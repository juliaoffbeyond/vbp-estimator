# VBP Estimator — Value-based Price Estimator

A single-page tool for automation agency owners to calculate the true value an automation delivers to a client, and set a confident, defensible price based on that value.

**Live:** https://vbp-estimator.vercel.app

## What it does

Instead of pricing by hours spent, this tool helps you price by **value created**. Enter a few details about the client's team and the automation's impact, and the tool calculates:

- **Labour cost savings** — the monetary value of time saved across the team
- **Additional revenue generated** — what the team can produce with freed-up hours
- **Total value created** — the combined benefit to the client
- **Recommended price** — your chosen percentage of that total value
- **Client ROI** — what the client gets back for every £1 they spend

A colour-coded prompt guides you toward a healthy pricing range (10–30% of value created).

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

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Bundler | Vite 6 |
| Styling | CSS Modules + CSS custom properties |
| Language | JavaScript |
| Deployment | Vercel |

## Running Locally

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/juliaoffbeyond/vbp-estimator.git
cd vbp-estimator
npm install
```

2. Copy `.env.example` to `.env` and adjust the default values if needed:

```bash
cp .env.example .env
```

3. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Environment Variables

These control the default values pre-filled in the calculator inputs.

| Variable | Description |
|---|---|
| `VITE_DEFAULT_HOURS_SAVED_PER_WEEK` | Default hours saved per week |
| `VITE_DEFAULT_WORKING_WEEKS_PER_YEAR` | Default working weeks per year |
| `VITE_DEFAULT_AVERAGE_ANNUAL_SALARY` | Default average annual salary |
| `VITE_DEFAULT_NUMBER_OF_EMPLOYEES` | Default number of employees |
| `VITE_DEFAULT_EXTRA_REVENUE_PER_EMPLOYEE` | Default extra revenue per employee |
| `VITE_DEFAULT_CHARGE_PERCENTAGE` | Default charge percentage |
| `VITE_APP_CURRENCY` | Currency code (e.g. `GBP`) |
| `VITE_APP_CURRENCY_SYMBOL` | Currency symbol (e.g. `£`) |

## Deployment

The app is a static Vite build — deploy anywhere that serves static files. To deploy to Vercel: connect your GitHub repo, set the `VITE_*` environment variables in Vercel project settings, and deploy.
