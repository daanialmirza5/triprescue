import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { RouterProvider, useRouter } from './router';

const wrapper = ({ children }: { children: ReactNode }) => <RouterProvider>{children}</RouterProvider>;

describe('hash router', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('opens the route in the URL hash', () => {
    window.location.hash = '#/recovery';
    const { result } = renderHook(() => useRouter(), { wrapper });
    expect(result.current.route).toBe('recovery');
  });

  it('falls back to the dashboard for unknown routes', () => {
    window.location.hash = '#/pipeline';
    const { result } = renderHook(() => useRouter(), { wrapper });
    expect(result.current.route).toBe('dashboard');
  });

  it('navigates with params and clears them once used', () => {
    const { result } = renderHook(() => useRouter(), { wrapper });
    act(() => result.current.navigate('assistant', { prompt: 'Is my flight safe?' }));
    expect(result.current.route).toBe('assistant');
    expect(result.current.params.prompt).toBe('Is my flight safe?');
    expect(window.location.hash).toBe('#/assistant');
    act(() => result.current.consumeParams());
    expect(result.current.params).toEqual({});
  });

  it('must be used inside the provider', () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useRouter())).toThrow('useRouter must be used within RouterProvider');
    quiet.mockRestore();
  });
});
