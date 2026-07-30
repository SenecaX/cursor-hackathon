# Data Dictionary — ShiftSafe (MVP)

Join key: `worker_id` across all used datasets.

## Used columns

### workers.csv
- `worker_id`, `city`, `province`, `occupation`, `pay_type`

### transactions.csv
- `txn_id`, `worker_id`, `txn_ts`, `direction`, `amount_cad`, `category`, `is_essential`, `running_balance_cad`, `notes`
- Directions: `debit`, `credit`
- `is_essential`: `0` | `1`
- Date format: ISO datetime `YYYY-MM-DDTHH:MM:SS`

### daily_earnings.csv
- `earnings_id`, `worker_id`, `work_date`, `net_pay_cad`, `paid_same_day`
- `paid_same_day`: `0` | `1`
- Date format: `YYYY-MM-DD`

### recurring_obligations.csv
- `obligation_id`, `worker_id`, `name`, `category`, `amount_cad`, `frequency`, `due_day_of_month`, `autopay`, `essential`
- Frequencies observed: `monthly`, `biweekly`
- `essential` / `autopay`: `0` | `1`

### weekly_cashflow_summary.csv (balance fallback only)
- `worker_id`, `week_start`, `ending_balance_cad`
- Date format: `YYYY-MM-DD`

## Implemented recurrence
- **monthly**: obligation due on `due_day_of_month` within each calendar month intersecting the 14-day forecast (day clamped to month length).
- **biweekly**: excluded — `due_day_of_month` alone does not define a verified biweekly schedule.

## Material limitations
- `earned_wage_advances.csv` ignored.
- Delayed earnings have no payment date; accessible earnings = median net × same-day payout rate.
- Essential variable spending excludes only debit rows with `obligation_id=` in notes (settlements), not entire matching categories.
- Money stored as integer cents.
