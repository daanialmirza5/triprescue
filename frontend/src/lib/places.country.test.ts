import { describe, expect, it } from 'vitest';
import { countryOf, normalizeName, placeCode } from './places';

describe('place names', () => {
  it('strips codes, terminals and station words', () => {
    expect(normalizeName('Delhi (DEL) T3')).toBe('delhi');
    expect(normalizeName('Agra Cantt Railway Station')).toBe('agra');
    expect(normalizeName('Indira Gandhi International Airport')).toBe('indira gandhi');
  });

  it('works out the country from a city, alias or country name', () => {
    expect(countryOf('Mumbai')).toBe('India');
    expect(countryOf('Changi')).toBe('Singapore');
    expect(countryOf('UK')).toBe('United Kingdom');
    expect(countryOf('Trip to Japan')).toBe('Japan');
    expect(countryOf('Nowhere')).toBeUndefined();
    expect(countryOf(undefined)).toBeUndefined();
  });

  it('gives the main airport code for a place', () => {
    expect(placeCode('Bangalore')).toBe('BLR');
    expect(placeCode('LGW')).toBe('LHR');
    expect(placeCode('Atlantis')).toBeUndefined();
  });
});
