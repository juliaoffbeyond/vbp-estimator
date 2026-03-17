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

## Tech stack

| Layer | Choice |
|---|---|
| UI framework | React 18 |
| Bundler | Vite 6 |
| Styling | CSS Modules + CSS custom properties |
| Language | JavaScript (ES modules) |
| Hosting | Vercel |

---

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

The `.env` file controls the default values pre-filled in the inputs — edit them to change the starting state of the tool.
