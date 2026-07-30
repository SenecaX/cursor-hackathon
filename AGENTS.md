# AGENTS.md — ShiftSafe 60-Minute Execution Contract
## 1. Mission
Deliver a working, hosted ShiftSafe MVP within 60 minutes.
ShiftSafe answers:
> Can an irregular-income worker safely stop working today, and how many additional shifts are required to prevent the next cash gap?
Completion beats breadth. Working software beats process documentation.
## 2. Authority
This file defines the emergency 60-minute execution mode.
When scope conflicts occur, use this priority:
1. Direct user instruction.
2. This execution contract.
3. Verified dataset facts.
4. `docs/product-spec.md`.
5. `docs/implementation-roadmap.md`.
6. `docs/judging-strategy.md`.
7. `docs/work-ledger.md`.
The broader roadmap describes the ideal product. This file controls what must be delivered within the deadline.
## 3. Operating Principles
1. **First Principles Thinking** — preserve only the worker, forecast, decision and action.
2. **Pareto** — implement features that directly improve the four criteria worth 90%.
3. **LEAN** — eliminate optional features, abstractions and documentation.
4. **Systemic Integrity** — keep calculations, UI, tests and claims consistent.
5. **Constraint-Driven Design** — optimize every decision for the remaining time.
6. **Mandatory Closure** — reserve enough time to build, deploy, document and submit.
## 4. Start Procedure
Immediately:
1. Record the start time.
2. Set the deadline to 60 minutes later.
3. Inspect the repository and installed tooling.
4. Read:
   - `docs/product-spec.md`
   - `docs/judging-strategy.md`
   - `docs/implementation-roadmap.md`
   - `docs/work-ledger.md`
