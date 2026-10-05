import React from 'react';
import { 
  PlusCircle, 
  Compass, 
  Calendar, 
  Bookmark, 
  MapPin, 
  ArrowRight, 
  Users, 
  Heart, 
  Ticket, 
  Sparkles,
  ExternalLink,
  Clock,
  IndianRupee
} from 'lucide-react';
import { UserProfile, OutingPlan, SavedPlace } from '../types';
import { createPlanCalendarUrl } from '../lib/calendar';

interface DashboardViewProps {
  user: UserProfile | null;
  currentCity: string;
  savedPlans: OutingPlan[];
  bookmarkedPlaces: SavedPlace[];
  onNavigate: (view: string) => void;
  onStartPlanning: (intent?: string) => void;
  onOpenCitySelector: () => void;
  onSelectPlan: (plan: OutingPlan) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  currentCity,
  savedPlans,
  bookmarkedPlaces,
  onNavigate,
  onStartPlanning,
  onOpenCitySelector,
  onSelectPlan,
}) => {
  const isMinor = user?.ageGroup === '16-17';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome & City Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Welcome back, {user ? user.name.split(' ')[0] : 'Explorer'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-teal-700 font-semibold">{currentCity} Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ready for your next real-world outing?
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Choose an intent below or jump into custom planning with your personalized preferences.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onStartPlanning()}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-teal-400" />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {/* Quick Planning Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Quick Planning Categories
          </h2>
          <span className="text-xs text-slate-400">Grounded in {currentCity}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          
          <button
            onClick={() => onStartPlanning('friends')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-2.5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Friends Outing</h3>
            <p className="text-xs text-slate-500 mt-0.5">Crew hangouts & casual bites</p>
          </button>

          <button
            onClick={() => onStartPlanning('solo')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-2.5 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Solo Quest</h3>
            <p className="text-xs text-slate-500 mt-0.5">Cafes, museums & bookshops</p>
          </button>

          <button
            onClick={() => onNavigate('events')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2.5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Ticket className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Live Events</h3>
            <p className="text-xs text-slate-500 mt-0.5">Verified shows & workshops</p>
          </button>

          <button
            onClick={() => onStartPlanning('explore')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Explore City</h3>
            <p className="text-xs text-slate-500 mt-0.5">New neighborhoods & walks</p>
          </button>

          {/* Date Option (Only shown for 18+) */}
          {!isMinor && (
            <button
              onClick={() => onStartPlanning('date')}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-rose-400 hover:shadow-xs transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-2.5 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Heart className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Date Plan</h3>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1 rounded">18+</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Cozy ambiance & sunset dinner</p>
            </button>
          )}

        </div>
      </div>

      {/* Grid: Saved Plans (Left) & Bookmarked Places (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Saved Plans Section (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              Saved Plans & Itineraries
            </h2>
            <button
              onClick={() => onNavigate('saved-plans')}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
            >
              View all ({savedPlans.length})
            </button>
          </div>

          {savedPlans.length > 0 ? (
            <div className="space-y-3">
              {savedPlans.slice(0, 3).map(plan => {
                const calUrl = createPlanCalendarUrl(plan);
                return (
                  <div
                    key={plan.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-slate-500 font-medium">
                          {plan.city} · {plan.area} · {plan.durationHours} hours
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">
                          {plan.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                          {plan.tagline}
                        </p>
                      </div>

                      <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0">
                        {plan.costPerPerson}
                      </span>
                    </div>

                    {/* Timeline stops preview (rendered with zero-pill discipline) */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Stops:</span>
                      {plan.timeline.map((s, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-slate-600">
                          {idx > 0 && <span className="text-slate-300">→</span>}
                          <span>{s.name}</span>
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-between">
                      <a
                        href={calUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Google Calendar</span>
                      </a>

                      <button
                        onClick={() => onSelectPlan(plan)}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                      >
                        <span>Open Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Clean Empty State */
            <div className="p-8 rounded-2xl border border-slate-200 bg-white text-center space-y-2">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Your saved plans will appear here</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Generate an outing plan and tap "Save Plan" to keep it handy with full transit directions.
              </p>
              <button
                onClick={() => onStartPlanning()}
                className="mt-2 text-xs font-semibold text-teal-700 hover:text-teal-900"
              >
                Plan your first outing →
              </button>
            </div>
          )}
        </div>

        {/* Bookmarked Places Section (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-teal-600" />
              Bookmarked Places
            </h2>
            <button
              onClick={() => onNavigate('saved-places')}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
            >
              View all ({bookmarkedPlaces.length})
            </button>
          </div>

          {bookmarkedPlaces.length > 0 ? (
            <div className="space-y-2.5">
              {bookmarkedPlaces.slice(0, 4).map(place => (
                <div
                  key={place.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{place.name}</h4>
                    <p className="text-[11px] text-slate-500">{place.area}, {place.city}</p>
                    <span className="text-[10px] text-teal-700 font-medium block mt-0.5">
                      {place.category}
                    </span>
                  </div>

                  <a
                    href={place.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Open in Google Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            /* Clean Empty State */
            <div className="p-8 rounded-2xl border border-slate-200 bg-white text-center space-y-2">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Bookmark places you want to remember</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                While exploring plans, tap the bookmark icon on any café, park, or venue to save it.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
