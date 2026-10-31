import requests
import json

url = "https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream"
params = {
    "publishDateTimeFrom": "2025-12-30T00:00:00Z",
    "publishDateTimeTo": "2025-12-30T06:00:00Z",
}

r = requests.get(url, params=params, timeout=30)
print("STATUS:", r.status_code)
data = r.json()
print("COUNT:", len(data))
wind_items = [d for d in data if d.get("fuelType") == "WIND"]
print("WIND COUNT:", len(wind_items))
print("FIRST WIND ITEM:")
print(json.dumps(wind_items[0], indent=2))