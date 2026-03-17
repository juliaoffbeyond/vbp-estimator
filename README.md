# VBP Estimator — Value-based Price Estimator

**Live:** https://vbp-estimator-efilnpbb1-julia-1003s-projects.vercel.app

A single-page internal tool for automation agency owners to calculate the true value an automation delivers to a client, and set a confident, defensible price based on that value.

---

## What it does

Instead of pricing by hours spent, this tool helps you price by **value created**. Enter a few details about the client's team and the automation's impact, and the tool calculates:

- **Labour cost savings** — the monetary value of time saved across the team
- **Additional revenue generated** — what the team can produce with freed-up hours
- **Total value created** — the combined benefit to the client
- **Recommended price** — your chosen percentage of that total value
- **Client ROI** — what the client gets back for every £1 they spend

A colour-coded prompt guides you toward a healthy pricing range (10–30% of value created).

---

## Tech stack

| Layer | Choice |
|---|---|
| UI framework | React 18 |
| Bundler / dev server | Vite 6 |
| Styling | CSS Modules + CSS custom properties |
| Language | JavaScript (ES modules) |
| Deployment target | Vercel (static) |

No database, no authentication, no external API calls.

---

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run

```bash
# 1. Clone the repo
git clone https://github.com/<your-org>/vbp-estimator.git
cd vbp-estimator

# 2. Copy the environment file and adjust defaults if needed
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Environment variables

All variables are prefixed with `VITE_` so Vite exposes them to the browser bundle. **Never put secrets here.**

| Variable | Default | Description |
|---|---|---|
| `VITE_DEFAULT_HOURS_SAVED_PER_WEEK` | `5` | Hours saved per employee per week |
| `VITE_DEFAULT_WORKING_WEEKS_PER_YEAR` | `48` | Working weeks per year (after leave & holidays) |
| `VITE_DEFAULT_AVERAGE_ANNUAL_SALARY` | `60000` | Average gross annual salary of the team (£) |
| `VITE_DEFAULT_NUMBER_OF_EMPLOYEES` | `10` | Number of team members using the automation |
| `VITE_DEFAULT_EXTRA_REVENUE_PER_EMPLOYEE` | `8000` | Extra annual revenue each person can generate with freed time (£) |
| `VITE_DEFAULT_CHARGE_PERCENTAGE` | `20` | % of total value to charge the client |
| `VITE_APP_CURRENCY` | `GBP` | Currency code (display only) |
| `VITE_APP_CURRENCY_SYMBOL` | `£` | Currency symbol shown in the UI |

These are **default values** pre-filled in the inputs. The user can change any of them in the tool at runtime.

---

## How the calculation works

```
Salary cost per hour      = Annual salary ÷ (Working weeks × 40 hrs)
Annual hours saved        = Hours saved per week × Working weeks
Labour savings (total)    = Salary cost per hour × Annual hours saved × No. of employees
Extra revenue (total)     = Extra revenue per employee × No. of employees

Total value created       = Labour savings + Extra revenue
Recommended price         = Total value × (Charge % ÷ 100)
Client ROI                = ((Total value − Price) ÷ Price) × 100
```

---

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server at `http://localhost:5173` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |

---

## Deploying to Vercel

The app is deployed at:
**https://vbp-estimator-efilnpbb1-julia-1003s-projects.vercel.app**

To redeploy or set up from scratch:
1. Push the repo to GitHub (already done).
2. Import the project in [Vercel](https://vercel.com/new).
3. Vercel auto-detects Vite — no build configuration needed.
4. Add your `.env` variables under **Project → Settings → Environment Variables**.

> **Note:** The security headers in `vite.config.js` apply to the dev/preview server only. For production headers on Vercel, add a `vercel.json` file — ask the team to set this up before going live.

---

## Security notes

- No secrets are stored — all `VITE_` variables are intentionally public defaults.
- `.env` is git-ignored; `.env.example` is the safe, committed template.
- The production build strips all `console.*` calls and debugger statements.
- CSP, `X-Frame-Options`, and other security headers are configured in `vite.config.js`.
