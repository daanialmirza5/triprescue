import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorageState } from './useLocalStorageState';

describe('useLocalStorageState Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns initial value when no item exists in localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState('test-key', 'default-val'));
    expect(result.current[0]).toBe('default-val');
  });

  it('reads pre-existing stored JSON value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify({ active: true }));
    const { result } = renderHook(() => useLocalStorageState('test-key', { active: false }));
    expect(result.current[0]).toEqual({ active: true });
  });

  it('updates state and persists next value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState('theme-pref', 'light'));

    act(() => {
      result.current[1]('dark');
    });

    expect(result.current[0]).toBe('dark');
    expect(JSON.parse(localStorage.getItem('theme-pref') || '""')).toBe('dark');
  });

  it('supports updater function and handles invalid JSON gracefully', () => {
    localStorage.setItem('corrupted-key', 'invalid-json{{{');
    const { result } = renderHook(() => useLocalStorageState('corrupted-key', 10));

    expect(result.current[0]).toBe(10);

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
    expect(localStorage.getItem('corrupted-key')).toBe('15');
  });
});
