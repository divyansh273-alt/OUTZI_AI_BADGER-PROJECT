import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  IndianRupee, 
  Sliders, 
  RefreshCw, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Send, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Heart,
  ChevronRight,
  TrendingDown,
  Minimize2,
  Compass,
  Footprints,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { 
  OutingPlan, 
  PlanStop, 
  UserProfile, 
  SupportedCity, 
  ConfigurableQuestion,
  PlanIntent 
} from '../types';
import { generateOutingPlan, adjustOutingPlan, shareOutingPlan } from '../lib/api';
import { savePlanToStorage, toggleBookmarkPlace, isPlaceBookmarked } from '../lib/storage';
import { createPlanCalendarUrl } from '../lib/calendar';
import { TimelineView } from '../components/TimelineView';

interface PlannerViewProps {
  currentCity: string;
  user: UserProfile | null;
  onOpenCitySelector: () => void;
  questions: ConfigurableQuestion[];
  prefilledIntent?: string;
  prefilledEvent?: any;
  onPlanCreated?: (plan: OutingPlan) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  currentCity,
  user,
  onOpenCitySelector,
  questions,
  prefilledIntent,
  prefilledEvent,
  onPlanCreated,
}) => {
  // Form Constraint State
  const [intent, setIntent] = useState<PlanIntent>((prefilledIntent as PlanIntent) || 'friends');
  const [area, setArea] = useState('');
  const [date, setDate] = useState('Today');
  const [startTime, setStartTime] = useState('4:00 PM');
  const [duration, setDuration] = useState('3.5 hours');
  const [groupSize, setGroupSize] = useState('3-5');
  const [budget, setBudget] = useState('₹400 - ₹900');
  const [vibe, setVibe] = useState('chill_talk');
  const [specialNotes, setSpecialNotes] = useState('');
  const [naturalQuery, setNaturalQuery] = useState('');

  // AI & Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<OutingPlan | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modification & Sharing States
  const [modificationText, setModificationText] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [activePlanTab, setActivePlanTab] = useState<'main' | 'alt1' | 'alt2'>('main');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);
  const [_, setRenderTrigger] = useState(0);

  const isMinor = user?.ageGroup === '16-17';

  // Enforce server & client safety: If user is under 18 and intent was set to 'date', reset to 'friends'
  useEffect(() => {
    if (isMinor && intent === 'date') {
      setIntent('friends');
    }
  }, [isMinor, intent]);

  // If prefilled event was provided, adjust notes
  useEffect(() => {
    if (prefilledEvent) {
      setIntent('event');
      setSpecialNotes(`Anchor event: ${prefilledEvent.title} at ${prefilledEvent.venue} (${prefilledEvent.time})`);
    }
  }, [prefilledEvent]);

  // Trigger Plan Generation
  const handleGeneratePlan = async () => {
    setErrorMessage(null);
    setIsGenerating(true);
    setShareUrl(null);
    setPlanSaved(false);

    // Realistic research status progression
    setGenerationStep(`Scouting verified venues in ${currentCity}...`);
    const timer1 = setTimeout(() => {
      setGenerationStep(`Balancing ${budget} budget & calculating walking transit...`);
    }, 1100);
    const timer2 = setTimeout(() => {
      setGenerationStep('Formatting itinerary and alternatives with Gemini 3.8...');
    }, 2200);

    try {
      const response = await generateOutingPlan({
        intent,
        city: currentCity,
        area: area || undefined,
        date,
        startTime,
        duration,
        groupSize,
        budget,
        vibe,
        specialNotes: [specialNotes, naturalQuery].filter(Boolean).join(' · '),
        userAgeGroup: user?.ageGroup || '18-35',
        userPersonality: user?.personalityPreferences || ['Chill', 'Foodie'],
        anchorEvent: prefilledEvent,
      });

      setGeneratedPlan(response.plan);
      setActivePlanTab('main');
      if (onPlanCreated) {
        onPlanCreated(response.plan);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to generate plan. Please try again.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Handle Natural Language or Quick Action Modification
  const handleAdjustPlan = async (quickAction?: string) => {
    if (!generatedPlan) return;
    setIsAdjusting(true);
    setErrorMessage(null);

    try {
      const res = await adjustOutingPlan(generatedPlan, {
        modificationText: modificationText || undefined,
        quickAction,
      });

      setGeneratedPlan(res.plan);
      setModificationText('');
      setPlanSaved(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to modify plan.');
    } finally {
      setIsAdjusting(false);
    }
  };

  // Handle Save Plan
  const handleSavePlan = () => {
    if (!generatedPlan) return;
    savePlanToStorage(generatedPlan);
    setPlanSaved(true);
    setTimeout(() => setPlanSaved(false), 3000);
  };

  // Handle Share Plan
  const handleSharePlan = async () => {
    if (!generatedPlan) return;
    try {
      const { shareUrl: url } = await shareOutingPlan(generatedPlan);
      const fullUrl = `${window.location.origin}${url}`;
      setShareUrl(fullUrl);
      await navigator.clipboard.writeText(fullUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch (err) {
      console.error('Sharing failed:', err);
    }
  };

  // Handle bookmarking single place
  const handleToggleBookmark = (stop: PlanStop) => {
    toggleBookmarkPlace({
      name: stop.name,
      city: generatedPlan?.city || currentCity,
      area: stop.area,
      category: stop.category,
      address: stop.address,
      googleMapsUrl: stop.googleMapsUrl,
    });
    setRenderTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Indian Metro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Outing Planner
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              India Grounded
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Specify your constraints. Gemini researches real physical spots and crafts a verified timeline.
          </p>
        </div>

        {/* Current City Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Target Metro:</span>
          <button
            onClick={onOpenCitySelector}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>{currentCity}</span>
            <span className="text-[11px] text-teal-700 underline ml-1">Change</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Constraints / Right Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Constraints & Natural Hybrid Prompt (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              Configure Constraints
            </h2>
            <p className="text-xs text-slate-500">
              Select key parameters or describe your mood in natural language.
            </p>
          </div>

          {/* Natural Language Prompt Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Natural Language Request (Optional)
            </label>
            <textarea
              value={naturalQuery}
              onChange={e => setNaturalQuery(e.target.value)}
              placeholder="e.g. Indiranagar Saturday afternoon with 3 college friends, budget under ₹800 each, love artisan coffee & board games..."
              rows={2}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all resize-none"
            />
          </div>

          {/* Quick Intent Selectable Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Outing Intent
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIntent('friends')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2 ${
                  intent === 'friends' 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>Friends / Group</span>
              </button>

              <button
                type="button"
                onClick={() => setIntent('solo')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2 ${
                  intent === 'solo' 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Solo Experience</span>
              </button>

              <button
                type="button"
                onClick={() => setIntent('explore')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2 ${
                  intent === 'explore' 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Footprints className="w-3.5 h-3.5 shrink-0" />
                <span>Explore City</span>
              </button>

              {/* Date Option (Strictly restricted for under 18) */}
              {!isMinor ? (
                <button
                  type="button"
                  onClick={() => setIntent('date')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    intent === 'date' 
                      ? 'bg-rose-900 border-rose-900 text-white shadow-xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                    <span>Date</span>
                  </span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1 rounded">18+</span>
                </button>
              ) : (
                <div className="p-2.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Date mode restricted (18+)</span>
                </div>
              )}
            </div>
          </div>

          {/* Target Neighborhood / Area in City */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Neighborhood or Area in {currentCity} (Optional)
            </label>
            <input
              type="text"
              value={area}
              onChange={e => setArea(e.target.value)}
              placeholder="e.g. Indiranagar, Bandra, Connaught Place, Koramangala..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Time, Duration & Group Size Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time
              </label>
              <select
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="11:00 AM">Morning (11:00 AM)</option>
                <option value="2:00 PM">Afternoon (2:00 PM)</option>
                <option value="3:30 PM">Afternoon (3:30 PM)</option>
                <option value="5:00 PM">Evening (5:00 PM)</option>
                <option value="6:30 PM">Sunset / Twilight (6:30 PM)</option>
                <option value="8:00 PM">Night (8:00 PM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Duration
              </label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="2 hours">Quick (1.5 – 2 hrs)</option>
                <option value="3.5 hours">Standard (3 – 4 hrs)</option>
                <option value="5.5 hours">Half Day (5 – 6 hrs)</option>
                <option value="8 hours">Full Day (7+ hrs)</option>
              </select>
            </div>
          </div>

          {/* Group Size & Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Group Size
              </label>
              <select
                value={groupSize}
                onChange={e => setGroupSize(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="Just me">Just me (1)</option>
                <option value="2">Pair (2)</option>
                <option value="3-5">Small Crew (3–5)</option>
                <option value="6-10">Large Squad (6–10)</option>
                <option value="10+">Big Group (10+)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Budget / Person (INR)
              </label>
              <select
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="Under ₹400">Budget (Under ₹400)</option>
                <option value="₹400 - ₹900">Moderate (₹400–₹900)</option>
                <option value="₹900 - ₹1800">Comfort (₹900–₹1,800)</option>
                <option value="₹1800+">Splurge (₹1,800+)</option>
              </select>
            </div>
          </div>

          {/* Vibe Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Desired Energy & Vibe
            </label>
            <select
              value={vibe}
              onChange={e => setVibe(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
            >
              <option value="chill_talk">Chill & Talk (Comfortable acoustics, great coffee)</option>
              <option value="foodie">Foodie Feast (Signature bites, local legends)</option>
              <option value="entertainment">Entertainment & Games (Arcade, bowling, comedy)</option>
              <option value="peaceful">Peaceful & Scenic (Gardens, sunset views, low noise)</option>
              <option value="adventure">Active Adventure (Outdoor, bouldering, karting)</option>
              <option value="explore_photos">Aesthetic & Photos (Architecture, indie stores)</option>
              <option value="something_different">Something Different (Unique workshops, vinyl record lounges)</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Researching Real Venues...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Generate Realistic Outing Plan</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>

        {/* Right Column: Output / Timeline / Alternatives (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Loading Skeleton during AI Research */}
          {isGenerating && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm animate-pulse">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {generationStep || `Researching ${currentCity}...`}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Cross-referencing verified spots, current price bands, and realistic foot/transit connections.
                </p>
              </div>
            </div>
          )}

          {/* Empty State before first generation */}
          {!isGenerating && !generatedPlan && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6 text-slate-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Your personalized plan will appear here
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Choose your intent, budget, and vibe on the left, then tap <strong>Generate Realistic Outing Plan</strong>. We’ll build a cohesive, chronological experience.
                </p>
              </div>
            </div>
          )}

          {/* Generated Plan Display */}
          {!isGenerating && generatedPlan && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Plan Card Header */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                
                {/* Tabs: Main Recommendation vs Alternatives */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-md">
                  <button
                    onClick={() => setActivePlanTab('main')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                      activePlanTab === 'main'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Main Plan (Optimal)
                  </button>

                  {generatedPlan.alternatives && generatedPlan.alternatives.length > 0 && (
                    <button
                      onClick={() => setActivePlanTab('alt1')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        activePlanTab === 'alt1'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Alternative 1
                    </button>
                  )}

                  {generatedPlan.alternatives && generatedPlan.alternatives.length > 1 && (
                    <button
                      onClick={() => setActivePlanTab('alt2')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        activePlanTab === 'alt2'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Alternative 2
                    </button>
                  )}
                </div>

                {/* Main Plan View */}
                {activePlanTab === 'main' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                          Primary Recommendation · {generatedPlan.area}, {generatedPlan.city}
                        </span>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <span>{generatedPlan.costPerPerson}</span>
                          <span className="text-slate-400 font-normal">/ person</span>
                          <span aria-hidden="true">·</span>
                          <span>{generatedPlan.durationHours} hrs</span>
                        </div>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                        {generatedPlan.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {generatedPlan.tagline}
                      </p>
                    </div>

                    {/* Timeline Component */}
                    <div className="pt-2">
                      <TimelineView
                        stops={generatedPlan.timeline}
                        city={generatedPlan.city}
                        onToggleBookmark={handleToggleBookmark}
                        isBookmarked={(name) => isPlaceBookmarked(name, generatedPlan.city)}
                      />
                    </div>

                    {/* "Why this plan?" Reasoning Section */}
                    {generatedPlan.whyThisPlan && (
                      <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50/80 rounded-xl p-4 space-y-2 text-xs">
                        <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                          Why this plan was selected
                        </h4>
                        <ul className="space-y-1.5 text-slate-600">
                          <li><strong>Budget Fit:</strong> {generatedPlan.whyThisPlan.budgetFit}</li>
                          <li><strong>Vibe & Atmosphere:</strong> {generatedPlan.whyThisPlan.vibeFit}</li>
                          <li><strong>Logistics & Commute:</strong> {generatedPlan.whyThisPlan.logisticsFit}</li>
                          <li><strong>Group Size Dynamics:</strong> {generatedPlan.whyThisPlan.groupFit}</li>
                        </ul>
                      </div>
                    )}

                    {/* Pro-Tips */}
                    {generatedPlan.proTips && generatedPlan.proTips.length > 0 && (
                      <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1.5 text-xs text-teal-950">
                        <span className="font-bold text-teal-900">Local Pro-Tips:</span>
                        <ul className="list-disc list-inside space-y-1 text-teal-900/80">
                          {generatedPlan.proTips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Alternative 1 View */}
                {activePlanTab === 'alt1' && generatedPlan.alternatives?.[0] && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Meaningful Alternative 1
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        ~{generatedPlan.alternatives[0].costPerPerson} / person
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {generatedPlan.alternatives[0].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {generatedPlan.alternatives[0].concept}
                    </p>

                    <div className="p-3 bg-indigo-50/60 rounded-xl text-xs text-indigo-900 font-medium">
                      <strong>How it differs:</strong> {generatedPlan.alternatives[0].difference}
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-semibold text-slate-700 block">Stops Overview:</span>
                      <div className="space-y-2">
                        {generatedPlan.alternatives[0].timelineSummary.map((s, idx) => (
                          <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white flex items-start justify-between text-xs">
                            <div>
                              <span className="font-bold text-slate-900">{s.time} · {s.name}</span>
                              <p className="text-slate-500 text-[11px] mt-0.5">{s.activity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Alternative 2 View */}
                {activePlanTab === 'alt2' && generatedPlan.alternatives?.[1] && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                        Meaningful Alternative 2
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        ~{generatedPlan.alternatives[1].costPerPerson} / person
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {generatedPlan.alternatives[1].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {generatedPlan.alternatives[1].concept}
                    </p>

                    <div className="p-3 bg-sky-50/60 rounded-xl text-xs text-sky-900 font-medium">
                      <strong>How it differs:</strong> {generatedPlan.alternatives[1].difference}
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-semibold text-slate-700 block">Stops Overview:</span>
                      <div className="space-y-2">
                        {generatedPlan.alternatives[1].timelineSummary.map((s, idx) => (
                          <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white flex items-start justify-between text-xs">
                            <div>
                              <span className="font-bold text-slate-900">{s.time} · {s.name}</span>
                              <p className="text-slate-500 text-[11px] mt-0.5">{s.activity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Plan Primary Actions: Save, Share, Google Calendar */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Save Plan */}
                    <button
                      onClick={handleSavePlan}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        planSaved
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {planSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved to Plans</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 text-slate-600" />
                          <span>Save Plan</span>
                        </>
                      )}
                    </button>

                    {/* Share Plan */}
                    <button
                      onClick={handleSharePlan}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>{shareCopied ? 'Link Copied!' : 'Share Plan'}</span>
                    </button>

                    {/* Add to Google Calendar */}
                    <a
                      href={createPlanCalendarUrl(generatedPlan)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                      <span>Add to Google Calendar</span>
                    </a>
                  </div>

                  {shareUrl && (
                    <div className="text-[11px] text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 font-medium">
                      Public Link: {shareUrl}
                    </div>
                  )}

                </div>

              </div>

              {/* Natural Language & Quick Adjustments Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Adjust It Naturally
                  </h3>
                  <span className="text-[11px] text-slate-400">Preserves untouched constraints</span>
                </div>

                {/* Quick Modification Chips */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleAdjustPlan('make_cheaper')}
                    disabled={isAdjusting}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                  >
                    <TrendingDown className="w-3 h-3 text-emerald-600" />
                    Make it cheaper
                  </button>

                  <button
                    onClick={() => handleAdjustPlan('shorten')}
                    disabled={isAdjusting}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                  >
                    <Minimize2 className="w-3 h-3 text-sky-600" />
                    I only have 2 hours
                  </button>

                  <button
                    onClick={() => handleAdjustPlan('closer')}
                    disabled={isAdjusting}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                  >
                    <Footprints className="w-3 h-3 text-teal-600" />
                    Make stops closer
                  </button>

                  <button
                    onClick={() => handleAdjustPlan('more_adventurous')}
                    disabled={isAdjusting}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Make it more adventurous
                  </button>
                </div>

                {/* Natural text adjustment input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={modificationText}
                    onChange={e => setModificationText(e.target.value)}
                    placeholder="e.g. “Swap the coffee shop for a tea lounge” or “Add one dessert stop”"
                    className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAdjustPlan();
                    }}
                  />
                  <button
                    onClick={() => handleAdjustPlan()}
                    disabled={isAdjusting || !modificationText.trim()}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors disabled:opacity-50"
                  >
                    {isAdjusting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
