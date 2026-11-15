import type { ShoppingItem, StoreStop, OptimizedRoute } from '../types/basket';
import type { GroceryStore } from '../types';

// Calculate Haversine distance between two lat/lng points in miles
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export function computeOptimizedBasketRoute(
  userLocation: { latitude: number; longitude: number; zipcode: string },
  items: ShoppingItem[],
  availableStores: GroceryStore[]
): OptimizedRoute {
  if (availableStores.length === 0 || items.length === 0) {
    throw new Error('No stores or items available for route optimization.');
  }

  // Heuristic category assignment, not a stock claim. Each basket item belongs
  // to one suggested stop. Minimize unnecessary stops where possible.
  const selectedStores = availableStores.map(store => ({ store, items: [] as string[] }));
  const specialty = (name: string) => /fresh thyme|whole foods|natural grocers|sprouts|trader joe|organic|health food/i.test(name);
  const budget = (name: string) => /aldi|lidl|save a lot|walmart|costco|sam's club|dollar|discount/i.test(name);
  for (const item of items) {
    let choices = selectedStores;
    if (item.preference === 'healthiest') {
      const healthyStores = choices.filter(entry => specialty(entry.store.name));
      if (healthyStores.length) choices = healthyStores;
    } else if (item.preference === 'cheapest') {
      const discountStores = choices.filter(entry => budget(entry.store.name));
      if (discountStores.length) choices = discountStores;
    }
    // Prefer a store already in the itinerary, then proximity.
    const chosen = [...choices].sort((a,b) =>
      (a.items.length ? 0 : 1) - (b.items.length ? 0 : 1) ||
      a.store.distance - b.store.distance)[0];
    chosen.items.push(item.name);
  }
  const activeStores = selectedStores.filter(entry => entry.items.length > 0);

  // Order only the selected item-assigned stops by nearest-neighbor distance.
  let currentLocation = { lat: userLocation.latitude, lng: userLocation.longitude };
  let unvisited = [...activeStores];
  const orderedStops: StoreStop[] = [];
  let totalDistance = 0;

  while (unvisited.length > 0) {
    // Find closest unvisited store from current position
    let nearestIndex = 0;
    let minDistance = Infinity;

    unvisited.forEach((entry, idx) => {
      const dist = calculateDistance(currentLocation.lat, currentLocation.lng, entry.store.latitude, entry.store.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = idx;
      }
    });

    const nextStop = unvisited.splice(nearestIndex, 1)[0];
    totalDistance += minDistance;

    orderedStops.push({
      storeId: nextStop.store.id,
      storeName: nextStop.store.name,
      address: nextStop.store.address,
      latitude: nextStop.store.latitude,
      longitude: nextStop.store.longitude,
      itemsToBuy: nextStop.items
    });

    currentLocation = { lat: nextStop.store.latitude, lng: nextStop.store.longitude };
  }

  // Add return trip back to home location
  const returnDist = calculateDistance(currentLocation.lat, currentLocation.lng, userLocation.latitude, userLocation.longitude);
  totalDistance += returnDist;

  // Straight-line distance is not a driving route; avoid implying accurate travel times.
  const estimatedDurationMins = 0;

  return {
    origin: userLocation,
    stops: orderedStops,
    totalDistanceMiles: parseFloat(totalDistance.toFixed(1)),
    estimatedDurationMins
  };
}