import { describe, expect, it } from 'vitest';
import { env, getApiEndpoint } from './env';

describe('env', () => {
  it('joins paths onto the API base with exactly one slash', () => {
    expect(getApiEndpoint('/api/health')).toBe(`${env.apiUrl}/api/health`);
    expect(getApiEndpoint('api/health')).toBe(`${env.apiUrl}/api/health`);
  });

  it('runs the tests in a non-production mode', () => {
    expect(env.isProd).toBe(false);
    expect(env.mode).toBe('test');
  });
});
