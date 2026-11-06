import { describe, expect, it } from 'vitest';
import type { Attraction, Hotel, LiveTransport, TrainBetween, TravelEvent } from '@/services/api';
import {
  attractionToItem,
  betweenTrainToItem,
  composeImpact,
  eventToItem,
  flightToItem,
  hotelToItem,
  liveTrainToItem,
  timeAgo,
  tripDayCount,
} from './liveTravel';

const FLIGHT: LiveTransport = {
  id: 'aviationstack:AI101:2026-09-27', mode: 'flight', provider: 'aviationstack', source: 'aviationstack', externalId: 'AI101@2026-09-27',
  dataSource: 'live', number: 'AI101', name: 'Air India', operator: 'Air India',
  origin: { code: 'BOM', name: 'Mumbai', latitude: null, longitude: null }, destination: { code: 'DEL', name: 'Delhi', latitude: null, longitude: null },
  status: 'en_route', delayMinutes: 12, currentLocation: { latitude: 22.5, longitude: 75.1 }, currentLocationName: null,
  speedKmh: 820, altitudeMeters: 10668, heading: 25, isOnGround: false, aircraft: 'B77W',
  scheduledDeparture: '2026-09-27T08:00:00+00:00', estimatedDeparture: null, actualDeparture: '2026-09-27T08:20:00+00:00',
  scheduledArrival: '2026-09-27T10:10:00+00:00', estimatedArrival: '2026-09-27T10:22:00+00:00', actualArrival: null,
  previousStop: null, nextStop: null, platform: null, route: [], journeyDate: '2026-09-27', notices: [],
  lastUpdatedAt: '2026-09-27T09:12:00+00:00', retrievedAt: '2026-09-27T09:12:30+00:00',
};

const TRIP = { startDate: '12 Sep 2025', endDate: '16 Sep 2025', days: [] };

describe('live travel adapters', () => {
  it('maps a live flight to a flight booking with its own schedule', () => {
    expect(flightToItem(FLIGHT)).toEqual({
      kind: 'flight', source: 'aviationstack', externalId: 'AI101@2026-09-27', title: 'AI101 BOM → DEL', operator: 'Air India',
      location: 'Mumbai', originCode: 'BOM', destinationCode: 'DEL',
      scheduledStart: '2026-09-27T08:00:00', scheduledEnd: '2026-09-27T10:10:00', lat: null, lng: null,
    });
    expect(() => flightToItem({ ...FLIGHT, origin: null })).toThrow(/airport codes/);
  });

  it('maps live and timetable trains to their journey dates', () => {
    const live = liveTrainToItem({ ...FLIGHT, mode: 'train', source: 'railradar', provider: 'railradar', number: '12951', name: 'Mumbai Rajdhani', externalId: '12951@2026-09-26',
      origin: { code: 'MMCT', name: 'Mumbai Central', latitude: 18.97, longitude: 72.82 }, destination: { code: 'NDLS', name: 'New Delhi', latitude: null, longitude: null },
      scheduledDeparture: '2026-09-26T17:00:00+05:30', scheduledArrival: '2026-09-27T08:35:00+05:30' });
    expect(live).toMatchObject({ kind: 'train', title: 'Train 12951 Mumbai Rajdhani', scheduledStart: '2026-09-26T17:00:00', scheduledEnd: '2026-09-27T08:35:00', originCode: 'MMCT' });

    const row: TrainBetween = { id: 'x', source: 'railradar', externalId: '12951', dataSource: 'live', number: '12951', name: 'Mumbai Rajdhani', trainType: null,
      origin: { code: 'MMCT', name: 'Mumbai Central', latitude: null, longitude: null }, destination: { code: 'NDLS', name: 'New Delhi', latitude: null, longitude: null },
      departureTime: '17:00', arrivalTime: '08:35', arrivalDayOffset: 1, durationMinutes: 935, runDays: [], liveDelayMinutes: null, livePlatform: null };
    expect(betweenTrainToItem(row, '2026-10-02')).toMatchObject({ externalId: '12951@2026-10-02', scheduledStart: '2026-10-02T17:00:00', scheduledEnd: '2026-10-03T08:35:00' });
  });

  it('uses hotel check-in/out dates and never adds a price', () => {
    const hotel = { id: 'osm', type: 'hotel', source: 'openstreetmap', externalId: 'node/1', name: 'Hotel Mandovi', category: 'hotel', latitude: 15.49, longitude: 73.82,
      address: 'D B Marg, Panaji', city: 'Panaji', phone: null, website: null, stars: null, sourceUrl: '', lastUpdatedAt: '' } as Hotel;
    const item = hotelToItem(hotel, '2025-09-12', '2025-09-15');
    expect(item).toMatchObject({ kind: 'hotel', scheduledStart: '2025-09-12T14:00:00', scheduledEnd: '2025-09-15T11:00:00', location: 'D B Marg, Panaji', lat: 15.49 });
    expect(item).not.toHaveProperty('cost');
    expect(() => hotelToItem(hotel, '2025-09-15', '2025-09-12')).toThrow(/Check-out/);
  });

  it('puts attractions on the chosen trip day', () => {
    const place = { id: 'p', type: 'attraction', source: 'openstreetmap', externalId: 'way/9', name: 'Fort Aguada', category: 'fort', latitude: 15.49, longitude: 73.77,
      address: null, city: 'Goa', website: null, sourceUrl: '', lastUpdatedAt: '' } as Attraction;
    expect(attractionToItem(place, TRIP, 3)).toMatchObject({ kind: 'attraction', scheduledStart: '2025-09-14T10:00:00', scheduledEnd: '2025-09-14T12:00:00', location: 'Fort Aguada, Goa' });
    expect(tripDayCount(TRIP)).toBe(5);
  });

  it('uses the event date, reserving 2h when no end time is announced', () => {
    const start = new Date(2026, 9, 3, 20, 0);
    const event = { id: 'e', type: 'event', source: 'ticketmaster', externalId: 'Z7', name: 'Sunburn', venue: 'Vagator Beach', city: 'Goa', latitude: null, longitude: null,
      startTime: start.toISOString(), startDate: '2026-10-03', endTime: null, category: null, imageUrl: null, ticketUrl: null, status: null, lastUpdatedAt: '' } as TravelEvent;
    expect(eventToItem(event)).toMatchObject({ kind: 'event', scheduledStart: '2026-10-03T20:00:00', scheduledEnd: '2026-10-03T22:00:00', location: 'Vagator Beach, Goa' });
    expect(eventToItem({ ...event, startTime: null })).toMatchObject({ scheduledStart: '2026-10-03T00:00:00', scheduledEnd: '2026-10-03T23:59:00' });
  });
});

describe('live baseline + simulation', () => {
  it('adds a simulated delay on top of the real one without touching live data', () => {
    const live = Object.freeze({ ...FLIGHT });
    expect(composeImpact(live, 120)).toEqual({ realDelayMinutes: 12, simulatedDelayMinutes: 120, totalImpactMinutes: 132 });
    expect(live.delayMinutes).toBe(12);
    expect(composeImpact({ delayMinutes: null }, 30).totalImpactMinutes).toBe(30);
  });

  it('formats freshness', () => {
    const now = new Date('2026-09-27T09:13:00Z').getTime();
    expect(timeAgo('2026-09-27T09:12:18Z', now)).toBe('42 sec ago');
    expect(timeAgo('2026-09-27T09:00:00Z', now)).toBe('13 min ago');
  });
});

