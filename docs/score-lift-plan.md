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

### 3.1 Full-population findings (220 workers)

Measured with `computeDecision` over all workers:

| Signal | Value | Judge impact |
|---|---:|---|
| Safe / At Risk / Caution / Insufficient | 196 / 24 / **0** / 0 | Caution path unproven; Safe-skew hides demo |
| At Risk where required shifts > days on/before first risk | **22 / 24** | Recommendation timing fails Integrity |
| Workers with same-day payout rate &lt; 100% | 192 | Differentiator exists in data |
| Workers with daily essential &lt; $1 | 87 | Reserve can look decorative |
| Workers with biweekly obligations | 38 | Exclusion OK if disclosed |

Only **W-0056** among At Risk is calendar-OK for “shifts before risk” without stacking beyond day count (1 shift, risk 2026-07-13).

Canonical contrast pair remains useful: **W-0220** (rent cliff) + **W-0072** (Safe control), but W-0220’s “7 shifts before July 1” copy is the #1 bottleneck.

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

### Package H — Recommendation honesty (IMPLEMENTED)

**Status:** Implemented.

**First Principles:** Required shifts answer “how much accessible earnings close the gap?”, not “how many distinct workdays exist before risk.”

**Pareto:** Raises Technical Execution trust, Problem–Solution Fit honesty, and Innovation credibility (advice must be believable).

**LEAN:** No scheduler, no auto-placement of shifts, no new pages, no formula change to coverage gap.

#### H.1 Problem

Today At Risk copy can say “Add N shifts **before** {firstRiskDate}”.

Population fact: **22/24** At Risk workers have `N >` count of forecast days on or before first risk (e.g. W-0220: N=7, analysis 2026-06-30, risk 2026-07-01).

UI already allows stacking multiple planned shifts on one date, but the recommendation hides that and overclaims calendar feasibility.

#### H.2 Invariants (unchanged)

Keep exactly:

```text
required additional shifts = ceil(coverage gap / accessible earnings per shift)
```

- Integer cents, analysis date, forecast horizon, status thresholds unchanged.
- Scenario controls unchanged (add/remove/reset on a selected date).
- Do not set analysis date to wall-clock “today”.

#### H.3 New derived values (domain only)

Compute inside `computeDecision` (pure):

```text
available action days
= if firstRiskDate is null
    then 14
    else count of forecast days with dateKey <= firstRiskDate

schedule pressure
= if required shifts is Unavailable or 0
    then none
  else if required shifts <= available action days
    then within_day_count
  else
    requires_stacking_or_later_earnings
```

No user-facing control for these. They exist to drive honest copy and tests.

#### H.4 Recommendation contract (replaces misleading At Risk line)

| Condition | Recommended action pattern |
|---|---|
| Safe | Unchanged intent: stopping today is safe; include safe-to-spend vs 3-day reserve |
| Caution | Unchanged intent: preserve cash or add shifts to restore reserve; include coverage gap |
| At Risk + Unavailable | State gap exists; required shifts unavailable because accessible earnings are zero/unknown |
| At Risk + `within_day_count` | “Add N additional shift(s) to cover the G CAD coverage gap (~A CAD accessible each). Prioritize shifts on or before {firstRiskDate}.” |
| At Risk + `requires_stacking_or_later_earnings` | “Add N additional shift(s) to cover the G CAD coverage gap (~A CAD accessible each). First shortfall is projected on {firstRiskDate} — that is fewer calendar days than N, so plan multiple shifts on the same day and/or earnings after that date; the count is cash needed, not distinct workdays.” |
| Insufficient Data | Unchanged |

Always include primary risk driver / dollar amounts already shown elsewhere when available.

**Forbidden phrase** for `requires_stacking_or_later_earnings`:  
`Add N ... before {firstRiskDate}` as the sole timing instruction.

#### H.5 UI / explanation (minimal)

1. Decision card uses the new `recommendedAction` string only (no second recommendation system).
2. Planned-shifts hint (one line): planned shifts may be stacked on one forecast date; earnings credited at accessible rate only.
3. Explanation adds one bullet:  
   `Required shifts close the coverage gap at accessible earnings; they are not a count of distinct days before the first risk date.`

#### H.6 Tests (critical only)

Add/adjust focused tests:

1. When N > available action days → recommendation must not use bare “before {riskDate}” scheduling; must mention stacking or cash-vs-calendar.
2. When N ≤ available action days and risk date exists → may prioritize on or before risk date.
3. Existing required-shift ceiling math still passes.
4. Scenario add/remove still recalculates recommendation.

