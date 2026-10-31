from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from elexon_client import fetch_actual_wind, fetch_wind_forecast
from analysis import build_day_ahead_pairs, summarize, latest_forecast_run

app = FastAPI(title="Wind Forecast Dashboard API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

JAN_START, JAN_END = "2026-01-01T00:00:00Z", "2026-02-01T00:00:00Z"
FC_START, FC_END = "2025-12-31T00:00:00Z", "2026-02-01T00:00:00Z"

_cache = {}

def _load():
    if not _cache:
        _cache["actuals"] = fetch_actual_wind(JAN_START, JAN_END)
        _cache["forecasts"] = fetch_wind_forecast(FC_START, FC_END)
    return _cache["actuals"], _cache["forecasts"]

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/forecast/latest")
def latest_forecast():
    _, forecasts = _load()
    run = latest_forecast_run(forecasts)
    return {
        "publishTime": run[0]["publishTime"] if run else None,
        "points": [{"startTime": r["startTime"], "generation": r["generation"]} for r in run],
    }

@app.get("/api/accuracy")
def accuracy():
    actuals, forecasts = _load()
    pairs = build_day_ahead_pairs(actuals, forecasts)
    return {"summary": summarize(pairs), "pairs": pairs}