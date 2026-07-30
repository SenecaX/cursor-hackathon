import { describe, expect, it } from 'vitest'
import type { WorkerBundle } from '../data/types'
import { computeDecision, type PlannedShift } from './decision'
import { toCents } from '../lib/money'

function bundle(partial: Partial<WorkerBundle> & { workerId?: string }): WorkerBundle {
  const id = partial.workerId ?? 'W-TEST'
  return {
    worker: {
      workerId: id,
      city: 'Calgary',
      province: 'AB',
      occupation: 'Tester',
      payType: 'daily',
      ...(partial.worker ?? {}),
    },
    transactions: partial.transactions ?? [],
    earnings: partial.earnings ?? [],
    obligations: partial.obligations ?? [],
    weekly: partial.weekly ?? [],
  }
}

describe('computeDecision', () => {
  it('classifies Safe when min balance covers reserve', () => {
    const b = bundle({
      transactions: [
        {
          txnId: 'T1',
          workerId: 'W-TEST',
          dateKey: '2026-06-01',
          direction: 'credit',
          amountCents: toCents(100),
          category: 'income',
          isEssential: false,
          runningBalanceCents: toCents(2000),
          notes: '',
        },
      ],
      earnings: [
        {
          earningsId: 'E1',
          workerId: 'W-TEST',
          workDate: '2026-05-20',
          netPayCents: toCents(100),
          paidSameDay: true,
        },
        {
          earningsId: 'E2',
          workerId: 'W-TEST',
          workDate: '2026-05-21',
          netPayCents: toCents(100),
          paidSameDay: true,
        },
      ],
      obligations: [],
    })
    const result = computeDecision(b)
    expect(result.status).toBe('Safe')
    expect(result.safeToSpendCents).toBeGreaterThanOrEqual(0)
    expect(result.requiredAdditionalShifts).toBe(0)
    expect(result.forecast).toHaveLength(14)
  })

  it('classifies At Risk when projected balance goes negative', () => {
    const b = bundle({
      transactions: [
        {
          txnId: 'T1',
          workerId: 'W-TEST',
          dateKey: '2026-06-01',
          direction: 'credit',
          amountCents: toCents(50),
          category: 'income',
          isEssential: false,
          runningBalanceCents: toCents(100),
          notes: '',
        },
      ],
      earnings: [
        {
          earningsId: 'E1',
          workerId: 'W-TEST',
          workDate: '2026-05-01',
          netPayCents: toCents(200),
          paidSameDay: true,
        },
      ],
      obligations: [
        {
          obligationId: 'O1',
          workerId: 'W-TEST',
          name: 'Rent',
          category: 'housing',
          amountCents: toCents(500),
          frequency: 'monthly',
          dueDayOfMonth: 5,
          autopay: true,
          essential: true,
        },
      ],
    })
    const result = computeDecision(b)
    expect(result.status).toBe('At Risk')
    expect(result.minimumProjectedBalanceCents!).toBeLessThan(0)
    expect(result.firstRiskDate).toBeTruthy()
    expect(typeof result.requiredAdditionalShifts === 'number').toBe(true)
    expect(result.requiredAdditionalShifts as number).toBeGreaterThan(0)
  })

  it('computes required shifts as ceiling of coverage gap / accessible earnings', () => {
    const b = bundle({
      transactions: [
        {
          txnId: 'T1',
          workerId: 'W-TEST',
          dateKey: '2026-06-01',
          direction: 'credit',
          amountCents: 0,
          category: 'income',
          isEssential: false,
          runningBalanceCents: toCents(50),
          notes: '',
        },
      ],
      earnings: Array.from({ length: 3 }, (_, i) => ({
        earningsId: `E${i}`,
        workerId: 'W-TEST',
        workDate: `2026-05-0${i + 1}`,
        netPayCents: toCents(100),
        paidSameDay: true,
      })),
      obligations: [
        {
          obligationId: 'O1',
          workerId: 'W-TEST',
          name: 'Rent',
          category: 'housing',
          amountCents: toCents(400),
          frequency: 'monthly',
          dueDayOfMonth: 10,
          autopay: true,
          essential: true,
        },
      ],
    })
    const result = computeDecision(b)
    expect(result.accessibleEarningsPerShiftCents).toBe(toCents(100))
    expect(result.coverageGapCents).toBeGreaterThan(0)
    expect(result.requiredAdditionalShifts).toBe(
      Math.ceil(result.coverageGapCents / result.accessibleEarningsPerShiftCents!),
    )
  })

  it('ignores future earnings after analysis date', () => {
    const b = bundle({
      transactions: [
        {
          txnId: 'T1',
          workerId: 'W-TEST',
          dateKey: '2026-06-01',
          direction: 'credit',
          amountCents: 0,
          category: 'income',
          isEssential: false,
          runningBalanceCents: toCents(5000),
          notes: '',
        },
      ],
      earnings: [
        {
          earningsId: 'E1',
          workerId: 'W-TEST',
          workDate: '2026-05-01',
          netPayCents: toCents(100),
          paidSameDay: true,
        },
        {
          earningsId: 'E-FUTURE',
          workerId: 'W-TEST',
          workDate: '2026-06-15',
          netPayCents: toCents(9999),
          paidSameDay: true,
        },
      ],
    })
    const result = computeDecision(b)
    expect(result.expectedNetPerShiftCents).toBe(toCents(100))
    expect(result.analysisDate).toBe('2026-06-01')
  })

  it('returns Unavailable required shifts when accessible earnings are zero', () => {
    const b = bundle({
      transactions: [
        {
          txnId: 'T1',
          workerId: 'W-TEST',
          dateKey: '2026-06-01',
          direction: 'credit',
          amountCents: 0,
          category: 'income',
          isEssential: false,
          runningBalanceCents: toCents(10),
          notes: '',
        },
      ],
      earnings: [
        {
          earningsId: 'E1',
          workerId: 'W-TEST',
          workDate: '2026-05-01',
          netPayCents: toCents(100),
          paidSameDay: false,
        },
      ],
      obligations: [
        {
          obligationId: 'O1',
          workerId: 'W-TEST',
          name: 'Rent',
          category: 'housing',
          amountCents: toCents(300),
          frequency: 'monthly',
          dueDayOfMonth: 5,
          autopay: true,
          essential: true,
        },
      ],
    })
    const result = computeDecision(b)
    expect(result.accessibleEarningsPerShiftCents).toBe(0)
    expect(result.requiredAdditionalShifts).toBe('Unavailable')
    expect(result.status).not.toBe('Safe')
  })

  it('uses integer cents and never negative safe-to-spend or required shifts', () => {
    const b = bundle({
      transactions: [
        {
          txnId: 'T1',
          workerId: 'W-TEST',
          dateKey: '2026-06-01',
          direction: 'credit',
          amountCents: 0,
          category: 'income',
          isEssential: false,
          runningBalanceCents: 12345,
          notes: '',
        },
      ],
      earnings: [
        {
          earningsId: 'E1',
          workerId: 'W-TEST',
          workDate: '2026-05-01',
          netPayCents: 1011,
          paidSameDay: true,
        },
        {
          earningsId: 'E2',
          workerId: 'W-TEST',
          workDate: '2026-05-02',
          netPayCents: 2022,
          paidSameDay: true,
        },
      ],
    })
    const result = computeDecision(b)
    expect(Number.isInteger(result.currentBalanceCents)).toBe(true)
    expect(Number.isInteger(result.expectedNetPerShiftCents)).toBe(true)
    expect(result.safeToSpendCents).toBeGreaterThanOrEqual(0)
    if (typeof result.requiredAdditionalShifts === 'number') {
      expect(result.requiredAdditionalShifts).toBeGreaterThanOrEqual(0)
    }
  })

  it('changes status when planned shifts are added', () => {
    const b = bundle({
      transactions: [
        {
          txnId: 'T1',
          workerId: 'W-TEST',
          dateKey: '2026-06-01',
          direction: 'credit',
          amountCents: 0,
          category: 'income',
          isEssential: false,
          runningBalanceCents: toCents(80),
          notes: '',
        },
      ],
      earnings: Array.from({ length: 5 }, (_, i) => ({
        earningsId: `E${i}`,
        workerId: 'W-TEST',
        workDate: `2026-05-0${i + 1}`,
        netPayCents: toCents(200),
        paidSameDay: true,
      })),
      obligations: [
        {
          obligationId: 'O1',
          workerId: 'W-TEST',
          name: 'Rent',
          category: 'housing',
          amountCents: toCents(400),
          frequency: 'monthly',
          dueDayOfMonth: 3,
          autopay: true,
          essential: true,
        },
      ],
    })
    const before = computeDecision(b)
    expect(before.status).toBe('At Risk')
    const planned: PlannedShift[] = [
      { dateKey: '2026-06-01' },
      { dateKey: '2026-06-01' },
      { dateKey: '2026-06-02' },
    ]
    const after = computeDecision(b, planned)
    expect(after.minimumProjectedBalanceCents!).toBeGreaterThan(
      before.minimumProjectedBalanceCents!,
    )
    expect(after.forecast[0]!.plannedShiftCount).toBe(2)
  })

  it('uses forecast closing balances for minimum, not opening balance', () => {
    const b = bundle({
      transactions: [
        {
          txnId: 'T1',
          workerId: 'W-TEST',
          dateKey: '2026-06-01',
          direction: 'credit',
          amountCents: 0,
          category: 'income',
          isEssential: false,
          runningBalanceCents: toCents(-200),
          notes: '',
        },
      ],
      earnings: Array.from({ length: 3 }, (_, i) => ({
        earningsId: `E${i}`,
        workerId: 'W-TEST',
        workDate: `2026-05-0${i + 1}`,
        netPayCents: toCents(250),
        paidSameDay: true,
      })),
      obligations: [],
    })
    const without = computeDecision(b)
    expect(without.status).toBe('At Risk')
    const planned = Array.from({ length: 3 }, () => ({ dateKey: '2026-06-01' }))
    const withShifts = computeDecision(b, planned)
    expect(withShifts.minimumProjectedBalanceCents!).toBeGreaterThan(toCents(-200))
    expect(withShifts.forecast[0]!.closingBalanceCents).toBeGreaterThan(0)
  })

  it('returns Insufficient Data with no balance sources', () => {
    const result = computeDecision(bundle({}))
    expect(result.status).toBe('Insufficient Data')
    expect(result.requiredAdditionalShifts).toBe('Unavailable')
  })

  it('does not claim bare before-risk scheduling when shifts exceed available days', () => {
    const b = bundle({
      transactions: [
        {
          txnId: 'T1',
          workerId: 'W-TEST',
          dateKey: '2026-06-30',
          direction: 'credit',
          amountCents: 0,
          category: 'income',
          isEssential: false,
          runningBalanceCents: toCents(200),
          notes: '',
        },
      ],
      earnings: Array.from({ length: 5 }, (_, i) => ({
        earningsId: `E${i}`,
        workerId: 'W-TEST',
        workDate: `2026-05-0${i + 1}`,
        netPayCents: toCents(100),
        paidSameDay: true,
      })),
      obligations: [
        {
          obligationId: 'O1',
          workerId: 'W-TEST',
          name: 'Rent',
          category: 'housing',
          amountCents: toCents(800),
          frequency: 'monthly',
          dueDayOfMonth: 1,
          autopay: true,
          essential: true,
        },
      ],
    })
    const result = computeDecision(b)
    expect(result.status).toBe('At Risk')
    expect(typeof result.requiredAdditionalShifts).toBe('number')
    expect(result.requiredAdditionalShifts as number).toBeGreaterThan(result.availableActionDays)
    expect(result.schedulePressure).toBe('requires_stacking_or_later_earnings')
    expect(result.recommendedAction).not.toMatch(/before 2026-07-01/)
    expect(result.recommendedAction).toMatch(/shift-equivalent|cash chunk/i)
    expect(result.explanation.some((line) => line.includes('cash chunk'))).toBe(true)
  })

  it('may prioritize on or before risk when shift count fits available days', () => {
    const b = bundle({
      transactions: [
        {
          txnId: 'T1',
          workerId: 'W-TEST',
          dateKey: '2026-06-01',
          direction: 'credit',
          amountCents: 0,
          category: 'income',
          isEssential: false,
          runningBalanceCents: toCents(120),
          notes: '',
        },
      ],
      earnings: Array.from({ length: 5 }, (_, i) => ({
        earningsId: `E${i}`,
        workerId: 'W-TEST',
        workDate: `2026-05-0${i + 1}`,
        netPayCents: toCents(200),
        paidSameDay: true,
      })),
      obligations: [
        {
          obligationId: 'O1',
          workerId: 'W-TEST',
          name: 'Loan',
          category: 'debt_payment',
          amountCents: toCents(250),
          frequency: 'monthly',
          dueDayOfMonth: 10,
          autopay: true,
          essential: true,
        },
      ],
    })
    const result = computeDecision(b)
    expect(result.status).toBe('At Risk')
    expect(typeof result.requiredAdditionalShifts).toBe('number')
    expect(result.requiredAdditionalShifts as number).toBeGreaterThan(0)
    expect(result.requiredAdditionalShifts as number).toBeLessThanOrEqual(result.availableActionDays)
    expect(result.schedulePressure).toBe('within_day_count')
    expect(result.recommendedAction).toMatch(/Prioritize landing that accessible cash on or before/)
    expect(result.recommendedAction).not.toMatch(/Add \d+ additional shift\(s\) before /)
    expect(result.recommendedAction).toMatch(/shift-equivalent/)
  })

  it('counts grocery essentials even when housing obligations exist', () => {
    const b = bundle({
      transactions: [
        {
          txnId: 'T-bal',
          workerId: 'W-TEST',
          dateKey: '2026-06-28',
          direction: 'credit',
          amountCents: 0,
          category: 'income',
          isEssential: false,
          runningBalanceCents: toCents(5000),
          notes: '',
        },
        {
          txnId: 'T-rent',
          workerId: 'W-TEST',
          dateKey: '2026-06-01',
          direction: 'debit',
          amountCents: toCents(1000),
          category: 'housing',
          isEssential: true,
          runningBalanceCents: toCents(4000),
          notes: 'obligation_id=O1',
        },
        {
          txnId: 'T-groc',
          workerId: 'W-TEST',
          dateKey: '2026-06-15',
          direction: 'debit',
          amountCents: toCents(280),
          category: 'groceries',
          isEssential: true,
          runningBalanceCents: toCents(3720),
          notes: '',
        },
      ],
      earnings: [
        {
          earningsId: 'E1',
          workerId: 'W-TEST',
          workDate: '2026-06-01',
          netPayCents: toCents(100),
          paidSameDay: true,
        },
      ],
      obligations: [
        {
          obligationId: 'O1',
          workerId: 'W-TEST',
          name: 'Rent',
          category: 'housing',
          amountCents: toCents(1000),
          frequency: 'monthly',
          dueDayOfMonth: 1,
          autopay: true,
          essential: true,
        },
      ],
    })
    const result = computeDecision(b)
    // 280 CAD groceries over 28 days = 10 CAD/day = 1000 cents
    expect(result.dailyEssentialSpendCents).toBe(toCents(10))
    expect(result.safetyReserveCents).toBe(toCents(30))
  })

  it('attributes next in-horizon obligation when first risk day has none', () => {
    const b = bundle({
      transactions: [
        {
          txnId: 'T1',
          workerId: 'W-TEST',
          dateKey: '2026-06-30',
          direction: 'credit',
          amountCents: 0,
          category: 'income',
          isEssential: false,
          runningBalanceCents: toCents(-50),
          notes: '',
        },
      ],
      earnings: Array.from({ length: 3 }, (_, i) => ({
        earningsId: `E${i}`,
        workerId: 'W-TEST',
        workDate: `2026-05-0${i + 1}`,
        netPayCents: toCents(100),
        paidSameDay: true,
      })),
      obligations: [
        {
          obligationId: 'O1',
          workerId: 'W-TEST',
          name: 'Rent',
          category: 'housing',
          amountCents: toCents(900),
          frequency: 'monthly',
          dueDayOfMonth: 1,
          autopay: true,
          essential: true,
        },
      ],
    })
    const result = computeDecision(b)
    expect(result.status).toBe('At Risk')
    expect(result.firstRiskDate).toBe('2026-06-30')
    expect(result.primaryRiskObligation).toMatch(/Rent on 2026-07-01/)
  })
})
