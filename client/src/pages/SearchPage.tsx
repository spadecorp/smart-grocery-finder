import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, MapPin, Plus, Trash2, ArrowRight, Search, Check, Loader2 } from 'lucide-react'

const POPULAR_ITEMS = [
  { name: 'Bananas', emoji: '🍌', category: 'Produce' },
  { name: 'Apples', emoji: '🍎', category: 'Produce' },
  { name: 'Whole Milk', emoji: '🥛', category: 'Dairy' },
  { name: 'Eggs', emoji: '🥚', category: 'Dairy' },
  { name: 'Chicken Breast', emoji: '🐔', category: 'Meat' },
  { name: 'Whole Wheat Bread', emoji: '🍞', category: 'Bakery' },
  { name: 'Pasta', emoji: '🍝', category: 'Pantry' }
]

export default function SearchPage({ darkMode }: { darkMode: boolean }) {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([])
  const [isSearchingLoc, setIsSearchingLoc] = useState(false)
  const [showLocSuggestions, setShowLocSuggestions] = useState(false)

  const [items, setItems] = useState<string[]>(['Whole Wheat Bread', 'Organic Milk', 'Bananas'])
  const [inputVal, setInputVal] = useState('')
  const [suggestions, setSuggestions] = useState<typeof POPULAR_ITEMS>([])

  // Real-time location autocomplete via OpenStreetMap Nominatim API
  useEffect(() => {
    const query = location.trim()
    if (query.length < 2) {
      setLocationSuggestions([])
      setShowLocSuggestions(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearchingLoc(true)
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6`, {
          headers: { 'User-Agent': 'SmartGroceryFinder/1.0' }
        })
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setLocationSuggestions(data)
            setShowLocSuggestions(true)
          } else {
            setLocationSuggestions([])
            setShowLocSuggestions(false)
          }
        }
      } catch (err) {
        console.error('Location search failed:', err)
      } finally {
        setIsSearchingLoc(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [location])

  const handleItemInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputVal(val)
    if (val.trim().length > 0) {
      setSuggestions(POPULAR_ITEMS.filter(item => item.name.toLowerCase().includes(val.toLowerCase())))
    } else {
      setSuggestions([])
    }
  }

  const handleStartSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location.trim() || items.length === 0) return
    const params = new URLSearchParams({
      location: location.trim(),
      item: items.join(', ')
    })
    navigate(`/results?${params.toString()}`)
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          Smart Grocery Finder
        </h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Type any address, city, or zipcode to instantly query live geospatial routing networks.
        </p>
      </div>

      <form onSubmit={handleStartSearch} className={`${darkMode ? 'bg-[#1b1e23] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} rounded-2xl shadow-xl p-8 border space-y-6 transition-colors`}>
        {/* Real-Time Location Input with Auto-Suggestions Popup */}
        <div className="relative">
          <label className="block text-sm font-semibold mb-2 flex items-center justify-between">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-amber-500" /> Starting Hub Address, City, or Zip Code
            </span>
            {isSearchingLoc && <Loader2 className="h-4 w-4 animate-spin text-amber-400" />}
          </label>
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value)
                setShowLocSuggestions(true)
              }}
              onFocus={() => {
                if (locationSuggestions.length > 0) setShowLocSuggestions(true)
              }}
              onBlur={() => setTimeout(() => setShowLocSuggestions(false), 250)}
              placeholder="Type any address"
              required
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm font-mono ${darkMode ? 'bg-[#252830] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
            />

            {showLocSuggestions && locationSuggestions.length > 0 && (
              <div className={`absolute z-50 left-0 right-0 mt-1 border rounded-xl shadow-2xl max-h-60 overflow-y-auto ${darkMode ? 'bg-[#252830] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                {locationSuggestions.map((loc: any, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setLocation(loc.display_name)
                      setShowLocSuggestions(false)
                    }}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm border-b last:border-b-0 transition-colors ${darkMode ? 'hover:bg-[#2e323b] border-gray-700' : 'hover:bg-gray-50 border-gray-100'}`}
                  >
                    <span className="font-medium truncate pr-2">{loc.display_name}</span>
                    <Check className="h-4 w-4 text-amber-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Grocery List Builder */}
        <div className="relative">
          <label className="block text-sm font-semibold mb-2 flex items-center justify-between">
            <span className="flex items-center">
              <ShoppingCart className="h-4 w-4 mr-1 text-amber-500" /> Weekly Grocery List
            </span>
            <span className="text-xs bg-amber-400/20 text-amber-400 px-2.5 py-0.5 rounded-full font-mono font-bold">
              {items.length} ITEMS
            </span>
          </label>

          <div className="flex gap-2 mb-3 relative">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={inputVal}
                onChange={handleItemInputChange}
                placeholder="Search catalog (e.g., Bananas, Eggs)..."
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm ${darkMode ? 'bg-[#252830] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              />

              {suggestions.length > 0 && (
                <div className={`absolute z-40 left-0 right-0 mt-1 border rounded-xl shadow-xl max-h-60 overflow-y-auto ${darkMode ? 'bg-[#252830] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (!items.includes(sug.name)) setItems([...items, sug.name])
                        setInputVal('')
                        setSuggestions([])
                      }}
                      className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm border-b last:border-b-0 ${darkMode ? 'hover:bg-[#2e323b] border-gray-700' : 'hover:bg-gray-50 border-gray-100'}`}
                    >
                      <span className="flex items-center space-x-2">
                        <span className="text-lg">{sug.emoji}</span>
                        <span className="font-medium">{sug.name}</span>
                      </span>
                      <span className="text-xs bg-gray-500/20 px-2 py-0.5 rounded">{sug.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (inputVal.trim() && !items.includes(inputVal.trim())) {
                  setItems([...items, inputVal.trim()])
                  setInputVal('')
                }
              }}
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-5 py-2.5 rounded-xl font-bold flex items-center space-x-1 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          <div className={`flex flex-wrap gap-2 p-3 rounded-xl border min-h-[70px] ${darkMode ? 'bg-[#141619] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 italic m-auto">No items in basket.</p>
            ) : (
              items.map((it, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center border px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm ${darkMode ? 'bg-[#252830] border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
                >
                  {it}
                  <button
                    type="button"
                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={items.length === 0 || !location.trim()}
          className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-extrabold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          <span>Initialize Optimal TSP Route Engine</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}