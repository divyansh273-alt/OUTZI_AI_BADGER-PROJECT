import React from 'react';
import { 
  MapPin, 
  ExternalLink, 
  Calendar, 
  Bookmark, 
  Footprints, 
  Car, 
  Train, 
  CheckCircle, 
  Clock, 
  IndianRupee,
  Share2
} from 'lucide-react';
import { PlanStop } from '../types';
import { createStopCalendarUrl } from '../lib/calendar';

interface TimelineViewProps {
  stops: PlanStop[];
  city: string;
  onToggleBookmark: (stop: PlanStop) => void;
  isBookmarked: (name: string) => boolean;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  stops,
  city,
  onToggleBookmark,
  isBookmarked,
}) => {
  return (
    <div className="space-y-6">
      <div className="relative pl-6 sm:pl-8 before:absolute before:left-2.5 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {stops.map((stop, index) => {
          const bookmarked = isBookmarked(stop.name);
          const stopCalUrl = createStopCalendarUrl(stop, city);

          return (
            <div key={stop.id || index} className="relative mb-8 last:mb-0 group">
              {/* Timeline dot */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full border-2 border-white bg-slate-900 shadow-sm flex items-center justify-center text-white text-[9px] font-bold">
                {index + 1}
              </div>

              {/* Stop Container */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                {/* Header row: Time & Unboxed Category Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {stop.time}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-teal-700 font-semibold">{stop.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{stop.area}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                    <span>₹{stop.approxCostPerPerson}</span>
                    <span className="text-[11px] text-slate-400 font-normal">/ person</span>
                  </div>
                </div>

                {/* Venue Name & Verified Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {stop.name}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{stop.address}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleBookmark(stop)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        bookmarked 
                          ? 'bg-amber-50 border-amber-300 text-amber-700' 
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                      title={bookmarked ? 'Remove Bookmark' : 'Bookmark this place'}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-600' : ''}`} />
                    </button>

                    <a
                      href={stopCalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      title="Add this stop to Google Calendar"
                    >
                      <Calendar className="w-4 h-4" />
                    </a>

                    <a
                      href={stop.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-xs"
                      title="View real directions on Google Maps"
                    >
                      <span className="hidden sm:inline">Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                  {stop.description}
                </p>

                {/* Highlights (rendered with zero-pill discipline) */}
                {stop.highlights && stop.highlights.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Highlights:</span>
                    {stop.highlights.map((h, i) => (
                      <span key={i} className="flex items-center gap-1 text-slate-600">
                        <span className="w-1 h-1 rounded-full bg-teal-500" />
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Trust & Verification badge */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Verified Physical Venue in {city}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Live Google Maps Grounding
                  </span>
                </div>
              </div>

              {/* Transit connector to next stop */}
              {stop.transitToNext && index < stops.length - 1 && (
                <div className="my-3 ml-2 flex items-center gap-2 text-xs font-medium text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                    {stop.transitToNext.mode === 'walk' ? (
                      <Footprints className="w-3 h-3" />
                    ) : stop.transitToNext.mode === 'metro' ? (
                      <Train className="w-3 h-3" />
                    ) : (
                      <Car className="w-3 h-3" />
                    )}
                  </div>
                  <span>
                    {stop.transitToNext.durationMin} min {stop.transitToNext.mode} ({stop.transitToNext.distanceKm} km)
                  </span>
                  {stop.transitToNext.note && (
                    <span className="text-slate-400 text-[11px]">
                      · {stop.transitToNext.note}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
