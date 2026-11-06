import { describe, expect, it } from 'vitest';
import { findPlace } from './places';

describe('findPlace', () => {
  it('resolves an IATA code in brackets before reading the text', () => {
    expect(findPlace('Delhi (DEL) T3')?.city).toBe('Delhi');
    expect(findPlace('Somewhere (IXL)')?.city).toBe('Leh');
  });

  it('resolves bare airport codes, including secondary ones', () => {
    expect(findPlace('BOM')?.city).toBe('Mumbai');
    expect(findPlace('GOX')?.city).toBe('Goa');
    expect(findPlace('NRT')?.city).toBe('Tokyo');
  });

  it('matches old city names and nearby areas', () => {
    expect(findPlace('Bombay')?.city).toBe('Mumbai');
    expect(findPlace('Pangong Tso')?.city).toBe('Leh');
    expect(findPlace('Zürich')?.city).toBe('Zurich');
  });

  it('finds a city inside longer booking text', () => {
    expect(findPlace('Leh airport transfer')?.city).toBe('Leh');
    expect(findPlace('Taj Hotel Agra')?.city).toBe('Agra');
  });

  it('returns nothing for unknown or empty text', () => {
    expect(findPlace('Atlantis')).toBeUndefined();
    expect(findPlace('')).toBeUndefined();
    expect(findPlace(null)).toBeUndefined();
    expect(findPlace('XYZ')).toBeUndefined();
  });
});
