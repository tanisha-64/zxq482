from collections import defaultdict

def _day(iso: str) -> str:
    return iso[:10]

def build_day_ahead_pairs(actuals, forecasts):
    """
    For each actual settlement period, use the forecast that was the LATEST one
    published on the previous calendar day — i.e. what the trading desk actually
    had in hand when making its day-ahead purchase decision.
    """
    by_start = defaultdict(list)
    for f in forecasts:
        by_start[f["startTime"]].append(f)

    pairs = []
    for a in actuals:
        start = a["startTime"]
        target_day = _day(start)
        candidates = [f for f in by_start.get(start, []) if _day(f["publishTime"]) < target_day]
        if not candidates:
            continue
        best = max(candidates, key=lambda f: f["publishTime"])
        error = a["generation"] - best["generation"]
        pairs.append({
            "startTime": start,
            "actual": a["generation"],
            "forecast": best["generation"],
            "forecastPublishTime": best["publishTime"],
            "error": error,
            "absError": abs(error),
        })
    pairs.sort(key=lambda p: p["startTime"])
    return pairs

def summarize(pairs):
    if not pairs:
        return {"mae": 0, "rmse": 0, "count": 0, "dailyMae": []}
    n = len(pairs)
    mae = sum(p["absError"] for p in pairs) / n
    rmse = (sum(p["error"] ** 2 for p in pairs) / n) ** 0.5
    daily = defaultdict(list)
    for p in pairs:
        daily[_day(p["startTime"])].append(p["absError"])
    daily_mae = [{"date": d, "mae": round(sum(v) / len(v), 1)} for d, v in sorted(daily.items())]
    return {"mae": round(mae, 1), "rmse": round(rmse, 1), "count": n, "dailyMae": daily_mae}

def latest_forecast_run(forecasts):
    """The most recently published forecast run and every startTime it covers."""
    if not forecasts:
        return []
    latest_publish = max(f["publishTime"] for f in forecasts)
    run = [f for f in forecasts if f["publishTime"] == latest_publish]
    run.sort(key=lambda f: f["startTime"])
    return run