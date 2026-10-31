import requests

BASE = "https://data.elexon.co.uk/bmrs/api/v1/datasets"

def _get(dataset, params):
    r = requests.get(f"{BASE}/{dataset}/stream", params=params, timeout=60)
    r.raise_for_status()
    return r.json()

def fetch_actual_wind(date_from: str, date_to: str):
    """Actual half-hourly WIND generation (MW)."""
    data = _get("FUELHH", {"publishDateTimeFrom": date_from, "publishDateTimeTo": date_to})
    return [d for d in data if d.get("fuelType") == "WIND"]

def fetch_wind_forecast(date_from: str, date_to: str):
    """WIND generation forecasts published in this window."""
    return _get("WINDFOR", {"publishDateTimeFrom": date_from, "publishDateTimeTo": date_to})