/** Recommended demo workers for judge / human walkthrough. */
export const DEMO_WORKERS = {
  atRisk: 'W-0220',
  delayedPay: 'W-0071',
  safe: 'W-0072',
} as const

export function demoLabel(workerId: string): string | null {
  if (workerId === DEMO_WORKERS.atRisk) return 'Demo · At Risk'
  if (workerId === DEMO_WORKERS.delayedPay) return 'Demo · Delayed pay'
  if (workerId === DEMO_WORKERS.safe) return 'Demo · Safe'
  return null
}

export function defaultDemoWorkerId(workerIds: string[]): string {
  if (workerIds.includes(DEMO_WORKERS.atRisk)) return DEMO_WORKERS.atRisk
  if (workerIds.includes(DEMO_WORKERS.delayedPay)) return DEMO_WORKERS.delayedPay
  if (workerIds.includes(DEMO_WORKERS.safe)) return DEMO_WORKERS.safe
  return workerIds[0] ?? ''
}
