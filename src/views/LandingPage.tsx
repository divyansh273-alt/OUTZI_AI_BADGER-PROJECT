import React from 'react';
import { 
  ArrowRight, 
  Users, 
  Compass, 
  Heart, 
  Ticket, 
  MapPin, 
  CheckCircle, 
  Sparkles, 
  SlidersHorizontal, 
  RotateCcw,
  ShieldCheck,
  Clock,
  IndianRupee
} from 'lucide-react';
import { UserProfile } from '../types';

interface LandingPageProps {
  onStartPlanning: (intent?: string) => void;
  onExploreEvents: () => void;
  user: UserProfile | null;
  onOpenCitySelector: () => void;
  currentCity: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onExploreEvents,
  user,
  onOpenCitySelector,
  currentCity,
}) => {
  const isMinor = user?.ageGroup === '16-17';

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Serving {currentCity} and 9 other Indian hubs</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Don’t just find a place. <br />
            <span className="text-teal-700">Plan the whole experience.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
            OUTZI.AI turns <em>“What should we do today?”</em> into a personalized, realistic plan using AI and verified real-world venue data. No endless tabs. No unrealistic cab hops.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onStartPlanning()}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
            >
              <span>Plan Something</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={scrollToHowItWorks}
              className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors"
            >
              See How It Works
            </button>
          </div>

          {/* Zero-Hallucination Trust Guarantee */}
          <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Real Physical Locations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Realistic Indian Rupee Budgets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>True City Commute Times</span>
            </div>
          </div>

        </div>

        {/* Quick Example Category Triggers */}
        <div className="mt-12 pt-8 border-t border-slate-200/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Quick Outing Starters
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            
            {/* Friends */}
            <button
              onClick={() => onStartPlanning('friends')}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Friends & Crew</h4>
              <p className="text-xs text-slate-500 mt-1">Board games, food crawl, or casual hangouts.</p>
            </button>

            {/* Solo */}
            <button
              onClick={() => onStartPlanning('solo')}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-3 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Solo Quest</h4>
              <p className="text-xs text-slate-500 mt-1">Book cafes, solo museum visits & quiet parks.</p>
            </button>

            {/* Events */}
            <button
              onClick={onExploreEvents}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Ticket className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Events & Shows</h4>
              <p className="text-xs text-slate-500 mt-1">Live gigs, pottery workshops & stand-up comedy.</p>
            </button>

            {/* Explore */}
            <button
              onClick={() => onStartPlanning('explore')}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Explore & Photos</h4>
              <p className="text-xs text-slate-500 mt-1">Heritage walks, sunset viewpoints & hidden gems.</p>
            </button>

            {/* Date Planning (Strictly Age Gated: NEVER shown for users 16-17) */}
            {!isMinor && (
              <button
                onClick={() => onStartPlanning('date')}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-rose-400 hover:shadow-sm transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-3 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Date (18+)</h4>
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1 py-0.5 rounded">
                    18+
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Cozy acoustics, scenic viewpoints, evening dinners.</p>
              </button>
            )}

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
            The Core Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How OUTZI.AI builds your outing
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mt-1">
            We don’t dump a generic list of 10 cafes. We construct an end-to-end chronological timeline that actually works on the ground.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="text-xs font-mono font-bold text-teal-700">01</div>
            <h3 className="text-base font-bold text-slate-900">Tell us what you want</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose your intent, location, budget per person, available time window, and energy vibe.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="text-xs font-mono font-bold text-teal-700">02</div>
            <h3 className="text-base font-bold text-slate-900">AI researches & grounds</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Gemini 3.8 cross-references your constraints with real venues, realistic menus, and transit routes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="text-xs font-mono font-bold text-teal-700">03</div>
            <h3 className="text-base font-bold text-slate-900">Get a complete plan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive one primary recommendation with chronological stops, budget breakdowns, transit notes, plus 2 distinct alternatives.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <div className="text-xs font-mono font-bold text-teal-700">04</div>
            <h3 className="text-base font-bold text-slate-900">Adjust it naturally</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Say things like <em>“Make it cheaper”</em>, <em>“Change the café”</em>, <em>“I only have 2 hours”</em>, or <em>“Make it more adventurous”</em>.
            </p>
          </div>

        </div>
      </section>

      {/* Real-World Integrity Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Anti-Hallucination Standard</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Built for real streets, not hypothetical itineraries.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We verify that the bakery actually exists, that the bowling alley hasn’t shut down, and that travel between stops doesn’t strand you in 90 minutes of peak-hour Bengaluru or Mumbai traffic.
            </p>
          </div>

          <button
            onClick={() => onStartPlanning()}
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-colors shadow-sm shrink-0"
          >
            Start Planning Now
          </button>
        </div>
      </section>

    </div>
  );
};
