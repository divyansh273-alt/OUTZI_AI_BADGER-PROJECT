import React, { useState } from 'react';
import { Calendar, Trash2, Share2, ExternalLink, ArrowRight, MapPin, IndianRupee, Clock, PlusCircle } from 'lucide-react';
import { OutingPlan } from '../types';
import { deleteSavedPlan, getSavedPlans } from '../lib/storage';
import { createPlanCalendarUrl } from '../lib/calendar';
import { shareOutingPlan } from '../lib/api';

interface SavedPlansViewProps {
  plans: OutingPlan[];
  onSelectPlan: (plan: OutingPlan) => void;
  onPlanDeleted: (id: string) => void;
  onStartPlanning: () => void;
}

export const SavedPlansView: React.FC<SavedPlansViewProps> = ({
  plans,
  onSelectPlan,
  onPlanDeleted,
  onStartPlanning,
}) => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteSavedPlan(id);
    onPlanDeleted(id);
  };

  const handleShare = async (plan: OutingPlan) => {
    try {
      const { shareUrl } = await shareOutingPlan(plan);
      const fullUrl = `${window.location.origin}${shareUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedToken(plan.id);
      setTimeout(() => setCopiedToken(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Outing Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explicitly saved itineraries with chronological schedules and Google Calendar sync.
          </p>
        </div>

        <button
          onClick={onStartPlanning}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-teal-400" />
          <span>Plan New Outing</span>
        </button>
      </div>

      {/* Plans List or Empty State */}
      {plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map(plan => {
            const calUrl = createPlanCalendarUrl(plan);

            return (
              <div
                key={plan.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {plan.city} · {plan.area}
                    </span>
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {plan.costPerPerson} / person
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Stops Timeline preview */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-700 block">
                      Stops ({plan.timeline.length}):
                    </span>
                    <div className="space-y-1 text-xs text-slate-600">
                      {plan.timeline.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="truncate">
                            {s.time} · <strong>{s.name}</strong> ({s.category})
                          </span>
                          <span className="text-slate-400 shrink-0 ml-2">₹{s.approxCostPerPerson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={calUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors flex items-center gap-1"
                      title="Add to Google Calendar"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Calendar</span>
                    </a>

                    <button
                      onClick={() => handleShare(plan)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors flex items-center gap-1"
                      title="Share this plan anonymously"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{copiedToken === plan.id ? 'Copied!' : 'Share'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete saved plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectPlan(plan)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>View Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-16 rounded-2xl border border-slate-200 bg-white text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            Your saved plans will appear here
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven’t saved any plans yet. Generate a realistic outing plan and tap <strong>Save Plan</strong> to access it anytime.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartPlanning}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
            >
              Plan Your First Outing
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
