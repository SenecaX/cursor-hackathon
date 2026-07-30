import {
  addDays,
  clampDueDay,
  forecastDates,
  parseUtcDate,
} from '../lib/dates'
import { medianCents } from '../lib/money'
import type { DailyEarning, Obligation, Transaction, WeeklySummary, WorkerBundle } from '../data/types'

export type SafetyStatus = 'Safe' | 'Caution' | 'At Risk' | 'Insufficient Data'

export type PlannedShift = {
  dateKey: string
}

export type ForecastDay = {
  dateKey: string
  openingBalanceCents: number
  plannedShiftEarningsCents: number
  obligationCents: number
  essentialSpendCents: number
  closingBalanceCents: number
  obligations: { name: string; amountCents: number; category: string }[]
  plannedShiftCount: number
}

export type DecisionResult = {
  analysisDate: string
  status: SafetyStatus
  currentBalanceCents: number | null
  balanceSource: 'transaction' | 'weekly' | 'none'
  expectedNetPerShiftCents: number | null
  sameDayPayoutRate: number | null
  accessibleEarningsPerShiftCents: number | null
  dailyEssentialSpendCents: number
  safetyReserveCents: number
  minimumProjectedBalanceCents: number | null
  firstRiskDate: string | null
  primaryRiskObligation: string | null
  cashShortfallCents: number
  coverageGapCents: number
  requiredAdditionalShifts: number | 'Unavailable'
  safeToSpendCents: number
  recommendedAction: string
  explanation: string[]
  forecast: ForecastDay[]
  upcomingObligations: { dateKey: string; name: string; amountCents: number; essential: boolean }[]
}

function analysisDateFromBundle(bundle: WorkerBundle): string | null {
  if (bundle.transactions.length > 0) {
    return bundle.transactions[bundle.transactions.length - 1]!.dateKey
  }
  if (bundle.weekly.length > 0) {
    const last = bundle.weekly[bundle.weekly.length - 1]!
    return addDays(last.weekStart, 6)
  }
  return null
}

function currentBalance(
  transactions: Transaction[],
  weekly: WeeklySummary[],
  analysisDate: string,
): { cents: number | null; source: 'transaction' | 'weekly' | 'none' } {
  const eligibleTx = transactions.filter((t) => t.dateKey <= analysisDate)
  if (eligibleTx.length > 0) {
    return { cents: eligibleTx[eligibleTx.length - 1]!.runningBalanceCents, source: 'transaction' }
  }
  const eligibleWeek = weekly.filter((w) => w.weekStart <= analysisDate)
  if (eligibleWeek.length > 0) {
    return {
      cents: eligibleWeek[eligibleWeek.length - 1]!.endingBalanceCents,
      source: 'weekly',
    }
  }
  return { cents: null, source: 'none' }
}

function historicalEarnings(earnings: DailyEarning[], analysisDate: string): DailyEarning[] {
  return earnings.filter((e) => e.workDate <= analysisDate)
}

function computeAccessible(earnings: DailyEarning[]): {
  expectedNet: number | null
  sameDayRate: number | null
  accessible: number | null
} {
  if (earnings.length === 0) {
    return { expectedNet: null, sameDayRate: null, accessible: null }
  }
  const expectedNet = medianCents(earnings.map((e) => e.netPayCents))
  const sameDayCount = earnings.filter((e) => e.paidSameDay).length
  const sameDayRate = sameDayCount / earnings.length
  if (expectedNet === null) {
    return { expectedNet: null, sameDayRate, accessible: null }
  }
  const accessible = Math.round(expectedNet * sameDayRate)
  return { expectedNet, sameDayRate, accessible }
}

function dailyEssentialSpend(
  transactions: Transaction[],
  obligations: Obligation[],
  analysisDate: string,
): number {
  const start = addDays(analysisDate, -27)
  const recurringCategories = new Set(
    obligations.filter((o) => o.essential && o.frequency === 'monthly').map((o) => o.category),
  )
  let total = 0
  for (const t of transactions) {
    if (t.dateKey < start || t.dateKey > analysisDate) continue
    if (t.direction !== 'debit') continue
    if (!t.isEssential) continue
    if (recurringCategories.has(t.category)) continue
    total += t.amountCents
  }
  return Math.round(total / 28)
}

