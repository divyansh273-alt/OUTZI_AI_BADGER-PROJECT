import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  Search, 
  Filter, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { EventItem } from '../types';
import { fetchEvents } from '../lib/api';

interface EventsExploreViewProps {
  currentCity: string;
  onUseEventInPlan: (event: EventItem) => void;
  onOpenCitySelector: () => void;
}

export const EventsExploreView: React.FC<EventsExploreViewProps> = ({
  currentCity,
  onUseEventInPlan,
  onOpenCitySelector,
}) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Concert',
    'Workshop',
    'Stand-up',
    'Exhibition',
    'Heritage Walk',
    'Sports',
    'Festival',
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchEvents(currentCity, selectedCategory)
      .then(res => {
        if (isMounted) setEvents(res);
      })
      .catch(err => {
        console.error('Failed to fetch events:', err);
        if (isMounted) setEvents([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentCity, selectedCategory]);

  const filteredEvents = events.filter(e => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.area.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Events & Curated Experiences
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Verified Gigs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover confirmed shows, exhibitions, and walks in <strong>{currentCity}</strong>. Use any event as the anchor for a complete outing.
          </p>
        </div>

        <button
          onClick={onOpenCitySelector}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-xs self-start sm:self-auto"
        >
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
          <span>City: {currentCity}</span>
          <span className="text-[11px] text-teal-700 underline ml-1">Change</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search events in ${currentCity}...`}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-56 bg-slate-100 rounded-2xl border border-slate-200" />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(evt => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                {/* Header row: Category & Price */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="font-semibold text-teal-700">{evt.category}</span>
                  <span className="font-bold text-slate-900">{evt.priceText}</span>
                </div>

                {/* Title & Venue */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{evt.venue}</span>
                  </p>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-4 text-xs text-slate-600 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {evt.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {evt.time}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {evt.description}
                </p>

                {/* Tags */}
                {evt.tags && evt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-[11px] text-slate-500 pt-1">
                    {evt.tags.map((tag, i) => (
                      <span key={i} className="text-slate-500">
                        #{tag}{i < evt.tags.length - 1 ? ' ·' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Verified Schedule</span>
                </div>

                <button
                  onClick={() => onUseEventInPlan(evt)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Use in my plan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State as specified */
        <div className="p-12 rounded-2xl border border-slate-200 bg-white text-center space-y-3">
          <Ticket className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            No verified events found for this location/date
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We only index confirmed, physically staged public events. Try picking another category or changing your active city.
          </p>
        </div>
      )}

    </div>
  );
};
