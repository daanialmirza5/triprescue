import type { Disruption, ItineraryNodeData, NodeStatus, Trip } from '@/types';
import { findPlace, normalizeName } from '@/lib/places';

/** Normalizes a backend Trip (a dependency graph of itinerary nodes) into the
 * shape the UI draws: an ordered list of city stops joined by transport legs,
 * plus stays, activities and derived impact counts. Pure functions only, so
 * every page renders the same journey from the same data. */

export type LegMode = 'flight' | 'train' | 'transfer';
export type NodeKind = LegMode | 'hotel' | 'activity' | 'connection';

export interface JourneyLeg {
  node: ItineraryNodeData;
  mode: LegMode;
  from: string;
  to: string;
  fromCode?: string;
  toCode?: string;
  status: NodeStatus;
  delayMinutes: number;
  start?: Date;
  end?: Date;
}

export interface JourneyStop {
  city: string;
  code?: string;
  lat?: number;
  lng?: number;
  status: NodeStatus;
  role: 'origin' | 'via' | 'destination';
  time?: Date;
}

export interface Journey {
  stops: JourneyStop[];
  legs: JourneyLeg[];
  stays: ItineraryNodeData[];
  activities: ItineraryNodeData[];
}

const TRAIN_RE = /\b(train|rail|railway|express|shatabdi|rajdhani|vande bharat|irctc|eurostar|tgv)\b/i;
const ARROW_RE = /\s*(?:→|->|—>|\bto\b)\s*/i;
const TRAILING_NOISE_RE = /\b(transfer|train|flight|express|bus|cab|shuttle|ferry|journey|return|trip)\b/gi;

export function nodeKind(node: Pick<ItineraryNodeData, 'category' | 'title' | 'subtitle' | 'provider' | 'icon'>): NodeKind {
  const text = `${node.title} ${node.subtitle} ${node.provider}`;
  switch (node.category) {
    case 'train':
      return 'train';
    case 'flight':
      return 'flight';
    case 'return':
      return node.icon === 'plane' ? 'flight' : TRAIN_RE.test(text) ? 'train' : 'transfer';
    case 'transfer':
      return TRAIN_RE.test(text) ? 'train' : 'transfer';
    case 'hotel':
      return 'hotel';
    case 'connection':
      return 'connection';
    default:
      return 'activity';
  }
}

function cleanEndpoint(raw: string): string {
  return raw.replace(/\(.*?\)/g, '').replace(TRAILING_NOISE_RE, '').replace(/\s+/g, ' ').trim();
}

/** "Mumbai → Delhi" / "BOM → DEL" / "Jaipur → Agra Transfer" -> endpoints. */
export function parseEndpoints(node: Pick<ItineraryNodeData, 'title' | 'subtitle' | 'label'>): { from: string; to: string; fromCode?: string; toCode?: string } | null {
  const codes = node.label.match(/^\s*([A-Z]{3})\s*(?:→|->)\s*([A-Z]{3})\s*$/);
  for (const text of [node.title, node.subtitle, node.label]) {
    const parts = text.split(ARROW_RE).map(cleanEndpoint).filter(Boolean);
    if (parts.length >= 2) {
      const from = parts[0];
      const to = parts[parts.length - 1];
      if (/\b(airport|hotel|resort|station)\b/i.test(`${from} ${to}`) && !findPlace(to)) continue;
      const fromPlace = findPlace(from);
      const toPlace = findPlace(to);
      return {
        from: fromPlace?.city ?? from,
        to: toPlace?.city ?? to,
        fromCode: codes?.[1] ?? fromPlace?.code,
        toCode: codes?.[2] ?? toPlace?.code,
      };
    }
  }
  return null;
}

export function parseDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function legDelayMinutes(node: ItineraryNodeData, disruption?: Disruption | null): number {
  const scheduled = parseDate(node.scheduledEnd);
  const actual = parseDate(node.actualEnd ?? undefined);
  if (scheduled && actual) {
    const diff = Math.round((actual.getTime() - scheduled.getTime()) / 60000);
    if (diff > 0) return diff;
  }
  if (disruption && disruption.primaryNodeId === node.id && disruption.delayMinutes) return disruption.delayMinutes;
  return 0;
}

