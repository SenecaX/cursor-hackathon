# Submission Handoff — ShiftSafe

## Submission description

ShiftSafe answers the question irregular-income workers face every day: “Can I safely stop working today?” It combines real shift earnings, payout availability, recurring obligations, essential spending and current cash position to forecast the next 14 days. It identifies upcoming cash gaps, calculates the additional shift-equivalents required and lets workers test earnings units before acting. Unlike traditional budgets, ShiftSafe converts volatile income into an immediate, explainable work decision.

## Hosted demo

https://cursor-hackathon-iota-roan.vercel.app/

## Verified commands

```bash
npm install
npm test      # 13 passed
npm run build # pass → dist/
npm run preview
```

## Core loop proof

1. Open app (defaults to `W-0220` Demo · At Risk).
2. See **At Risk**, required shift-equivalents, safe-to-spend, first risk date.
3. Add earnings units on/before the risk trough.
4. Observe status move to **Safe**.
5. Optionally check `W-0071` (delayed pay) and `W-0072` (Safe).
6. Read calculation explanation (median × same-day rate, 3-day reserve).

## Screenshots

Refreshed from the live host (2026-07-29):

1. `docs/screenshots/01-immediate-decision.png`
2. `docs/screenshots/02-cash-forecast.png`
3. `docs/screenshots/03-before-action.png`
4. `docs/screenshots/04-after-action.png`
5. `docs/screenshots/05-calculation-explanation.png`

## Repository readiness

- No secrets committed.
- Wage advances excluded.
- Biweekly obligations excluded and disclosed.
- README includes hosted URL and current methodology.
- Public remote: `https://github.com/SenecaX/cursor-hackathon.git`

## Build window

- Start: 2026-07-29 19:23:31 MDT
- Deadline: 2026-07-29 20:23:31 MDT
