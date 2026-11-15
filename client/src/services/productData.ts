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
