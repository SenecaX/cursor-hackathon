export type Worker = {
  workerId: string
  city: string
  province: string
  occupation: string
  payType: string
}

export type Transaction = {
  txnId: string
  workerId: string
  dateKey: string
  direction: 'debit' | 'credit'
  amountCents: number
  category: string
  isEssential: boolean
  runningBalanceCents: number
  notes: string
}

export type DailyEarning = {
  earningsId: string
  workerId: string
  workDate: string
  netPayCents: number
  paidSameDay: boolean
}

export type Obligation = {
  obligationId: string
  workerId: string
  name: string
  category: string
  amountCents: number
  frequency: string
  dueDayOfMonth: number
  autopay: boolean
  essential: boolean
}

export type WeeklySummary = {
  workerId: string
  weekStart: string
  endingBalanceCents: number
}

export type WorkerBundle = {
  worker: Worker
  transactions: Transaction[]
  earnings: DailyEarning[]
  obligations: Obligation[]
  weekly: WeeklySummary[]
}

export type DatasetIndex = {
  workers: Worker[]
  byWorker: Map<string, WorkerBundle>
}
