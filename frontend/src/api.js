const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export async function getLatestForecast() {
  const res = await fetch(`${API_BASE}/api/forecast/latest`)
  return res.json()
}

export async function getAccuracy() {
  const res = await fetch(`${API_BASE}/api/accuracy`)
  return res.json()
}