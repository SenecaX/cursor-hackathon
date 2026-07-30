# Implementation Roadmap — ShiftSafe
## 1. Objective
Deliver a working, hosted ShiftSafe MVP within approximately 60 minutes.
The application must answer:
> Can this worker safely stop working today, and how many additional shifts are required to prevent the next cash gap?
The required loop is:
```text
select worker
→ calculate 14-day forecast
→ display safety decision
→ display required shifts
→ add or remove planned shifts
→ recalculate recommendation

Functional completeness takes priority over breadth.

2. Technical Direction

Use:

* React.
* TypeScript.
* Vite.
* Vitest.
* Static deployment.
* Minimal CSV processing.
* Pure financial calculation functions.
* Integer cents for monetary calculations.
* Minimal dependencies.

Do not add:

* Backend.
* Database.
* Authentication.
* External APIs.
* Machine learning.
* Infrastructure unrelated to deployment.

3. Dataset Priority

Use:

1. workers.csv
2. transactions.csv
3. daily_earnings.csv
4. recurring_obligations.csv
5. weekly_cashflow_summary.csv only as a balance fallback

Ignore earned_wage_advances.csv.

Inspect only the fields and categorical values required by the MVP.

4. Phase 1 — Foundation and Inspection

Elapsed time: 0–5 minutes

Deliver

* Initialize React, TypeScript and Vite.
* Configure Vitest.
* Confirm dev, test and build commands.
* Inspect required CSV headers.
* Inspect only required categorical values:
    * Transaction directions.
    * Boolean encodings.
    * Obligation frequencies.
    * Date formats.
* Establish minimal source directories.

Gate

* Development server starts.
* Baseline test passes.
* Production build succeeds.
* Required data semantics are sufficient to begin parsing.

5. Phase 2 — Minimal Data Layer

Elapsed time: 5–15 minutes

Deliver

* Types for used dataset fields.
* CSV loading and parsing.
* Currency conversion to integer cents.
* Date and boolean normalization.
* Deterministic record ordering.
* Records indexed by worker_id.
* Explicit rejection of unusable required records.
* Minimal docs/data-dictionary.md.

Data Dictionary Scope

Record only:

* Used columns.
* Observed categorical values.
* Join keys.
* Date formats.
* Implemented recurrence semantics.
* Material limitations.

Gate

* Multiple workers load successfully.
* Required records can be retrieved by worker_id.
* No demonstrated result is hard-coded.
* Processed data builds successfully.

6. Phase 3 — Decision Engine

Elapsed time: 15–30 minutes

Deliver

Implement pure functions for:

* Analysis date.
* Current balance.
* Median net earnings per shift.
* Same-day payout rate.
* Accessible earnings per shift.
* Twenty-eight-day essential spending estimate.
* Three-day safety reserve.
* Fourteen-day obligation generation.
* Daily projected balances.
* Minimum projected balance.
* First risk date.
* Coverage gap.
* Required additional shifts.
* Safe-to-spend.
* Safety classification.
* Recommended action.
* Calculation explanation.

Mandatory Rules

* Use integer cents.
* Use only historical records at or before the analysis date.
* Do not count delayed earnings as immediately available.
* Do not knowingly double-count recurring obligations.
* Missing critical data cannot produce a Safe result.
* Required shifts and safe-to-spend cannot be negative.
* Division by zero returns an unavailable result.
* Keep financial logic outside React components.

Critical Tests

Test:

* Safe classification.
* Caution or At Risk classification.
* Required-shift calculation.
* Future-data leakage prevention.
* Zero accessible earnings.
* Integer-cent correctness.

Gate

* Multiple workers produce coherent decision results.
* Critical tests pass.
* Production build succeeds.

At 30 minutes, calculation scope freezes.

7. Phase 4 — Interface and Scenario Loop

Elapsed time: 30–43 minutes

Deliver

* Worker selector.
* Worker context.
* Safety status.
* Recommended action.
* Required shifts.
* Safe-to-spend.
* Minimum projected balance.
* First risk date.
* Upcoming obligations.
* Compact 14-day forecast.
* Add a planned shift on a selected date.
* Remove a planned shift.
* Reset planned shifts.
* Immediate recalculation.
* Short explanation panel.

Visual Priority

status
→ recommended action
→ required shifts
→ safe-to-spend
→ forecast
→ explanation

Gate

A user can:

1. Select a worker.
2. Understand the projected risk.
3. See the required shifts.
4. Add a planned shift.
5. Observe the forecast and recommendation change.
6. Understand why the result changed.

At 43 minutes, all features freeze.

8. Phase 5 — Verification and Repair

Elapsed time: 43–50 minutes

Deliver

* Run critical tests.
* Run the production build.
* Test multiple representative workers.
* Repair broken calculations and interactions.
* Verify historical and scenario data remain distinct.
* Remove dead controls.
* Remove placeholders.
* Remove console errors.
* Confirm no secret or private information is present.
* Ensure the desktop layout is clear.
* Ensure the layout remains usable on mobile.

Do not add features during this phase.

Gate

* Core loop works for multiple workers.
* Tests pass.
* Production build passes.
* No visible broken or unfinished state remains.

At 50 minutes, application coding stops.

9. Phase 6 — Deploy and Document

Elapsed time: 50–55 minutes

Deliver

* Deploy the production build.
* Test the hosted URL in a clean browser session.
* Complete README.md.
* Include:
    * Value proposition.
    * Hosted URL.
    * Core flow.
    * Calculation methodology.
    * Dataset usage.
    * Setup, test and build commands.
    * Assumptions and limitations.
* Update the work ledger.

If deployment requires user authorization, report the exact required action immediately while preserving the verified build.

10. Phase 7 — Submission Package

Elapsed time: 55–60 minutes

Deliver

* Verify the public repository.
* Capture five current screenshots.
* Add screenshots to the README when time permits.
* Prepare the final submission description.
* Verify the hosted core loop one final time.
* Record final test and build results.
* Produce a submission-ready handoff.

Do not change application logic unless the hosted core loop is broken.

11. Screenshot Plan

1. Immediate decision.
2. Fourteen-day forecast.
3. At Risk or Caution state before action.
4. Improved state after adding shifts.
5. Calculation explanation and assumptions.

Screenshots must not contain placeholders, developer tools or unfinished features.

12. Work-Ledger Limit

Use no more than three new build entries:

1. Foundation and data layer.
2. Decision engine and interface.
3. Verification, deployment and submission.

Record only material changes, verification, failures and the next action.

13. Explicitly Deferred

Do not implement:

* Wage-advance analysis.
* Custom analysis dates.
* Custom shift earnings.
* Custom payout timing.
* Adjustable reserve.
* Spending-reduction scenarios.
* Historical analytics.
* Worker comparisons.
* Advanced forecasting.
* Machine learning.
* Additional pages.
* Decorative visualizations.

14. Deadline Rules

* At 30 minutes: freeze financial calculation scope.
* At 43 minutes: freeze all features.
* At 50 minutes: stop coding and begin packaging.
* At 55 minutes: work only on submission-critical artifacts.
* At 60 minutes: return the completed handoff.

If behind schedule:

1. Preserve the decision engine.
2. Preserve planned-shift recalculation.
3. Preserve critical tests.
4. Preserve production build and deployment.
5. Remove visual extras.
6. Reduce documentation.
7. Never add deferred functionality.

15. Final Gate

The MVP is submission-ready when:

* The public repository works.
* The hosted application opens.
* A worker can be selected.
* The 14-day safety result appears.
* Required shifts and safe-to-spend appear.
* Planned shifts update the forecast.
* The recommendation is explainable.
* Critical tests pass.
* The production build passes.
* No demonstrated result is hard-coded.
* No placeholder remains.
* README and screenshots match the implementation.
* No secret or private information is committed.