#### H.7 Files touched (implementation map)

| File | Change |
|---|---|
| `docs/product-spec.md` | Spec §7.14 semantics + §10 recommendation table (done in design pass) |
| `src/domain/decision.ts` | derived days + recommendation branches |
| `src/domain/decision.test.ts` | honesty + math tests |
| `src/App.tsx` | one planned-shift stacking hint if not already clear |
| `README.md` | one methodology/limitation sentence if copy changes |
| Screenshots 3–4 | recapture after implement |

#### H.8 Closure checklist

- [x] Design approved
- [x] Domain + tests implemented
- [x] `npm test` pass (11)
- [x] `npm run build` pass
- [x] UI hint + explanation bullet consistent
- [x] README limitation updated
- [ ] At Risk screenshot recaptured (W-0220 class) — user/local refresh after preview
- [x] Work ledger Current State updated

#### H.9 Explicit non-goals

- Auto-distributing N shifts across days
- Blocking add-shift when “infeasible”
- Changing required-shift formula
- Wall-clock analysis dates
- Wage advances / biweekly invention / Package B demo labels (separate package)

---

### Package D — Delayed-payout visibility (IMPLEMENTED)

**Status:** Implemented after H+B.

**First Principles:** Innovation claim (conservative accessible earnings) must be visible on the decision surface, not only in the explanation footer.

Delivered:

1. Decision-card line: accessible = median × same-day % (delayed pay conservative).
2. Demo tag `Demo · Delayed pay` for `W-0071` (At Risk, rent driver, ~38% same-day).
3. Hint + README walkthrough updated.

**Non-goals:** changing accessible-earnings formula; replacing W-0220 as default.

---

### Package A — Calculation credibility (IMPLEMENTED)

**Status:** Implemented.

**First Principles:** forecast inputs must not erase real variable essentials or mis-label risk drivers.

Delivered:

1. **Essential spend** — exclude only `obligation_id=` settlement rows (not blanket category matches).
2. **Primary risk driver** — if the first negative day has no obligation, attribute the next in-horizon obligation (e.g. rent on due date).
3. Biweekly remains excluded + disclosed.

**Closure checklist:**

- [x] Focused unit tests updated/added (13 total)
- [x] `npm test` pass
- [x] `npm run build` pass
- [x] Explanation / product-spec / data dictionary / README aligned
- [ ] Screenshots refreshed — local/user optional

**Non-goals:** custom reserves, spending-reduction scenarios, wage advances.

### Package B — Demo path explicitness (IMPLEMENTED)

**Status:** Implemented.

**First Principles:** judges must hit the pain → action → recovery loop without hunting.

Delivered:

1. Selector tags: `Demo · At Risk` (`W-0220`), `Demo · Safe` (`W-0072`).
2. Default load selects `W-0220` when present.
3. One-line walkthrough hint under the selector.
4. README core flow updated to the same pair.
5. No second page; no comparison table.

**Closure checklist:**

- [x] Core loop unchanged for all workers
- [x] No dead controls
- [ ] Screenshot 1 and 3–4 refreshed — local/user after preview
- [x] Submission / README demo flow updated
- [x] `npm test` / `npm run build` still pass

**Non-goals:** worker comparison analytics, filters, search systems.

### Package C — Five-second decision hierarchy (only if H/B done)

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

1. **Package H** (recommendation honesty) — designed; implement next after approval.
2. **Package B** (demo path) — after H closed.
3. **Package A** only if essential-spend / risk-driver issues still materially hurt demos.
4. **Package C** only if time remains.

Default stop rule: after H+B, **ship**. Do not invent Package D.

## 10. Decision log (pre-implementation)

| Decision | Reason |
|---|---|
| Plan before code | Prevents stretch creep; preserves Mandatory Closure |
| Prefer calc + demo evidence over new features | Matches Priority Rule in judging-strategy §12 |
| Keep deferred list frozen | AGENTS mandatory cuts |
| One package at a time with closure checklist | Systemic Integrity |
| Package H before B | Honesty failure is measurable on 22/24 At Risk workers; demo labels cannot fix false timing claims |
| Do not change required-shift formula | Gap math remains correct; only semantics/copy were wrong |

## 11. Next action

**All analysis bottlenecks addressed in-product (H+B+D+A).** Remaining: user hosting / public repo. Ship.
