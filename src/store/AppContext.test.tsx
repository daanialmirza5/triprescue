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
    createTrip: vi.fn(),
    listTrips: vi.fn(),
    addFlightNode: vi.fn(),
    addNode: vi.fn(),
    deleteNode: vi.fn(),
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
  vi.mocked(api.listTrips).mockResolvedValue([]);
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

  it('does not display the seeded demo trip for a new user who owns no trip (404)', async () => {
    vi.mocked(api.getItinerary).mockRejectedValue(new api.ApiError('Trip not found', 404));

    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.noTripFound).toBe(true);
    expect(result.current.error).toBeNull();
    // Never the seeded Ladakh trip (or any fabricated-looking data) - a
    // genuinely empty, non-misleading placeholder.
    expect(result.current.trip.name).toBe('');
    expect(result.current.trip.nodes).toEqual([]);
    expect(result.current.trip.tripValue).toBe(0);
    expect(result.current.trip.healthScore).toBe(0);
  });

  it('clears stale trip state when a subsequent load 404s (switching into an unowned trip)', async () => {
    vi.mocked(api.getItinerary).mockResolvedValue(baseTrip());
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.trip.name).toBe('Test Trip');
    expect(result.current.noTripFound).toBe(false);

    vi.mocked(api.getItinerary).mockRejectedValue(new api.ApiError('Trip not found', 404));
    act(() => {
      result.current.switchTrip('someone-elses-trip');
    });

    await waitFor(() => expect(result.current.noTripFound).toBe(true));
    // The previously-loaded real trip's data must not linger.
    expect(result.current.trip.name).toBe('');
    expect(result.current.trip.nodes).toEqual([]);
    expect(result.current.activeDisruption).toBeNull();
    expect(result.current.recoveryOptions).toEqual([]);
  });

  it('still loads and renders a real owned trip normally (demo or otherwise), with noTripFound false', async () => {
    vi.mocked(api.getItinerary).mockResolvedValue(baseTrip());

    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.noTripFound).toBe(false);
    expect(result.current.trip.name).toBe('Test Trip');
    expect(result.current.trip.nodes.length).toBeGreaterThan(0);
  });

  it('does not leak trip state between separate sessions (e.g. logout then a different user logging in)', async () => {
    vi.mocked(api.getItinerary).mockResolvedValueOnce(baseTrip({ name: 'First User Trip' }));
    const first = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(first.result.current.loading).toBe(false));
    expect(first.result.current.trip.name).toBe('First User Trip');

    // AppProvider is only ever mounted while authenticated (see App.tsx's
    // Gate()) - logging out unmounts it entirely, so a fresh login always
    // gets a brand-new provider instance starting from a clean initial
    // state, never whatever the previous session last held.
    vi.mocked(api.getItinerary).mockRejectedValueOnce(new api.ApiError('Trip not found', 404));
    const second = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(second.result.current.loading).toBe(false));

    expect(second.result.current.trip.name).toBe('');
    expect(second.result.current.noTripFound).toBe(true);
    // The first session's own state is unaffected by the second mounting.
    expect(first.result.current.trip.name).toBe('First User Trip');
  });

  it('falls back to the traveler\'s own trip (surviving a refresh) when the default trip 404s but they own a real trip', async () => {
    // Simulates a browser refresh after creating a trip: tripId always
    // starts from the hardcoded default on a fresh load (nothing is
    // persisted client-side), which a real user doesn't own, but they do
    // own a genuine trip the backend can list.
    vi.mocked(api.getItinerary).mockRejectedValueOnce(new api.ApiError('Trip not found', 404));
    vi.mocked(api.listTrips).mockResolvedValue([
      { id: 'trip-mine', name: 'My Real Trip', route: 'A to B', startDate: '2026-01-01', endDate: '2026-01-03', tripValue: 0, healthScore: 100, status: 'operational', nodeCount: 0, edgeCount: 0 },
    ]);
    vi.mocked(api.getItinerary).mockResolvedValueOnce(baseTrip({ id: 'trip-mine', name: 'My Real Trip' }));

    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.noTripFound).toBe(false);
    expect(result.current.tripId).toBe('trip-mine');
    expect(result.current.trip.name).toBe('My Real Trip');
  });

  it('creates a trip via the API and makes it the active trip', async () => {
    vi.mocked(api.getItinerary).mockResolvedValue(baseTrip());
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    const created = baseTrip({ id: 'trip-new', name: 'Kyoto Weekend' });
    vi.mocked(api.createTrip).mockResolvedValue(created);
    vi.mocked(api.getItinerary).mockResolvedValue(created);

    await act(async () => {
      await result.current.createTrip({
        name: 'Kyoto Weekend',
        origin: 'Tokyo',
        destination: 'Kyoto',
        startDate: '2026-04-10',
        endDate: '2026-04-13',
      });
    });

    expect(api.createTrip).toHaveBeenCalledWith({
      name: 'Kyoto Weekend',
      origin: 'Tokyo',
      destination: 'Kyoto',
      startDate: '2026-04-10',
      endDate: '2026-04-13',
    });
    await waitFor(() => expect(result.current.trip.id).toBe('trip-new'));
    expect(result.current.tripId).toBe('trip-new');
  });

  it('adds a flight via the API and replaces trip state wholesale from the backend response', async () => {
    vi.mocked(api.getItinerary).mockResolvedValue(baseTrip());
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.trip.nodes).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'n1' }), expect.objectContaining({ id: 'n2' })])
    );

    const withFlight = baseTrip({
      nodes: [
        {
          id: 'flight-1', category: 'flight', label: 'Flight', title: 'Delhi to Mumbai', subtitle: '',
          location: 'DEL', scheduledTime: '', provider: 'IndiGo', cost: 5500, cancellationPolicy: '',
          refundable: false, riskLevel: 0, dependencyCount: 0, status: 'healthy', day: 1, icon: 'plane',
        },
      ],
      edges: [],
    });
    vi.mocked(api.addFlightNode).mockResolvedValue(withFlight);

    await act(async () => {
      await result.current.addFlightNode({
        category: 'flight',
        title: 'Delhi to Mumbai',
        provider: 'IndiGo',
        confirmation: '6E-999',
        originCode: 'DEL',
        destinationCode: 'BOM',
        scheduledStart: '2026-05-01T08:00',
        scheduledEnd: '2026-05-01T10:15',
        cost: 5500,
      });
    });

    expect(api.addFlightNode).toHaveBeenCalledWith('trip-ladakh-2025', expect.objectContaining({ title: 'Delhi to Mumbai' }));
    // Trip state was replaced wholesale from the backend's authoritative
    // response - never a client-fabricated node appended to local state.
    expect(result.current.trip.nodes).toHaveLength(1);
    expect(result.current.trip.nodes[0].id).toBe('flight-1');
    expect(result.current.trip.edges).toEqual([]);
  });

  it('deletes a node via the API and replaces trip state wholesale from the backend response', async () => {
    const initialTrip = baseTrip({
      nodes: [
        {
          id: 'flight-1', category: 'flight', label: 'Flight', title: 'Delhi to Mumbai', subtitle: '',
          location: 'DEL', scheduledTime: '', provider: 'IndiGo', cost: 5500, cancellationPolicy: '',
          refundable: false, riskLevel: 0, dependencyCount: 0, status: 'healthy', day: 1, icon: 'plane',
        },
      ],
      edges: [],
    });
    vi.mocked(api.getItinerary).mockResolvedValue(initialTrip);
    const { result } = renderHook(() => useApp(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.trip.nodes).toHaveLength(1);

    const emptyTrip = baseTrip({ nodes: [], edges: [] });
    vi.mocked(api.deleteNode).mockResolvedValue(emptyTrip);

    await act(async () => {
      await result.current.deleteNode('flight-1');
    });

    expect(api.deleteNode).toHaveBeenCalledWith('trip-ladakh-2025', 'flight-1');
    expect(result.current.trip.nodes).toHaveLength(0);
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
