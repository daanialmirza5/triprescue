import { describe, expect, it } from 'vitest';
import { LOOP_SECONDS, sampleTimeline } from './timeline';

describe('hero motion', () => {
  it('loops every cycle, including negative clock values', () => {
    expect(sampleTimeline(LOOP_SECONDS + 4)).toEqual(sampleTimeline(4));
    expect(sampleTimeline(-2)).toEqual(sampleTimeline(LOOP_SECONDS - 2));
  });

  it('the plane and train only move forward within a loop', () => {
    let last = sampleTimeline(0);
    for (let t = 0.25; t < LOOP_SECONDS; t += 0.25) {
      const now = sampleTimeline(t);
      expect(now.flight).toBeGreaterThanOrEqual(last.flight);
      expect(now.train).toBeGreaterThanOrEqual(last.train);
      last = now;
    }
  });

  it('the plane slows down once the delay hits', () => {
    expect(sampleTimeline(3.5).flight).toBeCloseTo(0.45);
    expect(sampleTimeline(8.5).flight).toBe(1);
  });

  it('the train waits for the plane to land', () => {
    expect(sampleTimeline(9).train).toBe(0);
    expect(sampleTimeline(15).train).toBe(1);
  });
});
