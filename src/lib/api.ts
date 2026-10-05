import { OutingPlan, ConfigurableQuestion, SupportedCity, EventItem, AdminProductConfig } from '../types';

export interface ConfigResponse {
  supportedCities: SupportedCity[];
  allCities: SupportedCity[];
  questions: ConfigurableQuestion[];
  productConfig: AdminProductConfig;
}

export async function fetchAppConfig(): Promise<ConfigResponse> {
  const res = await fetch('/api/config');
  if (!res.ok) throw new Error('Failed to load application config');
  return res.json();
}

export async function checkCitySupport(cityName: string): Promise<{ supported: boolean; city?: SupportedCity; message?: string }> {
  const res = await fetch(`/api/cities/check?city=${encodeURIComponent(cityName)}`);
  if (!res.ok) throw new Error('Failed to check city');
  return res.json();
}

export async function fetchEvents(city?: string, category?: string): Promise<EventItem[]> {
  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (category && category !== 'All') params.set('category', category);
  const res = await fetch(`/api/events?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch events');
  const data = await res.json();
  return data.events || [];
}

export async function generateOutingPlan(payload: {
  intent: string;
  city: string;
  area?: string;
  date?: string;
  startTime?: string;
  groupSize?: string;
  budget?: string;
  vibe?: string;
  duration?: string;
  specialNotes?: string;
  userAgeGroup?: string;
  userPersonality?: string[];
  anchorEvent?: any;
}): Promise<{ plan: OutingPlan; note?: string }> {
  const res = await fetch('/api/plan/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to generate outing plan');
  }
  return data;
}

export async function adjustOutingPlan(
  currentPlan: OutingPlan,
  options: { modificationText?: string; quickAction?: string }
): Promise<{ plan: OutingPlan }> {
  const res = await fetch('/api/plan/adjust', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      currentPlan,
      modificationText: options.modificationText,
      quickAction: options.quickAction,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to adjust plan');
  }
  return data;
}

export async function shareOutingPlan(plan: OutingPlan): Promise<{ token: string; shareUrl: string }> {
  const res = await fetch('/api/plan/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to generate share link');
  }
  return data;
}

export async function fetchSharedPlan(token: string): Promise<OutingPlan> {
  const res = await fetch(`/api/plan/share/${encodeURIComponent(token)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Plan not found or expired');
  }
  return data.plan;
}

export async function verifyUserAge(payload: {
  documentType: string;
  declaredDob: string;
}): Promise<{ success: boolean; isAgeVerified: boolean; ageGroup: '16-17' | '18-35'; canPlanDates: boolean; privacyNotice: string }> {
  const res = await fetch('/api/verify-age', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
