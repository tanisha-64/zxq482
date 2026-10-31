import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function fmt(iso) {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit' })
}

export default function AccuracyOverlayChart({ pairs }) {
  const recent = pairs.slice(-168) // last 7 days (168 half-hour-ish points)
  const chartData = recent.map(p => ({ time: fmt(p.startTime), Actual: p.actual, Forecast: p.forecast }))

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={Math.ceil(chartData.length / 10)} />
          <YAxis label={{ value: 'MW', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Actual" stroke="#16a34a" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="Forecast" stroke="#2563eb" dot={false} strokeWidth={2} strokeDasharray="5 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}