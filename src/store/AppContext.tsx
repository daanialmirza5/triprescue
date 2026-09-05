import { createContext, useContext, useReducer, useCallback, type ReactNode, useEffect, useRef } from 'react';
import type {
  Trip,
  DependencyEdgeData,
  Disruption,
  RecoveryOption,
  Notification,
  TravelerPreferences,
  ActivityEvent,
} from '@/types';
import { initialTrip, defaultPreferences } from '@/data/mockData';
import * as api from '@/services/api';
import { ApiError } from '@/services/api';

export type AppPhase = 'idle' | 'disrupted' | 'analyzing' | 'recovering' | 'recovered';

const DEFAULT_TRIP_ID = 'trip-ladakh-2025';
const CASCADE_STEP_MS = 450;

export interface AppState {
  tripId: string;
  trip: Trip;
  /** Snapshot of the trip exactly as it was the moment the active disruption
   * started - real data for the "before" side of Before/After, not a
   * synthesized "everything healthy" guess. */
  preDisruptionTrip: Trip | null;
  phase: AppPhase;
  activeDisruption: Disruption | null;
  recoveryOptions: RecoveryOption[];
  selectedRecovery: string | null;
  appliedRecovery: RecoveryOption | null;
  notifications: Notification[];
  activityLog: ActivityEvent[];
  preferences: TravelerPreferences;
  unreadCount: number;
  demoRunning: boolean;
  isBusy: boolean;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; trip: Trip; activityLog: ActivityEvent[]; notifications: Notification[]; preferences: TravelerPreferences }
  | { type: 'LOAD_ERROR'; message: string }
  | { type: 'SWITCH_TRIP'; tripId: string }
  | { type: 'SET_BUSY'; busy: boolean }
  | { type: 'DISRUPTION_STARTED'; disruption: Disruption }
  | { type: 'NODE_EDGE_UPDATE'; nodeUpdates: { nodeId: string; status: string; reason?: string | null }[]; edgeUpdates: { edgeId: string; status: string; animated?: boolean }[] }
  | { type: 'SET_PHASE'; phase: AppPhase }
  | { type: 'SET_RECOVERY_OPTIONS'; options: RecoveryOption[] }
  | { type: 'SELECT_RECOVERY'; recoveryId: string | null }
  | { type: 'RECOVERY_APPLIED'; trip: Trip; recovery: RecoveryOption }
  | { type: 'TRIP_RESET'; trip: Trip }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'REFRESH_ACTIVITY'; activityLog: ActivityEvent[]; notifications: Notification[] }
  | { type: 'SET_PREFERENCES'; preferences: TravelerPreferences }
  | { type: 'SET_DEMO_RUNNING'; running: boolean };

function applyUpdates(
  nodes: Trip['nodes'],
  edges: DependencyEdgeData[],
  nodeUpdates: { nodeId: string; status: string; reason?: string | null }[],
  edgeUpdates: { edgeId: string; status: string; animated?: boolean }[]
) {
  const newNodes = nodes.map((n) => {
    const update = nodeUpdates.find((u) => u.nodeId === n.id);
    if (!update) return n;
    return { ...n, status: update.status as Trip['nodes'][number]['status'], reason: update.reason ?? n.reason };
  });
  const newEdges = edges.map((e) => {
    const update = edgeUpdates.find((u) => u.edgeId === e.id);
    if (!update) return e;
    return { ...e, status: update.status as DependencyEdgeData['status'], animated: update.animated ?? e.animated };
  });
  return { newNodes, newEdges };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        trip: action.trip,
        activityLog: action.activityLog,
        notifications: action.notifications,
        unreadCount: action.notifications.filter((n) => !n.read).length,
        preferences: action.preferences,
        phase: action.trip.status === 'disrupted' ? 'disrupted' : action.trip.status === 'recovering' ? 'recovering' : action.trip.status === 'recovered' ? 'recovered' : 'idle',
      };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.message };
    case 'SWITCH_TRIP':
      return {
        ...state,
        tripId: action.tripId,
        loading: true,
        error: null,
        phase: 'idle',
        activeDisruption: null,
        preDisruptionTrip: null,
        recoveryOptions: [],
        selectedRecovery: null,
        appliedRecovery: null,
        demoRunning: false,
        isBusy: false,
      };
    case 'SET_BUSY':
      return { ...state, isBusy: action.busy };
    case 'DISRUPTION_STARTED':
      return {
        ...state,
        phase: 'disrupted',
        activeDisruption: action.disruption,
        preDisruptionTrip: structuredClone(state.trip),
        selectedRecovery: null,
        appliedRecovery: null,
        recoveryOptions: [],
      };
    case 'NODE_EDGE_UPDATE': {
      const { newNodes, newEdges } = applyUpdates(state.trip.nodes, state.trip.edges, action.nodeUpdates, action.edgeUpdates);
      return { ...state, trip: { ...state.trip, nodes: newNodes, edges: newEdges } };
    }
    case 'SET_PHASE':
      return { ...state, phase: action.phase };
    case 'SET_RECOVERY_OPTIONS':
      return { ...state, recoveryOptions: action.options, phase: 'recovering' };
    case 'SELECT_RECOVERY':
      return { ...state, selectedRecovery: action.recoveryId };
    case 'RECOVERY_APPLIED':
      return {
        ...state,
        trip: action.trip,
        appliedRecovery: action.recovery,
        phase: 'recovered',
        selectedRecovery: action.recovery.id,
      };
    case 'TRIP_RESET':
      return {
        ...state,
        trip: action.trip,
        preDisruptionTrip: null,
        phase: 'idle',
        activeDisruption: null,
        recoveryOptions: [],
        selectedRecovery: null,
        appliedRecovery: null,
        demoRunning: false,
      };
    case 'MARK_NOTIFICATIONS_READ':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })), unreadCount: 0 };
    case 'REFRESH_ACTIVITY':
      return {
        ...state,
        activityLog: action.activityLog,
        notifications: action.notifications,
        unreadCount: action.notifications.filter((n) => !n.read).length,
      };
    case 'SET_PREFERENCES':
      return { ...state, preferences: action.preferences };
    case 'SET_DEMO_RUNNING':
      return { ...state, demoRunning: action.running };
    default:
      return state;
  }
}

