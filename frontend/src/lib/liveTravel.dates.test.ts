import { describe, expect, it } from 'vitest';
import { dayDate, timeAgo, toDateInput, tripDayCount, tripStartDate, wallClock } from './liveTravel';

describe('live travel date helpers', () => {
  it('formats freshness in hours and days', () => {
    const now = new Date('2026-10-01T12:00:00Z').getTime();
    expect(timeAgo('2026-10-01T09:00:00Z', now)).toBe('3 h ago');
    expect(timeAgo('2026-09-28T12:00:00Z', now)).toBe('3 d ago');
    expect(timeAgo('2026-10-01T12:05:00Z', now)).toBe('0 sec ago'); // clock skew never goes negative
  });

  it('derives trip days from the trip dates', () => {
    const trip = { startDate: '12 Sep 2025', endDate: '16 Sep 2025', days: [] };
    expect(toDateInput(tripStartDate(trip))).toBe('2025-09-12');
    expect(toDateInput(dayDate(trip, 3))).toBe('2025-09-14');
    expect(tripDayCount(trip)).toBe(5);
  });

  it('falls back safely for unparseable trip dates', () => {
    const trip = { startDate: 'not a date', endDate: '', days: [] };
    expect(tripDayCount(trip)).toBe(1);
    expect(Number.isNaN(tripStartDate(trip).getTime())).toBe(false);
  });

  it('keeps the provider wall-clock time', () => {
    expect(wallClock('2026-09-27T17:00:00+05:30')).toBe('2026-09-27T17:00:00');
  });
});
