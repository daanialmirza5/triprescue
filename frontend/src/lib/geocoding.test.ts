import { afterEach, describe, expect, it, vi } from 'vitest';
import { coordinatesFor, geocodeCandidates, geocodeLocation } from './geocoding';

afterEach(() => vi.unstubAllGlobals());

describe('geocoding', () => {
  it('resolves known cities from the local registry without the network', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const point = await geocodeLocation('Fort Road, Leh');
    expect(point).toMatchObject({ source: 'registry', label: 'Leh, India' });
    expect(point!.lat).toBeCloseTo(34.15, 1);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('falls back to the remote geocoder, trying the most specific term first', async () => {
    const fetchSpy = vi.fn(async (url: string) => {
      const hit = decodeURIComponent(url).includes('name=Hampi')
        ? { results: [{ name: 'Hampi', latitude: 15.335, longitude: 76.46, country: 'India', admin1: 'Karnataka' }] }
        : {};
      return new Response(JSON.stringify(hit), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchSpy);
    const point = await geocodeLocation('Virupaksha Temple Road, Hampi');
    expect(point).toMatchObject({ source: 'open-meteo', label: 'Hampi, Karnataka, India', lat: 15.335 });
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('returns no coordinates (instead of throwing) when nothing resolves', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('offline'); }));
    await expect(coordinatesFor('Somewhere Unmapped 12')).resolves.toEqual({});
  });

  it('builds search candidates from comma-separated parts', () => {
    expect(geocodeCandidates('Fort Road, Leh')).toEqual(['Fort Road, Leh', 'Leh', 'Fort Road']);
  });
});
