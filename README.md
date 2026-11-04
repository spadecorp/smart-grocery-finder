<div align="center">
  <img src="client/public/SPaDe_Name3.png" alt="SPaDe Corp Logo" width="160" />
  <h1>SPaDe Corp Domestic Intelligence</h1>
  <p><strong>Smart Grocery Finder & Multi-Stop Geospatial Routing Suite</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Tauri-v1.5%2Fv2-blue?style=flat-square&logo=tauri" alt="Tauri">
    <img src="https://img.shields.io/badge/React-18.x-blueviolet?style=flat-square&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Engine-TSP_Client_Side-amber?style=flat-square" alt="TSP Engine">
    <img src="https://img.shields.io/badge/OSM-Nominatim_%26_Overpass-success?style=flat-square" alt="OSM">
  </p>
</div>

---

## 🧭 Overview

**SPaDe Corp Grocery Finder** is an enterprise-grade, offline-capable desktop application designed for high-performance geospatial intelligence. Built using **Tauri, React, Vite, Tailwind CSS, Leaflet, and React Query**, it eliminates hardcoded mock data entirely in favor of live, real-time geocoding and multi-stop route optimization.

---

## ✨ Key Architectural Features

* **🌐 Real-Time Geospatial Autocomplete**: Integrates the OpenStreetMap Nominatim live search API (`nominatim.openstreetmap.org`) to provide instant address, city, and zipcode suggestions as you type[cite: 1].
* **🛒 Active Shopping Basket**: Dynamic weekly grocery list builder featuring inline catalog recommendations, category auto-assignment (Produce, Dairy, Meat, Bakery, Pantry), and per-item preference modes (`cheapest`, `healthiest`, `closest`).
* **🗺️ Client-Side TSP Route Optimization**: Computes multi-stop itineraries entirely within the desktop runtime, distributing basket items across specialized supermarkets discovered via the OpenStreetMap Overpass API within a 15km radius.
* **📍 Interactive Leaflet Map Integration**: Visualizes your start and end hub coordinates alongside numbered store stops connected via an amber-dashed Traveling Salesperson Problem (TSP) route polyline.
* **🌓 Global Theme Persistence**: Seamless dark/light mode toggle with persistent local storage and obsidian charcoal / sand industrial styling inspired by SPaDe Corp's design system.
* **🛡️ Standalone Native Binary**: Packaged via Tauri into a lightweight executable (`.exe` / `.app`), allowing users to run the software locally with zero external server dependencies.

---

## 📁 Repository Structure

```text
smart-grocery-finder/
├── client/
│   ├── public/
│   │   └── SPaDe_Name3.png             # Exact corporate logo asset
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx              # Enterprise navigation & theme toggle
│   │   │   └── ShoppingListBuilder.tsx # Active basket with inline autocomplete
│   │   ├── pages/
│   │   │   ├── SearchPage.tsx          # Real-time Nominatim address/zipcode search
│   │   │   ├── ResultsPage.tsx         # Leaflet map & Overpass store discovery
│   │   │   └── AboutPage.tsx           # System architecture & TSP engine specs
│   │   ├── services/
│   │   │   └── routeOptimizer.ts       # Client-side multi-stop TSP algorithm
│   │   ├── types/
│   │   │   ├── index.ts                # Core store & location interfaces
│   │   │   └── basket.ts               # Shopping item & optimized route types
│   │   ├── App.tsx                     # Global theme & router wrapper
│   │   └── main.tsx                    # React DOM entry point
│   └── package.json
└── src-tauri/                          # Tauri Rust backend & window configuration