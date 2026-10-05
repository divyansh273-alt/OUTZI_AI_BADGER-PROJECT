import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Calendar, 
  Bookmark, 
  MapPin, 
  Check, 
  Copy, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { OutingPlan, PlanStop } from '../types';
import { TimelineView } from '../components/TimelineView';
import { createPlanCalendarUrl } from '../lib/calendar';
import { savePlanToStorage, toggleBookmarkPlace, isPlaceBookmarked } from '../lib/storage';

interface PlanDetailViewProps {
  plan: OutingPlan;
  isPublicShared?: boolean;
  onBack: () => void;
  onUseThisPlan: (plan: OutingPlan) => void;
}

export const PlanDetailView: React.FC<PlanDetailViewProps> = ({
  plan,
  isPublicShared = false,
  onBack,
  onUseThisPlan,
}) => {
  const [copied, setCopied] = useState(false);
  const [savedLocally, setSavedLocally] = useState(false);
  const [_, setRenderTrigger] = useState(0);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleSaveToMyPlans = () => {
    savePlanToStorage(plan);
    setSavedLocally(true);
    setTimeout(() => setSavedLocally(false), 3000);
  };

  const handleToggleBookmark = (stop: PlanStop) => {
    toggleBookmarkPlace({
      name: stop.name,
      city: plan.city,
      area: stop.area,
      category: stop.category,
      address: stop.address,
      googleMapsUrl: stop.googleMapsUrl,
    });
    setRenderTrigger(prev => prev + 1);
  };

  const calUrl = createPlanCalendarUrl(plan);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Plans</span>
        </button>

        {isPublicShared && (
          <div className="inline-flex items-center gap-1.5 text-[11px] text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Shared Outing Plan · Creator identity fully protected</span>
          </div>
        )}
      </div>

      {/* Main Plan Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Header Information */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {plan.city} · {plan.area} · {plan.durationHours} hours
            </span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
              {plan.costPerPerson} / person
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {plan.title}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            {plan.tagline}
          </p>
        </div>

        {/* Action Bar */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onUseThisPlan(plan)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Use this plan</span>
            </button>

            <button
              onClick={handleSaveToMyPlans}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-600" />
              <span>{savedLocally ? 'Saved to My Plans!' : 'Save Plan'}</span>
            </button>

            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              <span>Google Calendar</span>
            </a>
          </div>

          <button
            onClick={handleShare}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Link'}</span>
          </button>
        </div>

        {/* Timeline Itinerary */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-6">
            Chronological Outing Timeline
          </h2>

          <TimelineView
            stops={plan.timeline}
            city={plan.city}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={(name) => isPlaceBookmarked(name, plan.city)}
          />
        </div>

        {/* Why this plan reasoning */}
        {plan.whyThisPlan && (
          <div className="pt-6 border-t border-slate-100 bg-slate-50/80 rounded-xl p-5 space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Why this itinerary was selected
            </h3>
            <ul className="space-y-1.5 text-slate-600 mt-2">
              <li><strong>Budget Fit:</strong> {plan.whyThisPlan.budgetFit}</li>
              <li><strong>Vibe & Ambiance:</strong> {plan.whyThisPlan.vibeFit}</li>
              <li><strong>Transit Logistics:</strong> {plan.whyThisPlan.logisticsFit}</li>
              <li><strong>Group Size Dynamics:</strong> {plan.whyThisPlan.groupFit}</li>
            </ul>
          </div>
        )}

        {/* Pro Tips */}
        {plan.proTips && plan.proTips.length > 0 && (
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 space-y-1.5 text-xs text-teal-950">
            <span className="font-bold text-teal-900">Local Pro-Tips:</span>
            <ul className="list-disc list-inside space-y-1 text-teal-900/80">
              {plan.proTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

    </div>
  );
};
