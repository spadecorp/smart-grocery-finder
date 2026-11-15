"""Smart Grocer optional local data API. Standard-library only.

Run: python services/data_api.py
Set VITE_DATA_API_URL=http://localhost:8765 in client/.env.local
Open Food Facts is community data; product matches are candidates, not inventory.
"""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse, urlencode
from urllib.request import Request, urlopen
from functools import lru_cache
import json
import os
import re
import time

PORT = int(os.getenv("SMART_GROCER_DATA_PORT", "8765"))
USER_AGENT = "SPaDeSmartGrocer/0.2 (https://github.com/spadecorp/smart-grocery-finder)"
MAX_ITEMS = 12
MIN_INTERVAL = 2.0
last_request = 0.0


def fetch_json(url):
    global last_request
    wait = MIN_INTERVAL - (time.monotonic() - last_request)
    if wait > 0:
        time.sleep(wait)
    last_request = time.monotonic()
    with urlopen(Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"}), timeout=12) as response:
        return json.load(response)


def norm(value):
    return set(re.findall(r"[a-z0-9]+", (value or "").lower()))


@lru_cache(maxsize=128)
def candidates(query):
    # Legacy full-text endpoint is required: API v2 structured search does not
    # support arbitrary search terms.
    url = "https://world.openfoodfacts.org/cgi/search.pl?" + urlencode({
        "search_terms": query, "search_simple": 1, "action": "process",
        "json": 1, "page_size": 12,
        "fields": "code,product_name,brands,quantity,nutriscore_grade,nutriments"
    })
    response = fetch_json(url)
    wanted = norm(query)
    found = []
    for product in response.get("products", []):
        name = product.get("product_name") or ""
        overlap = len(wanted & norm(name))
        if not wanted or overlap < len(wanted):
            continue
        grade = str(product.get("nutriscore_grade") or "").upper()
        if grade not in "ABCDE" or len(grade) != 1:
            grade = None
        found.append({
            "name": name, "brand": product.get("brands") or "",
            "quantity": product.get("quantity") or "",
            "barcode": product.get("code") or "",
            "nutriScore": grade,
            "nutritionPer100g": {
                key: product.get("nutriments", {}).get(key)
                for key in ("sugars_100g", "salt_100g", "saturated-fat_100g",
                            "fiber_100g", "proteins_100g")
                if isinstance(product.get("nutriments", {}).get(key), (int, float))
            },
            "source": "Open Food Facts"
        })
    return found[:5]


class Handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.headers_out()
        self.end_headers()

    def headers_out(self):
        self.send_header("Access-Control-Allow-Origin", "http://localhost:5173")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def respond(self, status, data):
        payload = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.headers_out()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/health":
            return self.respond(200, {"status": "ok"})
        if parsed.path != "/api/nutrition":
            return self.respond(404, {"error": "Not found"})
        items = [x.strip() for x in parse_qs(parsed.query).get("item", []) if x.strip()]
        if not items or len(items) > MAX_ITEMS or any(len(x) > 80 for x in items):
            return self.respond(400, {"error": "Provide 1-12 grocery item names (80 characters max each)."})
        output = []
        for item in items:
            try:
                matches = candidates(item)
                output.append({"item": item, "matches": matches, "status": "found" if matches else "no_match"})
            except Exception:
                output.append({"item": item, "matches": [], "status": "source_unavailable"})
        return self.respond(200, {"items": output, "priceStatus": "not_connected",
                                  "note": "Nutrition matches are product candidates, not store inventory or price evidence."})


if __name__ == "__main__":
    print(f"Smart Grocer data service: http://localhost:{PORT}")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
