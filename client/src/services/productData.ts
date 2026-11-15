export interface ProductMatch {
  name: string
  brand: string
  quantity: string
  barcode: string
  nutriScore: string | null
  nutritionPer100g: Record<string, number>
  source: string
}

export interface NutritionResult {
  items: Array<{ item: string; matches: ProductMatch[]; status: string }>
  priceStatus: string
  note: string
}

export async function lookupNutrition(items: string[]): Promise<NutritionResult | null> {
  const api = import.meta.env.VITE_DATA_API_URL
  if (!api) return null
  const params = new URLSearchParams()
  items.slice(0, 12).forEach(item => params.append('item', item))
  const response = await fetch(`${api}/api/nutrition?${params.toString()}`)
  if (!response.ok) throw new Error('Nutrition lookup unavailable')
  return response.json() as Promise<NutritionResult>
}

export interface PriceObservation { name: string; barcode: string | null; price: number; currency: string | null; date: string; source: string }
export async function lookupStorePrices(storeId: string): Promise<PriceObservation[]> {
  const api = import.meta.env.VITE_DATA_API_URL
  const match = /^osm-(node|way|relation)-(\d+)$/.exec(storeId)
  if (!api || !match) return []
  const params = new URLSearchParams({ osm_type: match[1].toUpperCase(), osm_id: match[2] })
  const response = await fetch(api + '/api/store-prices?' + params.toString())
  if (!response.ok) return []
  const data = await response.json()
  return Array.isArray(data.observations) ? data.observations : []
}
