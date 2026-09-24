import { describe, it, expect, beforeEach } from 'vitest';
import { getStoredToken, setStoredToken, clearStoredToken } from './authStorage';

describe('authStorage Utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when token is not present', () => {
    expect(getStoredToken()).toBeNull();
  });

  it('sets and retrieves authentication token', () => {
    setStoredToken('mock-jwt-token-xyz');
    expect(getStoredToken()).toBe('mock-jwt-token-xyz');
  });

  it('clears stored authentication token correctly', () => {
    setStoredToken('mock-jwt-token-xyz');
    expect(getStoredToken()).toBe('mock-jwt-token-xyz');

    clearStoredToken();
    expect(getStoredToken()).toBeNull();
  });
});
