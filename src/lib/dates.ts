/** Parse YYYY-MM-DD or ISO datetime to YYYY-MM-DD calendar date string. */
export function toDateKey(value: string): string {
  return value.slice(0, 10)
}

export function compareDateKeys(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

export function addDays(dateKey: string, days: number): string {
  const d = parseUtcDate(dateKey)
  d.setUTCDate(d.getUTCDate() + days)
  return formatUtcDate(d)
}

export function daysInMonth(year: number, monthIndex0: number): number {
  return new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate()
}

export function parseUtcDate(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(Date.UTC(y!, m! - 1, d!))
}

export function formatUtcDate(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Build 14 calendar dates starting at analysisDate (inclusive). */
export function forecastDates(analysisDate: string): string[] {
  return Array.from({ length: 14 }, (_, i) => addDays(analysisDate, i))
}

export function clampDueDay(year: number, monthIndex0: number, dueDay: number): string {
  const dim = daysInMonth(year, monthIndex0)
  const day = Math.min(Math.max(1, dueDay), dim)
  const m = String(monthIndex0 + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}