/** Monthly obligations only; biweekly excluded (ambiguous schedule). */
export function generateObligationsInHorizon(
  obligations: Obligation[],
  _analysisDate: string,
  horizonDates: string[],
): { dateKey: string; name: string; amountCents: number; category: string; essential: boolean }[] {
  const horizonSet = new Set(horizonDates)
  const out: { dateKey: string; name: string; amountCents: number; category: string; essential: boolean }[] =
    []

  const months = new Set<string>()
  for (const d of horizonDates) {
    months.add(d.slice(0, 7))
  }

  for (const obl of obligations) {
    if (obl.frequency !== 'monthly') continue
    for (const ym of months) {
      const [ys, ms] = ym.split('-')
      const year = Number(ys)
      const monthIndex0 = Number(ms) - 1
      const due = clampDueDay(year, monthIndex0, obl.dueDayOfMonth)
      if (horizonSet.has(due)) {
        out.push({
          dateKey: due,
          name: obl.name,
          amountCents: obl.amountCents,
          category: obl.category,
          essential: obl.essential,
        })
      }
    }
  }

  out.sort((a, b) => a.dateKey.localeCompare(b.dateKey) || a.name.localeCompare(b.name))
  return out
}

function recommendation(
  status: SafetyStatus,
  required: number | 'Unavailable',
  firstRiskDate: string | null,
  coverageGapCents: number,
  safeToSpendCents: number,
): string {
  if (status === 'Insufficient Data') {
    return 'Review the missing information before deciding.'
  }
  if (status === 'Safe') {
    return `Stopping today is safe within the modeled horizon. Safe-to-spend is ${(safeToSpendCents / 100).toFixed(2)} CAD above the 3-day reserve.`
  }
  if (status === 'Caution') {
    return `Preserve cash or add shifts to restore the ${(coverageGapCents / 100).toFixed(2)} CAD reserve gap.`
  }
  const shifts =
    required === 'Unavailable' ? 'an unknown number of' : `${required}`
  const when = firstRiskDate ? ` before ${firstRiskDate}` : ''
  return `At risk of a cash gap. Add ${shifts} additional shift(s)${when} to cover the ${(coverageGapCents / 100).toFixed(2)} CAD coverage gap.`
}

