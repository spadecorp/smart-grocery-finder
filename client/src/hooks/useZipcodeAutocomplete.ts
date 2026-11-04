import { useState, useEffect } from 'react';
import axios from 'axios';

export interface ZipcodeSuggestion {
  zipcode: string;
  city: string;
  state: string;
  area?: string;
}

export function useZipcodeAutocomplete(query: string, debounceMs = 300) {
  const [suggestions, setSuggestions] = useState<ZipcodeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    
    // Only trigger if user is typing numbers (zipcode search)
    if (!trimmed || trimmed.length < 2 || !/^\d+/.test(trimmed)) {
      setSuggestions([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        // If it's a complete 5-digit US zipcode, query the live public registry instantly
        if (trimmed.length === 5) {
          const response = await axios.get(`https://api.zippopotam.us/us/${trimmed}`, { timeout: 4000 });
          const data = response.data;
          
          if (data && data.places && data.places.length > 0) {
            const place = data.places[0];
            setSuggestions([{
              zipcode: data['post code'],
              city: place['place name'],
              state: place['state abbreviation'],
              area: place['state']
            }]);
          } else {
            setSuggestions([]);
          }
        } else {
          // For partial zipcodes, allow direct custom entry fallback
          setSuggestions([{
            zipcode: trimmed,
            city: 'Custom Zipcode',
            state: 'US',
            area: `${trimmed}...`
          }]);
        }
      } catch (err) {
        // If the live API fails or network is offline, ensure the user's typed zipcode is still fully usable
        setSuggestions([{
          zipcode: trimmed,
          city: 'Entered Location',
          state: 'US',
          area: 'Custom Entry'
        }]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const clearSuggestions = () => setSuggestions([]);

  return { suggestions, isLoading, error, clearSuggestions };
}