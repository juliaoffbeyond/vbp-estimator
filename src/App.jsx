import { useState, useMemo, useCallback, useId } from 'react'
import styles from './App.module.css'

// ─── Env defaults (validated at module load, never at runtime to avoid re-reads) ──
const ENV = {
  hoursSavedPerWeek:       Number(import.meta.env.VITE_DEFAULT_HOURS_SAVED_PER_WEEK)       || 5,
  workingWeeksPerYear:     Number(import.meta.env.VITE_DEFAULT_WORKING_WEEKS_PER_YEAR)     || 48,
  averageAnnualSalary:     Number(import.meta.env.VITE_DEFAULT_AVERAGE_ANNUAL_SALARY)      || 60000,
  numberOfEmployees:       Number(import.meta.env.VITE_DEFAULT_NUMBER_OF_EMPLOYEES)        || 10,
  extraRevenuePerEmployee: Number(import.meta.env.VITE_DEFAULT_EXTRA_REVENUE_PER_EMPLOYEE) || 8000,
  chargePercentage:        Number(import.meta.env.VITE_DEFAULT_CHARGE_PERCENTAGE)          || 20,
  currencySymbol:          import.meta.env.VITE_APP_CURRENCY_SYMBOL                        || '£',
}

// ─── Pure calculation (no side effects) ──────────────────────────────────────
function calculate(inputs) {
  const {
    hoursSavedPerWeek,
    workingWeeksPerYear,
    averageAnnualSalary,
    numberOfEmployees,
    extraRevenuePerEmployee,
    chargePercentage,
  } = inputs

  const annualHoursWorked   = workingWeeksPerYear * 40
  const hourlyRate          = annualHoursWorked > 0 ? averageAnnualSalary / annualHoursWorked : 0
  const annualHoursSaved    = hoursSavedPerWeek * workingWeeksPerYear
  const labourSavingsPerEmp = annualHoursSaved * hourlyRate
  const totalLabourSavings  = labourSavingsPerEmp * numberOfEmployees
  const totalExtraRevenue   = extraRevenuePerEmployee * numberOfEmployees
  const totalValue          = totalLabourSavings + totalExtraRevenue
  const recommendedPrice    = totalValue * (chargePercentage / 100)
  const roi                 = recommendedPrice > 0 ? ((totalValue - recommendedPrice) / recommendedPrice) * 100 : 0
  const paybackMonths       = recommendedPrice > 0 ? (recommendedPrice / (totalValue / 12)) : 0

  return {
    hourlyRate,
    annualHoursSaved,
    labourSavingsPerEmp,
    totalLabourSavings,
    totalExtraRevenue,
    totalValue,
    recommendedPrice,
    roi,
    paybackMonths,
  }
}

// ─── Input validation ─────────────────────────────────────────────────────────
function sanitiseNumber(raw, min, max) {
  const n = parseFloat(String(raw).replace(/[^0-9.]/g, ''))
  if (isNaN(n)) return ''
  return Math.min(Math.max(n, min), max)
}

// ─── Formatting helpers ───────────────────────────────────────────────────────
function fmt(value, symbol = '£') {
  if (!isFinite(value)) return `${symbol}0`
  return `${symbol}${Math.round(value).toLocaleString('en-US')}`
}

function fmtDecimal(value) {
  if (!isFinite(value)) return '0'
  return value.toLocaleString('en-US', { maximumFractionDigits: 1 })
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function InputField({ label, hint, value, onChange, min, max, step = 1, prefix, suffix, id }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={styles.inputWrapper}>
        {prefix && <span className={styles.adornment} aria-hidden="true">{prefix}</span>}
        <input
          id={id}
          className={styles.input}
          style={prefix ? { paddingLeft: '2.25rem' } : suffix ? { paddingRight: '3rem' } : undefined}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          autoComplete="off"
          spellCheck={false}
        />
        {suffix && <span className={styles.adornmentRight} aria-hidden="true">{suffix}</span>}
      </div>
    </div>
  )
}