5. Begin implementation without requesting approval.
Check elapsed time after every phase.
Do not ask questions answerable through the repository or datasets.
## 5. Strict MVP
The complete required loop is:
```text
select worker
→ calculate 14-day forecast
→ display Safe, Caution or At Risk
→ display required additional shifts
→ display safe-to-spend
→ add or remove planned shifts
→ recalculate result

The primary screen must show:

* Worker selection.
* Safety status.
* Recommended action.
* Required shifts.
* Safe-to-spend.
* Minimum projected balance.
* First risk date.
* Upcoming obligations.
* Compact 14-day forecast.
* Planned-shift control.
* Short calculation explanation.

6. Dataset Priority

Use datasets in this order:

1. data/raw/workers.csv
2. data/raw/transactions.csv
3. data/raw/daily_earnings.csv
4. data/raw/recurring_obligations.csv
5. data/raw/weekly_cashflow_summary.csv only as a balance fallback
6. Ignore data/raw/earned_wage_advances.csv

Join through worker_id.

Inspect only the fields and categorical values required by the MVP.

Do not perform exhaustive profiling before implementation.

7. Mandatory Cuts

Do not implement:

* Wage-advance analysis.
* Authentication.
* Backend.
* Database.
* External APIs.
* Machine learning.
* Custom analysis dates.
* Worker comparisons.
* Historical analytics.
* Spending-reduction scenarios.
* Adjustable reserve controls.
* Advanced filtering.
* Multiple pages.
* Complex animations.
* Comprehensive mobile refinement.
* Exhaustive data validation.
* Exhaustive test coverage.
* Infrastructure not required for deployment.

Do not begin any stretch feature during this session.

8. Technical Direction

Use:

* React.
* TypeScript.
* Vite.
* Vitest.
* Static deployment.
* Integer cents for financial calculations.
* Pure functions for decision logic.
* Minimal dependencies.

Prefer the simplest reliable CSV-loading approach.

Do not build abstractions for hypothetical future requirements.

9. Timeboxed Execution

0–5 Minutes — Foundation and Inspection

Deliver:

* Working React, TypeScript and Vite application.
* Working test command.
* Working production build command.
* Confirmed CSV headers and required categorical values.

Do not produce a complete data dictionary.

5–15 Minutes — Minimal Data Layer

Deliver:

* Required dataset types.
* CSV parsing.
* Worker-indexed records.
* Currency conversion to integer cents.
* Date parsing and deterministic ordering.
* Minimal handling of invalid required fields.

If recurrence semantics are ambiguous, implement only verified supported values and disclose exclusions.

15–30 Minutes — Decision Engine

Implement:

* Current balance.
* Median historical net earnings per shift.
* Same-day payout rate.
* Accessible earnings per shift.
* Essential spending estimate.
* Three-day safety reserve.
* Fourteen-day obligations.
* Daily projected balances.
* Minimum projected balance.
* First risk date.
* Safe, Caution and At Risk status.
* Coverage gap.
* Required additional shifts.
* Safe-to-spend.
* Recommended action.

At 30 minutes, stop expanding calculation scope.

30–43 Minutes — Interface and Scenario Loop

Deliver:

* Worker selector.
* Primary decision card.
* Key financial values.
* Upcoming obligations.
* Compact forecast visualization.
* Add planned shift.
* Remove planned shift.
* Reset scenario.
* Immediate recalculation.
* Short explanation panel.

At 43 minutes, freeze features.

43–50 Minutes — Verification and Repair

Run critical tests for:

* Safe classification.
* At Risk classification.
* Required-shift calculation.
* Scenario-driven status change.
* Future-data leakage.
* Integer-cent correctness.
* Zero and unavailable states.

Then:

* Run the production build.
* Repair broken interactions.
* Remove placeholders.
* Remove console errors.
* Verify multiple workers.

Do not add features during this phase.

50–55 Minutes — Deploy and Document

Stop feature coding.

Deliver:

* Production build.
* Hosted deployment.
* Concise README containing:
    * Value proposition.
    * Hosted URL.
    * Core flow.
    * Calculation methodology.
    * Dataset usage.
    * Setup, test and build commands.
    * Assumptions and limitations.
* Updated work ledger.

If deployment requires user authentication, report the exact blocker immediately while preserving the verified production build.

55–60 Minutes — Submission Package

Deliver:

* Public repository verification.
* Five current screenshots.
* Final submission description.
* Clean hosted-demo verification.
* Final test and build results.
* Submission-ready handoff.

Do not modify application logic unless the hosted core loop is broken.

10. Calculation Rules

Follow docs/product-spec.md, subject to the deadline cuts.

Mandatory invariants:

* Store money as integer cents.
* Use the selected worker’s latest transaction date as the analysis date.
* Use the weekly summary only when no transaction balance exists.
* Use only records at or before the analysis date for historical calculations.
* Use median net_pay_cad for expected shift earnings.
* Treat delayed earnings conservatively.
* Forecast exactly 14 calendar days.
* Use three days of essential spending as the reserve.
* Safe-to-spend cannot be negative.
* Required shifts cannot be negative.
* Missing critical data cannot produce a Safe status.
* Division by zero returns an unavailable result.
* Forecasts are estimates, not guarantees.

Keep all calculation logic outside React components.

11. UX Priority

The screen hierarchy is:

status
→ recommended action
→ required shifts
→ safe-to-spend
→ forecast
→ explanation

Requirements:

* Understandable within five seconds.
* Status communicated with text and color.
* Historical data visually distinct from planned shifts.
* Consistent CAD formatting.
* No dead controls.
* No visible placeholders.
* Desktop layout must be polished.
* Mobile must remain usable but does not require refinement.

Use a simple visualization. Do not spend time building a charting system.

12. Testing Rule

Tests protect only critical financial behavior and the complete loop.

For domain-logic bugs:

1. Add or update a focused test.
2. Correct the implementation.
3. Confirm the test passes.

Do not pursue coverage targets or snapshot-heavy tests.

13. Documentation Rule

Documentation must describe only implemented functionality.

Data Dictionary

During this session, record only:

* Used columns.
* Observed categorical values.
* Join keys.
* Date formats.
* Implemented recurrence semantics.
* Material limitations.

Work Ledger

Use no more than three new entries during the build:

1. Foundation and data.
2. Decision engine and interface.
3. Verification, deployment and submission.

Update the Current State when each entry is added.

README

Keep it concise and optimized for judges. Do not reproduce internal planning documents.

14. Autonomy

Continue automatically from one phase to the next.

Choose the smallest compliant solution when multiple approaches exist.

Stop only when:

* External authentication or authorization is required.
* Continuing risks destroying user work.
* Verified data makes the core calculation impossible.
* A blocker cannot be resolved within three minutes.

When blocked:

1. Preserve working functionality.
2. Record the blocker.
3. Move to another submission-critical task when possible.
4. Report the smallest user action required.

15. Deadline Rules

* At 30 minutes: calculation scope freezes.
* At 43 minutes: all features freeze.
* At 50 minutes: coding stops and packaging begins.
* At 55 minutes: only submission-critical work remains.
* At 60 minutes: return the completed handoff.

Never sacrifice working functionality for architecture, documentation or polish.

16. Completion Definition

The session succeeds when:

* The application builds.
* Critical tests pass.
* A worker can be selected.
* The 14-day decision appears.
* Required shifts and safe-to-spend appear.
* Planned shifts change the forecast.
* The result is explainable.
* The application is hosted or deployment is ready with one explicit authorization blocker.
* README and screenshots match the implementation.
* The repository is ready for submission.

