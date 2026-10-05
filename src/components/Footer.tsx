import React from 'react';
import { ShieldCheck, MapPin, Compass, Download } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenCitySelector: () => void;
  currentCity: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenCitySelector,
  currentCity,
}) => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center font-extrabold text-xs tracking-tighter">
                OZ
              </div>
              <span className="font-extrabold text-slate-900 text-base">OUTZI<span className="text-teal-600">.AI</span></span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Don’t just find a place. Plan the whole experience. Turning “What should we do today?” into realistic, constraint-aware itineraries across Indian cities.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Real venues · Zero fake reviews · Zero hallucinated spots</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Outing Categories
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('plan')} className="hover:text-slate-900 text-slate-600 transition-colors">
                  Friends & Group Hangouts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plan')} className="hover:text-slate-900 text-slate-600 transition-colors">
                  Solo Deep Work & Exploration
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('events')} className="hover:text-slate-900 text-slate-600 transition-colors">
                  Curated Live Shows & Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plan')} className="hover:text-slate-900 text-slate-600 transition-colors">
                  Date Planning (Strictly 18+)
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Metros */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Supported Indian Metros
            </h4>
            <p className="text-[11px] text-slate-500">
              Current City: <strong className="text-slate-800">{currentCity}</strong>
            </p>
            <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
              <span>Bengaluru</span> · <span>Delhi NCR</span> · <span>Greater Noida</span> · <span>Mumbai</span> · <span>Hyderabad</span> · <span>Pune</span> · <span>Kolkata</span> · <span>Chennai</span> · <span>Jaipur</span>
            </div>
            <button
              onClick={onOpenCitySelector}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 mt-1"
            >
              <MapPin className="w-3 h-3" />
              Change City / View Coverage
            </button>
          </div>

          {/* Trust & Safety Principles */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Trust & Privacy
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              No public profiles. No follower metrics. When you share a plan, your identity is never leaked. Uploaded verification documents are parsed in memory and instantly deleted.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={() => onNavigate('admin')}
                className="text-slate-500 hover:text-slate-800 text-[11px] underline"
              >
                Admin Control Room
              </button>
              <span className="text-slate-300">·</span>
              <a
                href="/api/export-zip"
                download="outzi-ai.zip"
                className="text-teal-700 hover:text-teal-900 font-semibold text-[11px] flex items-center gap-1 inline-flex"
                title="Download clean project ZIP archive with source code, docs, and configs"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                Export Project ZIP
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} OUTZI.AI Planner. Made for modern urban India.
          </div>
          <div className="flex items-center gap-4">
            <span>Server-side Gemini 3.8 Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Google Maps Grounding</span>
            <span aria-hidden="true">·</span>
            <span>Zero Hallucination Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
