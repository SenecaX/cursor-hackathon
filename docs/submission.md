# Submission Handoff — ShiftSafe

## Submission description

ShiftSafe answers the question irregular-income workers face every day: “Can I safely stop working today?” It combines real shift earnings, payout availability, recurring obligations, essential spending and current cash position to forecast the next 14 days. It identifies upcoming cash gaps, calculates the additional shifts required and lets workers test actions before making them. Unlike traditional budgets, ShiftSafe converts volatile income into an immediate, explainable work decision.

## Verified commands

```bash
npm install
npm test      # 9 passed
npm run build # pass → dist/
npm run preview
```

## Core loop proof

1. Select worker (e.g. `W-0014`).
2. See **At Risk**, required shifts, safe-to-spend, first risk date.
3. Add the recommended planned shifts.
4. Observe status move to **Safe** and coverage gap clear.
5. Read calculation explanation (median earnings, same-day rate, 3-day reserve).

## Screenshots

Located in `docs/screenshots/`:

1. `01-immediate-decision.png`
2. `02-cash-forecast.png`
3. `03-before-action.png`
4. `04-after-action.png`
5. `05-calculation-explanation.png`

## Hosting blocker (explicit)

| Check | Result |
|---|---|
| Production build | Pass |
| Vercel CLI | Token invalid — run `vercel login` |
| GitHub CLI | Token invalid — run `gh auth login` |

Smallest user action: authenticate to Vercel, run `vercel --prod --yes`, put the URL in README.

## Repository readiness

- No secrets committed.
- Wage advances excluded.
- Biweekly obligations excluded and disclosed.
- README matches implemented functionality.
- Public remote: `https://github.com/SenecaX/cursor-hackathon.git` (push/auth currently blocked).

## Build window

- Start: 2026-07-29 19:23:31 MDT
- Deadline: 2026-07-29 20:23:31 MDT
