export type AgeGroup = '16-17' | '18-35' | '36+';

export type PlanIntent = 'friends' | 'solo' | 'date' | 'event' | 'explore' | 'other';

export type VibeType = 
  | 'chill_talk'
  | 'foodie'
  | 'entertainment'
  | 'peaceful'
  | 'adventure'
  | 'explore_photos'
  | 'something_different';

export type PersonalityType =
  | 'Chill'
  | 'Adventurous'
  | 'Foodie'
  | 'Social'
  | 'Introvert'
  | 'Explorer'
  | 'Romantic'
  | 'Budget-conscious';

export interface UserProfile {
  id: string;
  googleUserId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  ageGroup: AgeGroup;
  isAgeVerified: boolean;
  city: string;
  personalityPreferences: PersonalityType[];
  preferredTravelDistanceKm: number;
  notificationPreferences: {
    upcomingPlans: boolean;
    eventAlerts: boolean;
    pushEnabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SupportedCity {
  id: string;
  name: string;
  state: string;
  popularAreas: string[];
  active: boolean;
  isPopular?: boolean;
}

export interface ConfigurableQuestion {
  id: string;
  key: string;
  question: string;
  subtext?: string;
  type: 'single_select' | 'multi_select' | 'text' | 'range' | 'time_select';
  options: { label: string; value: string; minAge?: number; icon?: string }[];
  order: number;
  priority: 'required' | 'recommended' | 'optional';
  active: boolean;
}

export interface PlanStop {
  id: string;
  time: string;
  name: string;
  area: string;
  category: 'Food & Drinks' | 'Activity & Fun' | 'Culture & Sightseeing' | 'Nature & Chill' | 'Nightlife & Social';
  address: string;
  approxCostPerPerson: number;
  transitToNext?: {
    mode: 'walk' | 'auto/cab' | 'metro';
    durationMin: number;
    distanceKm: number;
    note?: string;
  };
  description: string;
  highlights: string[];
  verificationStatus: 'verified_real_place' | 'partner_confirmed' | 'needs_visitor_check';
  verificationNote?: string;
  googleMapsQuery: string;
  googleMapsUrl: string;
}

export interface OutingPlan {
  id: string;
  title: string;
  tagline: string;
  city: string;
  area: string;
  intent: PlanIntent;
  date: string;
  startTime: string;
  durationHours: number;
  groupSize: string;
  vibe: string;
  totalCostRange: string;
  costPerPerson: string;
  timeline: PlanStop[];
  whyThisPlan: {
    budgetFit: string;
    vibeFit: string;
    logisticsFit: string;
    groupFit: string;
  };
  proTips: string[];
  alternatives?: {
    id: string;
    title: string;
    concept: string;
    difference: string;
    costPerPerson: string;
    timelineSummary: { time: string; name: string; activity: string }[];
  }[];
  createdAt: string;
}

export interface SavedPlace {
  id: string;
  userId: string;
  name: string;
  city: string;
  area: string;
  category: string;
  address: string;
  googleMapsUrl: string;
  savedAt: string;
  note?: string;
}

export interface EventItem {
  id: string;
  title: string;
  city: string;
  venue: string;
  area: string;
  category: 'Concert' | 'Workshop' | 'Sports' | 'Festival' | 'Exhibition' | 'Stand-up' | 'Community' | 'College Event' | 'Heritage Walk';
  date: string;
  time: string;
  priceText: string;
  description: string;
  verificationStatus: 'verified_organizer' | 'public_schedule_verified';
  tags: string[];
  sourceUrl?: string;
}

export interface AdminProductConfig {
  datePlanningMinAge: number;
  strictServerAgeCheck: boolean;
  kycVerificationServiceActive: boolean;
  enableGoogleCalendarSync: boolean;
  enablePushNotifications: boolean;
  maxTravelRadiusKm: number;
}