function samePlace(a: string, b: string): boolean {
  const pa = findPlace(a)?.city;
  const pb = findPlace(b)?.city;
  if (pa && pb) return pa === pb;
  const na = normalizeName(a);
  const nb = normalizeName(b);
  return na === nb || na.includes(nb) || nb.includes(na);
}

function toLeg(node: ItineraryNodeData, disruption?: Disruption | null): JourneyLeg | null {
  const kind = nodeKind(node);
  if (kind !== 'flight' && kind !== 'train' && kind !== 'transfer') return null;
  const ends = parseEndpoints(node);
  if (!ends || samePlace(ends.from, ends.to)) return null;
  return {
    node,
    mode: kind,
    ...ends,
    status: node.status,
    delayMinutes: legDelayMinutes(node, disruption),
    start: parseDate(node.actualStart ?? node.scheduledStart),
    end: parseDate(node.actualEnd ?? node.scheduledEnd),
  };
}

function coordsFor(city: string, nodes: ItineraryNodeData[]): { lat?: number; lng?: number; code?: string } {
  const place = findPlace(city);
  if (place) return { lat: place.lat, lng: place.lng, code: place.code };
  const node = nodes.find((n) => n.lat != null && n.lng != null && samePlace(n.location, city));
  return { lat: node?.lat, lng: node?.lng };
}

export function routeCities(trip: Pick<Trip, 'route' | 'origin' | 'destination'>): string[] {
  const fromRoute = trip.route.split(/→|->/).map((s) => s.trim()).filter(Boolean);
  if (fromRoute.length >= 2) return fromRoute;
  return [trip.origin, trip.destination].filter(Boolean);
}

export function buildJourney(trip: Trip, disruption?: Disruption | null): Journey {
  const outbound = trip.nodes.filter((n) => n.category !== 'return');
  const candidates = outbound.map((n) => toLeg(n, disruption)).filter((l): l is JourneyLeg => l !== null);
  const cities = routeCities(trip);
  const legs: JourneyLeg[] = [];
  const used = new Set<string>();

  for (let i = 0; i < cities.length - 1; i++) {
    const match =
      candidates.find((l) => !used.has(l.node.id) && samePlace(l.from, cities[i]) && samePlace(l.to, cities[i + 1])) ??
      candidates.find((l) => !used.has(l.node.id) && samePlace(l.to, cities[i + 1]));
    if (match) {
      used.add(match.node.id);
      legs.push(match);
    }
  }
  // Trips whose route string doesn't describe their legs: fall back to leg order.
  const stopCities = legs.length === cities.length - 1 ? cities : chainFromLegs(candidates, cities);
  const chain = legs.length === cities.length - 1 ? legs : candidates.slice(0, Math.max(0, stopCities.length - 1));

  const stops: JourneyStop[] = stopCities.map((city, i) => {
    const incoming = i > 0 ? chain[i - 1] : undefined;
    const outgoing = chain[i];
    const place = findPlace(city);
    const coords = coordsFor(city, trip.nodes);
    const code = i === 0 ? outgoing?.fromCode ?? coords.code : incoming?.toCode ?? coords.code;
    return {
      city: place?.city ?? city,
      code,
      lat: coords.lat,
      lng: coords.lng,
      role: i === 0 ? 'origin' : i === stopCities.length - 1 ? 'destination' : 'via',
      status: i === 0 ? originStatus(outgoing) : incoming?.status ?? 'healthy',
      time: i === 0 ? outgoing?.start : incoming?.end,
    };
  });

  return {
    stops,
    legs: chain,
    stays: trip.nodes.filter((n) => n.category === 'hotel'),
    activities: trip.nodes.filter((n) => n.category === 'activity'),
  };
}

function originStatus(outgoing?: JourneyLeg): NodeStatus {
  if (!outgoing) return 'healthy';
  return outgoing.status === 'cancelled' ? 'cancelled' : outgoing.status === 'recovered' ? 'recovered' : 'healthy';
}

function chainFromLegs(legs: JourneyLeg[], fallback: string[]): string[] {
  if (legs.length === 0) return fallback;
  return [legs[0].from, ...legs.map((l) => l.to)];
}

