import type {
  Trip,
  Disruption,
  RecoveryOption,
  RiskScore,
  RiskCardData,
  Alert,
  Booking,
  ActivityEvent,
  Notification,
  TravelerPreferences,
} from '@/types';
import { getStoredToken } from '@/lib/authStorage';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const DEFAULT_TIMEOUT_MS = 12000;

async function request<T>(path: string, options: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const token = getStoredToken();
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('The TripRescue backend timed out. Please try again.', 0);
    }
    throw new ApiError('Could not reach the TripRescue backend. Is it running on ' + API_BASE_URL + '?', 0);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let detail = response.statusText || `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body?.detail === 'string') detail = body.detail;
    } catch {
      // response had no JSON body - keep the status text
    }
    throw new ApiError(detail, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined });
}

export interface TripSummary {
  id: string;
  name: string;
  route: string;
  startDate: string;
  endDate: string;
  tripValue: number;
  healthScore: number;
  status: Trip['status'];
  nodeCount: number;
  edgeCount: number;
}

export interface ImpactEntry {
  nodeId: string;
  status: string;
  reason: string | null;
  causedBy: string | null;
  availableBufferMinutes: number | null;
  requiredBufferMinutes: number | null;
}

export interface PropagationResult {
  disruption: Disruption;
  impacts: ImpactEntry[];
  sequence: string[];
  tripHealthScore: number;
}

export interface RiskAnalysis {
  score: RiskScore;
  cards: RiskCardData[];
  alerts: Alert[];
}

export interface ApplyRecoveryResult {
  trip: Trip;
  appliedRecovery: RecoveryOption;
  activityEvent: ActivityEvent;
  notification: Notification;
}

export interface AssistantReferenceOut {
  type: 'node' | 'recovery' | 'risk';
  id: string;
  label: string;
}

export interface AssistantAnswer {
  content: string;
  references: AssistantReferenceOut[];
  source: 'llm' | 'deterministic';
}

export interface DisruptionRequest {
  type: string;
  primaryNodeId?: string;
  delayMinutes?: number;
}

export async function listTrips(): Promise<TripSummary[]> {
  return get<TripSummary[]>('/api/trips');
}

export async function getItinerary(tripId: string): Promise<Trip> {
  return get<Trip>(`/api/trips/${tripId}`);
}

export async function getGraph(tripId: string): Promise<Trip> {
  return get<Trip>(`/api/trips/${tripId}/graph`);
}

export async function getRiskAnalysis(tripId: string): Promise<RiskAnalysis> {
  return get<RiskAnalysis>(`/api/trips/${tripId}/risks`);
}

export async function getBookings(tripId: string): Promise<Booking[]> {
  return get<Booking[]>(`/api/trips/${tripId}/bookings`);
}

export async function getActivityLog(tripId: string): Promise<ActivityEvent[]> {
  return get<ActivityEvent[]>(`/api/trips/${tripId}/activity`);
}

export async function getNotifications(tripId: string): Promise<Notification[]> {
  return get<Notification[]>(`/api/trips/${tripId}/notifications`);
}

export async function markNotificationsRead(tripId: string): Promise<void> {
  await post<void>(`/api/trips/${tripId}/notifications/read`);
}

export async function getPreferences(tripId: string): Promise<TravelerPreferences> {
  return get<TravelerPreferences>(`/api/trips/${tripId}/preferences`);
}

export async function setPreferences(tripId: string, preferences: TravelerPreferences): Promise<void> {
  await post<void>(`/api/trips/${tripId}/preferences`, preferences);
}

export async function triggerDisruption(tripId: string, req: DisruptionRequest): Promise<PropagationResult> {
  return post<PropagationResult>(`/api/trips/${tripId}/disruptions`, req);
}

export async function simulateDisruption(tripId: string, req: DisruptionRequest): Promise<PropagationResult> {
  return post<PropagationResult>(`/api/trips/${tripId}/simulate`, req);
}

export async function repropagate(tripId: string): Promise<PropagationResult> {
  return post<PropagationResult>(`/api/trips/${tripId}/propagate`);
}

export async function generateRecoveryOptions(tripId: string): Promise<RecoveryOption[]> {
  return post<RecoveryOption[]>(`/api/trips/${tripId}/recovery-options/generate`);
}

export async function applyRecovery(tripId: string, recoveryId: string): Promise<ApplyRecoveryResult> {
  return post<ApplyRecoveryResult>(`/api/trips/${tripId}/recovery/apply`, { recoveryId });
}

export async function resetTrip(tripId: string): Promise<Trip> {
  return post<Trip>(`/api/trips/${tripId}/reset`);
}

export async function askAssistant(tripId: string, message: string): Promise<AssistantAnswer> {
  return post<AssistantAnswer>('/api/assistant', { tripId, message });
}

export async function checkHealth(): Promise<boolean> {
  try {
    await get<{ status: string }>('/api/health');
    return true;
  } catch {
    return false;
  }
}

export interface AuthResponse {
  token: string;
  travelerId: string;
  name: string;
  email: string;
}

export interface TravelerProfile {
  travelerId: string;
  name: string;
  email: string;
  homeAirport: string;
  loyaltyTier: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return post<AuthResponse>('/api/auth/login', { email, password });
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return post<AuthResponse>('/api/auth/register', { name, email, password });
}

export async function getDemoAccount(): Promise<AuthResponse> {
  return get<AuthResponse>('/api/auth/demo-account');
}

export async function getMe(): Promise<TravelerProfile> {
  return get<TravelerProfile>('/api/auth/me');
}
