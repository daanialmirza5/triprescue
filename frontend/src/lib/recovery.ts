import type { ItineraryNodeData, RecoveryOption, TravelerPreferences, Trip } from '@/types';
import { nodeKind, parseDate, parseEndpoints, type LegMode } from '@/lib/journey';

/** Presentation helpers for backend recovery options. */

export type Priority = 'sooner' | 'cost' | 'comfort';

export const priorityPresets: Record<Priority, (p: TravelerPreferences) => TravelerPreferences> = {
  sooner: (p) => ({ ...p, costVsSpeed: 85, disruptionVsComfort: 35, recoveryPriorities: { minimizeCost: false, minimizeTime: true, minimizeDisruption: true, maximizeComfort: false } }),
  cost: (p) => ({ ...p, costVsSpeed: 15, disruptionVsComfort: 35, recoveryPriorities: { minimizeCost: true, minimizeTime: false, minimizeDisruption: true, maximizeComfort: false } }),
  comfort: (p) => ({ ...p, costVsSpeed: 50, disruptionVsComfort: 85, recoveryPriorities: { minimizeCost: false, minimizeTime: false, minimizeDisruption: false, maximizeComfort: true } }),
};

export function priorityOf(p: TravelerPreferences): Priority {
  if (p.recoveryPriorities.maximizeComfort || p.disruptionVsComfort >= 70) return 'comfort';
  if (p.recoveryPriorities.minimizeCost || p.costVsSpeed <= 40) return 'cost';
  return 'sooner';
}

/** Ranks feasible options for the chosen priority. The backend score already
 * reflects saved preferences; the breakdown term breaks ties instantly while
 * a re-ranking request is in flight. */
export function rankOptions(options: RecoveryOption[], priority: Priority): RecoveryOption[] {
  const key = priority === 'sooner' ? 'speed' : priority === 'cost' ? 'cost' : 'comfort';
  return options
    .filter((o) => o.feasible !== false)
    .sort((a, b) => b.score - a.score || b.scoreBreakdown[key] - a.scoreBreakdown[key]);
}

export type BadgeTone = 'safe' | 'ai' | 'risk' | 'brand';

export function optionBadge(option: RecoveryOption, rankIndex: number): { label: string; tone: BadgeTone } {
  if (rankIndex === 0) return { label: 'Recommended', tone: 'safe' };
  const tag = option.tag.toLowerCase();
  if (option.tagColor === 'violet' || /save|cheap|cost/.test(tag) || option.costDelta <= 0) return { label: option.tagColor === 'violet' ? option.tag : 'Save More', tone: 'ai' };
  if (option.tagColor === 'amber' || /comfort|premium/.test(tag)) return { label: option.tag.includes('Comfort') ? option.tag : 'More Comfort', tone: 'risk' };
  return { label: titleCase(option.tag), tone: 'brand' };
}

function titleCase(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface OptionRoute {
  from: string;
  to: string;
  mode: LegMode;
  depart?: Date;
  arrive?: Date;
  node?: ItineraryNodeData;
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** The leg a plan rebooks, with its new departure/arrival where derivable. */
export function optionRoute(option: RecoveryOption, trip: Trip): OptionRoute | null {
  const change = option.changes.find((c) => c.changeType === 'rebooked' || c.changeType === 'rescheduled' || c.changeType === 'new') ?? option.changes[0];
  if (!change) return null;
  const node = trip.nodes.find((n) => n.id === change.nodeId);
  if (!node) return null;
  const ends = parseEndpoints(node);
  const text = `${change.description} ${option.description}`;
  const departMatch = text.match(/(?:departing|moved to)\s+(?:(\d{1,2}) (\w{3}), )?(\d{1,2}):(\d{2})/i);
  const baseStart = parseDate(node.scheduledStart);
  const baseEnd = parseDate(node.scheduledEnd);
  let depart: Date | undefined;
  if (departMatch && baseStart) {
    depart = new Date(baseStart);
    const [, day, month, hh, mm] = departMatch;
    if (day && month) {
      const monthIndex = MONTHS.indexOf(month.slice(0, 3).toLowerCase());
      if (monthIndex >= 0) depart.setMonth(monthIndex, Number(day));
    }
    depart.setHours(Number(hh), Number(mm), 0, 0);
  }
  const arrive = baseEnd ? new Date(baseEnd.getTime() + option.timeImpactMinutes * 60_000) : undefined;
  // A bare "departing 07:00" whose arrival lands the following day (e.g.
  // "next available ... (next day)") departs on that later day too.
  if (depart && arrive && !departMatch?.[1]) {
    while (arrive.getTime() - depart.getTime() > 16 * 3_600_000) depart.setDate(depart.getDate() + 1);
  }
  const mode: LegMode = /\b(flight|airline|indigo|air india|vistara|air|6E|AI \d)/i.test(change.description) && nodeKind(node) !== 'flight'
    ? 'flight'
    : /\b(car|chauffeur|cab|taxi|transfer)\b/i.test(change.description)
      ? 'transfer'
      : ((k) => (k === 'flight' || k === 'train' || k === 'transfer' ? k : 'transfer'))(nodeKind(node));
  return { from: ends?.from ?? node.location, to: ends?.to ?? trip.destination, mode, depart, arrive, node };
}

export function whyBullets(option: RecoveryOption): string[] {
  const useful = option.changes.filter((c) => c.description && !/^Unaffected by this recovery\.?$/i.test(c.description));
  // The rebooking itself is already shown as the plan's route row.
  const supporting = useful.filter((c) => c.changeType !== 'rebooked');
  const bullets = (supporting.length ? supporting : useful).map((c) => c.description);
  if (option.providerReason) bullets.push(option.providerReason);
  if (bullets.length === 0) bullets.push(option.description);
  return Array.from(new Set(bullets)).slice(0, 3);
}
