export interface GroceryStore {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  rating: number;
  priceScore: number; // 1-10 reputation score for affordability (10 = typically budget-friendly)
  healthScore: number;
  categories: string[];
  phone?: string;
  website?: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export interface ZipcodeResult {
  zipcode: string;
  city: string;
  state: string;
  area?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  avgPrice: number;
}

export interface SearchRequest {
  zipcode: string;
  item: string;
}

export interface SearchResult {
  stores: GroceryStore[];
  shortest: GroceryStore;
  healthiest: GroceryStore;
  budgetFriendly: GroceryStore;
  searchedItem: string;
  userLocation: {
    latitude: number;
    longitude: number;
    zipcode: string;
    city?: string;
    state?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  zipcode: string;
  city?: string;
  state?: string;
}

export type RecommendationType = 'shortest' | 'healthiest' | 'budgetFriendly' 