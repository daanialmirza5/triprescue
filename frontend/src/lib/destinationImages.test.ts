import { describe, expect, it } from 'vitest';
import { FALLBACK_IMAGE, resolveDestinationImage } from './destinationImages';

describe('resolveDestinationImage', () => {
  it('resolves known cities by name', () => {
    expect(resolveDestinationImage('Agra')).toMatch(/destinations\/agra\.jpg$/);
    expect(resolveDestinationImage('Paris')).toMatch(/destinations\/paris\.jpg$/);
    expect(resolveDestinationImage('Singapore')).toMatch(/destinations\/singapore\.jpg$/);
  });

  it('normalizes case, accents, airport codes and aliases', () => {
    expect(resolveDestinationImage('  new delhi ')).toMatch(/delhi\.jpg$/);
    expect(resolveDestinationImage('Delhi (DEL) T3')).toMatch(/delhi\.jpg$/);
    expect(resolveDestinationImage('BOM')).toMatch(/mumbai\.jpg$/);
    expect(resolveDestinationImage('Bombay')).toMatch(/mumbai\.jpg$/);
    expect(resolveDestinationImage('Pangong Tso')).toMatch(/leh\.jpg$/);
  });

  it('falls back to a country image for unknown cities in a known country', () => {
    expect(resolveDestinationImage('Lyon, France')).toMatch(/paris\.jpg$/);
    expect(resolveDestinationImage('Switzerland')).toMatch(/switzerland\.jpg$/);
  });

  it('uses the generic travel image for anything unknown', () => {
    expect(resolveDestinationImage('Atlantis')).toBe(FALLBACK_IMAGE);
    expect(resolveDestinationImage('')).toBe(FALLBACK_IMAGE);
    expect(resolveDestinationImage(undefined)).toBe(FALLBACK_IMAGE);
  });
});
