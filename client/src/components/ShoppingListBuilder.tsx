import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart, Sparkles, Search } from 'lucide-react';
import type { ShoppingItem, PreferenceMode } from '../types/basket';

const POPULAR_ITEMS = [
  { name: 'Bananas', emoji: '🍌', category: 'Produce' },
  { name: 'Apples', emoji: '🍎', category: 'Produce' },
  { name: 'Avocado', emoji: '🥑', category: 'Produce' },
  { name: 'Tomatoes', emoji: '🍅', category: 'Produce' },
  { name: 'Spinach', emoji: '🥬', category: 'Produce' },
  { name: 'Whole Milk', emoji: '🥛', category: 'Dairy' },
  { name: 'Eggs', emoji: '🥚', category: 'Dairy' },
  { name: 'Chicken Breast', emoji: '🐔', category: 'Meat' },
  { name: 'Ground Beef', emoji: '🥩', category: 'Meat' },
  { name: 'Whole Wheat Bread', emoji: '🍞', category: 'Bakery' },
  { name: 'Pasta', emoji: '🍝', category: 'Pantry' },
  { name: 'Olive Oil', emoji: '🫒', category: 'Pantry' }
];

interface ShoppingListBuilderProps {
  initialItems: string[];
  onCalculateRoute: (items: ShoppingItem[]) => void;
  isLoading: boolean;
}

export const ShoppingListBuilder: React.FC<ShoppingListBuilderProps> = ({ initialItems, onCalculateRoute, isLoading }) => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    return initialItems.map((name, idx) => {
      const matchedCat = POPULAR_ITEMS.find(p => p.name.toLowerCase() === name.trim().toLowerCase())?.category || 'General';
      return {
        id: `${Date.now()}-${idx}`,
        name: name.trim(),
        category: matchedCat,
        preference: 'cheapest'
      };
    });
  });

  useEffect(() => {
    setItems(
      initialItems.map((name, idx) => {
        const matchedCat = POPULAR_ITEMS.find(p => p.name.toLowerCase() === name.trim().toLowerCase())?.category || 'General';
        return {
          id: `${Date.now()}-${idx}`,
          name: name.trim(),
          category: matchedCat,
          preference: 'cheapest'
        };
      })
    );
  }, [initialItems]);

  const [newItemName, setNewItemName] = useState('');
  const [suggestions, setSuggestions] = useState<typeof POPULAR_ITEMS>([]);
  const [defaultPreference, setDefaultPreference] = useState<PreferenceMode>('cheapest');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewItemName(val);
    if (val.trim().length > 0) {
      setSuggestions(POPULAR_ITEMS.filter(item => item.name.toLowerCase().includes(val.toLowerCase())));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (sug: { name: string; category: string }) => {
    if (!items.some(i => i.name.toLowerCase() === sug.name.toLowerCase())) {
      setItems([...items, { id: Date.now().toString(), name: sug.name, category: sug.category, preference: defaultPreference }]);
    }
    setNewItemName('');
    setSuggestions([]);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const trimmed = newItemName.trim();
    const matched = POPULAR_ITEMS.find(p => p.name.toLowerCase() === trimmed.toLowerCase());
    const category = matched ? matched.category : 'General';

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: trimmed,
      category,
      preference: defaultPreference
    };

    setItems([...items, newItem]);
    setNewItemName('');
    setSuggestions([]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItemPreference = (id: string, preference: PreferenceMode) => {
    setItems(items.map(i => i.id === id ? { ...i, preference } : i));
  };

  return (
    <div className="bg-white dark:bg-[#1b1e23] rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-800 transition-colors">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-400/20">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Active Shopping Basket</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Configure store preferences per item</p>
          </div>
        </div>
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg text-xs font-bold font-mono">
          {items.length} ITEMS LOADED
        </span>
      </div>

      <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 p-4 bg-gray-50 dark:bg-[#141619] rounded-xl border border-gray-200 dark:border-gray-800 relative">
        <div className="md:col-span-2 relative">
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Type item for recommendations..."
              value={newItemName}
              onChange={handleInputChange}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#252830] border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm text-gray-900 dark:text-white"
            />
          </div>

          {suggestions.length > 0 && (
            <div className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-[#252830] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-52 overflow-y-auto">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(sug)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2e323b] flex items-center justify-between text-sm border-b dark:border-gray-700 last:border-b-0 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-base">{sug.emoji}</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{sug.name}</span>
                  </span>
                  <span className="text-[11px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                    {sug.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <select
            value={defaultPreference}
            onChange={(e) => setDefaultPreference(e.target.value as PreferenceMode)}
            className="w-full px-3 py-2.5 bg-white dark:bg-[#252830] border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm font-medium text-gray-900 dark:text-white"
          >
            <option value="cheapest">💰 Cheapest</option>
            <option value="healthiest">❤️ Healthiest</option>
            <option value="closest">📍 Closest</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-1.5 transition-colors text-sm shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </form>

      <div className="space-y-3 mb-8">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm font-medium">Your basket is empty. Add items above.</div>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3.5 bg-white dark:bg-[#252830] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm transition-all">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</h4>
                  <span className="text-[11px] text-gray-400 font-mono uppercase tracking-wider">{item.category}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={item.preference}
                  onChange={(e) => updateItemPreference(item.id, e.target.value as PreferenceMode)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                    item.preference === 'cheapest' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/20' :
                    item.preference === 'healthiest' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/20' :
                    'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-400/10 dark:text-blue-300 dark:border-blue-400/20'
                  }`}
                >
                  <option value="cheapest">💰 Cheapest</option>
                  <option value="healthiest">❤️ Healthiest</option>
                  <option value="closest">📍 Closest</option>
                </select>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => onCalculateRoute(items)}
        disabled={isLoading || items.length === 0}
        className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-extrabold py-3.5 px-6 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 text-sm tracking-wide"
      >
        <Sparkles className="h-4 w-4" />
        <span>{isLoading ? 'Computing Optimized Route...' : 'Construct Multi-Stop Route'}</span>
      </button>
    </div>
  );
};