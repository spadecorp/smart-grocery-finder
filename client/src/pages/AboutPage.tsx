import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Cpu, MapPin, Database } from 'lucide-react'

export default function AboutPage({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400 text-gray-900 rounded-2xl mb-4 shadow-sm font-black text-xl">
          SP
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          SPaDe Corp Domestic Intelligence
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          High-performance offline-ready desktop architecture powered by Tauri, React, Leaflet, and Client-Side TSP Optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#1b1e23] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
          <div className="w-10 h-10 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-4 border border-amber-400/20">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold mb-2">Client-Side TSP Engine</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Solves multi-stop Traveling Salesperson Problem itineraries entirely in the browser/desktop runtime without expensive backend routing hops.
          </p>
        </div>

        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#1b1e23] border-gray-800' : 'bg-white border-gray-200'} shadow-sm`}>
          <div className="w-10 h-10 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-4 border border-amber-400/20">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold mb-2">Geospatial Store Discovery</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Integrates OpenStreetMap Overpass API and Nominatim live geocoding to discover real-world supermarkets and grocery hubs.
          </p>
        </div>
      </div>
    </div>
  )
}