function ResultRow({ label, value, muted }) {
  return (
    <div className={`${styles.resultRow} ${muted ? styles.resultRowMuted : ''}`}>
      <span className={styles.resultLabel}>{label}</span>
      <span className={styles.resultValue}>{value}</span>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const uid = useId()
  const id  = (key) => `${uid}-${key}`

  const [inputs, setInputs] = useState({
    hoursSavedPerWeek:       ENV.hoursSavedPerWeek,
    workingWeeksPerYear:     ENV.workingWeeksPerYear,
    averageAnnualSalary:     ENV.averageAnnualSalary,
    numberOfEmployees:       ENV.numberOfEmployees,
    extraRevenuePerEmployee: ENV.extraRevenuePerEmployee,
    chargePercentage:        ENV.chargePercentage,
  })

  const handleChange = useCallback((key, min, max) => (e) => {
    const raw = e.target.value
    if (raw === '' || raw === '-') {
      setInputs(prev => ({ ...prev, [key]: '' }))
      return
    }
    const safe = sanitiseNumber(raw, min, max)
    setInputs(prev => ({ ...prev, [key]: safe === '' ? '' : safe }))
  }, [])

  const numericInputs = useMemo(() => ({
    hoursSavedPerWeek:       Number(inputs.hoursSavedPerWeek)       || 0,
    workingWeeksPerYear:     Number(inputs.workingWeeksPerYear)      || 0,
    averageAnnualSalary:     Number(inputs.averageAnnualSalary)      || 0,
    numberOfEmployees:       Number(inputs.numberOfEmployees)        || 0,
    extraRevenuePerEmployee: Number(inputs.extraRevenuePerEmployee)  || 0,
    chargePercentage:        Number(inputs.chargePercentage)         || 0,
  }), [inputs])

  const results = useMemo(() => calculate(numericInputs), [numericInputs])

  const sym = ENV.currencySymbol

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon} aria-hidden="true">£</span>
            <span className={styles.logoText}>VBP Estimator</span>
          </div>
          <p className={styles.tagline}>Value-based Price Estimator</p>
        </div>
      </header>

      {/* ── Main ── */}
      <main className={styles.main}>
        <div className={styles.container}>

          {/* Intro */}
          <section className={styles.intro} aria-labelledby="intro-heading">
            <h1 id="intro-heading" className={styles.title}>
              What's your automation actually worth?
            </h1>
            <p className={styles.subtitle}>
              Enter the details below to calculate the total value your automation delivers — and
              set a price your client will happily pay.
            </p>
          </section>

          {/* Grid: inputs + results */}
          <div className={styles.grid}>

            {/* ── Inputs panel ── */}
            <section className={styles.card} aria-label="Calculator inputs">
              <h2 className={styles.cardTitle}>
                <span className={styles.cardTitleIcon} aria-hidden="true">⚙</span>
                Inputs
              </h2>

              <fieldset className={styles.fieldset} aria-label="Time savings">
                <legend className={styles.legend}>Time savings</legend>
                <InputField
                  id={id('hours')}
                  label="Hours saved per employee per week"
                  hint="Be conservative — e.g. if the automation removes 1 hr of manual data entry per day, enter 5."
                  value={inputs.hoursSavedPerWeek}
                  onChange={handleChange('hoursSavedPerWeek', 0, 168)}
                  min={0} max={168} step={0.5}
                  suffix="hrs / wk"
                />
                <InputField
                  id={id('weeks')}
                  label="Working weeks per year"
                  hint="Deduct public holidays and average leave — 48 is a safe default for most UK businesses."
                  value={inputs.workingWeeksPerYear}
                  onChange={handleChange('workingWeeksPerYear', 1, 52)}
                  min={1} max={52}
                  suffix="weeks"
                />
              </fieldset>

              <fieldset className={styles.fieldset} aria-label="Workforce">
                <legend className={styles.legend}>Workforce</legend>
                <InputField
                  id={id('salary')}
                  label="Average annual employee salary"
                  hint="Use gross salary — this is what the business actually pays per person and determines the true cost of their time."
                  value={inputs.averageAnnualSalary}
                  onChange={handleChange('averageAnnualSalary', 0, 10_000_000)}
                  min={0} max={10_000_000} step={1000}
                  prefix={sym}
                />
                <InputField
                  id={id('employees')}
                  label="Number of team members using this automation"
                  hint="Include everyone whose workflow changes — even partial time savings multiply quickly across a team."
                  value={inputs.numberOfEmployees}
                  onChange={handleChange('numberOfEmployees', 0, 100_000)}
                  min={0} max={100_000}
                  suffix="people"
                />
              </fieldset>

              <fieldset className={styles.fieldset} aria-label="Revenue upside">
                <legend className={styles.legend}>Revenue upside</legend>
                <InputField
                  id={id('revenue')}
                  label="Extra revenue per employee per year"
                  hint="What could each person realistically bring in if they redirected those hours to sales, client work, or growth? Enter 0 if not applicable."
                  value={inputs.extraRevenuePerEmployee}
                  onChange={handleChange('extraRevenuePerEmployee', 0, 10_000_000)}
                  min={0} max={10_000_000} step={500}
                  prefix={sym}
                />
              </fieldset>

              <fieldset className={styles.fieldset} aria-label="Your price">
                <legend className={styles.legend}>Your price</legend>
                <InputField
                  id={id('pct')}
                  label="% of total value to charge"
                  hint="Industry standard is 10–30%. Your client keeps the rest — the gap between your price and the total value is your strongest sales argument."
                  value={inputs.chargePercentage}
                  onChange={handleChange('chargePercentage', 0, 100)}
                  min={0} max={100} step={1}
                  suffix="% of value"
                />
              </fieldset>
            </section>

            {/* ── Results panel ── */}
            <aside className={styles.results} aria-live="polite" aria-label="Calculation results">

              {/* Hero price */}
              <div className={styles.priceHero}>
                <p className={styles.priceLabel}>Recommended price</p>
                <p className={styles.price}>{fmt(results.recommendedPrice, sym)}</p>
                <p className={styles.priceSub}>
                  {fmtDecimal(numericInputs.chargePercentage)}% of the value you create
                </p>
              </div>

              {/* Value breakdown */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <span className={styles.cardTitleIcon} aria-hidden="true">📊</span>
                  Value breakdown
                </h2>

                <div className={styles.resultList}>
                  <ResultRow
                    label={`Hours saved per employee / year`}
                    value={`${fmtDecimal(results.annualHoursSaved)} hrs`}
                    muted
                  />
                  <div className={styles.divider} aria-hidden="true" />
                  <ResultRow
                    label="Labour cost savings"
                    value={fmt(results.totalLabourSavings, sym)}
                  />
                  <ResultRow
                    label="Additional revenue generated"
                    value={fmt(results.totalExtraRevenue, sym)}
                  />
                  <div className={styles.totalRow}>
                    <span>Total value created</span>
                    <span className={styles.totalValue}>{fmt(results.totalValue, sym)}</span>
                  </div>
                </div>
              </div>

              {/* Client ROI */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <span className={styles.cardTitleIcon} aria-hidden="true">📈</span>
                  Client ROI
                </h2>

                <div className={styles.roiGrid}>
                  <div className={styles.roiStat}>
                    <span className={styles.roiStatValue}>{Math.round(results.roi)}%</span>
                    <span className={styles.roiStatLabel}>Return on investment</span>
                  </div>
                  <div className={styles.roiStat}>
                    <span className={styles.roiStatValue}>
                      {results.paybackMonths > 0 ? `${fmtDecimal(results.paybackMonths)} mo` : '—'}
                    </span>
                    <span className={styles.roiStatLabel}>Payback period</span>
                  </div>
                </div>

                <p className={styles.roiNote}>
                  For every {sym}1 your client spends, they get{' '}
                  <strong>{sym}{fmtDecimal(results.roi / 100 + 1)}</strong> in return.
                </p>
              </div>

              {/* Confidence tip */}
              {numericInputs.chargePercentage > 0 && numericInputs.chargePercentage < 10 && (
                <div className={`${styles.tip} ${styles.tipLow}`} role="note">
                  <span className={styles.tipIcon} aria-hidden="true">⚠</span>
                  <p>
                    {fmtDecimal(numericInputs.chargePercentage)}% may be too low to be worth it.
                    Factor in your build time, maintenance, and support — below 10% often means
                    you're leaving significant money on the table.
                  </p>
                </div>
              )}
              {numericInputs.chargePercentage >= 10 && numericInputs.chargePercentage <= 30 && (
                <div className={styles.tip} role="note">
                  <span className={styles.tipIcon} aria-hidden="true">✓</span>
                  <p>
                    Charging {fmtDecimal(numericInputs.chargePercentage)}% of value is a strong,
                    defensible price. Lead with the ROI number — your client keeps{' '}
                    <strong>{fmt(results.totalValue - results.recommendedPrice, sym)}</strong>.
                  </p>
                </div>
              )}
              {numericInputs.chargePercentage > 30 && (
                <div className={`${styles.tip} ${styles.tipWarn}`} role="note">
                  <span className={styles.tipIcon} aria-hidden="true">⚠</span>
                  <p>
                    Above 30% can feel aggressive to clients. Make sure your value calculation is
                    conservative and well-documented to back up the ask.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <p>Value-based Price Estimator &mdash; for internal use only</p>
      </footer>
    </div>
  )
}
