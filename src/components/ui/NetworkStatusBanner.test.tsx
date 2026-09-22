import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { NetworkStatusBanner } from './NetworkStatusBanner';
import * as api from '@/services/api';

describe('NetworkStatusBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when browser is online and backend is awake', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    render(<NetworkStatusBanner />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows offline warning when navigator is offline', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    render(<NetworkStatusBanner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/You are currently offline/i)).toBeInTheDocument();
  });

  it('responds to window online/offline events', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    render(<NetworkStatusBanner />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(screen.getByText(/You are currently offline/i)).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
