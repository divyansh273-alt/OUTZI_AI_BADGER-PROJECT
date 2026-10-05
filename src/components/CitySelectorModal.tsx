import React, { useState, useMemo } from 'react';
import { Search, MapPin, X, Check, BellRing, Sparkles } from 'lucide-react';
import { SupportedCity } from '../types';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  supportedCities: SupportedCity[];
  currentCity: string;
  onSelectCity: (cityName: string) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  supportedCities,
  currentCity,
  onSelectCity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifiedCities, setNotifiedCities] = useState<string[]>([]);
  const [justSubscribed, setJustSubscribed] = useState<string | null>(null);

  const filteredCities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return supportedCities;
    return supportedCities.filter(
      c => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    );
  }, [supportedCities, searchQuery]);

  const isExactCitySupported = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return supportedCities.some(c => c.name.toLowerCase() === q && c.active);
  }, [supportedCities, searchQuery]);

  if (!isOpen) return null;

  const handleNotifyMe = (city: string) => {
    setNotifiedCities(prev => [...prev, city]);
    setJustSubscribed(city);
    setTimeout(() => setJustSubscribed(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="city-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 id="city-modal-title" className="text-base font-bold text-slate-900">
              Select Indian City
            </h2>
            <p className="text-xs text-slate-500">
              We only serve cities with verified local venues and real transit data.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Indian city (e.g. Bengaluru, Mumbai, Jaipur)..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-900 placeholder:text-slate-400"
              autoFocus
            />
          </div>
        </div>

        {/* Popular Cities Chips */}
        {!searchQuery && (
          <div className="px-6 pt-3 pb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Popular Outing Hubs
            </span>
            <div className="flex flex-wrap gap-1.5">
              {supportedCities
                .filter(c => c.isPopular)
                .map(city => (
                  <button
                    key={city.id}
                    onClick={() => {
                      onSelectCity(city.name);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      currentCity === city.name
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    {city.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* City List or Unsupported State */}
        <div className="max-h-72 overflow-y-auto px-4 py-3 divide-y divide-slate-100">
          {filteredCities.length > 0 ? (
            filteredCities.map(city => {
              const isSelected = currentCity === city.name;
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city.name);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between group ${
                    isSelected ? 'bg-teal-50 text-teal-900' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {city.name}
                      {city.isPopular && (
                        <span className="text-[10px] font-medium text-teal-700 bg-teal-100 px-1.5 py-0.2 rounded">
                          Active Hub
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {city.state} · Areas: {city.popularAreas.slice(0, 3).join(', ')}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            /* Explicit Coming Soon State as required */
            <div className="py-8 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Coming soon to {searchQuery || 'this city'}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  We refuse to hallucinate fake spots or guess transport speeds. We are currently scouting and indexing real venues for {searchQuery}.
                </p>
              </div>

              <div className="pt-2">
                {notifiedCities.includes(searchQuery) ? (
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    We will notify you when {searchQuery} launches!
                  </div>
                ) : (
                  <button
                    onClick={() => handleNotifyMe(searchQuery)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <BellRing className="w-3.5 h-3.5 text-amber-400" />
                    Notify me when {searchQuery} goes live
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Supported across major Indian metro areas</span>
          <span className="text-teal-700 font-medium">100% Real Physical Venues</span>
        </div>
      </div>
    </div>
  );
};
