<div align="center">
  <h1>Smart Grocery</h1>
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

Smart Grocery Finder is an offline-capable desktop application designed for high-performance geospatial intelligence. Built using **Tauri, React, Vite, Tailwind CSS, Leaflet, and React Query**, it eliminates hardcoded mock data entirely in favor of live, real-time geocoding and multi-stop route optimization.

---

## ✨ Key Architectural Features

* **🌐 Real-Time Geospatial Autocomplete**: Integrates the OpenStreetMap Nominatim live search API (`nominatim.openstreetmap.org`) to provide instant address, city, and zipcode suggestions as you type[cite: 1].
* **🛒 Active Shopping Basket**: Dynamic weekly grocery list builder featuring inline catalog recommendations, category auto-assignment (Produce, Dairy, Meat, Bakery, Pantry), and per-item preference modes (`cheapest`, `healthiest`, `closest`).
* **🗺️ Client-Side TSP Route Optimization**: Computes multi-stop itineraries entirely within the desktop runtime, distributing basket items across specialized supermarkets discovered via the OpenStreetMap Overpass API within a 15km radius.
* **📍 Interactive Leaflet Map Integration**: Visualizes your start and end hub coordinates alongside numbered store stops connected via an amber-dashed Traveling Salesperson Problem (TSP) route polyline.
* **🌓 Global Theme Persistence**: Seamless dark/light mode toggle with persistent local storage and obsidian charcoal / sand industrial styling inspired by SPaDe Corp's design system.
* **🛡️ Standalone Native Binary**: Packaged via Tauri into a lightweight executable (`.exe` / `.app`), allowing users to run the software locally with zero external server dependencies.

---

## 🖥️ For End Users: How to Download & Run

If you want to run **SPaDe Corp Grocery Finder** directly on your desktop without configuring developer tools:

1. **Download the App**: 
   * Go to the [Releases Page](https://github.com/spadecorp/smart-grocery-finder/releases) (or clone/download this repository as a `.zip` and extract it).
2. **Run Locally (No Server Required)**:
   * This is a standalone Tauri desktop application. All geospatial routing, geocoding, and preference engines run 100% locally on your machine with zero background servers needed.

---

## 🛠️ For Developers: Building from Source

If you want to compile the native desktop binary yourself:

### Prerequisites
* **Node.js** (v18 or higher)
* **Rust** (Required for Tauri compilation — [Install Rust](https://www.rust-lang.org/tools/install))

### Installation Steps
1. **Clone the repository**:
   ```bash
   git clone [https://github.com/spadecorp/smart-grocery-finder.git](https://github.com/spadecorp/smart-grocery-finder.git)
   cd smart-grocery-finder
2. Install dependencies:
   ```bash
   npm install

3. Run in Development Mode:
   ```bash
   npm run tauri dev

4. Build the Standalone Installer (.exe / .app):
   ```bash
   npm run build
   npx tauri build

5. Output Installer Location: src-tauri/target/release/bundle/
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
```
---
© <img src="https://github.com/spadecorp/smart-grocery-finder/releases/download/Logo/SPaDe_Name3.png" alt="SPaDe Corp Logo" width="60" />
 
