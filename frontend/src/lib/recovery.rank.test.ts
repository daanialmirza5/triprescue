import { describe, expect, it } from 'vitest';
import type { RecoveryOption, TravelerPreferences } from '@/types';
import { priorityOf, priorityPresets, rankOptions } from './recovery';

const base: TravelerPreferences = {
  costVsSpeed: 50,
  disruptionVsComfort: 50,
  recoveryPriorities: { minimizeCost: false, minimizeTime: false, minimizeDisruption: false, maximizeComfort: false },
};

const option = (id: string, score: number, breakdown: Partial<RecoveryOption['scoreBreakdown']> = {}, feasible?: boolean) =>
  ({ id, score, feasible, scoreBreakdown: { cost: 0, speed: 0, preservation: 0, comfort: 0, risk: 0, ...breakdown } }) as RecoveryOption;

describe('recovery priorities', () => {
  it('each preset reads back as its own priority', () => {
    for (const priority of ['sooner', 'cost', 'comfort'] as const) {
      expect(priorityOf(priorityPresets[priority](base))).toBe(priority);
    }
  });

  it('defaults balanced preferences to sooner', () => {
    expect(priorityOf(base)).toBe('sooner');
  });

  it('ranks by score and drops infeasible plans', () => {
    const ranked = rankOptions([option('a', 70), option('b', 90), option('c', 99, {}, false)], 'sooner');
    expect(ranked.map((o) => o.id)).toEqual(['b', 'a']);
  });

  it('breaks score ties with the chosen priority', () => {
    const cheap = option('cheap', 80, { cost: 95, speed: 20 });
    const fast = option('fast', 80, { cost: 20, speed: 95 });
    expect(rankOptions([cheap, fast], 'sooner')[0].id).toBe('fast');
    expect(rankOptions([fast, cheap], 'cost')[0].id).toBe('cheap');
  });
});
