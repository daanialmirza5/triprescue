import type { Attraction, ExternalItem, Hotel, LiveTransport, TrainBetween, TravelEvent, TransportStatus } from '@/services/api';
import type { Trip } from '@/types';

/** Adapters from live/discovery objects to the existing trip model, plus small
 * display helpers. Pure functions: nothing here fetches or invents data. */

export const SOURCE_LABEL: Record<string, string> = {
  aviationstack: 'Aviationstack',
  railradar: 'RailRadar',
  openstreetmap: 'OpenStreetMap',
  ticketmaster: 'Ticketmaster',
  internal: 'SafarSathi',
  simulation: 'SafarSathi Demo',
};

export const STATUS_LABEL: Record<TransportStatus, string> = {
  scheduled: 'Scheduled',
  boarding: 'Boarding',
  departed: 'Departed',
  en_route: 'En route',
  arrived: 'Arrived',
  delayed: 'Delayed',
  cancelled: 'Cancelled',
  diverted: 'Diverted',
  unknown: 'Status unknown',
};

const pad = (n: number) => String(n).padStart(2, '0');
/** Naive local ISO (YYYY-MM-DDTHH:mm:00), the format itinerary nodes use. */
export const localIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
const addMinutes = (d: Date, m: number) => new Date(d.getTime() + m * 60_000);

/** Wall-clock part of a provider timestamp ("2026-09-27T08:20:00+05:30" -> 08:20 that day). */
export function wallClock(value: string): string {
  return `${value.slice(0, 16)}:00`;
}

export function timeAgo(iso: string, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds} sec ago`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min ago`;
  if (seconds < 86_400) return `${Math.round(seconds / 3600)} h ago`;
  return `${Math.round(seconds / 86_400)} d ago`;
}

export function formatClock(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return iso.slice(11, 16);
}

/** Trip start as a Date ("12 Sep 2025" or ISO), falling back to today. */
export function tripStartDate(trip: Pick<Trip, 'startDate'>): Date {
  const parsed = new Date(trip.startDate);
  if (!Number.isNaN(parsed.getTime())) return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export function tripDayCount(trip: Pick<Trip, 'startDate' | 'endDate' | 'days'>): number {
  const start = tripStartDate(trip);
  const end = new Date(trip.endDate);
  const span = Number.isNaN(end.getTime()) ? 0 : Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  return Math.max(1, span, trip.days?.length ?? 0);
}

export function dayDate(trip: Pick<Trip, 'startDate'>, day: number): Date {
  const start = tripStartDate(trip);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + (day - 1));
}

export const toDateInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// ---- Adapters -------------------------------------------------------------------------------

export function flightToItem(f: LiveTransport): ExternalItem {
  const start = f.scheduledDeparture ?? f.estimatedDeparture;
  const end = f.scheduledArrival ?? f.estimatedArrival;
  if (!start || !end) throw new Error('This flight has no scheduled times to add it with.');
  if (!f.origin?.code || !f.destination?.code) throw new Error('This flight has no airport codes to add it with.');
  return {
    kind: 'flight',
    source: 'aviationstack',
    externalId: f.externalId,
    title: `${f.number ?? 'Flight'} ${f.origin.code} → ${f.destination.code}`,
    operator: f.operator,
    location: f.origin.name,
    originCode: f.origin.code,
    destinationCode: f.destination.code,
    // Aviationstack reports airport-local wall-clock times.
    scheduledStart: wallClock(start),
    scheduledEnd: wallClock(end),
    lat: f.origin.latitude,
    lng: f.origin.longitude,
  };
}

export function liveTrainToItem(t: LiveTransport): ExternalItem {
  if (!t.scheduledDeparture || !t.scheduledArrival) throw new Error('This train has no timetable to add it with.');
  return {
    kind: 'train',
    source: 'railradar',
    externalId: t.externalId,
    title: `Train ${t.number} ${t.name ?? ''}`.trim(),
    operator: 'Indian Railways',
    location: t.origin?.name ?? null,
    originCode: t.origin?.code ?? null,
    destinationCode: t.destination?.code ?? null,
    scheduledStart: wallClock(t.scheduledDeparture),
    scheduledEnd: wallClock(t.scheduledArrival),
    lat: t.origin?.latitude ?? null,
    lng: t.origin?.longitude ?? null,
  };
}

