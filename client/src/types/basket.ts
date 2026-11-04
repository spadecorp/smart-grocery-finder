export type PreferenceMode = 'closest' | 'healthiest' | 'cheapest';

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  preference: PreferenceMode;
}

export interface StoreStop {
  storeId: string;
  storeName: string;
  address: string;
  latitude: number;
  longitude: number;
  itemsToBuy: string[];
}

export interface OptimizedRoute {
  origin: { latitude: number; longitude: number; zipcode: string };
  stops: StoreStop[];
  totalDistanceMiles: number;
  estimatedDurationMins: number;
}