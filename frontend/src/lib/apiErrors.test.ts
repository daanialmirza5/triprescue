import { describe, expect, it } from 'vitest';
import { formatApiError } from './apiErrors';

describe('formatApiError', () => {
  it('returns default fallback when error is null or undefined', () => {
    expect(formatApiError(null)).toBe('An unexpected error occurred. Please try again.');
    expect(formatApiError(undefined)).toBe('An unexpected error occurred. Please try again.');
  });

  it('returns custom fallback when provided', () => {
    expect(formatApiError(null, 'Custom error')).toBe('Custom error');
  });

  it('handles string errors directly', () => {
    expect(formatApiError('Network timeout')).toBe('Network timeout');
  });

  it('extracts message from standard Error instances', () => {
    expect(formatApiError(new Error('Connection refused'))).toBe('Connection refused');
  });

  it('extracts detail property from API response bodies', () => {
    expect(formatApiError({ detail: 'Invalid credentials provided' })).toBe('Invalid credentials provided');
  });

  it('extracts message or error property when present in response object', () => {
    expect(formatApiError({ message: 'Trip node not found' })).toBe('Trip node not found');
    expect(formatApiError({ error: 'Database unreachable' })).toBe('Database unreachable');
  });
});