/** A timetable row from "trains between stations" on the chosen journey date. */
export function betweenTrainToItem(t: TrainBetween, journeyDate: string): ExternalItem {
  if (!t.departureTime || !t.arrivalTime) throw new Error('This train has no timetable to add it with.');
  const [y, m, d] = journeyDate.split('-').map(Number);
  const [dh, dm] = t.departureTime.split(':').map(Number);
  const [ah, am] = t.arrivalTime.split(':').map(Number);
  const depart = new Date(y, m - 1, d, dh, dm);
  const arrive = new Date(y, m - 1, d + t.arrivalDayOffset, ah, am);
  return {
    kind: 'train',
    source: 'railradar',
    externalId: `${t.number}@${journeyDate}`,
    title: `Train ${t.number} ${t.name}`,
    operator: 'Indian Railways',
    location: t.origin.name,
    originCode: t.origin.code,
    destinationCode: t.destination.code,
    scheduledStart: localIso(depart),
    scheduledEnd: localIso(arrive),
  };
}

/** Hotels use the selected check-in / check-out dates (14:00 / 11:00). */
export function hotelToItem(h: Hotel, checkIn: string, checkOut: string): ExternalItem {
  if (checkOut <= checkIn) throw new Error('Check-out must be after check-in.');
  return {
    kind: 'hotel',
    source: 'openstreetmap',
    externalId: h.externalId,
    title: h.name,
    operator: h.name,
    location: h.address ?? h.city ?? h.name,
    scheduledStart: `${checkIn}T14:00:00`,
    scheduledEnd: `${checkOut}T11:00:00`,
    lat: h.latitude,
    lng: h.longitude,
  };
}

/** Attractions go on the chosen trip day, 10:00-12:00. */
export function attractionToItem(a: Attraction, trip: Pick<Trip, 'startDate'>, day: number): ExternalItem {
  const date = dayDate(trip, day);
  return {
    kind: 'attraction',
    source: 'openstreetmap',
    externalId: a.externalId,
    title: a.name,
    location: a.city ? `${a.name}, ${a.city}` : a.name,
    scheduledStart: localIso(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 0)),
    scheduledEnd: localIso(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0)),
    lat: a.latitude,
    lng: a.longitude,
  };
}

export const EVENT_DEFAULT_MINUTES = 120;

/** Events use their own date. Without an announced end time a 2-hour block is
 * reserved; without a start time, the whole announced day is used. */
export function eventToItem(e: TravelEvent): ExternalItem {
  let start: Date;
  let end: Date;
  if (e.startTime) {
    start = new Date(e.startTime);
    end = e.endTime ? new Date(e.endTime) : addMinutes(start, EVENT_DEFAULT_MINUTES);
  } else if (e.startDate) {
    const [y, m, d] = e.startDate.split('-').map(Number);
    start = new Date(y, m - 1, d, 0, 0);
    end = new Date(y, m - 1, d, 23, 59);
  } else {
    throw new Error('This event has no date to add it with.');
  }
  return {
    kind: 'event',
    source: 'ticketmaster',
    externalId: e.externalId,
    title: e.name,
    operator: 'Ticketmaster',
    location: [e.venue, e.city].filter(Boolean).join(', ') || null,
    scheduledStart: localIso(start),
    scheduledEnd: localIso(end),
    lat: e.latitude,
    lng: e.longitude,
  };
}

export const itemKey = (source: string, externalId: string) => `${source}:${externalId}`;

// ---- Live baseline + existing simulation -----------------------------------------------------

export interface LiveBaselineImpact {
  realDelayMinutes: number;
  simulatedDelayMinutes: number;
  totalImpactMinutes: number;
}

/** Real delay (read-only) plus a simulated extra delay. Never mutates `live`. */
export function composeImpact(live: Readonly<Pick<LiveTransport, 'delayMinutes'>>, simulatedExtraMinutes: number): LiveBaselineImpact {
  const real = Math.max(0, live.delayMinutes ?? 0);
  const simulated = Math.max(0, Math.round(simulatedExtraMinutes));
  return { realDelayMinutes: real, simulatedDelayMinutes: simulated, totalImpactMinutes: real + simulated };
}
