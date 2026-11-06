import { findPlace } from '@/lib/places';

/** Resolves a free-text location ("Fort Road, Leh", "Hôtel Negresco, Nice")
 * to coordinates so custom hotels and activities get a pin on the itinerary
 * map. Known cities resolve instantly from the local place registry; anything
 * else goes to Open-Meteo's free, key-less geocoder. Never throws - a location
 * that can't be resolved simply has no pin. */

export interface GeoPoint {
  lat: number;
  lng: number;
  /** Human-readable match, e.g. "Leh, India". */
  label: string;
  source: 'registry' | 'open-meteo';
}

const GEOCODER_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const TIMEOUT_MS = 4000;
const cache = new Map<string, GeoPoint | null>();

interface OpenMeteoResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

async function lookupRemote(term: string): Promise<GeoPoint | null> {
  if (typeof fetch === 'undefined') return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url = `${GEOCODER_URL}?name=${encodeURIComponent(term)}&count=1&language=en&format=json`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    const data = (await response.json()) as { results?: OpenMeteoResult[] };
    const hit = data.results?.[0];
    if (!hit || !Number.isFinite(hit.latitude) || !Number.isFinite(hit.longitude)) return null;
    return { lat: hit.latitude, lng: hit.longitude, label: [hit.name, hit.admin1, hit.country].filter(Boolean).join(', '), source: 'open-meteo' };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Candidate search terms, most specific first: "Fort Road, Leh" -> ["Fort Road, Leh", "Leh", "Fort Road"]. */
export function geocodeCandidates(location: string): string[] {
  const parts = location.split(',').map((p) => p.trim()).filter(Boolean);
  const terms = [location.trim(), ...parts.slice().reverse()];
  return Array.from(new Set(terms.filter((t) => t.length >= 2)));
}

export async function geocodeLocation(location: string, opts: { remote?: boolean } = {}): Promise<GeoPoint | null> {
  const key = location.trim().toLowerCase();
  if (!key) return null;
  if (cache.has(key)) return cache.get(key) ?? null;

  // 1. Local registry: instant and offline (city-level precision).
  const place = findPlace(location);
  if (place) {
    const point: GeoPoint = { lat: place.lat, lng: place.lng, label: `${place.city}, ${place.country}`, source: 'registry' };
    cache.set(key, point);
    return point;
  }

  // 2. Remote geocoder: the full text first, then each comma-separated part.
  if (opts.remote !== false) {
    for (const term of geocodeCandidates(location)) {
      const point = await lookupRemote(term);
      if (point) {
        cache.set(key, point);
        return point;
      }
    }
  }
  cache.set(key, null);
  return null;
}

/** Spread into a node-create payload: adds lat/lng only when resolved. */
export async function coordinatesFor(location: string): Promise<{ lat?: number; lng?: number }> {
  const point = await geocodeLocation(location);
  return point ? { lat: Number(point.lat.toFixed(5)), lng: Number(point.lng.toFixed(5)) } : {};
}
