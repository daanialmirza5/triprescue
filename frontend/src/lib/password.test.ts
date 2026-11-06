import { describe, expect, it } from 'vitest';
import { PASSWORD_RULES, isStrongPassword } from './password';

describe('password strength', () => {
  it('accepts only passwords meeting every rule', () => {
    expect(isStrongPassword('Str0ng!Pass')).toBe(true);
    for (const weak of ['', 'x', 'Sh0rt!', 'alllowercase1!', 'ALLUPPERCASE1!', 'NoNumbers!!', 'NoSymbols123', 'Spaces 123Ab']) {
      expect(isStrongPassword(weak)).toBe(false);
    }
    expect(isStrongPassword('Aa1!' + 'x'.repeat(200))).toBe(false);
  });

  it('reports which rules a password misses', () => {
    const missing = (p: string) => PASSWORD_RULES.filter((r) => !r.test(p)).map((r) => r.label);
    expect(missing('password')).toEqual(['An uppercase letter', 'A number', 'A symbol (e.g. ! @ # $)']);
  });
});
