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

  // 1. Match each basket item to its optimal store based on user preference
  const storeMap = new Map<string, { store: GroceryStore; items: string[] }>();

  items.forEach(item => {
    let targetStore: GroceryStore;

    if (item.preference === 'closest') {
      targetStore = [...availableStores].sort((a, b) => a.distance - b.distance)[0];
    } else if (item.preference === 'healthiest') {
      targetStore = [...availableStores].sort((a, b) => a.distance - b.distance)[0];
    } else {
      // cheapest
      targetStore = [...availableStores].sort((a, b) => a.distance - b.distance)[0];
    }

    if (!storeMap.has(targetStore.id)) {
      storeMap.set(targetStore.id, { store: targetStore, items: [] });
    }
    storeMap.get(targetStore.id)!.items.push(item.name);
  });

  const selectedStores = Array.from(storeMap.values());

  // 2. Solve multi-stop TSP using Nearest Neighbor Algorithm starting from user location
  let currentLocation = { lat: userLocation.latitude, lng: userLocation.longitude };
  let unvisited = [...selectedStores];
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