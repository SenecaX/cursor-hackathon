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
| Current phase | Phase 1 — Foundation and Inspection |
| Status | `not_started` |
| Build start | Not recorded |
| Deadline | Not recorded |
| Core loop | Not implemented |
| Automated tests | Not configured |
| Production build | Not configured |
| Hosted application | Not deployed |
| Data dictionary | Pending minimal inspection |
| Deferred functionality | Wage advances and optional scenarios |
| Next action | Record the deadline and initialize the application |

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

List only verified evidence:

- Data integration.
- Domain modeling.
- TypeScript implementation.
- Automated testing.
- UX implementation.
- Deployment.
- Technical communication.

Remove unsupported items.

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