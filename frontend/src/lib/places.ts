/** Geographic reference data for cities and airports the UI needs to place on
 * the map or match to imagery. Backend nodes carry free-text locations
 * ("Delhi (DEL) T3", "Leh (IXL)", "Mumbai → Delhi"), so everything here is
 * keyed by a normalized city name with IATA codes and aliases pointing at it. */

export interface Place {
  city: string;
  country: string;
  code?: string;
  lat: number;
  lng: number;
  aliases?: string[];
  /** Extra airport codes that serve the same city. */
  codes?: string[];
}

const PLACES: Place[] = [
  { city: 'Mumbai', country: 'India', code: 'BOM', lat: 19.0896, lng: 72.8656, aliases: ['bombay', 'navi mumbai'] },
  { city: 'Delhi', country: 'India', code: 'DEL', lat: 28.5562, lng: 77.1, aliases: ['new delhi', 'ndls'] },
  { city: 'Agra', country: 'India', code: 'AGR', lat: 27.1767, lng: 78.0081, aliases: ['agc', 'agra cantt'], codes: ['AGC'] },
  { city: 'Jaipur', country: 'India', code: 'JAI', lat: 26.9124, lng: 75.7873, aliases: ['pink city'] },
  { city: 'Leh', country: 'India', code: 'IXL', lat: 34.1526, lng: 77.5771, aliases: ['ladakh', 'leh ladakh', 'pangong', 'pangong tso', 'nubra', 'nubra valley'] },
  { city: 'Goa', country: 'India', code: 'GOI', lat: 15.38, lng: 73.831, aliases: ['panjim', 'panaji', 'candolim', 'grande island', 'mopa'], codes: ['GOX'] },
  { city: 'Bengaluru', country: 'India', code: 'BLR', lat: 13.1986, lng: 77.7066, aliases: ['bangalore'] },
  { city: 'Chennai', country: 'India', code: 'MAA', lat: 12.9941, lng: 80.1709, aliases: ['madras'] },
  { city: 'Kolkata', country: 'India', code: 'CCU', lat: 22.6547, lng: 88.4467, aliases: ['calcutta'] },
  { city: 'Hyderabad', country: 'India', code: 'HYD', lat: 17.2403, lng: 78.4294 },
  { city: 'Kochi', country: 'India', code: 'COK', lat: 10.152, lng: 76.4019, aliases: ['cochin', 'kerala', 'alleppey', 'munnar'] },
  { city: 'Udaipur', country: 'India', code: 'UDR', lat: 24.6177, lng: 73.8961 },
  { city: 'Varanasi', country: 'India', code: 'VNS', lat: 25.4524, lng: 82.8593, aliases: ['banaras', 'kashi'] },
  { city: 'Paris', country: 'France', code: 'CDG', lat: 49.0097, lng: 2.5479, codes: ['ORY'] },
  { city: 'Nice', country: 'France', code: 'NCE', lat: 43.6584, lng: 7.2159, aliases: ['cote d azur', 'french riviera'] },
  { city: 'London', country: 'United Kingdom', code: 'LHR', lat: 51.47, lng: -0.4543, codes: ['LGW', 'STN', 'LCY'] },
  { city: 'Singapore', country: 'Singapore', code: 'SIN', lat: 1.3644, lng: 103.9915, aliases: ['changi', 'marina bay'] },
  { city: 'New York', country: 'United States', code: 'JFK', lat: 40.6413, lng: -73.7781, aliases: ['nyc', 'manhattan', 'new york city'], codes: ['EWR', 'LGA'] },
  { city: 'San Francisco', country: 'United States', code: 'SFO', lat: 37.6213, lng: -122.379 },
  { city: 'Dubai', country: 'United Arab Emirates', code: 'DXB', lat: 25.2532, lng: 55.3657 },
  { city: 'Tokyo', country: 'Japan', code: 'HND', lat: 35.5494, lng: 139.7798, codes: ['NRT'] },
  { city: 'Rome', country: 'Italy', code: 'FCO', lat: 41.8003, lng: 12.2389, aliases: ['roma'] },
  { city: 'Barcelona', country: 'Spain', code: 'BCN', lat: 41.2974, lng: 2.0833 },
  { city: 'Amsterdam', country: 'Netherlands', code: 'AMS', lat: 52.3105, lng: 4.7683 },
  { city: 'Zurich', country: 'Switzerland', code: 'ZRH', lat: 47.4582, lng: 8.5555, aliases: ['zürich', 'interlaken', 'lucerne', 'swiss alps'] },
  { city: 'Geneva', country: 'Switzerland', code: 'GVA', lat: 46.2381, lng: 6.109 },
];

export const COUNTRY_ALIASES: Record<string, string> = {
  uk: 'United Kingdom', england: 'United Kingdom', britain: 'United Kingdom',
  usa: 'United States', us: 'United States', america: 'United States',
  uae: 'United Arab Emirates', switzerland: 'Switzerland', swiss: 'Switzerland',
  holland: 'Netherlands', japan: 'Japan', italy: 'Italy', spain: 'Spain', france: 'France', india: 'India',
};

export function normalizeName(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, ' ')
    .replace(/\b(airport|intl|international|terminal|t\d|railway|station|junction|cantt?)\b/g, ' ')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const byKey = new Map<string, Place>();
const byCode = new Map<string, Place>();
for (const place of PLACES) {
  byKey.set(normalizeName(place.city), place);
  place.aliases?.forEach((a) => byKey.set(normalizeName(a), place));
  if (place.code) byCode.set(place.code, place);
  place.codes?.forEach((c) => byCode.set(c, place));
}

/** Resolves free text ("Delhi (DEL) T3", "BOM", "Pangong Tso") to a known place. */
export function findPlace(raw: string | null | undefined): Place | undefined {
  if (!raw) return undefined;
  const codeInParens = raw.match(/\(([A-Z]{3})\)/)?.[1];
  if (codeInParens && byCode.has(codeInParens)) return byCode.get(codeInParens);
  const trimmed = raw.trim();
  if (/^[A-Z]{3}$/.test(trimmed) && byCode.has(trimmed)) return byCode.get(trimmed);
  const key = normalizeName(raw);
  if (!key) return undefined;
  if (byKey.has(key)) return byKey.get(key);
  // Multi-word text like "leh airport transfer" or "taj hotel agra": try each word run.
  const words = key.split(' ');
  for (let size = Math.min(3, words.length); size >= 1; size--) {
    for (let i = 0; i + size <= words.length; i++) {
      const hit = byKey.get(words.slice(i, i + size).join(' '));
      if (hit) return hit;
    }
  }
  return undefined;
}

export function countryOf(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const place = findPlace(raw);
  if (place) return place.country;
  const key = normalizeName(raw);
  if (COUNTRY_ALIASES[key]) return COUNTRY_ALIASES[key];
  return Object.values(COUNTRY_ALIASES).find((country) => key.includes(normalizeName(country)));
}

export function placeCode(raw: string | null | undefined): string | undefined {
  return findPlace(raw)?.code;
}
