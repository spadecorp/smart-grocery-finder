import React from 'react';
import { MapPin, Navigation, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import type { OptimizedRoute } from '../types/basket';

interface RouteDisplayProps {
  route: OptimizedRoute;
  onReset: () => void;
}

export const RouteDisplay: React.FC<RouteDisplayProps> = ({ route, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Optimized Shopping Route</h2>
          <p className="text-sm text-gray-500">Multi-stop trip starting & returning to {route.origin.zipcode}</p>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          Edit Basket
        </button>
      </div>

      {/* Trip Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center text-gray-500 text-sm mb-1">
            <MapPin className="h-4 w-4 mr-1 text-primary-600" />
            <span>Total Stops</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{route.stops.length} Stores</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center text-gray-500 text-sm mb-1">
            <Navigation className="h-4 w-4 mr-1 text-emerald-600" />
            <span>Total Distance</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{route.totalDistanceMiles} miles</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 col-span-2 md:col-span-1">
          <div className="flex items-center text-gray-500 text-sm mb-1">
            <Clock className="h-4 w-4 mr-1 text-amber-600" />
            <span>Est. Duration</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{route.estimatedDurationMins} mins</span>
        </div>
      </div>

      {/* Stop-by-Stop Timeline */}
      <div className="space-y-6 relative before:absolute before:top-3 before:bottom-3 before:left-4 before:w-0.5 before:bg-primary-200">
        {route.stops.map((stop, index) => (
          <div key={stop.storeId} className="relative flex items-start space-x-4 pl-2">
            <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs z-10 shadow-md">
              {index + 1}
            </div>
            <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{stop.storeName}</h3>
                  <p className="text-xs text-gray-500">{stop.address}</p>
                </div>
                <span className="text-xs bg-primary-50 text-primary-700 font-medium px-2.5 py-1 rounded-full">
                  Stop #{index + 1}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Items to pick up here:</span>
                <div className="flex flex-wrap gap-2">
                  {stop.itemsToBuy.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};