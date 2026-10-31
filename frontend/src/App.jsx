import { useEffect, useState } from 'react'
import { getLatestForecast, getAccuracy } from './api.js'
import ForecastChart from './ForecastChart.jsx'
import ErrorChart from './ErrorChart.jsx'
import AccuracyOverlayChart from './AccuracyOverlayChart.jsx'
import useCountUp from './useCountUp.js'

export default function App() {
  const [forecast, setForecast] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getLatestForecast(), getAccuracy()])
      .then(([f, a]) => { setForecast(f); setAccuracy(a) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Center>Loading dashboard…</Center>
  if (error) return <Center style={{ color: '#dc2626' }}>Error: {error}</Center>

  const avgActual = accuracy.pairs.reduce((s, p) => s + p.actual, 0) / accuracy.pairs.length
  const errorPct = (accuracy.summary.mae / avgActual) * 100
  const reliability =
    errorPct < 10 ? { label: 'Good reliability', color: '#16a34a' } :
      errorPct < 20 ? { label: 'Moderate reliability', color: '#d97706' } :
        { label: 'High uncertainty', color: '#dc2626' }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <header className="glow-header" style={{ color: '#fff', padding: '28px 32px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: 26 }}>🌬️ Wind Power Procurement Dashboard</h1>
          <p style={{ margin: '6px 0 0', color: '#cbd5e1', fontSize: 14 }}>
            Day-ahead wind generation forecasts and accuracy tracking — National Grid (Elexon BMRS)
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '32px' }}>
        <Section className="fade-in fade-in-1" icon="📈" title="Latest Wind Forecast" subtitle={`Published ${new Date(forecast.publishTime).toLocaleString('en-GB')}`}>
          <ForecastChart data={forecast.points} />
        </Section>

        <Section className="fade-in fade-in-2" icon="🔍" title="Actual vs Forecast — Last 7 Days" subtitle="How closely the model tracked real generation">
          <AccuracyOverlayChart pairs={accuracy.pairs} />
        </Section>

        <Section className="fade-in fade-in-3" icon="⚡" title="Forecast Accuracy — January 2026" subtitle="Quantified error, so purchase decisions can factor in uncertainty">
          <div style={{ marginBottom: 20 }}>
            <span className="badge" style={{ background: `${reliability.color}1a`, color: reliability.color }}>
              <span className="badge-dot" style={{ background: reliability.color }} />
              {reliability.label} — avg error {errorPct.toFixed(1)}% of typical output
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            <Stat label="Mean Absolute Error" value={accuracy.summary.mae} suffix=" MW" />
            <Stat label="RMSE" value={accuracy.summary.rmse} suffix=" MW" />
            <Stat label="Periods Compared" value={accuracy.summary.count} decimals={0} />
          </div>
          <ErrorChart data={accuracy.summary.dailyMae} />
        </Section>
      </main>
    </div>
  )
}

function Section({ title, subtitle, icon, children, className }) {
  return (
    <section className={`card ${className || ''}`} style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>{icon} {title}</h2>
      {subtitle && <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 13 }}>{subtitle}</p>}
      {children}
    </section>
  )
}

function Stat({ label, value, suffix = '', decimals = 1 }) {
  const animated = useCountUp(value)
  return (
    <div className="card" style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 22px', background: '#f8fafc' }}>
      <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#0f172a' }}>{animated.toFixed(decimals)}{suffix}</div>
    </div>
  )
}

function Center({ children, style }) {
  return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>{children}</div>
}