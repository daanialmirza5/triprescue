import { describe, expect, it } from 'vitest';
import { SCENARIO_PRESETS, asStatus, severityOf } from './digitalTwin';

const calm = { scenarioName: 'Calm', rainfallMmPerHour: 0, windSpeedKmh: 10, visibilityMeters: 10000, temperatureCelsius: 25, stormDurationHours: 1 };

describe('digital twin helpers', () => {
  it('rates calm weather as zero severity', () => {
    expect(severityOf(calm)).toBe(0);
  });

  it('caps severity at 1 for extreme weather', () => {
    expect(severityOf({ ...calm, rainfallMmPerHour: 200, windSpeedKmh: 300, visibilityMeters: 0, temperatureCelsius: 60 })).toBe(1);
  });

  it('weights the worst factor most', () => {
    // Rain alone at full strength: 0.7 * 1 + 0.3 * (1 / 4).
    expect(severityOf({ ...calm, rainfallMmPerHour: 80 })).toBe(0.775);
  });

  it('ranks the cyclone preset above the heatwave preset', () => {
    const by = Object.fromEntries(SCENARIO_PRESETS.map((p) => [p.id, severityOf(p.scenario)]));
    expect(by.cyclone).toBeGreaterThan(by.heat);
    expect(SCENARIO_PRESETS.every((p) => by[p.id] > 0 && by[p.id] <= 1)).toBe(true);
  });

  it('treats unknown statuses as healthy', () => {
    expect(asStatus('delayed')).toBe('delayed');
    expect(asStatus('exploded')).toBe('healthy');
  });
});
