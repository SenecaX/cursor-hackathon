# Judging Strategy — ShiftSafe
## 1. Objective
Maximize ShiftSafe’s probability of:
1. Reaching the top eight during AI screening.
2. Remaining convincing during human judging.
3. Demonstrating a complete product rather than scattered features.
Every scoring claim must be verifiable through the repository, hosted application, screenshots or README.
Never claim, screenshot or describe functionality that is not implemented and demonstrable.
## 2. Judging Pipeline
### AI Screening
Each submission receives:
1. Repository-structure analysis — Sonnet.
2. Code-quality analysis — Sonnet.
3. Innovation analysis — Sonnet.
4. Visual-UX analysis — Sonnet.
5. Pool-comparison analysis — Sonnet.
6. Final synthesis with extended thinking — Opus.
### Final Round
The eight highest AI-scored projects advance.
Human judges score each criterion out of 10. Scores are normalized using the published weights.
## 3. Weighted Priorities
| Criterion | Weight | Required evidence |
|---|---:|---|
| Innovation and Originality | 25% | A daily work-decision engine rather than a budget dashboard |
| Technical Execution | 25% | Real data integration, forecasting, scenarios and tests |
| Functional Completeness | 20% | Complete worker-to-recommendation loop |
| Problem–Solution Fit | 20% | A real cash-timing problem converted into action |
| UX and Design | 5% | Decision understood within five seconds |
| Learning and Ambition | 5% | Depth achieved by a solo developer under constraints |
The first four criteria represent 90% of the score and control implementation priority.
## 4. Core Positioning
### One-Sentence Position
> ShiftSafe tells irregular-income workers whether they have earned enough to safely stop working today—and what action will prevent the next cash gap.
### Differentiator
Traditional budgets answer:
> Where did my money go?
ShiftSafe answers:
> Can I safely stop working today?
ShiftSafe combines:
```text
variable earnings
+ payout availability
+ fixed obligations
+ essential spending
= immediate work recommendation

This positioning must remain consistent across:

* Submission description.
* README.
* Hosted application.
* Screenshots.
* Human demonstration.

5. Criterion-to-Evidence Map

Innovation and Originality — 25%

Prove that ShiftSafe is a decision engine:

* Lead with Safe, Caution or At Risk.
* Calculate required additional shifts.
* Calculate safe-to-spend.
* Identify the first projected risk date.
* Model same-day versus delayed payout availability.
* Let users test planned shifts before acting.

Do not position the product as a budgeting dashboard.

Technical Execution — 25%

Prove technical depth through:

* Multiple datasets joined by worker_id.
* Worker-specific analysis dates.
* Prevention of future-data leakage.
* Median shift-earnings calculation.
* Same-day payout-rate calculation.
* Fourteen-day daily cash projection.
* Recurring-obligation generation.
* Essential-spending estimation.
* Deterministic safety classification.
* Immediate scenario recalculation.
* Explicit missing-data handling.
* Automated tests for core calculations.
* Separation of data, domain logic and interface code.

No demonstrated result may be hard-coded.

Functional Completeness — 20%

The deployed application must support this complete loop:

1. Select a worker.
2. Receive a safety result.
3. Identify the first projected risk.
4. Review required additional shifts.
5. Add a planned shift.
6. Observe the forecast and recommendation change.
7. Understand why the result changed.

The loop must work without developer intervention, placeholder content or dead controls.

Problem–Solution Fit — 20%

Demonstrate one clear pain point:

A worker can earn enough over a month but still lack available cash when an essential obligation becomes due.

Prove the solution with a representative worker:

1. Show volatile earnings.
2. Show an upcoming obligation.
3. Reveal the projected cash gap.
4. Translate the gap into required shifts.
5. Show how an action changes the outcome.

UX and Design — 5%

The primary screen must communicate within five seconds:

1. Safety status.
2. Recommended action.
3. Required shifts.
4. Safe-to-spend.
5. Forecast timeline.
6. Supporting explanation.

Use plain language, consistent dollar formatting, accessible colors, responsive layout and explicit loading, empty and error states.

Learning and Ambition — 5%

Demonstrate depth rather than feature count:

* Multiple connected financial datasets.
* Temporal forecasting.
* Scenario simulation.
* Conservative payout modeling.
* Automated validation.
* Explicit assumptions and trade-offs.
* Public deployment.
* Persistent work ledger.

6. AI-Pass Optimization

AI pass	Evidence it must find
Repository structure	Clear directories, focused modules and complete README
Code quality	Typed models, centralized calculations, tests and error handling
Innovation	“Can I safely stop working today?” decision loop
Visual UX	Five current, legible screenshots
Pool comparison	Clear distinction from ordinary budgeting products
Final synthesis	Consistent evidence across code, documentation and visuals

The repository must be understandable without running the application.

7. README Requirements

The README must follow this order:

1. Product name and value proposition.
2. Hosted demo.
3. Worker problem.
4. Product solution.
5. Core demonstration flow.
6. Screenshots.
7. Architecture and data flow.
8. Calculation methodology.
9. Dataset usage.
10. Local setup.
11. Test instructions.
12. Assumptions and limitations.
13. Solo-builder scope and learning.

Use the rubric’s vocabulary naturally. Do not insert unsupported claims solely for keyword coverage.

8. Screenshot Strategy

Each screenshot must prove a distinct scoring claim.

Screenshot 1 — Immediate Decision

Show:

* Selected worker.
* Safety status.
* Recommended action.
* Required shifts.
* Safe-to-spend.

Proves: problem–solution fit, completeness and UX.

Screenshot 2 — Cash Forecast

Show:

* Fourteen-day timeline.
* First risk date.
* Main contributing obligation.
* Minimum projected balance.

Proves: technical execution and explainability.

Screenshot 3 — Before Action

Show:

* At Risk or Caution status.
* Coverage gap.
* Required additional shifts.

Proves: the worker’s pain point.

Screenshot 4 — After Action

Show the same worker after adding planned shifts:

* Updated forecast.
* Improved status.
* Reduced or eliminated coverage gap.

Proves: the complete interactive loop.

Screenshot 5 — Calculation Explanation

Show:

* Current-balance source.
* Expected shift earnings.
* Same-day payout rate.
* Essential-spending estimate.
* Safety reserve.
* Visible assumptions.

Proves: technical depth, trust and ambition.

Do not upload screenshots containing placeholders, developer tools, broken states or unfinished stretch features.

9. Submission Description

ShiftSafe answers the question irregular-income workers face every day: “Can I safely stop working today?” It combines real shift earnings, payout availability, recurring obligations, essential spending and current cash position to forecast the next 14 days. It identifies upcoming cash gaps, calculates the additional shifts required and lets workers test actions before making them. Unlike traditional budgets, ShiftSafe converts volatile income into an immediate, explainable work decision.

Update this description if the final implementation differs.

10. Human Demo

Use one continuous worker story:

1. Introduce a worker with volatile earnings.
2. Show an upcoming essential obligation.
3. Reveal the projected cash gap.
4. Show the required-shift recommendation.
5. Add the recommended shifts.
6. Show the improved status.
7. Explain the calculation and assumptions.

Prove value before discussing architecture.

11. Final Submission Gate

Submit only when:

* The GitHub repository is public.
* The hosted URL works in a clean browser session.
* The README contains the correct hosted URL.
* The core loop works for multiple workers.
* Documented build and test commands succeed.
* Automated tests pass.
* No future-data leakage exists.
* No hard-coded demonstration results exist.
* No placeholder content remains.
* Five current screenshots are uploaded.
* The submission description matches the implementation.
* No stretch feature can destabilize the MVP.
* The repository contains no secrets or private information.

12. Priority Rule

When choosing the next task:

1. Repair the core loop.
2. Strengthen real-data calculations.
3. Make scoring evidence explicit.
4. Improve the primary screen.
5. Add stretch functionality.

A smaller complete product is more valuable than a larger unfinished one.

13. Post-MVP Score Lift

After the 60-minute MVP is functionally complete, further work must follow `docs/score-lift-plan.md`.

That plan applies the six operating principles as hard gates. Next designed package:

* **Package H — Recommendation honesty** (required shifts = cash gap, not distinct days before risk).

Then Package B (demo-path labels). Packages A/C remain optional. Deferred stretch features stay forbidden.