# Work Ledger — ShiftSafe

## 1. Purpose

Maintain a concise, evidence-based record of execution.

Record only:

- Material changes.
- Material decisions.
- Verification results.
- Failures and corrections.
- Unresolved gaps.
- The next action.

The ledger must support delivery, not delay it.

## 2. Rules

- Only the Current State section may be updated in place.
- Completed entries are append-only.
- Never claim tests or functionality without evidence.
- Correct previous information through a new entry.
- Reference concrete files and commands.
- Separate verified facts from assumptions.
- Keep every entry concise.
- End every entry with one next action.

## 3. Build-Entry Limit

During the 60-minute build, add no more than three entries:

1. Foundation and data layer.
2. Decision engine and interface.
3. Verification, deployment and submission.

Do not create entries for minor edits or individual functions.

## 4. Status Vocabulary

Use only:

- `not_started`
- `in_progress`
- `blocked`
- `completed`
- `abandoned`

## 5. Current State

This is the only mutable section.

| Field | Current value |
|---|---|
| Current phase | Post-MVP — all in-product bottlenecks closed |
| Status | `completed` (H+B+D+A); hosting deferred |
| Build start | 2026-07-29 19:23:31 MDT |
| Deadline | 2026-07-29 20:23:31 MDT (MVP window); score-lift is post-MVP |
| Core loop | Honest recs + demos + delayed-pay + essential/risk-driver fixes |
| Automated tests | `npm test` — 13 passed |
| Production build | `npm run build` — pass |
| Hosted application | Deferred to manual user deploy |
| Data dictionary | Updated for obligation_id essential-spend exclusion |
| Deferred functionality | Wage advances, biweekly recurrence, optional scenarios |
| Score-lift plan | H+B+D+A closed |
| Next action | User hosts / pushes public repo; refresh screenshots if desired |

## 6. Entry Template

---

## Entry L-[number] — [short title]

**Date:** YYYY-MM-DD  
**Roadmap phase:** [phase number and name]  
**Status:** `not_started | in_progress | blocked | completed | abandoned`

### Objective

One sentence describing the intended outcome.

### Changes

- `path/to/file` — material change.
- `path/to/file` — material change.

### Decisions

- **Decision:** What was chosen.
- **Reason:** Why it was the smallest valid choice.

Include only material decisions.

### Verification

| Command or check | Result | Evidence |
|---|---|---|
| Command or check | `pass | fail | not_run` | Relevant output |

Never report `pass` without evidence.

### Failures, Corrections and Gaps

- **Failure:** What failed.
- **Correction:** What changed.
- **Gap:** What remains unresolved.

Write `None observed` only when appropriate.

### Evidence Demonstrated

List only verified evidence.

### Next Action

State one smallest submission-critical action.

---

## Entry L-001 — Product and Delivery Definition

**Date:** 2026-07-29  
**Roadmap phase:** Planning  
**Status:** `completed`

### Objective

Define a coherent product and a 60-minute delivery strategy before implementation.

### Changes

- `docs/product-spec.md` — defined the worker problem, calculation contract, strict MVP and acceptance criteria.
- `docs/judging-strategy.md` — mapped demonstrable evidence to the AI and human judging criteria.
- `docs/implementation-roadmap.md` — replaced the long incremental plan with a 60-minute timeboxed sequence.
- `docs/work-ledger.md` — established a lightweight execution record.
- `AGENTS.md` — established the autonomous 60-minute execution contract.

### Decisions

- **Decision:** Build a daily work-decision engine.
- **Reason:** It directly answers the event prompt beyond traditional budgeting.

- **Decision:** Use a 14-day deterministic forecast.
- **Reason:** It exposes near-term cash gaps while remaining explainable and achievable.

- **Decision:** Use a static React and TypeScript application.
- **Reason:** It minimizes infrastructure and deployment risk.

- **Decision:** Limit scenarios to adding, removing and resetting planned shifts.
- **Reason:** This proves the complete decision loop within the deadline.

- **Decision:** Exclude wage-advance analysis.
- **Reason:** It does not justify risking MVP completion.

### Verification

| Command or check | Result | Evidence |
|---|---|---|
| Product-spec review | `pass` | Strict 60-minute MVP and calculation rules are defined |
| Judging-strategy review | `pass` | All six criteria map to demonstrable evidence |
| Roadmap review | `pass` | Timeboxes, freeze points and final gate are defined |
| Application tests | `not_run` | Application has not been initialized |
| Production build | `not_run` | Application has not been initialized |

