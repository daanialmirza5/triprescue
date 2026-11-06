import { describe, expect, it } from 'vitest';
import { STILL_FRAME_SECONDS, phaseCaption, sampleTimeline } from './timeline';

describe('hero story phases', () => {
  it.each([
    [0, 'departed', 'on-track', 'scheduled'],
    [4, 'delayed', 'delayed', 'at-risk'],
    [8, 'recovering', 'delayed', 'recovered'],
    [10, 'recovered', 'landed', 'recovered'],
    [16, 'arrived', 'landed', 'arrived'],
  ] as const)('at %ss the story is %s', (seconds, phase, flight, rail) => {
    const s = sampleTimeline(seconds);
    expect(s.phase).toBe(phase);
    expect(s.flightStatus).toBe(flight);
    expect(s.railStatus).toBe(rail);
  });

  it('flags Agra at risk during the delay, then protects it', () => {
    expect(sampleTimeline(1).stops.agra).toBe('on-track');
    expect(sampleTimeline(5).stops.agra).toBe('at-risk');
    expect(sampleTimeline(12).stops.agra).toBe('recovered');
  });

  it('uses a recovered moment for the reduced-motion still frame', () => {
    expect(sampleTimeline(STILL_FRAME_SECONDS).phase).toBe('recovered');
  });

  it('has a caption for every phase', () => {
    for (const seconds of [0, 4, 8, 10, 16]) expect(phaseCaption[sampleTimeline(seconds).phase]).toBeTruthy();
  });
});
