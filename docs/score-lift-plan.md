# Score-Lift Plan — ShiftSafe (Post-MVP, Pre-Feature)

## 1. Purpose

Plan the **next** work after the 60-minute MVP so any change integrates without breaking Systemic Integrity.

This document is a **constrained score-lift plan**, not a license to reopen deferred scope.

Authority order remains: user instruction → `AGENTS.md` → verified data → product-spec → this plan → roadmap → judging-strategy → work-ledger.

## 2. Operating Principles (binding)

Every candidate change must pass all six filters before implementation:

| Principle | Gate question | Fail condition |
|---|---|---|
| **First Principles** | Does this improve worker → forecast → decision → action? | Adds dashboards, history tours, or side stories |
| **Pareto** | Does this raise one of the four criteria worth 90%? | Polishes the 5% UX/ambition axes only |
| **LEAN** | Can we delete half of this idea and keep the score lift? | New pages, libs, backends, or abstractions |
| **Systemic Integrity** | Will calc, UI, tests, README, and screenshots stay consistent? | Any claim without matching code/tests |
| **Constraint-Driven** | Can it ship in one small closed package under existing stack? | Needs new infra, auth, APIs, or ML |
| **Mandatory Closure** | Does the package end in a usable, demoable result? | Half-built controls or placeholders |

If any gate fails, **do not implement**.

## 3. Current baseline (verified)

Already delivered locally:

- Complete decision loop on real CSVs
- Integer-cent pure engine + critical tests (`npm test` pass)
- Production build (`npm run build` pass)
- Five screenshots + judge-oriented README
- Hosted URL / public push deferred to manual user action

Score risk is **not feature scarcity**. It is **evidence clarity and calculation credibility** under AI inspection.

## 4. Pareto target map (90% first)

| Criterion | Weight | Highest-impact lift (allowed) | Explicit non-lift (forbidden here) |
|---|---:|---|---|
| Innovation | 25% | Sharpen decision language + required-shift actionability | Rebrand as budgeting analytics |
| Technical Execution | 25% | Strengthen real-data calc edge cases; keep tests as proof | New forecasting models / ML |
| Functional Completeness | 20% | Make demo path one-click obvious (representative worker) | Extra flows / pages |
| Problem–Solution Fit | 20% | Make cash-gap → shifts → recovery story unavoidable | Wage-advance subplot |
| UX | 5% | Only if it clarifies the 5-second decision read | Decorative motion / mobile polish sprint |
| Learning | 5% | Disclose assumptions already implemented | Fake ambition features |

## 5. Ranked work packages

Implement **at most one package at a time**. Finish closure checklist before starting the next.

### Package A — Calculation credibility (Pareto #1)

**First Principles:** forecast and status must remain trustworthy under inspection.

Candidate fixes (only if still true in code/data):

1. **Primary risk driver** — when the first negative day has no obligation, attribute the next material obligation in-horizon (e.g. rent) instead of only “Essential daily spending”.
2. **Essential-spend sanity** — if excluding obligation categories collapses daily essentials toward ~0 for many workers, tighten exclusion rules so variable essentials remain visible without double-counting rent/phone.
3. **Keep biweekly excluded** unless a verified recurrence rule is proven from data (current exclusion stays disclosed).

**Closure checklist:**

- [ ] Focused unit tests updated/added
- [ ] `npm test` pass
- [ ] `npm run build` pass
- [ ] Explanation copy still matches formulas
- [ ] Screenshots 3–5 recaptured if numbers/status text change
- [ ] README methodology / limitations updated if behavior changed
- [ ] Data dictionary updated only if semantics changed

**Non-goals:** custom reserves, spending-reduction scenarios, wage advances.

### Package B — Demo path explicitness (Pareto #2)

**First Principles:** judges must hit the pain → action → recovery loop without hunting.

Candidate UI (single screen only):

1. Mark 1–2 **recommended demo workers** in the selector (e.g. At Risk `W-0014`, Safe control).
2. One-line “try this” hint under the selector: select → read gap → add required shifts → watch status change.
3. No second page; no comparison table.

**Closure checklist:**

- [ ] Core loop unchanged for all workers
- [ ] No dead controls
- [ ] Screenshot 1 and 3–4 refreshed
- [ ] Submission description unchanged unless flow text changes

**Non-goals:** worker comparison analytics, filters, search systems.

### Package C — Five-second decision hierarchy (Pareto #3, only if A/B done)

**First Principles:** status → action → required shifts → safe-to-spend remain dominant.

Candidate polish:

1. Reduce competing secondary text above the status.
2. Keep forecast/explanation subordinate.
3. Preserve planned-vs-projected visual distinction.

**Closure checklist:**

- [ ] Desktop decision readable without scrolling past status
- [ ] Screenshots 1 refreshed
- [ ] No new dependencies

**Non-goals:** chart libraries, animation systems, mobile redesign.

## 6. Hard exclusions (LEAN + AGENTS)

Do **not** schedule or partially start:

- Wage-advance analysis
- Auth / backend / database / external APIs / ML
- Custom analysis dates, adjustable reserve, spending-cut scenarios
- Historical analytics, worker comparisons
- Multiple pages, advanced filtering, exhaustive tests

These fail First Principles, Pareto, or Constraint-Driven Design for this product.

## 7. Systemic Integrity contract

For every accepted package:

```text
domain logic change
  → tests
  → UI copy/controls
  → README methodology/limitations
  → screenshots (if visible)
  → data dictionary (if semantics changed)
  → work-ledger Current State + one short entry if material
```

No orphan changes. No README claims ahead of code.

## 8. Constraint envelope

- Stack stays: React, TypeScript, Vite, Vitest, static CSVs, integer cents.
- One screen.
- Prefer edits inside `src/domain/decision.ts`, `src/App.tsx`, tests, and docs.
- Stop a package if it threatens the working core loop.
- Deploy/hosting remains a user-owned packaging step and is **out of this plan’s critical path**.

## 9. Recommended sequence

1. **Package A** (calculation credibility) — highest Technical Execution + Integrity return.
2. **Package B** (demo path) — highest Completeness + Problem–Solution Fit return for AI screening.
3. **Package C** only if time remains and A/B closed.

Default stop rule: after A+B, **ship**. Do not invent Package D.

## 10. Decision log (pre-implementation)

| Decision | Reason |
|---|---|
| Plan before code | Prevents stretch creep; preserves Mandatory Closure |
| Prefer calc + demo evidence over new features | Matches Priority Rule in judging-strategy §12 |
| Keep deferred list frozen | AGENTS mandatory cuts |
| One package at a time with closure checklist | Systemic Integrity |

## 11. Next action

Review this plan. Approve **Package A** (or choose B first). Only then implement that single package end-to-end.
