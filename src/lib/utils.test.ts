import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('joins plain string classes', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('drops falsy values', () => {
    expect(cn('a', undefined, null, false, 'b')).toBe('a b');
  });

  it('expands a class-map object to its truthy keys', () => {
    expect(cn({ active: true, disabled: false, large: true })).toBe('active large');
  });

  it('mixes strings and class-map objects', () => {
    expect(cn('base', { active: true, hidden: false }, 'extra')).toBe('base active extra');
  });

  it('returns an empty string when nothing is truthy', () => {
    expect(cn(undefined, false, { a: false })).toBe('');
  });
});
