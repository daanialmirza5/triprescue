import { describe, expect, it } from 'vitest';
import { shortText, toConciseBullets, toConciseLine } from './concise';

describe('concise text helpers', () => {
  it('splits a paragraph into at most N sentence bullets', () => {
    const text = 'Flight is delayed. Connection breaks. Hotel at risk. Trek unaffected.';
    expect(toConciseBullets(text, 2)).toEqual(['Flight is delayed.', 'Connection breaks.']);
    expect(toConciseBullets('', 3)).toEqual([]);
    expect(toConciseBullets(null)).toEqual([]);
  });

  it('keeps only the first sentence and caps its length', () => {
    expect(toConciseLine('Short one. Second sentence.')).toBe('Short one.');
    const long = 'a'.repeat(200);
    const line = toConciseLine(long, 50);
    expect(line).toHaveLength(50);
    expect(line.endsWith('…')).toBe(true);
  });

  it('drops asides and trailing clauses for labels', () => {
    expect(shortText('Heavy waterlogging near Mumbai (BOM) roads; cabs take +64 min.')).toBe('Heavy waterlogging near Mumbai roads');
    expect(shortText('Connection buffer meets the target (required minimum: 60 minutes).')).toBe('Connection buffer meets the target');
    expect(shortText('x'.repeat(80), 20)).toHaveLength(20);
    expect(shortText(undefined)).toBe('');
  });
});
