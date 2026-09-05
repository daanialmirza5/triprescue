import { describe, expect, it, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AppProvider, useApp } from './AppContext';
import type { RecoveryOption, Trip } from '@/types';

vi.mock('@/services/api', async () => {
  const actual = await vi.importActual<typeof import('@/services/api')>('@/services/api');
  return {
    ...actual,
    getItinerary: vi.fn(),
    getActivityLog: vi.fn(),
    getNotifications: vi.fn(),
    getPreferences: vi.fn(),
    triggerDisruption: vi.fn(),
    generateRecoveryOptions: vi.fn(),
    applyRecovery: vi.fn(),
    resetTrip: vi.fn(),
    setPreferences: vi.fn(),
    markNotificationsRead: vi.fn(),
  };
});

import * as api from '@/services/api';

function baseTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: 'trip-1',
    name: 'Test Trip',
    travelerName: 'Test Traveler',
    route: 'A to B',
    origin: 'A',
    destination: 'B',
    startDate: '2025-09-01',
    endDate: '2025-09-05',
    nodes: [
      {
        id: 'n1', category: 'flight', label: 'Flight', title: 'Flight A-B', subtitle: '', location: 'A',
        scheduledTime: '', provider: 'X', cost: 0, cancellationPolicy: '', refundable: false, riskLevel: 0,
        dependencyCount: 0, status: 'healthy', day: 1, icon: '',
      },
      {
        id: 'n2', category: 'hotel', label: 'Hotel', title: 'Hotel B', subtitle: '', location: 'B',
        scheduledTime: '', provider: 'Y', cost: 0, cancellationPolicy: '', refundable: false, riskLevel: 0,
        dependencyCount: 0, status: 'healthy', day: 1, icon: '',
      },
    ],
    edges: [{ id: 'e1', source: 'n1', target: 'n2', status: 'healthy' }],
    tripValue: 1000,
    healthScore: 100,
    status: 'operational',
    days: [],
    ...overrides,
  };
}

function recoveryOption(overrides: Partial<RecoveryOption> = {}): RecoveryOption {
  return {
    id: 'recovery-1',
    name: 'Rebook next flight',
    tag: 'BEST BALANCE',
    tagColor: 'cyan',
    description: 'Rebook to the next available option.',
    costDelta: 500,
    timeImpactMinutes: 60,
    bookingsPreserved: 2,
    totalBookings: 2,
    refundRecovered: 0,
    residualRisk: 'low',
    score: 80,
    changes: [],
    scoreBreakdown: { cost: 20, speed: 20, preservation: 20, comfort: 10, risk: 10 },
    ...overrides,
  };
}

const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(api.getActivityLog).mockResolvedValue([]);
  vi.mocked(api.getNotifications).mockResolvedValue([]);
  vi.mocked(api.getPreferences).mockResolvedValue({
    costVsSpeed: 50,
    disruptionVsComfort: 50,
    recoveryPriorities: { minimizeCost: false, minimizeTime: false, minimizeDisruption: true, maximizeComfort: false },
  });
});

