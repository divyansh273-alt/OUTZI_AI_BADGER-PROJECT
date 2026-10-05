import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Bookmark, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  PlusCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { UserProfile, SupportedCity } from '../types';

interface NavbarProps {
  currentCity: string;
  onOpenCitySelector: () => void;
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onOpenCitySelector,
  user,
  onLogin,
  onLogout,
  activeView,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-extrabold text-base tracking-tighter shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-colors">
                OZ
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                  OUTZI<span className="text-teal-600">.AI</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                    India
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:block -mt-0.5">
                  Real-world experience planner
                </span>
              </div>
            </button>

            {/* City Selector Button */}
            <button
              onClick={onOpenCitySelector}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
              title="Change your current city"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>{currentCity || 'Select City'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick('plan')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'plan' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Plan Outing
            </button>

            <button
              onClick={() => handleNavClick('events')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'events' 
                  ? 'bg-slate-100 text-slate-900 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4 text-slate-500" />
              Events & Explore
            </button>

            <button
              onClick={() => handleNavClick('saved-plans')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'saved-plans' 
                  ? 'bg-slate-100 text-slate-900 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              Saved Plans
            </button>

            <button
              onClick={() => handleNavClick('saved-places')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'saved-places' 
                  ? 'bg-slate-100 text-slate-900 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4 text-slate-500" />
              Saved Places
            </button>
          </nav>

          {/* User Auth & Profile / Admin */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div className="text-left text-xs">
                    <div className="font-semibold text-slate-900 leading-tight">{user.name.split(' ')[0]}</div>
                    <div className="text-slate-500 text-[10px] flex items-center gap-1">
                      {user.ageGroup === '16-17' ? (
                        <span className="text-amber-600 font-medium">Age 16–17</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">18+ Verified</span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 text-[10px] text-slate-600 bg-slate-50 p-1 rounded">
                        Privacy: Zero public discovery · Private profile
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Compass className="w-3.5 h-3.5 text-slate-500" />
                      Dashboard
                    </button>

                    <button
                      onClick={() => handleNavClick('settings')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      Preferences & Age Status
                    </button>

                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      Admin Dashboard
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        onLogout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In with Google</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button
              onClick={() => {
                onOpenCitySelector();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>City: <strong>{currentCity}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {user ? (
              <div className="text-right text-xs">
                <span className="font-semibold text-slate-900">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] block text-slate-500">
                  {user.ageGroup === '16-17' ? 'Age 16–17' : '18+ Verified'}
                </span>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLogin();
                  setMobileMenuOpen(false);
                }}
                className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('plan')}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium"
            >
              <PlusCircle className="w-4 h-4 text-teal-700" />
              Plan Outing
            </button>
            <button
              onClick={() => handleNavClick('events')}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium"
            >
              <Compass className="w-4 h-4 text-slate-600" />
              Events & Explore
            </button>
            <button
              onClick={() => handleNavClick('saved-plans')}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium"
            >
              <Calendar className="w-4 h-4 text-slate-600" />
              Saved Plans
            </button>
            <button
              onClick={() => handleNavClick('saved-places')}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium"
            >
              <Bookmark className="w-4 h-4 text-slate-600" />
              Saved Places
            </button>
          </div>

          {user && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button 
                onClick={() => handleNavClick('settings')}
                className="text-slate-600 hover:text-slate-900 font-medium py-1"
              >
                Preferences & Settings
              </button>
              <button 
                onClick={() => handleNavClick('admin')}
                className="text-teal-700 hover:text-teal-900 font-medium py-1"
              >
                Admin Panel
              </button>
              <button 
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-rose-600 hover:text-rose-800 font-medium py-1"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
