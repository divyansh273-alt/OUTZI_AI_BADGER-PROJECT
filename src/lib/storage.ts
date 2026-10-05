import { UserProfile, OutingPlan, SavedPlace } from '../types';

const USER_KEY = 'chalo_user_profile';
const SAVED_PLANS_KEY = 'chalo_saved_plans';
const BOOKMARKED_PLACES_KEY = 'chalo_bookmarked_places';

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredUser(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to store user profile:', e);
  }
}

export function clearStoredUser(): void {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Failed to clear user:', e);
  }
}

// Initial demo user with real Google ID simulation
export function createDefaultUser(ageGroup: '16-17' | '18-35' = '18-35', name = 'Nitin Kain', email = 'nitinkain15012007@gmail.com'): UserProfile {
  return {
    id: 'usr_' + Math.random().toString(36).slice(2, 9),
    googleUserId: 'goog_1092837465',
    name,
    email,
    avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
    ageGroup,
    isAgeVerified: ageGroup === '18-35',
    city: 'Bengaluru',
    personalityPreferences: ['Foodie', 'Chill', 'Explorer'],
    preferredTravelDistanceKm: 12,
    notificationPreferences: {
      upcomingPlans: true,
      eventAlerts: true,
      pushEnabled: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getSavedPlans(): OutingPlan[] {
  try {
    const raw = localStorage.getItem(SAVED_PLANS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePlanToStorage(plan: OutingPlan): void {
  try {
    const existing = getSavedPlans();
    const filtered = existing.filter(p => p.id !== plan.id);
    localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify([plan, ...filtered]));
  } catch (e) {
    console.error('Failed to save plan:', e);
  }
}

export function deleteSavedPlan(id: string): void {
  try {
    const existing = getSavedPlans();
    localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(existing.filter(p => p.id !== id)));
  } catch (e) {
    console.error('Failed to delete saved plan:', e);
  }
}

export function getBookmarkedPlaces(): SavedPlace[] {
  try {
    const raw = localStorage.getItem(BOOKMARKED_PLACES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function toggleBookmarkPlace(place: { name: string; city: string; area: string; category: string; address: string; googleMapsUrl: string; note?: string }): boolean {
  try {
    const existing = getBookmarkedPlaces();
    const idx = existing.findIndex(p => p.name.toLowerCase() === place.name.toLowerCase() && p.city.toLowerCase() === place.city.toLowerCase());
    if (idx >= 0) {
      existing.splice(idx, 1);
      localStorage.setItem(BOOKMARKED_PLACES_KEY, JSON.stringify(existing));
      return false; // Removed
    } else {
      const newPlace: SavedPlace = {
        id: 'place_' + Math.random().toString(36).slice(2, 9),
        userId: 'current',
        ...place,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(BOOKMARKED_PLACES_KEY, JSON.stringify([newPlace, ...existing]));
      return true; // Added
    }
  } catch {
    return false;
  }
}

export function isPlaceBookmarked(name: string, city: string): boolean {
  try {
    const existing = getBookmarkedPlaces();
    return existing.some(p => p.name.toLowerCase() === name.toLowerCase() && p.city.toLowerCase() === city.toLowerCase());
  } catch {
    return false;
  }
}