const initialState: AppState = {
  tripId: DEFAULT_TRIP_ID,
  trip: structuredClone(initialTrip),
  preDisruptionTrip: null,
  phase: 'idle',
  activeDisruption: null,
  recoveryOptions: [],
  selectedRecovery: null,
  appliedRecovery: null,
  notifications: [],
  activityLog: [],
  preferences: { ...defaultPreferences },
  unreadCount: 0,
  demoRunning: false,
  isBusy: false,
  loading: true,
  error: null,
};

interface AppContextValue extends AppState {
  reload: () => Promise<void>;
  switchTrip: (tripId: string) => void;
  triggerDisruption: (type: string, options?: { primaryNodeId?: string; delayMinutes?: number }) => Promise<void>;
  loadRecoveryOptions: () => Promise<void>;
  selectRecovery: (id: string | null) => void;
  applyRecoveryPlan: (recoveryId: string) => Promise<void>;
  resetTrip: () => Promise<void>;
  markNotificationsRead: () => void;
  setPreferences: (p: TravelerPreferences) => Promise<void>;
  setDemoRunning: (r: boolean) => void;
  setPhase: (p: AppPhase) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Single timer registry shared by the cascade animation, whether it was
  // started by a manual "Simulate Disruption" or by Demo Mode - there is only
  // ever one mechanism, and starting a new sequence always cancels the old one
  // first, so a manual trigger can never race a running demo.
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sequenceTokenRef = useRef(0);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
  }, []);

  const refreshActivity = useCallback(async (tripId: string) => {
    try {
      const [activityLog, notifications] = await Promise.all([
        api.getActivityLog(tripId),
        api.getNotifications(tripId),
      ]);
      dispatch({ type: 'REFRESH_ACTIVITY', activityLog, notifications });
    } catch {
      // Non-fatal: the main trip state already updated; activity/notifications
      // are supplementary and will refresh on the next successful call.
    }
  }, []);

  const reload = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const [trip, activityLog, notifications, preferences] = await Promise.all([
        api.getItinerary(state.tripId),
        api.getActivityLog(state.tripId),
        api.getNotifications(state.tripId),
        api.getPreferences(state.tripId).catch(() => ({ ...defaultPreferences })),
      ]);
      dispatch({ type: 'LOAD_SUCCESS', trip, activityLog, notifications, preferences });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not load your trip.';
      dispatch({ type: 'LOAD_ERROR', message });
    }
  }, [state.tripId]);

  const switchTrip = useCallback(
    (tripId: string) => {
      if (tripId === state.tripId) return;
      clearTimers();
      sequenceTokenRef.current += 1; // invalidate any in-flight cascade animation
      dispatch({ type: 'SWITCH_TRIP', tripId });
    },
    [state.tripId, clearTimers]
  );

  useEffect(() => {
    reload();
    // Re-fires on trip switch (reload's identity changes with state.tripId);
    // deliberately not depending on `reload` itself to avoid re-running on
    // every unrelated state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tripId]);

  /** Reveals backend-computed impacts one at a time for the cascade animation.
   * The backend has ALREADY decided every status - this only staggers the
   * reveal for visual effect and never changes the outcome. */
  const runImpactSequence = useCallback(
    (impacts: api.ImpactEntry[], sequence: string[], token: number) => {
      const impactByNode = new Map(impacts.map((i) => [i.nodeId, i]));
      let step = 0;
      sequence.forEach((nodeId) => {
        const impact = impactByNode.get(nodeId);
        if (!impact || impact.status === 'healthy') return;
        const delay = step * CASCADE_STEP_MS;
        step += 1;
        addTimer(() => {
          if (sequenceTokenRef.current !== token) return;
          const edgeUpdates = state.trip.edges
            .filter((e) => e.target === nodeId)
            .map((e) => ({ edgeId: e.id, status: impact.status, animated: impact.status === 'broken' }));
          dispatch({
            type: 'NODE_EDGE_UPDATE',
            nodeUpdates: [{ nodeId, status: impact.status, reason: impact.reason }],
            edgeUpdates,
          });
        }, delay);
      });
      return step * CASCADE_STEP_MS + 200;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addTimer]
  );

  const triggerDisruption = useCallback(
    async (type: string, options?: { primaryNodeId?: string; delayMinutes?: number }) => {
      if (state.isBusy) return;
      clearTimers();
      const token = ++sequenceTokenRef.current;
      dispatch({ type: 'SET_BUSY', busy: true });
      try {
        const result = await api.triggerDisruption(state.tripId, {
          type,
          primaryNodeId: options?.primaryNodeId,
          delayMinutes: options?.delayMinutes,
        });
        dispatch({ type: 'DISRUPTION_STARTED', disruption: result.disruption });
        const cascadeDuration = runImpactSequence(result.impacts, result.sequence, token);

        await new Promise<void>((resolve) => {
          addTimer(() => resolve(), cascadeDuration);
        });
        if (sequenceTokenRef.current !== token) return;

        dispatch({ type: 'SET_PHASE', phase: 'analyzing' });
        const recoveryOptions = await api.generateRecoveryOptions(state.tripId);
        if (sequenceTokenRef.current !== token) return;
        dispatch({ type: 'SET_RECOVERY_OPTIONS', options: recoveryOptions });
        await refreshActivity(state.tripId);
      } catch (err) {
        dispatch({
          type: 'LOAD_ERROR',
          message: err instanceof ApiError ? err.message : 'Failed to trigger disruption.',
        });
      } finally {
        dispatch({ type: 'SET_BUSY', busy: false });
      }
    },
    [state.isBusy, state.tripId, clearTimers, addTimer, runImpactSequence, refreshActivity]
  );

  const loadRecoveryOptions = useCallback(async () => {
    try {
      const options = await api.generateRecoveryOptions(state.tripId);
      dispatch({ type: 'SET_RECOVERY_OPTIONS', options });
      await refreshActivity(state.tripId);
    } catch (err) {
      dispatch({ type: 'LOAD_ERROR', message: err instanceof ApiError ? err.message : 'Failed to generate recovery options.' });
    }
  }, [state.tripId, refreshActivity]);

  const selectRecovery = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_RECOVERY', recoveryId: id });
  }, []);

  const applyRecoveryPlan = useCallback(
    async (recoveryId: string) => {
      if (state.isBusy) return;
      dispatch({ type: 'SET_BUSY', busy: true });
      try {
        const result = await api.applyRecovery(state.tripId, recoveryId);
        dispatch({ type: 'RECOVERY_APPLIED', trip: result.trip, recovery: result.appliedRecovery });
        await refreshActivity(state.tripId);
      } catch (err) {
        dispatch({ type: 'LOAD_ERROR', message: err instanceof ApiError ? err.message : 'Failed to apply recovery.' });
        throw err;
      } finally {
        dispatch({ type: 'SET_BUSY', busy: false });
      }
    },
    [state.isBusy, state.tripId, refreshActivity]
  );

  const resetTrip = useCallback(async () => {
    clearTimers();
    sequenceTokenRef.current += 1; // invalidate any in-flight cascade animation
    dispatch({ type: 'SET_BUSY', busy: true });
    try {
      const trip = await api.resetTrip(state.tripId);
      dispatch({ type: 'TRIP_RESET', trip });
      await refreshActivity(state.tripId);
    } catch (err) {
      dispatch({ type: 'LOAD_ERROR', message: err instanceof ApiError ? err.message : 'Failed to reset trip.' });
    } finally {
      dispatch({ type: 'SET_BUSY', busy: false });
    }
  }, [clearTimers, state.tripId, refreshActivity]);

  const markNotificationsRead = useCallback(() => {
    dispatch({ type: 'MARK_NOTIFICATIONS_READ' });
    api.markNotificationsRead(state.tripId).catch(() => {
      /* best-effort - local state already reflects "read" */
    });
  }, [state.tripId]);

  const setPreferences = useCallback(
    async (p: TravelerPreferences) => {
      dispatch({ type: 'SET_PREFERENCES', preferences: p });
      try {
        await api.setPreferences(state.tripId, p);
      } catch {
        /* preferences remain applied locally even if the persist call fails */
      }
    },
    [state.tripId]
  );

  const setDemoRunning = useCallback((r: boolean) => {
    dispatch({ type: 'SET_DEMO_RUNNING', running: r });
  }, []);

  const setPhase = useCallback((p: AppPhase) => {
    dispatch({ type: 'SET_PHASE', phase: p });
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        reload,
        switchTrip,
        triggerDisruption,
        loadRecoveryOptions,
        selectRecovery,
        applyRecoveryPlan,
        resetTrip,
        markNotificationsRead,
        setPreferences,
        setDemoRunning,
        setPhase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