export const isAffected = (status: NodeStatus) => status === 'delayed' || status === 'at-risk' || status === 'broken' || status === 'cancelled';

export interface ImpactCounts {
  flightsDelayed: number;
  connectionsAtRisk: number;
  hotelsImpacted: number;
  affectedLegs: number;
  bookable: number;
  healthyBookable: number;
}

export function impactCounts(trip: Trip): ImpactCounts {
  let flightsDelayed = 0;
  let connectionsAtRisk = 0;
  let hotelsImpacted = 0;
  let bookable = 0;
  let healthyBookable = 0;
  for (const node of trip.nodes) {
    const kind = nodeKind(node);
    const affected = isAffected(node.status);
    if (kind !== 'connection') {
      bookable += 1;
      if (!affected) healthyBookable += 1;
    }
    if (!affected) continue;
    if (kind === 'flight') flightsDelayed += 1;
    else if (kind === 'hotel') hotelsImpacted += 1;
    else if (kind === 'train' || kind === 'transfer') connectionsAtRisk += 1;
  }
  return { flightsDelayed, connectionsAtRisk, hotelsImpacted, affectedLegs: trip.nodes.filter((n) => isAffected(n.status)).length, bookable, healthyBookable };
}

/** "Leisure Trip" / "Work Trip" / "International Trip" chip for a trip. */
export function tripType(trip: Pick<Trip, 'name' | 'route' | 'origin' | 'destination'>): string {
  if (/\b(work|business|conference|client|office|summit)\b/i.test(trip.name)) return 'Work Trip';
  const countries = new Set(routeCities(trip).map((c) => findPlace(c)?.country).filter(Boolean));
  if (countries.size > 1) return 'International Trip';
  return 'Leisure Trip';
}

export type TripPhaseLabel = 'disrupted' | 'recovered' | 'upcoming' | 'confirmed' | 'in-progress' | 'completed';

/** Where a trip is in its lifecycle, from backend status plus its dates. */
export function tripLifecycle(trip: Pick<Trip, 'status' | 'startDate' | 'endDate'>, now = new Date()): TripPhaseLabel {
  if (trip.status === 'disrupted' || trip.status === 'recovering') return 'disrupted';
  const start = parseDate(trip.startDate);
  const end = parseDate(trip.endDate);
  if (end && end.getTime() + 86_400_000 < now.getTime()) return 'completed';
  if (trip.status === 'recovered') return 'recovered';
  if (start && start.getTime() <= now.getTime()) return 'in-progress';
  if (start && start.getTime() - now.getTime() < 14 * 86_400_000) return 'upcoming';
  return 'confirmed';
}

export function daysUntil(dateRaw: string, now = new Date()): number | null {
  const d = parseDate(dateRaw);
  if (!d) return null;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

export const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Trips whose date range includes the given calendar day. */
export function tripsOnDay<T extends Pick<Trip, 'startDate' | 'endDate'>>(trips: T[], day: Date): T[] {
  const t = startOfDay(day).getTime();
  return trips.filter((trip) => {
    const s = parseDate(trip.startDate);
    const e = parseDate(trip.endDate);
    return !!s && !!e && startOfDay(s).getTime() <= t && t <= startOfDay(e).getTime();
  });
}

// ---- Formatting ------------------------------------------------------------

export function formatTime(date?: Date): string {
  if (!date) return '—';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDay(date?: Date): string {
  if (!date) return '';
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function formatDateRange(startRaw: string, endRaw: string): string {
  const start = parseDate(startRaw);
  const end = parseDate(endRaw);
  if (!start || !end) return [startRaw, endRaw].filter(Boolean).join(' – ');
  const year = end.getFullYear();
  return `${formatDay(start)} – ${formatDay(end)} ${year}`;
}

export function formatMinutes(minutes: number): string {
  const sign = minutes < 0 ? '-' : '';
  const abs = Math.abs(Math.round(minutes));
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h === 0) return `${sign}${m} min`;
  return `${sign}${h}h${m ? ` ${m}m` : ''}`;
}

export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function durationBetween(start?: Date, end?: Date): string | null {
  if (!start || !end) return null;
  return formatMinutes((end.getTime() - start.getTime()) / 60000);
}
