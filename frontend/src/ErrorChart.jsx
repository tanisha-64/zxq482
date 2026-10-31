import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ErrorChart({ data }) {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis label={{ value: 'MAE (MW)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="mae" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}