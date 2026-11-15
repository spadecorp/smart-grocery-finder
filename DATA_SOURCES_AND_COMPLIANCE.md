# Smart Grocer — data acquisition policy and integration roadmap

## Allowed first-party sources

1. **Open Prices** — https://prices.openfoodfacts.org/api/docs — product-level price observations with locations and evidence. Inspect the Open Database License (ODbL) and attribution/share-alike obligations before integrating. Observations are not guaranteed current, local, or complete.
2. **Open Food Facts** — https://openfoodfacts.github.io/documentation/docs/Product-Opener/api/ — packaged-product ingredients, nutrition and Nutri-Score when available. Custom identifying User-Agent, endpoint-specific rate limits, attribution and ODbL compliance required.
3. **USDA FoodData Central** — https://fdc.nal.usda.gov/api-guide/ — public-domain nutrition reference data. Server-side API key only; never embed a key in React/browser bundles.
4. **OpenStreetMap/Overpass** — store discovery and approximate proximity only, not evidence of product inventory or prices.

## Retailer website collection

Before enabling a source: record its terms-of-use URL, robots.txt guidance, permitted access method, rate limits, whether public prices are location-specific, attribution obligations, and last review date. Do not bypass logins, CAPTCHAs, anti-bot controls, or access restrictions. Prefer authorized APIs, feeds, published datasets, or direct permission. Respect requests to stop.

## Price observation schema

Store: retailer/location ID, product GTIN or matching key, product name, brand, size, unit, currency, observed price, promotion/loyalty conditions, stock status if actually supplied, observed_at, source URL, source license, confidence and match status. Normalize unit prices and distinguish regular versus promotion pricing. Expire stale observations. Never treat a missing price as zero or silently infer an item is in stock.

## Nutrition schema

Product GTIN/normalized identity, source, serving size, energy, sodium, saturated fat, added sugar, fiber, protein, Nutri-Score if available, source timestamp and confidence. Compare like-for-like products within the same category and serving basis. Missing nutrition is **unknown**, not unhealthy. Avoid making medical claims.

## Recommendation rules

- Closest: rank by geographic distance (or actual travel duration if routing data is available).
- Cheapest: optimize **matched, observed basket prices** and travel costs; report basket coverage and timestamp. Do not claim cheapest when comparable basket coverage is inadequate.
- Healthiest: rank comparable products using published nutrition evidence, respecting user needs and missing-data limitations. Do not label stores healthy based on store name or category.
- For any mode, only claim that a specific product is available at a store when inventory or a relevant observed listing supports it.
- Multi-store routes require evidence that additional stops improve the selected objective. Otherwise one store can be the correct result.

## Implementation phases

1. Build a backend data ingestion/cache service; do not crawl from browser components.
2. Integrate Open Prices and Open Food Facts with explicit attribution and licenses, respecting rate limits.
3. Add USDA server-side nutrition fallback.
4. Match products using GTIN, brand, size and units; record ambiguity rather than guess.
5. Add store-specific basket coverage and confidence to the UI.
6. Introduce allowed retailer-specific collectors only after documented terms review and testing.
7. Test a fixed basket across multiple locations; verify no fabricated prices, stock, health rankings or travel times.

**Status:** This file defines the planned approach. It does not imply data integrations or scraping collectors are implemented.