### Failures, Corrections and Gaps

- **Failure:** The initial plan exceeded the available delivery time.
- **Correction:** Replaced the broad roadmap and agent protocol with a strict 60-minute execution contract.
- **Gap:** Dataset semantics remain minimally unverified.
- **Gap:** Application, tests and production build are not initialized.
- **Gap:** No hosted application exists.

### Evidence Demonstrated

- Product definition.
- Financial-domain modeling.
- Scope control.
- Judging-strategy analysis.
- Constraint-driven planning.
- Technical communication.

### Next Action

Record the build start and deadline, then complete Phase 1 — Foundation and Inspection.

---

## Entry L-002 — Foundation, Data Layer, Decision Engine and Interface

**Date:** 2026-07-29  
**Roadmap phase:** Phases 1–4  
**Status:** `completed`

### Objective

Deliver the complete worker → forecast → decision → planned-shift loop on real CSV data.

### Changes

- Vite React TypeScript app at repo root (`package.json`, `vite.config.ts`, `src/`).
- `public/data/*.csv` — static copies of required raw datasets.
- `src/lib/{csv,money,dates}.ts` — parsing and integer-cent helpers.
- `src/data/{types,loadData}.ts` — worker-indexed dataset load.
- `src/domain/decision.ts` — pure 14-day decision engine.
- `src/domain/decision.test.ts` — critical financial tests.
- `src/App.tsx` + `src/App.css` — single-screen MVP UI.
- `docs/data-dictionary.md` — minimal used columns and recurrence semantics.

### Decisions

- **Decision:** Load CSVs from `/public/data` via `fetch` at runtime.
- **Reason:** Smallest static deployment path; no bundler CSV plugins.

- **Decision:** Implement monthly obligations only; exclude biweekly.
- **Reason:** `due_day_of_month` alone does not verify biweekly schedules.

- **Decision:** Keep all money math in integer cents outside React.
- **Reason:** Spec invariant and Systemic Integrity.

### Verification

| Command or check | Result | Evidence |
|---|---|---|
| `npm test` | `pass` | 8–9 critical tests (later 9 after min-balance fix) |
| Real-worker smoke (`tsx`) | `pass` | 220 workers: Safe 207 / Caution 1 / At Risk 12 / Insufficient 0 |
| CSV headers inspected | `pass` | directions debit/credit; bool 0/1; freq monthly|biweekly |

### Failures, Corrections and Gaps

- **Failure:** `create-vite` cancelled on non-empty root.
- **Correction:** Scaffolded in subdirectory and moved files up.
- **Gap:** Hosted deployment not yet attempted.

### Evidence Demonstrated

- Data integration.
- Domain modeling.
- TypeScript implementation.
- Automated testing.
- UX implementation.

### Next Action

Verify, repair, build, deploy, document, and package submission artifacts.

---

## Entry L-003 — Verification, Deployment and Submission

**Date:** 2026-07-29  
**Roadmap phase:** Phases 5–7  
**Status:** `blocked`

### Objective

Verify critical behavior, ship a production build, host the demo, and finish submission artifacts.

### Changes

- Fixed minimum projected balance to use forecast closing balances only (`src/domain/decision.ts`).
- Added regression test for opening-balance seeding bug.
- `README.md` — judge-oriented product doc with methodology and blockers.
- `docs/screenshots/01-05-*.png` — five current screenshots.
- `docs/submission.md` — submission description and handoff.

### Decisions

- **Decision:** Report auth blockers and preserve verified `dist/` rather than inventing a host.
- **Reason:** AGENTS.md authorization stop condition; Mandatory Closure.

### Verification

| Command or check | Result | Evidence |
|---|---|---|
| `npm test` | `pass` | 9 tests passed |
| `npm run build` | `pass` | `dist/` produced |
| Scenario W-0014 | `pass` | At Risk → Safe after required planned shifts |
| `vercel whoami` | `fail` | invalid token |
| `gh auth status` | `fail` | invalid keyring token |
| Screenshots | `pass` | five files in `docs/screenshots/` |

### Failures, Corrections and Gaps

- **Failure:** Min balance seeded with opening balance blocked recovery from already-negative cash.
- **Correction:** Initialize min from forecast closings; test added.
- **Gap:** Public hosted URL unavailable until user authenticates to Vercel or GitHub.

### Evidence Demonstrated

- Automated testing.
- Deployment preparation.
- Technical communication.
- UX screenshots.

### Next Action

User: `vercel login` then `vercel --prod --yes`; paste URL into README Hosted demo section.
