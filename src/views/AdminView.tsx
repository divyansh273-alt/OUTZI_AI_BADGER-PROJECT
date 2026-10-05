import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  MapPin, 
  Sliders, 
  Flag, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Layers, 
  ToggleLeft, 
  ToggleRight, 
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { ConfigurableQuestion, SupportedCity, AdminProductConfig } from '../types';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'questions' | 'cities' | 'config' | 'moderation'>('questions');

  // Question Management State
  const [questions, setQuestions] = useState<ConfigurableQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<ConfigurableQuestion | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionKey, setNewQuestionKey] = useState('');
  const [newQuestionType, setNewQuestionType] = useState<'single_select' | 'text'>('single_select');

  // Cities Management State
  const [cities, setCities] = useState<SupportedCity[]>([]);
  const [newCityName, setNewCityName] = useState('');
  const [newCityState, setNewCityState] = useState('');
  const [newCityAreas, setNewCityAreas] = useState('');

  // Feature Configuration State
  const [config, setConfig] = useState<AdminProductConfig>({
    datePlanningMinAge: 18,
    strictServerAgeCheck: true,
    kycVerificationServiceActive: true,
    enableGoogleCalendarSync: true,
    enablePushNotifications: true,
    maxTravelRadiusKm: 25,
  });

  // Moderation Queue State
  const [flaggedItems, setFlaggedItems] = useState([
    { id: 'f-1', name: 'Social Hauz Khas', city: 'Delhi NCR', reason: 'Opening timing shifted from 11 AM to 12 PM', status: 'pending' },
    { id: 'f-2', name: 'Toit Indiranagar', city: 'Bengaluru', reason: 'High weekend waiting queue during 7-9 PM', status: 'verified_active' },
  ]);

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Fetch initial config from server
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.questions) setQuestions(data.questions);
        if (data.allCities) setCities(data.allCities);
        if (data.productConfig) setConfig(data.productConfig);
      })
      .catch(e => console.error('Failed to load admin data:', e));
  }, []);

  const showNotification = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  // Toggle city active status
  const toggleCityActive = (id: string) => {
    setCities(prev =>
      prev.map(c => (c.id === id ? { ...c, active: !c.active } : c))
    );
    showNotification('City status updated.');
  };

  // Add new supported Indian city
  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName || !newCityState) return;

    const newCity: SupportedCity = {
      id: newCityName.toLowerCase().slice(0, 3) + Date.now().toString().slice(-3),
      name: newCityName.trim(),
      state: newCityState.trim(),
      popularAreas: newCityAreas.split(',').map(a => a.trim()).filter(Boolean),
      active: true,
    };

    setCities(prev => [...prev, newCity]);
    setNewCityName('');
    setNewCityState('');
    setNewCityAreas('');
    showNotification(`City ${newCity.name} added to coverage registry.`);
  };

  // Toggle question active status
  const toggleQuestionActive = (id: string) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, active: !q.active } : q))
    );
    showNotification('Question visibility toggled.');
  };

  // Add Question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !newQuestionKey) return;

    const newQ: ConfigurableQuestion = {
      id: 'q_' + Date.now(),
      key: newQuestionKey.toLowerCase().replace(/\s+/g, '_'),
      question: newQuestionText,
      type: newQuestionType,
      options: [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' },
      ],
      order: questions.length + 1,
      priority: 'recommended',
      active: true,
    };

    setQuestions(prev => [...prev, newQ]);
    setNewQuestionText('');
    setNewQuestionKey('');
    showNotification('New configurable question added.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin & Governance Console
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dynamic questionnaire configuration, supported cities registry, feature flags, and data quality moderation.
          </p>
        </div>

        {savedNotice && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{savedNotice}</span>
          </div>
        )}
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'questions'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Configurable Questions ({questions.length})
        </button>

        <button
          onClick={() => setActiveTab('cities')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'cities'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Supported Cities ({cities.length})
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'config'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Feature Flags & Safety Policies
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'moderation'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Flag className="w-4 h-4" />
          Data Quality Moderation ({flaggedItems.length})
        </button>
      </div>

      {/* Tab 1: Configurable Questions */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600">
            <strong>Dynamic Questionnaire Engine:</strong> Questions are retrieved by the client from the server instead of being hard-coded into the UI. You can activate/deactivate questions, reorder them, or add new constraint prompts.
          </div>

          <div className="space-y-3">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                      #{q.order || index + 1}
                    </span>
                    <span className="font-semibold text-slate-700">key: {q.key}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{q.priority}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {q.question}
                  </h3>

                  {q.subtext && <p className="text-xs text-slate-500">{q.subtext}</p>}

                  <div className="text-[11px] text-slate-400 pt-1">
                    Options ({q.options?.length || 0}): {q.options?.map(o => o.label).join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => toggleQuestionActive(q.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      q.active
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {q.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-600" />
              Add New Planning Question
            </h3>

            <form onSubmit={handleAddQuestion} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Question (e.g. Dietary preferences?)"
                value={newQuestionText}
                onChange={e => setNewQuestionText(e.target.value)}
                required
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Constraint Key (e.g. dietary)"
                value={newQuestionKey}
                onChange={e => setNewQuestionKey(e.target.value)}
                required
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Add Question
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Supported Cities */}
      {activeTab === 'cities' && (
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600">
            <strong>India Coverage Registry:</strong> If a user searches an unlisted city, OUTZI.AI shows an explicit <em>“Coming soon”</em> banner instead of hallucinating places.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map(city => (
              <div
                key={city.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">{city.name}</h3>
                    <button
                      onClick={() => toggleCityActive(city.id)}
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        city.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {city.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <span className="text-xs text-slate-500">{city.state}</span>

                  <div className="mt-2 text-[11px] text-slate-600">
                    <strong>Popular Areas:</strong> {city.popularAreas?.join(', ') || 'Central Market'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add City Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-600" />
              Register New Indian City
            </h3>

            <form onSubmit={handleAddCity} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="City Name (e.g. Lucknow)"
                value={newCityName}
                onChange={e => setNewCityName(e.target.value)}
                required
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              />

              <input
                type="text"
                placeholder="State (e.g. Uttar Pradesh)"
                value={newCityState}
                onChange={e => setNewCityState(e.target.value)}
                required
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Popular Areas (comma separated)"
                value={newCityAreas}
                onChange={e => setNewCityAreas(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Add City
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Feature Flags & Safety Policies */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">
              Safety Gates & Platform Policy Configuration
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">Strict Server-Side Age Gating (Date Planning)</span>
                  <span className="text-slate-500 text-[11px]">Enforce 18+ check on API routes, rejecting attempts from accounts aged 16–17.</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.strictServerAgeCheck}
                  onChange={e => {
                    setConfig({ ...config, strictServerAgeCheck: e.target.checked });
                    showNotification('Server age enforcement updated.');
                  }}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">KYC Age Verification Service Active</span>
                  <span className="text-slate-500 text-[11px]">Allow users to unlock date planning via zero-retention government ID verification.</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.kycVerificationServiceActive}
                  onChange={e => {
                    setConfig({ ...config, kycVerificationServiceActive: e.target.checked });
                    showNotification('Verification service state saved.');
                  }}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">Enable Google Calendar Sync</span>
                  <span className="text-slate-500 text-[11px]">Allows users to explicitly export outing timelines and stops into Google Calendar.</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableGoogleCalendarSync}
                  onChange={e => {
                    setConfig({ ...config, enableGoogleCalendarSync: e.target.checked });
                    showNotification('Calendar sync setting saved.');
                  }}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Browser Push Notifications</span>
                  <span className="text-slate-500 text-[11px]">Service worker push reminders for scheduled outings.</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.enablePushNotifications}
                  onChange={e => {
                    setConfig({ ...config, enablePushNotifications: e.target.checked });
                    showNotification('Push notifications flag updated.');
                  }}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Moderation */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600">
            <strong>Data Quality & Verification Queue:</strong> Venues and events flagged by visitors for outdated timings, price changes, or closures are reviewed here.
          </div>

          <div className="space-y-3">
            {flaggedItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <span className="text-xs text-slate-500">· {item.city}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Flagged feedback: <em>{item.reason}</em>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFlaggedItems(prev => prev.filter(f => f.id !== item.id));
                      showNotification('Item marked as verified and updated.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Mark Verified
                  </button>
                  <button
                    onClick={() => {
                      setFlaggedItems(prev => prev.filter(f => f.id !== item.id));
                      showNotification('Item removed from verified index.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors"
                  >
                    Deactivate Venue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
