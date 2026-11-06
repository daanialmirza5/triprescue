import { describe, expect, it } from 'vitest';
import type { RecoveryChange, RecoveryOption } from '@/types';
import { optionBadge, whyBullets } from './recovery';

const option = (o: Partial<RecoveryOption>) =>
  ({ tag: 'Option', tagColor: 'blue', costDelta: 500, description: 'Plan description', changes: [], ...o }) as RecoveryOption;
const change = (changeType: RecoveryChange['changeType'], description: string): RecoveryChange => ({ nodeId: 'n', nodeLabel: 'Node', changeType, description });

describe('recovery option badges', () => {
  it('marks the top plan as recommended', () => {
    expect(optionBadge(option({ tagColor: 'violet' }), 0)).toEqual({ label: 'Recommended', tone: 'safe' });
  });

  it('labels cheaper and comfort plans', () => {
    expect(optionBadge(option({ costDelta: 0 }), 1)).toEqual({ label: 'Save More', tone: 'ai' });
    expect(optionBadge(option({ tag: 'Premium seat' }), 1)).toEqual({ label: 'More Comfort', tone: 'risk' });
  });

  it('falls back to the plan tag in title case', () => {
    expect(optionBadge(option({ tag: 'NEXT TRAIN' }), 2)).toEqual({ label: 'Next Train', tone: 'brand' });
  });
});

describe('whyBullets', () => {
  it('skips the rebooking and unaffected notes', () => {
    const bullets = whyBullets(option({
      changes: [change('rebooked', 'Rebooked on 6E 201'), change('preserved', 'Unaffected by this recovery.'), change('rescheduled', 'Hotel check-in moved')],
      providerReason: 'Seats confirmed by provider',
    }));
    expect(bullets).toEqual(['Hotel check-in moved', 'Seats confirmed by provider']);
  });

  it('uses the description when there is nothing else, and caps at three', () => {
    expect(whyBullets(option({}))).toEqual(['Plan description']);
    const many = ['a', 'b', 'c', 'd'].map((d) => change('new', d));
    expect(whyBullets(option({ changes: many }))).toHaveLength(3);
  });
});
