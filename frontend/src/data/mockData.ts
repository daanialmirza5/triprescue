import type { DisruptionType, TravelerPreferences } from '@/types';

/** Static catalogues imported at runtime: `disruptionTypes` (the disruption
 * picker's catalogue), `defaultPreferences` (AppContext's pre-load fallback) and
 * `nodePositions` (the hand-tuned Ladakh graph layout; ItineraryGraph falls back
 * to `graphLayout.ts`'s auto-layout for any node set this doesn't cover). Trip,
 * booking and recovery data always come from the backend. */

export const disruptionTypes: DisruptionType[] = [
  { id: 'flight-delay', label: 'Flight Delay', description: 'Delay an existing flight by a specified duration', icon: 'clock' },
  { id: 'flight-cancellation', label: 'Flight Cancellation', description: 'Cancel a flight entirely', icon: 'x-circle' },
  { id: 'missed-connection', label: 'Missed Connection', description: 'Simulate a missed connection between flights', icon: 'link-x' },
  { id: 'hotel-conflict', label: 'Hotel Check-in Conflict', description: 'Create a hotel check-in timing conflict', icon: 'bed' },
  { id: 'hotel-cancellation', label: 'Hotel Cancellation', description: 'The hotel cancels the reservation entirely', icon: 'bed' },
  { id: 'transfer-failure', label: 'Transfer Failure', description: 'The airport transfer fails to arrive', icon: 'link-x' },
  { id: 'activity-cancellation', label: 'Activity Cancellation', description: 'Cancel a booked activity or tour', icon: 'calendar-x' },
  { id: 'activity-delay', label: 'Activity Delay', description: 'Delay a booked activity or tour', icon: 'clock' },
  { id: 'airport-closure', label: 'Airport Closure', description: 'Simulate an airport closure event', icon: 'plane-landing' },
  { id: 'weather-disruption', label: 'Weather Disruption', description: 'Severe weather forces cancellation of an outdoor activity', icon: 'cloud-lightning' },
];

export const defaultPreferences: TravelerPreferences = {
  costVsSpeed: 50,
  disruptionVsComfort: 50,
  recoveryPriorities: {
    minimizeCost: false,
    minimizeTime: false,
    minimizeDisruption: true,
    maximizeComfort: false,
  },
};

export const nodePositions: Record<string, { x: number; y: number }> = {
  'bom-del': { x: 0, y: 0 },
  'del-connection': { x: 300, y: 0 },
  'del-leh': { x: 600, y: 0 },
  'airport-transfer': { x: 900, y: -70 },
  'grand-dragon': { x: 1200, y: 0 },
  'pangong-tour': { x: 1500, y: -150 },
  'nubra-valley': { x: 1500, y: 90 },
  'leh-return': { x: 1200, y: 240 },
};
