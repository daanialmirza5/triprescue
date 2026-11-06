import { describe, expect, it } from 'vitest';
import { primaryNav, secondaryNav } from './navigation';
import { ROUTES } from './router';

describe('navigation', () => {
  const all = [...primaryNav, ...secondaryNav];

  it('only links to routes the router knows', () => {
    for (const item of all) expect(ROUTES).toContain(item.id);
  });

  it('lists every route exactly once', () => {
    const ids = all.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual([...ROUTES].sort());
  });

  it('starts with the dashboard', () => {
    expect(primaryNav[0].id).toBe('dashboard');
  });
});
