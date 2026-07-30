/** Minimal CSV parser for quoted and unquoted fields. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let field = ''
  let row: string[] = []
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
      continue
    }
    if (ch === '"') {
      inQuotes = true
      continue
    }
    if (ch === ',') {
      row.push(field)
      field = ''
      continue
    }
    if (ch === '\n') {
      row.push(field)
      field = ''
      if (row.length > 1 || row[0] !== '') rows.push(row)
      row = []
      continue
    }
    if (ch === '\r') continue
    field += ch
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  if (rows.length === 0) return []
  const headers = rows[0]!
  return rows.slice(1).map((cols) => {
    const obj: Record<string, string> = {}
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]!] = cols[i] ?? ''
    }
    return obj
  })
}

export function parseBool01(value: string): boolean {
  return value.trim() === '1' || value.trim().toLowerCase() === 'true'
}