describe('AppContext', () => {
  it('loads the trip on mount via the API', async () => {
    vi.mocked(api.getItinerary).mockResolvedValue(baseTrip());

    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.trip.name).toBe('Test Trip');
    expect(result.current.error).toBeNull();
    expect(api.getItinerary).toHaveBeenCalledWith('trip-ladakh-2025');
  });

  it('loads persisted preferences from the backend instead of always resetting to defaults', async () => {
    vi.mocked(api.getItinerary).mockResolvedValue(baseTrip());
    vi.mocked(api.getPreferences).mockResolvedValue({
      costVsSpeed: 90,
      disruptionVsComfort: 10,
      recoveryPriorities: { minimizeCost: true, minimizeTime: false, minimizeDisruption: false, maximizeComfort: false },
    });

    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.preferences.costVsSpeed).toBe(90);
    expect(result.current.preferences.recoveryPriorities.minimizeCost).toBe(true);
  });

  it('falls back to default preferences if the preferences fetch fails, without failing the whole load', async () => {
    vi.mocked(api.getItinerary).mockResolvedValue(baseTrip());
    vi.mocked(api.getPreferences).mockRejectedValue(new api.ApiError('preferences unavailable', 500));

    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.preferences.costVsSpeed).toBe(50);
  });

  it('surfaces a friendly error when the initial load fails', async () => {
    vi.mocked(api.getItinerary).mockRejectedValue(new api.ApiError('Backend unreachable', 0));

    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Backend unreachable');
  });

  it('resets disruption/recovery state and reloads when switching trips', async () => {
    vi.mocked(api.getItinerary).mockResolvedValue(baseTrip());
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    vi.mocked(api.getItinerary).mockResolvedValue(baseTrip({ id: 'trip-2', name: 'Second Trip' }));
    act(() => {
      result.current.switchTrip('trip-2');
    });

    // The switch itself synchronously clears disruption/recovery state.
    expect(result.current.phase).toBe('idle');
    expect(result.current.recoveryOptions).toEqual([]);

    await waitFor(() => expect(result.current.trip.id).toBe('trip-2'));
    expect(api.getItinerary).toHaveBeenLastCalledWith('trip-2');
  });

  it('runs the full disruption -> recovery -> apply flow end to end', async () => {
    vi.mocked(api.getItinerary).mockResolvedValue(baseTrip());
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    vi.mocked(api.triggerDisruption).mockResolvedValue({
      disruption: {
        id: 'd1', type: 'flight-delay', label: 'Flight delayed', primaryNodeId: 'n1', delayMinutes: 180,
        impactLevel: 'high', directImpact: 1, downstreamImpact: 1, financialExposure: 0, refundExposure: 0,
        cascadeSteps: [], detectedAt: '2025-09-01T06:00:00',
      },
      impacts: [{ nodeId: 'n2', status: 'broken', reason: 'No buffer left', causedBy: 'n1', availableBufferMinutes: 0, requiredBufferMinutes: 60 }],
      sequence: ['n1', 'n2'],
      tripHealthScore: 40,
    });
    const option = recoveryOption();
    vi.mocked(api.generateRecoveryOptions).mockResolvedValue([option]);

    await act(async () => {
      await result.current.triggerDisruption('flight-delay', { delayMinutes: 180 });
    });

    expect(result.current.phase).toBe('recovering');
    expect(result.current.recoveryOptions).toEqual([option]);
    expect(result.current.trip.nodes.find((n) => n.id === 'n2')?.status).toBe('broken');
    expect(result.current.preDisruptionTrip?.nodes.every((n) => n.status === 'healthy')).toBe(true);

    const recoveredTrip = baseTrip({ status: 'recovered' });
    vi.mocked(api.applyRecovery).mockResolvedValue({
      trip: recoveredTrip,
      appliedRecovery: option,
      activityEvent: { id: 'a1', timestamp: '10:00', type: 'recovery', message: 'Applied' },
      notification: { id: 'not1', severity: 'low', category: 'recovery', title: 'Recovered', message: 'Done', timestamp: '10:00', read: false },
    });

    await act(async () => {
      await result.current.applyRecoveryPlan(option.id);
    });

    expect(result.current.phase).toBe('recovered');
    expect(result.current.appliedRecovery?.id).toBe(option.id);
    expect(result.current.trip.status).toBe('recovered');
  });

  it('leaves state untouched and rethrows when applying a recovery plan fails', async () => {
    vi.mocked(api.getItinerary).mockResolvedValue(baseTrip());
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    vi.mocked(api.applyRecovery).mockRejectedValue(new api.ApiError('Recovery plan expired', 409));

    await act(async () => {
      await expect(result.current.applyRecoveryPlan('stale-id')).rejects.toThrow('Recovery plan expired');
    });

    expect(result.current.phase).not.toBe('recovered');
    expect(result.current.error).toBe('Recovery plan expired');
    expect(result.current.isBusy).toBe(false);
  });
});
