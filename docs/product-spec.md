# Product Specification — ShiftSafe
## 1. Product Definition
**Working name:** ShiftSafe  
**Primary question:** “Can I safely stop working today?”
ShiftSafe converts irregular earnings, payout availability, recurring obligations and essential spending into a daily work decision.
It is a decision-support tool, not a traditional money-in/money-out budget.
## 2. Target User
A worker who:
- Earns through daily, hourly or gig work.
- Has variable income.
- Has fixed obligations due on specific dates.
- May not receive earnings immediately.
- Must decide whether another shift is financially necessary.
## 3. Core Problem
Monthly totals can appear healthy while payment timing creates short-term cash gaps.
Traditional budgets describe past activity but do not answer:
> Have I earned enough to cover the next 14 days, or must I work another shift?
## 4. Product Promise
For a selected worker, ShiftSafe provides:
- A **Safe**, **Caution** or **At Risk** status.
- The lowest projected balance over the next 14 days.
- The first projected risk date.
- The main obligation contributing to the risk.
- The number of additional shifts required.
- A safe-to-spend amount.
- A recommended next action.
- A plain-language calculation explanation.
## 5. Core User Loop
1. Select a worker.
2. Receive an immediate safety status.
3. See the projected risk and its cause.
4. Review the required additional shifts.
5. Add or remove planned shifts.
6. Observe the forecast and recommendation change.
The loop must work from the provided datasets without manual setup.
## 6. Primary Interface
Display information in this order:
1. Safety status.
2. Recommended action.
3. Required additional shifts.
4. Safe-to-spend amount.
5. Fourteen-day cash timeline.
6. Upcoming obligations.
7. Calculation explanation.
Worker demographics and transaction details are supporting information.
## 7. Calculation Contract
### 7.1 Analysis Date
Use the selected worker’s latest transaction date.
If the worker has no transactions, use the end date of their latest weekly cashflow record.
The MVP does not provide custom analysis-date selection.
No record after the analysis date may influence historical calculations.
### 7.2 Forecast Horizon
Forecast exactly **14 calendar days**, beginning on the analysis date.
### 7.3 Current Balance
Use the selected worker’s latest `running_balance_cad` at or before the analysis date.
```text
current balance
= latest eligible transaction.running_balance_cad

Fallback:

current balance
= latest eligible weekly_cashflow_summary.ending_balance_cad

If neither value exists, return Insufficient Data.

7.4 Expected Net Earnings per Shift

Use the median historical net_pay_cad at or before the analysis date.

expected net earnings per shift
= median(historical net_pay_cad)

The median limits distortion from unusually high or low shifts.

7.5 Same-Day Payout Rate

same-day payout rate
= same-day-paid historical shifts / total historical shifts

7.6 Accessible Earnings per Additional Shift

The dataset identifies whether earnings were paid on the same day but does not provide delayed payment dates.

accessible earnings per shift
= expected net earnings per shift × same-day payout rate

Delayed earnings are therefore handled conservatively.

If accessible earnings equal zero, required shifts must return Unavailable rather than inventing a value.

7.7 Essential Variable Spending

Use essential outgoing transactions from the 28 calendar days before the analysis date.

Include zero-spending days in the average.

Exclude debit rows whose `notes` contain `obligation_id=` (obligation settlements already modeled in the forecast) to reduce double counting. Do not blanket-exclude entire categories solely because an obligation category matches.

daily essential variable spending
= essential non-settlement outgoing transactions during 28 days / 28

Do not construct speculative category mappings.

7.8 Safety Reserve

Use three days of essential variable spending.

safety reserve
= daily essential variable spending × 3

The three-day assumption must be visible.

The MVP does not provide an adjustable reserve.

7.9 Upcoming Obligations

Generate obligations within the 14-day horizon using verified semantics from:

* frequency
* due_day_of_month
* amount_cad
* essential
* autopay

Implement only recurrence values confirmed during data inspection.

Unsupported records must be excluded explicitly and disclosed.

7.10 Projected Daily Balance

For each forecast day:

projected balance
= previous projected balance
+ accessible planned-shift earnings
- obligations due
- daily essential variable spending

Historical records after the analysis date must not be inserted into the forecast.

7.11 Minimum Projected Balance

minimum projected balance
= lowest projected balance during the 14-day horizon

7.12 Cash Shortfall

cash shortfall
= max(0, -minimum projected balance)

7.13 Coverage Gap

coverage gap
= max(0, safety reserve - minimum projected balance)

7.14 Required Additional Shifts

required additional shifts
= ceiling(
    coverage gap / accessible earnings per shift
)

If accessible earnings are zero or unavailable, return Unavailable.

**Semantics:** This value is the number of **accessible-earning shift-equivalents** needed to close the coverage gap — i.e. chunks of same-day-accessible cash equal to one typical shift’s accessible pay. It is **not** a count of distinct calendar workdays, and stacking multiple units on one date does **not** mean working multiple physical shifts that day.

Recommendation and UI copy must use “shift-equivalent” / “earnings unit” language when describing planned scenario actions, and must not claim that all required units fit strictly before the first risk date when the required count exceeds the number of forecast days on or before that date.

7.15 Safe-to-Spend

safe to spend
= max(
    0,
    minimum projected balance - safety reserve
)

All monetary calculations must use integer cents internally.

8. Safety Classification

Status	Rule
Safe	Minimum projected balance is at least equal to the safety reserve
Caution	Minimum projected balance is non-negative but below the reserve
At Risk	A negative projected balance occurs
Insufficient Data	No reliable balance or required calculation input exists

Missing information must never produce a false Safe result.

9. Scenario Controls

The MVP supports only:

* Adding one **planned shift-equivalent** (one accessible-earnings unit) on a selected forecast date.
* Removing one planned shift-equivalent.
* Resetting all planned shift-equivalents.

Multiple units may be placed on the same forecast date to model “that much accessible cash by that date,” not multiple physical shifts in 24 hours.

Each change recalculates:

* Safety status.
* Minimum projected balance.
* First risk date.
* Required shift-equivalents.
* Safe-to-spend.
* Recommended action.

Custom earnings, payout timing, reserve adjustment and spending reduction are outside the MVP.

10. Recommended Actions

Condition	Recommendation
Safe	Stopping today is safe within the modeled horizon
Caution	Preserve cash or add shift-equivalents to restore the reserve
At Risk (schedule within day count)	Add the calculated shift-equivalents to cover the coverage gap; prioritize landing accessible earnings on or before the first risk date when the count fits available days
At Risk (requires stacking or later earnings)	Add the calculated shift-equivalents to cover the coverage gap; state the first risk date; disclose that units are cash chunks (not distinct workdays) and may share a calendar date or land after the risk date
Insufficient Data	Review the missing information before deciding

Recommendations must include the primary reason and relevant dollar amounts.

Do not use “Add N shifts before {first risk date}” as the sole instruction when N exceeds available forecast days on or before that date.

Design detail: `docs/score-lift-plan.md` Package E (terminology).

11. MVP Data Sources

Dataset	Purpose
workers.csv	Worker selection and context
transactions.csv	Current balance and essential spending
daily_earnings.csv	Shift earnings and payout availability
recurring_obligations.csv	Upcoming fixed obligations
weekly_cashflow_summary.csv	Balance fallback

earned_wage_advances.csv is excluded from the 60-minute MVP.

All used datasets join through worker_id.

12. Strict 60-Minute MVP

The MVP includes:

* Worker selection.
* Worker financial summary.
* Fourteen-day forecast.
* Safety classification.
* First risk date.
* Required-shift calculation.
* Safe-to-spend calculation.
* Add, remove and reset planned shifts.
* Plain-language explanation.
* Compact forecast visualization.
* Critical automated tests.
* Production build.
* Public hosted demo.
* Submission-ready README and screenshots.

13. Explicitly Deferred

Do not implement during the 60-minute build:

* Wage-advance analysis.
* Custom analysis dates.
* Custom expected earnings.
* Custom payout timing.
* Adjustable reserve.
* Spending-reduction scenarios.
* Historical analytics.
* Worker comparisons.
* Advanced forecasting.
* Machine learning.
* Authentication.
* Backend or database.
* External financial integrations.

14. Design Rules

* Lead with the decision.
* Use plain language.
* Make assumptions visible.
* Explain every recommendation.
* Never count unavailable money as available.
* Never hide missing data.
* Never present forecasts as guarantees.
* Use real dataset values.
* Keep historical facts distinct from planned shifts.
* Preserve a usable desktop experience before adding polish.

15. Acceptance Criteria

The MVP is complete when:

* Selecting a worker isolates that worker’s records.
* The analysis date follows the defined fallback.
* Future records do not leak into historical calculations.
* Current balance matches the latest eligible source.
* Expected earnings use the median.
* Delayed earnings are handled conservatively.
* The forecast covers exactly 14 days.
* Safety status follows the defined thresholds.
* Required shifts and safe-to-spend cannot be negative.
* Zero accessible earnings return Unavailable.
* Adding and removing shifts updates the forecast correctly.
* Missing critical data produces Insufficient Data.
* Critical calculation tests pass.
* The production build succeeds.
* The hosted core loop works without manual configuration.
* README and screenshots describe only implemented functionality.

16. Delivery Constraints

* One developer using a Claude Code agent.
* Approximately 60 minutes.
* Provided anonymized datasets only.
* Public GitHub repository.
* AI screening before human judging.
* Functional completeness takes priority over breadth.
* Features freeze after 43 minutes.
* Implementation stops for packaging after 50 minutes.

