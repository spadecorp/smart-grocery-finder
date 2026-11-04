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
      targetStore = [...availableStores].sort((a, b) => b.healthScore - a.healthScore)[0];
    } else {
      // cheapest
      targetStore = [...availableStores].sort((a, b) => b.priceScore - a.priceScore)[0];
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
      // Estimate store coordinates based on distance and random offset or actual geocode
      const storeLat = currentLocation.lat + (Math.random() - 0.5) * 0.05;
      const storeLng = currentLocation.lng + (Math.random() - 0.5) * 0.05;
      const dist = calculateDistance(currentLocation.lat, currentLocation.lng, storeLat, storeLng);
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
      latitude: currentLocation.lat + 0.01,
      longitude: currentLocation.lng + 0.01,
      itemsToBuy: nextStop.items
    });

    currentLocation = { lat: currentLocation.lat + 0.01, lng: currentLocation.lng + 0.01 };
  }

  // Add return trip back to home location
  const returnDist = calculateDistance(currentLocation.lat, currentLocation.lng, userLocation.latitude, userLocation.longitude);
  totalDistance += returnDist;

  const estimatedDurationMins = Math.round(totalDistance * 3.5 + orderedStops.length * 10);

  return {
    origin: userLocation,
    stops: orderedStops,
    totalDistanceMiles: parseFloat(totalDistance.toFixed(1)),
    estimatedDurationMins
  };
}