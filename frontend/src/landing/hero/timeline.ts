/** The hero's story loop, as a pure function of time so the 3D scene, the
 * floating status cards and the reduced-motion still frame all agree.
 *
 *  0.0s  UA 901 departs Mumbai (on track)
 *  3.5s  delay detected: +95 min, Delhi → Agra connection at risk
 *  7.0s  Safar Sathi rebooks the connection (recovered)
 *  8.5s  flight lands in Delhi
 *  9.5s  train departs Delhi for Agra
 * 15.0s  arrives Agra; journey re-validated
 * 18.0s  loop
 */

export const LOOP_SECONDS = 18;
export const STILL_FRAME_SECONDS = 11.5;

export type StopStatus = 'on-track' | 'departed' | 'delayed' | 'at-risk' | 'recovered';
export type StoryPhase = 'departed' | 'delayed' | 'recovering' | 'recovered' | 'arrived';

export interface TimelineSample {
  /** 0..1 along the Mumbai → Delhi flight curve. */
  flight: number;
  /** 0..1 along the Delhi → Agra rail curve. */
  train: number;
  phase: StoryPhase;
  flightStatus: 'on-track' | 'delayed' | 'landed';
  railStatus: 'scheduled' | 'at-risk' | 'recovered' | 'arrived';
  stops: { mumbai: StopStatus; delhi: StopStatus; agra: StopStatus };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);

export function sampleTimeline(seconds: number): TimelineSample {
  const t = ((seconds % LOOP_SECONDS) + LOOP_SECONDS) % LOOP_SECONDS;

  // The aircraft covers the first 45% quickly, then crawls: the delay made visible.
  const flight = t < 3.5 ? ease(t / 3.5) * 0.45 : 0.45 + ease(clamp01((t - 3.5) / 5)) * 0.55;
  const train = ease(clamp01((t - 9.5) / 5.5));

  const phase: StoryPhase = t < 3.5 ? 'departed' : t < 7 ? 'delayed' : t < 9.5 ? 'recovering' : t < 15 ? 'recovered' : 'arrived';
  const flightStatus = t < 3.5 ? 'on-track' : t < 8.5 ? 'delayed' : 'landed';
  const railStatus = t < 3.5 ? 'scheduled' : t < 7 ? 'at-risk' : t < 15 ? 'recovered' : 'arrived';

  return {
    flight,
    train,
    phase,
    flightStatus,
    railStatus,
    stops: {
      mumbai: 'departed',
      delhi: t < 3.5 ? 'on-track' : 'delayed',
      agra: t < 3.5 ? 'on-track' : t < 7 ? 'at-risk' : t < 15 ? 'recovered' : 'on-track',
    },
  };
}

export const phaseCaption: Record<StoryPhase, string> = {
  departed: 'UA 901 departed Mumbai · all connections on track',
  delayed: 'UA 901 delayed +95 min · Delhi → Agra train at risk',
  recovering: 'Safar Sathi rebooked your Delhi → Agra connection',
  recovered: 'Train to Agra on schedule · hotel check-in protected',
  arrived: 'Journey re-validated · every booking on track',
};
