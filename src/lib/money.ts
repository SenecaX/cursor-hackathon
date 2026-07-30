/** Convert CAD decimal string/number to integer cents. */
export function toCents(value: string | number): number {
  const n = typeof value === 'number' ? value : Number.parseFloat(value)
  if (!Number.isFinite(n)) return NaN
  return Math.round(n * 100)
}

export function formatCad(cents: number): string {
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  const dollars = Math.floor(abs / 100)
  const rem = abs % 100
  return `${sign}$${dollars.toLocaleString('en-CA')}.${rem.toString().padStart(2, '0')} CAD`
}

export function medianCents(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1]! + sorted[mid]!) / 2)
  }
  return sorted[mid]!
}
