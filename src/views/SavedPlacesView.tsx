import React from 'react';
import { Bookmark, MapPin, ExternalLink, Trash2, PlusCircle } from 'lucide-react';
import { SavedPlace } from '../types';
import { toggleBookmarkPlace, getBookmarkedPlaces } from '../lib/storage';

interface SavedPlacesViewProps {
  places: SavedPlace[];
  onPlaceRemoved: () => void;
  onStartPlanning: () => void;
}

export const SavedPlacesView: React.FC<SavedPlacesViewProps> = ({
  places,
  onPlaceRemoved,
  onStartPlanning,
}) => {
  const handleRemove = (place: SavedPlace) => {
    toggleBookmarkPlace({
      name: place.name,
      city: place.city,
      area: place.area,
      category: place.category,
      address: place.address,
      googleMapsUrl: place.googleMapsUrl,
    });
    onPlaceRemoved();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Places & Spots
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bookmarked cafes, gaming arcades, cultural centers, and viewpoints with direct Google Maps access.
          </p>
        </div>

        <button
          onClick={onStartPlanning}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-teal-400" />
          <span>Plan an Outing</span>
        </button>
      </div>

      {/* Places Grid or Empty State */}
      {places.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map(place => (
            <div
              key={place.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="font-semibold text-teal-700">{place.category}</span>
                  <span>{place.city}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {place.name}
                </h3>

                <p className="text-xs text-slate-500 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{place.address || `${place.area}, ${place.city}`}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleRemove(place)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="Remove from saved places"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <a
                  href={place.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-16 rounded-2xl border border-slate-200 bg-white text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            Bookmark places you want to remember
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When reviewing any generated plan or stop, tap the bookmark icon to save that specific spot here.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartPlanning}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
            >
              Explore and Plan
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
