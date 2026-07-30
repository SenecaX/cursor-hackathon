import { parseBool01, parseCsv } from '../lib/csv'
import { toDateKey } from '../lib/dates'
import { toCents } from '../lib/money'
import type {
  DailyEarning,
  DatasetIndex,
  Obligation,
  Transaction,
  WeeklySummary,
  Worker,
  WorkerBundle,
} from './types'

async function fetchCsv(path: string): Promise<Record<string, string>[]> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return parseCsv(await res.text())
}

function parseWorker(row: Record<string, string>): Worker | null {
  const workerId = row.worker_id?.trim()
  if (!workerId) return null
  return {
    workerId,
    city: row.city ?? '',
    province: row.province ?? '',
    occupation: row.occupation ?? '',
    payType: row.pay_type ?? '',
  }
}

function parseTransaction(row: Record<string, string>): Transaction | null {
  const workerId = row.worker_id?.trim()
  const txnId = row.txn_id?.trim()
  const direction = row.direction?.trim()
  if (!workerId || !txnId || (direction !== 'debit' && direction !== 'credit')) return null
  const amountCents = toCents(row.amount_cad ?? '')
  const runningBalanceCents = toCents(row.running_balance_cad ?? '')
  if (!Number.isFinite(amountCents) || !Number.isFinite(runningBalanceCents)) return null
  const dateKey = toDateKey(row.txn_ts ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null
  return {
    txnId,
    workerId,
    dateKey,
    direction,
    amountCents,
    category: row.category ?? '',
    isEssential: parseBool01(row.is_essential ?? '0'),
    runningBalanceCents,
    notes: row.notes ?? '',
  }
}

function parseEarning(row: Record<string, string>): DailyEarning | null {
  const workerId = row.worker_id?.trim()
  const earningsId = row.earnings_id?.trim()
  if (!workerId || !earningsId) return null
  const netPayCents = toCents(row.net_pay_cad ?? '')
  if (!Number.isFinite(netPayCents)) return null
  const workDate = toDateKey(row.work_date ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(workDate)) return null
  return {
    earningsId,
    workerId,
    workDate,
    netPayCents,
    paidSameDay: parseBool01(row.paid_same_day ?? '0'),
  }
}

function parseObligation(row: Record<string, string>): Obligation | null {
  const workerId = row.worker_id?.trim()
  const obligationId = row.obligation_id?.trim()
  if (!workerId || !obligationId) return null
  const amountCents = toCents(row.amount_cad ?? '')
  const dueDayOfMonth = Number.parseInt(row.due_day_of_month ?? '', 10)
  if (!Number.isFinite(amountCents) || !Number.isFinite(dueDayOfMonth)) return null
  return {
    obligationId,
    workerId,
    name: row.name ?? '',
    category: row.category ?? '',
    amountCents,
    frequency: (row.frequency ?? '').trim().toLowerCase(),
    dueDayOfMonth,
    autopay: parseBool01(row.autopay ?? '0'),
    essential: parseBool01(row.essential ?? '0'),
  }
}

function parseWeekly(row: Record<string, string>): WeeklySummary | null {
  const workerId = row.worker_id?.trim()
  if (!workerId) return null
  const endingBalanceCents = toCents(row.ending_balance_cad ?? '')
  if (!Number.isFinite(endingBalanceCents)) return null
  const weekStart = toDateKey(row.week_start ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) return null
  return { workerId, weekStart, endingBalanceCents }
}

export async function loadDataset(): Promise<DatasetIndex> {
  const [workerRows, txnRows, earnRows, oblRows, weekRows] = await Promise.all([
    fetchCsv('/data/workers.csv'),
    fetchCsv('/data/transactions.csv'),
    fetchCsv('/data/daily_earnings.csv'),
    fetchCsv('/data/recurring_obligations.csv'),
    fetchCsv('/data/weekly_cashflow_summary.csv'),
  ])

  const workers = workerRows.map(parseWorker).filter((w): w is Worker => w !== null)
  const byWorker = new Map<string, WorkerBundle>()

  for (const worker of workers) {
    byWorker.set(worker.workerId, {
      worker,
      transactions: [],
      earnings: [],
      obligations: [],
      weekly: [],
    })
  }

  for (const row of txnRows) {
    const t = parseTransaction(row)
    if (!t) continue
    const bundle = byWorker.get(t.workerId)
    if (bundle) bundle.transactions.push(t)
  }
  for (const row of earnRows) {
    const e = parseEarning(row)
    if (!e) continue
    const bundle = byWorker.get(e.workerId)
    if (bundle) bundle.earnings.push(e)
  }
  for (const row of oblRows) {
    const o = parseObligation(row)
    if (!o) continue
    const bundle = byWorker.get(o.workerId)
    if (bundle) bundle.obligations.push(o)
  }
  for (const row of weekRows) {
    const w = parseWeekly(row)
    if (!w) continue
    const bundle = byWorker.get(w.workerId)
    if (bundle) bundle.weekly.push(w)
  }

  for (const bundle of byWorker.values()) {
    bundle.transactions.sort((a, b) =>
      a.dateKey === b.dateKey ? a.txnId.localeCompare(b.txnId) : a.dateKey.localeCompare(b.dateKey),
    )
    bundle.earnings.sort((a, b) =>
      a.workDate === b.workDate
        ? a.earningsId.localeCompare(b.earningsId)
        : a.workDate.localeCompare(b.workDate),
    )
    bundle.weekly.sort((a, b) => a.weekStart.localeCompare(b.weekStart))
  }

  return { workers, byWorker }
}
