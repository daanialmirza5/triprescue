import { countryOf, findPlace, normalizeName } from '@/lib/places';

/** Single registry for all destination photography. Components never
 * reference image paths directly - they ask for a destination by name and
 * this module resolves it: exact city -> alias/airport code -> country ->
 * premium generic travel fallback. New destinations only need one line here. */

const base = `${import.meta.env.BASE_URL}images/`;
const dest = (file: string) => `${base}destinations/${file}.jpg`;
const scene = (file: string) => `${base}scenes/${file}.jpg`;

export const destinationImages: Record<string, string> = {
  Mumbai: dest('mumbai'),
  Delhi: dest('delhi'),
  Agra: dest('agra'),
  Jaipur: dest('jaipur'),
  Leh: dest('leh'),
  Goa: dest('goa'),
  Bengaluru: dest('bangalore'),
  Kochi: dest('kerala'),
  Paris: dest('paris'),
  Nice: dest('nice'),
  London: dest('london'),
  Singapore: dest('singapore'),
  'New York': dest('new-york'),
  Dubai: dest('dubai'),
  Tokyo: dest('tokyo'),
  Rome: dest('rome'),
  Barcelona: dest('barcelona'),
  Amsterdam: dest('amsterdam'),
  Zurich: dest('switzerland'),
  Geneva: dest('switzerland'),
};

const countryImages: Record<string, string> = {
  India: dest('delhi-heritage'),
  France: dest('paris'),
  'United Kingdom': dest('london'),
  Singapore: dest('singapore'),
  'United States': dest('new-york'),
  'United Arab Emirates': dest('dubai'),
  Japan: dest('tokyo'),
  Italy: dest('rome'),
  Spain: dest('barcelona'),
  Netherlands: dest('amsterdam'),
  Switzerland: dest('switzerland'),
};

export const FALLBACK_IMAGE = dest('travel');

/** Imagery for booking types (used where a leg has no destination of its own). */
export const sceneImages = {
  flight: scene('flight'),
  train: scene('train'),
  transfer: scene('transfer'),
  hotel: scene('hotel'),
  heroTajMahal: scene('hero-taj-mahal'),
  heroIndiaGate: scene('hero-india-gate'),
  sidebarCoast: scene('sidebar-coast'),
  bannerMountains: scene('banner-mountains'),
} as const;

const normalizedRegistry = new Map(Object.entries(destinationImages).map(([k, v]) => [normalizeName(k), v]));

export function resolveDestinationImage(destination: string | null | undefined): string {
  if (!destination) return FALLBACK_IMAGE;
  const direct = normalizedRegistry.get(normalizeName(destination));
  if (direct) return direct;
  const place = findPlace(destination);
  if (place && destinationImages[place.city]) return destinationImages[place.city];
  const country = place?.country ?? countryOf(destination);
  if (country && countryImages[country]) return countryImages[country];
  return FALLBACK_IMAGE;
}
