import { describe, expect, it } from 'vitest';
import type { LiveTransport, TrainBetween, TravelEvent } from '@/services/api';
import { betweenTrainToItem, eventToItem, liveTrainToItem } from './liveTravel';

/** Adapters must refuse items they cannot schedule, never invent times. */
describe('live travel adapters refuse incomplete items', () => {
  it('rejects a timetable row without times', () => {
    const row = { number: '12951', name: 'Rajdhani', departureTime: null, arrivalTime: '08:35', arrivalDayOffset: 1,
      origin: { code: 'MMCT', name: 'Mumbai Central' }, destination: { code: 'NDLS', name: 'New Delhi' } } as unknown as TrainBetween;
    expect(() => betweenTrainToItem(row, '2026-10-03')).toThrow(/timetable/);
  });

  it('rejects a live train without a schedule', () => {
    const train = { number: '12951', name: 'Rajdhani', externalId: '12951', scheduledDeparture: null, scheduledArrival: null,
      origin: null, destination: null } as unknown as LiveTransport;
    expect(() => liveTrainToItem(train)).toThrow(/timetable/);
  });

  it('rejects an event with no date at all', () => {
    const event = { externalId: 'Z1', name: 'Concert', venue: null, city: null, latitude: null, longitude: null,
      startTime: null, startDate: null, endTime: null } as unknown as TravelEvent;
    expect(() => eventToItem(event)).toThrow(/no date/);
  });
});
