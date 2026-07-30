import { useEffect, useMemo, useState } from 'react'
import { loadDataset } from './data/loadData'
import type { DatasetIndex, WorkerBundle } from './data/types'
import { computeDecision, type PlannedShift } from './domain/decision'
import { formatCad } from './lib/money'
import './App.css'

export default function App() {
  const [data, setData] = useState<DatasetIndex | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [workerId, setWorkerId] = useState<string>('')
  const [planned, setPlanned] = useState<PlannedShift[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    loadDataset()
      .then((d) => {
        if (cancelled) return
        setData(d)
        const first = d.workers[0]?.workerId ?? ''
        setWorkerId(first)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load data')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setPlanned([])
    setSelectedDate('')
  }, [workerId])

  const bundle: WorkerBundle | null = useMemo(() => {
    if (!data || !workerId) return null
    return data.byWorker.get(workerId) ?? null
  }, [data, workerId])

  const decision = useMemo(() => {
    if (!bundle) return null
    return computeDecision(bundle, planned)
  }, [bundle, planned])

  useEffect(() => {
    if (decision?.forecast[0] && !selectedDate) {
      setSelectedDate(decision.forecast[0].dateKey)
    }
  }, [decision, selectedDate])

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
      </div>
    )
  }

  if (!data || !decision || !bundle) {
    return (
      <div className="page">
        <p className="loading">Loading worker data…</p>
      </div>
    )
  }

  const statusClass =
    decision.status === 'Safe'
      ? 'status-safe'
      : decision.status === 'Caution'
        ? 'status-caution'
        : decision.status === 'At Risk'
          ? 'status-risk'
          : 'status-insufficient'

  const minBal = Math.min(...decision.forecast.map((d) => d.closingBalanceCents), 0)
  const maxBal = Math.max(...decision.forecast.map((d) => d.closingBalanceCents), 1)
  const range = Math.max(maxBal - minBal, 1)

  function addShift() {
    if (!selectedDate) return
    setPlanned((p) => [...p, { dateKey: selectedDate }])
  }

  function removeShift() {
    setPlanned((p) => {
      const idx = p.findIndex((s) => s.dateKey === selectedDate)
      if (idx === -1) return p
      return [...p.slice(0, idx), ...p.slice(idx + 1)]
    })
  }

  return (
    <div className="page">
      <header className="top">
        <div>
          <p className="brand">ShiftSafe</p>
          <p className="tagline">Can I safely stop working today?</p>
        </div>
        <label className="worker-select">
          Worker
          <select value={workerId} onChange={(e) => setWorkerId(e.target.value)}>
            {data.workers.map((w) => (
              <option key={w.workerId} value={w.workerId}>
                {w.workerId} — {w.occupation} ({w.city})
              </option>
            ))}
          </select>
        </label>
      </header>

      <p className="context">
        {bundle.worker.occupation} · {bundle.worker.city}, {bundle.worker.province} ·{' '}
        {bundle.worker.payType} · Analysis {decision.analysisDate || '—'}
      </p>

      <section className={`decision ${statusClass}`}>
        <p className="status-label">{decision.status}</p>
        <p className="action">{decision.recommendedAction}</p>
        <div className="metrics">
          <div>
            <span className="metric-label">Required shifts</span>
            <span className="metric-value">
              {decision.requiredAdditionalShifts === 'Unavailable'
                ? 'Unavailable'
                : decision.requiredAdditionalShifts}
            </span>
          </div>
          <div>
            <span className="metric-label">Safe to spend</span>
            <span className="metric-value">{formatCad(decision.safeToSpendCents)}</span>
          </div>
          <div>
            <span className="metric-label">Min projected balance</span>
            <span className="metric-value">
              {decision.minimumProjectedBalanceCents === null
                ? '—'
                : formatCad(decision.minimumProjectedBalanceCents)}
            </span>
          </div>
          <div>
            <span className="metric-label">First risk date</span>
            <span className="metric-value">{decision.firstRiskDate ?? 'None'}</span>
          </div>
        </div>
        {decision.primaryRiskObligation && (
          <p className="risk-cause">Primary risk driver: {decision.primaryRiskObligation}</p>
        )}
        {decision.coverageGapCents > 0 && (
          <p className="gap">Coverage gap: {formatCad(decision.coverageGapCents)}</p>
        )}
      </section>

      <section className="panel scenario">
        <h2>Planned shifts</h2>
        <div className="scenario-controls">
          <label>
            Forecast date
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
              {decision.forecast.map((d) => (
                <option key={d.dateKey} value={d.dateKey}>
                  {d.dateKey}
                  {d.plannedShiftCount > 0 ? ` (${d.plannedShiftCount} planned)` : ''}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={addShift}>
            Add shift
          </button>
          <button type="button" onClick={removeShift} disabled={planned.length === 0}>
            Remove shift
          </button>
          <button type="button" onClick={() => setPlanned([])} disabled={planned.length === 0}>
            Reset
          </button>
        </div>
        <p className="hint">
          {planned.length} planned shift(s). Earnings credited at accessible rate only (
          {decision.accessibleEarningsPerShiftCents === null
            ? 'unavailable'
            : formatCad(decision.accessibleEarningsPerShiftCents)}
          /shift).
        </p>
      </section>

      <section className="panel forecast">
        <h2>14-day cash forecast</h2>
        <div className="bars" role="img" aria-label="Fourteen day projected balance">
          {decision.forecast.map((d) => {
            const height = ((d.closingBalanceCents - minBal) / range) * 100
            const isRisk = d.closingBalanceCents < 0
            const hasPlan = d.plannedShiftCount > 0
            return (
              <button
                type="button"
                key={d.dateKey}
                className={`bar ${isRisk ? 'bar-risk' : ''} ${hasPlan ? 'bar-planned' : ''} ${
                  selectedDate === d.dateKey ? 'bar-selected' : ''
                }`}
                style={{ height: `${Math.max(8, height)}%` }}
                title={`${d.dateKey}: ${formatCad(d.closingBalanceCents)}`}
                onClick={() => setSelectedDate(d.dateKey)}
              >
                <span className="bar-day">{d.dateKey.slice(8)}</span>
              </button>
            )
          })}
        </div>
        <p className="legend">
          <span className="swatch hist" /> Projected balance
          <span className="swatch plan" /> Has planned shift
          <span className="swatch risk" /> Negative day
        </p>
      </section>

      <section className="panel obligations">
        <h2>Upcoming obligations</h2>
        {decision.upcomingObligations.length === 0 ? (
          <p className="empty">No monthly obligations in this 14-day window.</p>
        ) : (
          <ul>
            {decision.upcomingObligations.map((o, i) => (
              <li key={`${o.dateKey}-${o.name}-${i}`}>
                <span>
                  {o.dateKey} · {o.name}
                  {o.essential ? ' · essential' : ''}
                </span>
                <span>{formatCad(o.amountCents)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel explain">
        <h2>How this was calculated</h2>
        <ul>
          {decision.explanation.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <footer className="foot">
        Estimates only — not financial advice. Money stored as integer cents. Biweekly obligations
        excluded.
      </footer>
    </div>
  )
}
