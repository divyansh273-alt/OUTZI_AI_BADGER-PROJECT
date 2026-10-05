import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Sliders, 
  Bell, 
  User, 
  Check, 
  AlertCircle, 
  Lock,
  Heart,
  Compass
} from 'lucide-react';
import { UserProfile, PersonalityType } from '../types';
import { saveStoredUser } from '../lib/storage';
import { requestNotificationPermission, showLocalNotification } from '../lib/notifications';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenAgeVerification: () => void;
  supportedCities: { name: string }[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onOpenAgeVerification,
  supportedCities,
}) => {
  const [name, setName] = useState(user.name);
  const [city, setCity] = useState(user.city);
  const [travelDistance, setTravelDistance] = useState(user.preferredTravelDistanceKm || 12);
  const [personalities, setPersonalities] = useState<PersonalityType[]>(user.personalityPreferences || ['Foodie', 'Chill']);
  const [upcomingPlansNotif, setUpcomingPlansNotif] = useState(user.notificationPreferences?.upcomingPlans ?? true);
  const [eventAlertsNotif, setEventAlertsNotif] = useState(user.notificationPreferences?.eventAlerts ?? true);
  const [pushEnabled, setPushEnabled] = useState(user.notificationPreferences?.pushEnabled ?? false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isMinor = user.ageGroup === '16-17';

  const allPersonalityOptions: PersonalityType[] = [
    'Chill',
    'Adventurous',
    'Foodie',
    'Social',
    'Introvert',
    'Explorer',
    'Romantic', // Disallowed for under 18
    'Budget-conscious',
  ];

  const handleTogglePersonality = (trait: PersonalityType) => {
    if (isMinor && trait === 'Romantic') return;
    if (personalities.includes(trait)) {
      setPersonalities(personalities.filter(p => p !== trait));
    } else {
      setPersonalities([...personalities, trait]);
    }
  };

  const handleTogglePush = async () => {
    if (!pushEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setPushEnabled(true);
        showLocalNotification('OUTZI.AI Notifications Enabled', {
          body: 'You will receive reminders 2 hours before planned outings.',
        });
      } else {
        alert('Notification permission was not granted by your browser.');
      }
    } else {
      setPushEnabled(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      city,
      preferredTravelDistanceKm: travelDistance,
      personalityPreferences: personalities,
      notificationPreferences: {
        upcomingPlans: upcomingPlansNotif,
        eventAlerts: eventAlertsNotif,
        pushEnabled,
      },
      updatedAt: new Date().toISOString(),
    };

    saveStoredUser(updated);
    onUpdateUser(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          User Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Control your city defaults, personality vibe traits, privacy rules, and browser notifications.
        </p>
      </div>

      {/* Privacy Guarantee Box */}
      <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1.5 text-xs shadow-xs">
        <div className="flex items-center gap-1.5 font-bold text-teal-400">
          <Lock className="w-4 h-4" />
          <span>Strict Zero-Social Privacy Architecture</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          OUTZI.AI is a personal utility, not a social network. You have no public profile, cannot be discovered in user directories, and when you share a plan link, your name and email are completely omitted.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Account Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            Google Account & Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Account Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Managed via Google OAuth</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary City Preference
            </label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
            >
              {supportedCities.map(c => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Age Gating & Verification Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Age Group & Safety Policy
            </h2>

            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              user.ageGroup === '18-35' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {user.ageGroup === '18-35' ? '18+ Adult Verified' : 'Age 16–17 (Young Adult)'}
            </span>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed space-y-2">
            <p>
              In accordance with our safety architecture, <strong>Date Planning</strong> is strictly restricted to adults aged 18 and older. Users aged 16–17 enjoy full access to Group Outings, Solo Plans, Events, and City Exploration.
            </p>

            {user.ageGroup === '16-17' && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between gap-3">
                <span className="text-[11px] text-amber-900 font-medium">
                  If you are 18+ and need to unlock adult features, you can complete a secure zero-retention DOB check.
                </span>
                <button
                  type="button"
                  onClick={onOpenAgeVerification}
                  className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 transition-colors"
                >
                  Verify DOB
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Personality Types Selection */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-600" />
              Personality & Outing Style Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select multiple traits that define your ideal pace. AI incorporates these into venue selection.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {allPersonalityOptions.map(trait => {
              const isSelected = personalities.includes(trait);
              const isRomanticMinor = isMinor && trait === 'Romantic';

              return (
                <button
                  type="button"
                  key={trait}
                  disabled={isRomanticMinor}
                  onClick={() => handleTogglePersonality(trait)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                    isRomanticMinor
                      ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                      : isSelected
                      ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {trait}
                  {isRomanticMinor && <span className="block text-[9px] text-slate-400">18+ only</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Travel Distance Radius */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              Preferred Travel Distance
            </h2>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              Up to {travelDistance} km
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Helps limit travel between sequential stops to keep outing commutes realistic.
          </p>

          <input
            type="range"
            min={4}
            max={30}
            step={2}
            value={travelDistance}
            onChange={e => setTravelDistance(Number(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>

        {/* Browser Push Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-600" />
            Browser Push Notifications
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Enable Desktop / Mobile Push Alerts
                </span>
                <span className="text-[11px] text-slate-500">
                  Timely reminders 2 hours before scheduled outings and event starts.
                </span>
              </div>
              <button
                type="button"
                onClick={handleTogglePush}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                  pushEnabled ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    pushEnabled ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-700">Saved Plan Reminders</span>
              <input
                type="checkbox"
                checked={upcomingPlansNotif}
                onChange={e => setUpcomingPlansNotif(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-700">Upcoming Live Event Alerts</span>
              <input
                type="checkbox"
                checked={eventAlertsNotif}
                onChange={e => setEventAlertsNotif(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess && (
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <Check className="w-4 h-4" />
              <span>Preferences saved successfully!</span>
            </div>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
