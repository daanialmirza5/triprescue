import { describe, expect, it } from 'vitest';
import { delayLabel, formatCurrency, formatDuration, riskBg, riskColor } from './status';

describe('formatCurrency', () => {
  it('formats with the rupee symbol and Indian digit grouping', () => {
    expect(formatCurrency(4200)).toBe('₹4,200');
    expect(formatCurrency(150000)).toBe('₹1,50,000');
    expect(formatCurrency(0)).toBe('₹0');
  });
});

describe('formatDuration', () => {
  it('formats minutes-only durations', () => {
    expect(formatDuration(45)).toBe('+45m');
  });

  it('formats hour-only durations', () => {
    expect(formatDuration(120)).toBe('+2h');
  });

  it('formats mixed hour+minute durations', () => {
    expect(formatDuration(150)).toBe('+2h 30m');
  });

  it('formats zero as minutes', () => {
    expect(formatDuration(0)).toBe('+0m');
  });
});

describe('riskColor / riskBg', () => {
  it('classifies high risk (>= 60) as red', () => {
    expect(riskColor(60)).toBe('text-red-600');
    expect(riskBg(75)).toBe('bg-red-500');
  });

  it('classifies medium risk (30-59) as amber', () => {
    expect(riskColor(30)).toBe('text-amber-600');
    expect(riskBg(59)).toBe('bg-amber-500');
  });

  it('classifies low risk (< 30) as emerald', () => {
    expect(riskColor(29)).toBe('text-emerald-600');
    expect(riskBg(0)).toBe('bg-emerald-500');
  });
});

describe('delayLabel', () => {
  it('returns a bare label when there is no scheduled/actual pair', () => {
    expect(delayLabel({})).toBe('DELAYED');
  });

  it('returns a bare label when the node is on time or early', () => {
    expect(
      delayLabel({ scheduledEnd: '2025-09-12T08:45:00', actualEnd: '2025-09-12T08:45:00' })
    ).toBe('DELAYED');
    expect(
      delayLabel({ scheduledEnd: '2025-09-12T08:45:00', actualEnd: '2025-09-12T08:30:00' })
    ).toBe('DELAYED');
  });

  it('formats hours and minutes when both are present', () => {
    expect(
      delayLabel({ scheduledEnd: '2025-09-12T08:45:00', actualEnd: '2025-09-12T11:15:00' })
    ).toBe('DELAYED +2h30m');
  });

  it('formats minutes-only delays under an hour', () => {
    expect(
      delayLabel({ scheduledEnd: '2025-09-12T08:45:00', actualEnd: '2025-09-12T09:00:00' })
    ).toBe('DELAYED +15m');
  });

  it('formats hour-only delays with no remainder minutes', () => {
    expect(
      delayLabel({ scheduledEnd: '2025-09-12T08:45:00', actualEnd: '2025-09-12T10:45:00' })
    ).toBe('DELAYED +2h');
  });
});
