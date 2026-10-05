import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CitySelectorModal } from './components/CitySelectorModal';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { PlannerView } from './views/PlannerView';
import { EventsExploreView } from './views/EventsExploreView';
import { SavedPlansView } from './views/SavedPlansView';
import { SavedPlacesView } from './views/SavedPlacesView';
import { SettingsView } from './views/SettingsView';
import { AdminView } from './views/AdminView';
import { PlanDetailView } from './views/PlanDetailView';
import { 
  UserProfile, 
  OutingPlan, 
  SavedPlace, 
  SupportedCity, 
  ConfigurableQuestion,
  EventItem 
} from './types';
import { 
  getStoredUser, 
  saveStoredUser, 
  clearStoredUser, 
  createDefaultUser, 
  getSavedPlans, 
  getBookmarkedPlaces 
} from './lib/storage';
import { fetchAppConfig, fetchSharedPlan } from './lib/api';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<string>('landing');
  const [currentCity, setCurrentCity] = useState<string>('Bengaluru');
  
  // Data states
  const [supportedCities, setSupportedCities] = useState<SupportedCity[]>([]);
  const [questions, setQuestions] = useState<ConfigurableQuestion[]>([]);
  const [savedPlans, setSavedPlans] = useState<OutingPlan[]>([]);
  const [bookmarkedPlaces, setBookmarkedPlaces] = useState<SavedPlace[]>([]);
  
  // Detailed Plan View State
  const [selectedPlan, setSelectedPlan] = useState<OutingPlan | null>(null);
  const [isPublicShared, setIsPublicShared] = useState<boolean>(false);
  const [sharedLoading, setSharedLoading] = useState<boolean>(false);

  // Prefill planning state
  const [plannerPrefillIntent, setPlannerPrefillIntent] = useState<string | undefined>();
  const [plannerPrefillEvent, setPlannerPrefillEvent] = useState<EventItem | undefined>();

  // Modals
  const [citySelectorOpen, setCitySelectorOpen] = useState(false);
  const [ageVerificationOpen, setAgeVerificationOpen] = useState(false);

  // Initialize stored state and config
  useEffect(() => {
    // 1. Load user from storage or provide initial demo user
    const existingUser = getStoredUser();
    if (existingUser) {
      setUser(existingUser);
      if (existingUser.city) setCurrentCity(existingUser.city);
    } else {
      // Auto-set initial user session
      const defaultUser = createDefaultUser('18-35', 'Nitin Kain', 'nitinkain15012007@gmail.com');
      setUser(defaultUser);
      saveStoredUser(defaultUser);
    }

    // 2. Load saved plans and places
    setSavedPlans(getSavedPlans());
    setBookmarkedPlaces(getBookmarkedPlaces());

    // 3. Load dynamic config from server
    fetchAppConfig()
      .then(cfg => {
        if (cfg.supportedCities) setSupportedCities(cfg.supportedCities);
        if (cfg.questions) setQuestions(cfg.questions);
      })
      .catch(err => {
        console.warn('Could not load remote config, using defaults:', err);
      });

    // 4. Check for public shared plan URL path e.g. /share/:token or hash #share=:token
    const path = window.location.pathname;
    const hash = window.location.hash;
    const shareMatch = path.match(/\/share\/([a-zA-Z0-9_-]+)/) || hash.match(/#share=([a-zA-Z0-9_-]+)/);

    if (shareMatch && shareMatch[1]) {
      const token = shareMatch[1];
      setSharedLoading(true);
      fetchSharedPlan(token)
        .then(plan => {
          setSelectedPlan(plan);
          setIsPublicShared(true);
          setActiveView('plan-detail');
        })
        .catch(err => {
          console.error('Failed to load shared plan:', err);
        })
        .finally(() => {
          setSharedLoading(false);
        });
    }
  }, []);

  const handleLogin = () => {
    const newUser = createDefaultUser('18-35', 'Nitin Kain', 'nitinkain15012007@gmail.com');
    saveStoredUser(newUser);
    setUser(newUser);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    setActiveView('landing');
  };

  const handleStartPlanning = (intent?: string) => {
    setPlannerPrefillIntent(intent);
    setPlannerPrefillEvent(undefined);
    setActiveView('plan');
  };

  const handleUseEventInPlan = (event: EventItem) => {
    setPlannerPrefillEvent(event);
    setPlannerPrefillIntent('event');
    setActiveView('plan');
  };

  const handleSelectPlan = (plan: OutingPlan) => {
    setSelectedPlan(plan);
    setIsPublicShared(false);
    setActiveView('plan-detail');
  };

  const handleUseSharedPlan = (plan: OutingPlan) => {
    setPlannerPrefillIntent(plan.intent);
    setActiveView('plan');
  };

  const handleRefreshSavedData = () => {
    setSavedPlans(getSavedPlans());
    setBookmarkedPlaces(getBookmarkedPlaces());
  };

  const handleVerificationComplete = (ageGroup: '16-17' | '18-35', isVerified: boolean) => {
    if (user) {
      const updated: UserProfile = {
        ...user,
        ageGroup,
        isAgeVerified: isVerified,
        updatedAt: new Date().toISOString(),
      };
      saveStoredUser(updated);
      setUser(updated);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Universal Top Navigation */}
      <Navbar
        currentCity={currentCity}
        onOpenCitySelector={() => setCitySelectorOpen(true)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          setSelectedPlan(null);
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {sharedLoading && (
          <div className="py-20 text-center text-sm text-slate-500">
            Loading shared itinerary...
          </div>
        )}

        {!sharedLoading && activeView === 'landing' && (
          <LandingPage
            onStartPlanning={handleStartPlanning}
            onExploreEvents={() => setActiveView('events')}
            user={user}
            onOpenCitySelector={() => setCitySelectorOpen(true)}
            currentCity={currentCity}
          />
        )}

        {!sharedLoading && activeView === 'dashboard' && (
          <DashboardView
            user={user}
            currentCity={currentCity}
            savedPlans={savedPlans}
            bookmarkedPlaces={bookmarkedPlaces}
            onNavigate={(view) => setActiveView(view)}
            onStartPlanning={handleStartPlanning}
            onOpenCitySelector={() => setCitySelectorOpen(true)}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {!sharedLoading && activeView === 'plan' && (
          <PlannerView
            currentCity={currentCity}
            user={user}
            onOpenCitySelector={() => setCitySelectorOpen(true)}
            questions={questions}
            prefilledIntent={plannerPrefillIntent}
            prefilledEvent={plannerPrefillEvent}
            onPlanCreated={() => handleRefreshSavedData()}
          />
        )}

        {!sharedLoading && activeView === 'events' && (
          <EventsExploreView
            currentCity={currentCity}
            onUseEventInPlan={handleUseEventInPlan}
            onOpenCitySelector={() => setCitySelectorOpen(true)}
          />
        )}

        {!sharedLoading && activeView === 'saved-plans' && (
          <SavedPlansView
            plans={savedPlans}
            onSelectPlan={handleSelectPlan}
            onPlanDeleted={() => handleRefreshSavedData()}
            onStartPlanning={() => handleStartPlanning()}
          />
        )}

        {!sharedLoading && activeView === 'saved-places' && (
          <SavedPlacesView
            places={bookmarkedPlaces}
            onPlaceRemoved={() => handleRefreshSavedData()}
            onStartPlanning={() => handleStartPlanning()}
          />
        )}

        {!sharedLoading && activeView === 'settings' && user && (
          <SettingsView
            user={user}
            onUpdateUser={(updated) => setUser(updated)}
            onOpenAgeVerification={() => setAgeVerificationOpen(true)}
            supportedCities={supportedCities.length > 0 ? supportedCities : [{ name: 'Bengaluru' }, { name: 'Delhi NCR' }, { name: 'Greater Noida' }, { name: 'Mumbai' }]}
          />
        )}

        {!sharedLoading && activeView === 'admin' && (
          <AdminView />
        )}

        {!sharedLoading && activeView === 'plan-detail' && selectedPlan && (
          <PlanDetailView
            plan={selectedPlan}
            isPublicShared={isPublicShared}
            onBack={() => {
              setSelectedPlan(null);
              setActiveView(user ? 'saved-plans' : 'landing');
            }}
            onUseThisPlan={handleUseSharedPlan}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer
        onNavigate={(view) => setActiveView(view)}
        onOpenCitySelector={() => setCitySelectorOpen(true)}
        currentCity={currentCity}
      />

      {/* City Selector Modal */}
      <CitySelectorModal
        isOpen={citySelectorOpen}
        onClose={() => setCitySelectorOpen(false)}
        supportedCities={supportedCities}
        currentCity={currentCity}
        onSelectCity={(city) => {
          setCurrentCity(city);
          if (user) {
            const updated = { ...user, city };
            setUser(updated);
            saveStoredUser(updated);
          }
        }}
      />

      {/* Age Verification Modal */}
      <AgeVerificationModal
        isOpen={ageVerificationOpen}
        onClose={() => setAgeVerificationOpen(false)}
        onVerificationComplete={handleVerificationComplete}
      />

    </div>
  );
}
