import { OutingPlan, PlanStop } from '../types';

export function createGoogleCalendarUrl(params: {
  title: string;
  details: string;
  location: string;
  startDateIso?: string; // YYYYMMDDTHHMMSSZ or basic ISO
  durationHours?: number;
}): string {
  const { title, details, location } = params;

  // Set default to next upcoming Saturday 4 PM if not provided
  const now = new Date();
  const start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  start.setHours(16, 0, 0, 0);

  const durationMs = (params.durationHours || 3) * 60 * 60 * 1000;
  const end = new Date(start.getTime() + durationMs);

  const formatGoogleDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const datesParam = `${formatGoogleDate(start)}/${formatGoogleDate(end)}`;

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', title);
  url.searchParams.set('details', details);
  url.searchParams.set('location', location);
  url.searchParams.set('dates', datesParam);

  return url.toString();
}

export function createPlanCalendarUrl(plan: OutingPlan): string {
  const scheduleText = plan.timeline
    .map(s => `• ${s.time}: ${s.name} (${s.category})\n  Address: ${s.address}\n  Details: ${s.description}\n  Maps: ${s.googleMapsUrl}`)
    .join('\n\n');

  const fullDetails = `${plan.tagline}\n\nEstimated Budget: ${plan.costPerPerson} per person\nDuration: ${plan.durationHours} hours\n\nITINERARY:\n${scheduleText}\n\nPro Tips:\n${plan.proTips.map(p => '- ' + p).join('\n')}\n\nCreated with OUTZI.AI (AI Real-World Outing Planner)`;

  const mainLocation = `${plan.area}, ${plan.city}, India`;

  return createGoogleCalendarUrl({
    title: `OUTZI.AI Outing: ${plan.title}`,
    details: fullDetails,
    location: mainLocation,
    durationHours: plan.durationHours,
  });
}

export function createStopCalendarUrl(stop: PlanStop, planCity: string): string {
  return createGoogleCalendarUrl({
    title: `${stop.name} (${stop.time})`,
    details: `${stop.description}\n\nCategory: ${stop.category}\nApprox Cost: ₹${stop.approxCostPerPerson}\nHighlights: ${stop.highlights.join(', ')}\n\nNavigation: ${stop.googleMapsUrl}`,
    location: `${stop.address || stop.area + ', ' + planCity}`,
    durationHours: 1.5,
  });
}