export function computeDecision(
  bundle: WorkerBundle,
  plannedShifts: PlannedShift[] = [],
): DecisionResult {
  const analysisDate = analysisDateFromBundle(bundle)
  if (!analysisDate) {
    return insufficient('No transactions or weekly summaries available for this worker.')
  }

  const balance = currentBalance(bundle.transactions, bundle.weekly, analysisDate)
  if (balance.cents === null) {
    return insufficient('No reliable current balance at or before the analysis date.')
  }

  const histEarn = historicalEarnings(bundle.earnings, analysisDate)
  const { expectedNet, sameDayRate, accessible } = computeAccessible(histEarn)
  const dailySpend = dailyEssentialSpend(bundle.transactions, bundle.obligations, analysisDate)
  const reserve = dailySpend * 3
  const horizon = forecastDates(analysisDate)
  const upcoming = generateObligationsInHorizon(bundle.obligations, analysisDate, horizon)

  const plannedByDate = new Map<string, number>()
  for (const p of plannedShifts) {
    if (!horizon.includes(p.dateKey)) continue
    plannedByDate.set(p.dateKey, (plannedByDate.get(p.dateKey) ?? 0) + 1)
  }

  const forecast: ForecastDay[] = []
  let prev = balance.cents
  let minBal = Number.POSITIVE_INFINITY
  let firstRiskDate: string | null = null
  let primaryRiskObligation: string | null = null

  for (const dateKey of horizon) {
    const dayObl = upcoming.filter((o) => o.dateKey === dateKey)
    const obligationCents = dayObl.reduce((s, o) => s + o.amountCents, 0)
    const shiftCount = plannedByDate.get(dateKey) ?? 0
    const plannedShiftEarningsCents =
      accessible !== null ? shiftCount * accessible : 0
    const essentialSpendCents = dailySpend
    const closing = prev + plannedShiftEarningsCents - obligationCents - essentialSpendCents

    forecast.push({
      dateKey,
      openingBalanceCents: prev,
      plannedShiftEarningsCents,
      obligationCents,
      essentialSpendCents,
      closingBalanceCents: closing,
      obligations: dayObl.map((o) => ({
        name: o.name,
        amountCents: o.amountCents,
        category: o.category,
      })),
      plannedShiftCount: shiftCount,
    })

    if (closing < minBal) minBal = closing
    if (closing < 0 && firstRiskDate === null) {
      firstRiskDate = dateKey
      const biggest = [...dayObl].sort((a, b) => b.amountCents - a.amountCents)[0]
      primaryRiskObligation = biggest
        ? `${biggest.name} (${(biggest.amountCents / 100).toFixed(2)} CAD)`
        : 'Essential daily spending'
    }
    prev = closing
  }

  if (!Number.isFinite(minBal)) minBal = balance.cents

  const cashShortfall = Math.max(0, -minBal)
  const coverageGap = Math.max(0, reserve - minBal)
  const safeToSpend = Math.max(0, minBal - reserve)

  let requiredAdditionalShifts: number | 'Unavailable'
  if (accessible === null || accessible === 0) {
    requiredAdditionalShifts = 'Unavailable'
  } else {
    requiredAdditionalShifts = Math.ceil(coverageGap / accessible)
  }

  let status: SafetyStatus
  if (expectedNet === null || sameDayRate === null) {
    // Missing earnings still allows At Risk / Caution from balance path, but never Safe
    if (minBal < 0) status = 'At Risk'
    else status = 'Insufficient Data'
  } else if (minBal < 0) {
    status = 'At Risk'
  } else if (minBal < reserve) {
    status = 'Caution'
  } else {
    status = 'Safe'
  }

  // Missing critical earnings data cannot produce Safe
  if ((expectedNet === null || accessible === null) && status === 'Safe') {
    status = 'Insufficient Data'
  }

  const explanation = [
    `Analysis date: ${analysisDate} (latest eligible transaction or weekly end).`,
    `Current balance: ${(balance.cents / 100).toFixed(2)} CAD from ${balance.source === 'transaction' ? 'latest running_balance_cad' : 'weekly ending_balance_cad'}.`,
    expectedNet !== null
      ? `Expected net per shift (median): ${(expectedNet / 100).toFixed(2)} CAD across ${histEarn.length} historical shifts.`
      : 'Expected net per shift unavailable (no historical earnings).',
    sameDayRate !== null
      ? `Same-day payout rate: ${(sameDayRate * 100).toFixed(1)}%.`
      : 'Same-day payout rate unavailable.',
    accessible !== null
      ? `Accessible earnings per additional shift: ${(accessible / 100).toFixed(2)} CAD (median × same-day rate).`
      : 'Accessible earnings unavailable.',
    `Daily essential variable spending (28-day avg, excl. recurring obligation categories): ${(dailySpend / 100).toFixed(2)} CAD.`,
    `Safety reserve = 3 × daily essential spending = ${(reserve / 100).toFixed(2)} CAD.`,
    `Biweekly obligations excluded (unsupported recurrence). Forecast is an estimate, not a guarantee.`,
  ]

  return {
    analysisDate,
    status,
    currentBalanceCents: balance.cents,
    balanceSource: balance.source,
    expectedNetPerShiftCents: expectedNet,
    sameDayPayoutRate: sameDayRate,
    accessibleEarningsPerShiftCents: accessible,
    dailyEssentialSpendCents: dailySpend,
    safetyReserveCents: reserve,
    minimumProjectedBalanceCents: minBal,
    firstRiskDate,
    primaryRiskObligation,
    cashShortfallCents: cashShortfall,
    coverageGapCents: coverageGap,
    requiredAdditionalShifts,
    safeToSpendCents: safeToSpend,
    recommendedAction: recommendation(
      status,
      requiredAdditionalShifts,
      firstRiskDate,
      coverageGap,
      safeToSpend,
    ),
    explanation,
    forecast,
    upcomingObligations: upcoming,
  }
}

function insufficient(reason: string): DecisionResult {
  return {
    analysisDate: '',
    status: 'Insufficient Data',
    currentBalanceCents: null,
    balanceSource: 'none',
    expectedNetPerShiftCents: null,
    sameDayPayoutRate: null,
    accessibleEarningsPerShiftCents: null,
    dailyEssentialSpendCents: 0,
    safetyReserveCents: 0,
    minimumProjectedBalanceCents: null,
    firstRiskDate: null,
    primaryRiskObligation: null,
    cashShortfallCents: 0,
    coverageGapCents: 0,
    requiredAdditionalShifts: 'Unavailable',
    safeToSpendCents: 0,
    recommendedAction: 'Review the missing information before deciding.',
    explanation: [reason],
    forecast: [],
    upcomingObligations: [],
  }
}

/** Test helpers / exports for verification */
export const __test = {
  analysisDateFromBundle,
  currentBalance,
  historicalEarnings,
  computeAccessible,
  dailyEssentialSpend,
  parseUtcDate,
}
