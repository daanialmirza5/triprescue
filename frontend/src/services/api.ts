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

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://127.0.0.1:8000';

/** Every session talks to the FastAPI backend. 'demo' is kept only so a
 * browser that stored it from the retired offline demo is migrated to 'live'. */
export type DataMode = 'live' | 'demo';
let dataMode: DataMode = 'live';

export function setDataMode(mode: DataMode) {
  dataMode = mode;
}

export function getDataMode(): DataMode {
  return dataMode;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const DEFAULT_TIMEOUT_MS = 15000;
// Render's free tier spins the backend down after inactivity; waking it back
// up can take up to ~60s. A single short-timeout request would fail during
// that window, so a request that times out gets one retry with a much longer
// timeout instead of surfacing an error the user can't do anything about.
const COLD_START_TIMEOUT_MS = 55000;

let coldStartHandler: (() => void) | null = null;

// Lets the UI show a "waking up the server" notice while a cold-start retry
// is in flight, instead of the request silently taking up to a minute.
export function onColdStartRetry(handler: (() => void) | null) {
  coldStartHandler = handler;
}

async function attempt<T>(path: string, options: RequestInit, timeoutMs: number): Promise<T> {
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
      throw new ApiError('The SafarSathi backend timed out. Please try again.', 0);
    }
    throw new ApiError('Could not reach the SafarSathi backend. Is it running on ' + API_BASE_URL + '?', 0);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let detail = response.statusText || `Request failed (${response.status})`;
    let details: unknown = undefined;
    try {
      const body = await response.json();
      if (typeof body?.detail === 'string') {
        detail = body.detail;
      } else if (Array.isArray(body?.detail)) {
        const joined = body.detail.map((d: { msg?: string }) => d.msg ?? '').filter(Boolean).join(', ');
        if (joined) detail = joined;
        details = body.detail;
      }
    } catch {
      // response had no JSON body - keep the status text
    }
    throw new ApiError(detail, response.status, details);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    return await attempt<T>(path, options, DEFAULT_TIMEOUT_MS);
  } catch (err) {
    // status 0 = client-side network/abort failure, not a real 4xx/5xx from
    // the server - exactly what a cold, still-waking backend looks like.
    // Only reads are retried: a POST that timed out may already have run on
    // the server, and replaying it would apply a disruption/recovery twice.
    const method = (options.method ?? 'GET').toUpperCase();
    if (err instanceof ApiError && err.status === 0 && method === 'GET') {
      coldStartHandler?.();
      return await attempt<T>(path, options, COLD_START_TIMEOUT_MS);
    }
    throw err;
  }
}

function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined });
}

function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
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

export interface TripCreateRequest {
  name: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
}

export async function createTrip(req: TripCreateRequest): Promise<Trip> {
  return post<Trip>('/api/trips', req);
}

export interface FlightCreateRequest {
  category: 'flight';
  title: string;
  provider: string;
  confirmation: string;
  originCode: string;
  destinationCode: string;
  scheduledStart: string;
  scheduledEnd: string;
  cost: number;
}

export interface HotelCreateRequest {
  category: 'hotel';
  title: string;
  provider: string;
  confirmation: string;
  location: string;
  scheduledStart: string;
  scheduledEnd: string;
  cost: number;
  /** Optional coordinates for the itinerary map (see lib/geocoding.ts). */
  lat?: number;
  lng?: number;
}

export interface ActivityCreateRequest {
  category: 'activity';
  title: string;
  provider: string;
  confirmation: string;
  location: string;
  scheduledStart: string;
  scheduledEnd: string;
  cost: number;
  /** Optional coordinates for the itinerary map (see lib/geocoding.ts). */
  lat?: number;
  lng?: number;
}

export interface TransferCreateRequest {
  category: 'transfer';
  title: string;
  provider: string;
  confirmation: string;
  originCode?: string;
  destinationCode?: string;
  location?: string;
  scheduledStart: string;
  scheduledEnd: string;
  cost: number;
  /** Optional coordinates for the itinerary map (see lib/geocoding.ts). */
  lat?: number;
  lng?: number;
}

export type NodeCreateRequest =
  | FlightCreateRequest
  | HotelCreateRequest
  | ActivityCreateRequest
  | TransferCreateRequest;

export async function addFlightNode(tripId: string, req: FlightCreateRequest): Promise<Trip> {
  return addNode(tripId, req);
}

export async function addNode(tripId: string, req: NodeCreateRequest): Promise<Trip> {
  return post<Trip>(`/api/trips/${tripId}/nodes`, req);
}

export async function deleteNode(tripId: string, nodeId: string): Promise<Trip> {
  return del<Trip>(`/api/trips/${tripId}/nodes/${nodeId}`);
}

export interface TripExport {
  exportedAt: string;
  version: string;
  trip: Trip;
  bookings: Booking[];
}

export async function exportTrip(tripId: string): Promise<TripExport> {
  return get<TripExport>(`/api/trips/${tripId}/export`);
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

/** Plans already generated for the active disruption. Read-only - unlike
 * generateRecoveryOptions it never recreates plans or logs activity, so it is
 * safe to call on every page load. */
export async function listRecoveryOptions(tripId: string): Promise<RecoveryOption[]> {
  return get<RecoveryOption[]>(`/api/trips/${tripId}/recovery-options`);
}

export async function applyRecovery(tripId: string, recoveryId: string): Promise<ApplyRecoveryResult> {
  return post<ApplyRecoveryResult>(`/api/trips/${tripId}/recovery/apply`, { recoveryId });
}

export async function resetTrip(tripId: string): Promise<Trip> {
  return post<Trip>(`/api/trips/${tripId}/reset`);
}

export interface RecoveryNarrative {
  executiveSummary: string | null;
  narrative: string | null;
  topOptionId: string | null;
  optionNotes: Record<string, string>;
  source: 'nugen' | 'llm' | 'deterministic';
}

export interface DisruptionExtraction {
  type: string | null;
  delayMinutes: number | null;
  flightNumber: string | null;
  gate: string | null;
  primaryNodeId: string | null;
  primaryNodeLabel: string | null;
  confidence: number;
  matchedSignals: string[];
  summary: string;
  /** 'fallback' = rule-based parser ('heuristic' from older servers). */
  source: 'fallback' | 'heuristic' | 'llm';
}

export async function getRecoveryNarrative(tripId: string): Promise<RecoveryNarrative> {
  return post<RecoveryNarrative>('/api/assistant/recovery-narrative', { tripId });
}

/** Parse an airline SMS / email into a disruption. */
export async function extractDisruption(text: string, tripId?: string): Promise<DisruptionExtraction> {
  return post<DisruptionExtraction>('/api/assistant/extract-disruption', { text, tripId });
}

export async function askAssistant(tripId: string, message: string): Promise<AssistantAnswer> {
  return post<AssistantAnswer>('/api/assistant', { tripId, message });
}

// ---- Weather, social signals & the weather Digital Twin ----------------------------

export interface HourlyWeather {
  time: string;
  temperatureC: number;
  precipitationProbability: number;
  rainfallMm: number;
  windSpeedKmh: number;
  cloudCover: number;
  visibilityM: number;
  weatherCode: number;
  label: string;
  riskPercent: number;
}

export interface WeatherForecast {
  lat: number;
  lng: number;
  source: 'open-meteo' | 'fallback';
  current: HourlyWeather;
  hourly: HourlyWeather[];
}

export interface NodeWeather {
  nodeId: string;
  title: string;
  category: string;
  location: string;
  lat: number | null;
  lng: number | null;
  scheduledStart: string;
  conditions: HourlyWeather | null;
  /** Weather Vulnerability Index (0-100): how exposed this kind of booking is. */
  vulnerabilityIndex: number;
  /** WVI x forecast risk (0-100). */
  exposure: number;
  /** "open-meteo-current": the booking is outside the 7-day forecast window, so
   * these are the live conditions at that place right now. */
  source: 'open-meteo' | 'open-meteo-current' | 'fallback' | 'unavailable';
}

export interface TripWeather {
  tripId: string;
  nodes: NodeWeather[];
  maxExposure: number;
  mostExposedNodeId: string | null;
  summary: string;
}

export type SocialSignalType = 'airport_congestion' | 'road_waterlogging' | 'transit_strike' | 'weather_warning' | 'crowd_surge' | 'all_clear';

export interface SocialSignal {
  id: string;
  type: SocialSignalType;
  location: string;
  lat: number | null;
  lng: number | null;
  nodeIds: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  sentiment: number;
  intensity: number;
  text: string;
  minutesAgo: number;
  /** "mastodon": a real public post; "simulated": synthesized from the hub's weather. */
  source: 'simulated' | 'mastodon';
  /** Link to the original post (real signals only). */
  url?: string | null;
}

export interface SocialSignals {
  tripId: string;
  signals: SocialSignal[];
  overallSentiment: number;
  summary: string;
}

export interface WeatherScenarioRequest {
  scenarioName: string;
  rainfallMmPerHour: number;
  windSpeedKmh: number;
  visibilityMeters: number;
  temperatureCelsius: number;
  stormDurationHours: number;
  affectedNodeId?: string | null;
  stormStart?: string | null;
}

export interface TwinStateSummary {
  healthScore: number;
  atRiskCommitments: number;
  totalCommitments: number;
  costExposure: number;
}

export interface TwinNode {
  nodeId: string;
  title: string;
  category: string;
  mode: string;
  liveStatus: string;
  twinStatus: string;
  reason: string | null;
  directHit: boolean;
  driver: string | null;
  delayMinutes: number;
  lat: number | null;
  lng: number | null;
}

export interface TwinRisk {
  nodeId: string;
  label: string;
  probability: number;
  low: number;
  high: number;
}

export interface CascadeLink {
  /** "weather" for a direct weather hit. */
  fromNodeId: string;
  toNodeId: string;
  status: string;
}

export interface TwinChange {
  nodeId: string;
  title: string;
  changeType: string;
  newStart: string;
  newEnd: string;
  costDelta: number;
  description: string;
}

export interface TwinOption {
  id: string;
  name: string;
  strategy: string;
  description: string;
  changes: TwinChange[];
  deltaCost: number;
  timeImpactMinutes: number;
  commitmentsPreserved: number;
  totalCommitments: number;
  healthScore: number;
  residualFailures: number;
  score: number;
  recommended: boolean;
  notes: string[];
}

export interface DigitalTwinSimulation {
  simulationId: string;
  tripId: string;
  scenarioName: string;
  severity: number;
  stormWindowStart: string;
  stormWindowEnd: string;
  live: TwinStateSummary;
  twin: TwinStateSummary;
  healthDelta: number;
  nodes: TwinNode[];
  risks: TwinRisk[];
  cascade: CascadeLink[];
  options: TwinOption[];
  socialSignals: SocialSignals;
  explanation: string;
  explanationSource: 'nugen' | 'heuristic';
  model: string | null;
  mitigation: string[];
  mitigationSource: 'nugen' | 'heuristic';
  expiresAt: string;
}

export interface DigitalTwinApplyResult {
  trip: Trip;
  appliedOption: TwinOption;
  validation: TwinStateSummary;
  allConnectionsValid: boolean;
}

export async function getWeather(lat: number, lng: number, hours = 24): Promise<WeatherForecast> {
  return get<WeatherForecast>(`/api/weather?lat=${lat}&lng=${lng}&hours=${hours}`);
}

export async function getTripWeather(tripId: string): Promise<TripWeather> {
  return get<TripWeather>(`/api/trips/${tripId}/weather`);
}

export async function getSocialSignals(tripId: string): Promise<SocialSignals> {
  return get<SocialSignals>(`/api/trips/${tripId}/social-signals`);
}

export async function simulateDigitalTwin(tripId: string, req: WeatherScenarioRequest): Promise<DigitalTwinSimulation> {
  return post<DigitalTwinSimulation>(`/api/trips/${tripId}/digital-twin/simulate`, req);
}

export async function applyDigitalTwin(tripId: string, simulationId: string, optionId: string): Promise<DigitalTwinApplyResult> {
  return post<DigitalTwinApplyResult>(`/api/trips/${tripId}/digital-twin/apply`, { simulationId, optionId });
}

// ---- Live travel data (Aviationstack, RailRadar, OpenStreetMap, Ticketmaster) ---------------
// Backend-only integrations: API keys never reach the browser, and simulated
// data is never presented as live.

export type TransportStatus = 'scheduled' | 'boarding' | 'departed' | 'en_route' | 'arrived' | 'delayed' | 'cancelled' | 'diverted' | 'unknown';
export type ExternalSource = 'aviationstack' | 'railradar' | 'openstreetmap' | 'ticketmaster';
export type ExternalKind = 'flight' | 'train' | 'hotel' | 'attraction' | 'event';

export interface PlaceRef { code: string | null; name: string; latitude: number | null; longitude: number | null }
export interface GeoPoint { latitude: number; longitude: number }
export interface RouteStop { code: string; name: string; latitude: number | null; longitude: number | null }

export interface LiveTransport {
  id: string;
  mode: 'flight' | 'train';
  provider: 'aviationstack' | 'railradar';
  source: ExternalSource;
  externalId: string;
  dataSource: 'live' | 'simulation';
  number: string | null;
  name: string | null;
  operator: string | null;
  origin: PlaceRef | null;
  destination: PlaceRef | null;
  status: TransportStatus;
  delayMinutes: number | null;
  currentLocation: GeoPoint | null;
  currentLocationName: string | null;
  speedKmh: number | null;
  altitudeMeters: number | null;
  heading: number | null;
  isOnGround: boolean | null;
  aircraft: string | null;
  scheduledDeparture: string | null;
  estimatedDeparture: string | null;
  actualDeparture: string | null;
  scheduledArrival: string | null;
  estimatedArrival: string | null;
  actualArrival: string | null;
  previousStop: PlaceRef | null;
  nextStop: PlaceRef | null;
  platform: string | null;
  route: RouteStop[];
  journeyDate: string | null;
  notices: string[];
  lastUpdatedAt: string;
  retrievedAt: string;
}

export interface TrainBetween {
  id: string;
  source: 'railradar';
  externalId: string;
  dataSource: 'live';
  number: string;
  name: string;
  trainType: string | null;
  origin: PlaceRef;
  destination: PlaceRef;
  departureTime: string | null;
  arrivalTime: string | null;
  arrivalDayOffset: number;
  durationMinutes: number | null;
  runDays: string[];
  liveDelayMinutes: number | null;
  livePlatform: string | null;
}

export interface TrainsBetweenResult { origin: PlaceRef; destination: PlaceRef; date: string | null; trains: TrainBetween[]; retrievedAt: string }

export interface Hotel {
  id: string;
  type: 'hotel';
  source: 'openstreetmap';
  externalId: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  phone: string | null;
  website: string | null;
  stars: number | null;
  sourceUrl: string;
  lastUpdatedAt: string;
}

export interface Attraction {
  id: string;
  type: 'attraction';
  source: 'openstreetmap';
  externalId: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  website: string | null;
  sourceUrl: string;
  lastUpdatedAt: string;
}

export interface TravelEvent {
  id: string;
  type: 'event';
  source: 'ticketmaster';
  externalId: string;
  name: string;
  venue: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  startTime: string | null;
  startDate: string | null;
  endTime: string | null;
  category: string | null;
  imageUrl: string | null;
  ticketUrl: string | null;
  status: string | null;
  lastUpdatedAt: string;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  airportCode: string | null;
  stationCode: string | null;
  regionMatch: string | null;
  source: 'catalog' | 'nominatim';
}

export interface ProviderHealth { provider: string; available: boolean; configured: boolean; detail: string }
export interface LiveHealth { flights: ProviderHealth; trains: ProviderHealth; places: ProviderHealth; events: ProviderHealth }

export interface ExternalItem {
  kind: ExternalKind;
  source: ExternalSource;
  externalId: string;
  title: string;
  operator?: string | null;
  location?: string | null;
  originCode?: string | null;
  destinationCode?: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  lat?: number | null;
  lng?: number | null;
}

export interface ExternalItemLink { nodeId: string; kind: ExternalKind; source: ExternalSource; externalId: string }
export interface ExternalItemAddResult { trip: Trip; nodeId: string; alreadyAdded: boolean; link: ExternalItemLink }
export interface TrackedTransport { nodeId: string; kind: 'flight' | 'train'; source: ExternalSource; externalId: string; live: LiveTransport | null; error: string | null }

function query(params: Record<string, string | number | null | undefined>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') q.set(k, String(v)); });
  const s = q.toString();
  return s ? `?${s}` : '';
}

export async function getLiveHealth(): Promise<LiveHealth> {
  return get<LiveHealth>('/api/live/health');
}

export async function searchLiveFlights(params: { flightNumber?: string; dep?: string; arr?: string; limit?: number }): Promise<LiveTransport[]> {
  return get<LiveTransport[]>(`/api/live/flights${query(params)}`);
}

export async function getLiveFlight(flightNumber: string, date?: string): Promise<LiveTransport> {
  return get<LiveTransport>(`/api/live/flights/${encodeURIComponent(flightNumber)}${query({ date })}`);
}

export async function getLiveTrain(trainNumber: string, date?: string): Promise<LiveTransport> {
  return get<LiveTransport>(`/api/live/trains/${encodeURIComponent(trainNumber)}${query({ date })}`);
}

export async function getTrainsBetween(from: string, to: string, date?: string): Promise<TrainsBetweenResult> {
  return get<TrainsBetweenResult>(`/api/live/trains/between${query({ from, to, date })}`);
}

export async function searchDestinations(q?: string): Promise<Destination[]> {
  return get<Destination[]>(`/api/destinations${query({ query: q })}`);
}

export interface PlaceSearch { city?: string; latitude?: number; longitude?: number; radius?: number; query?: string; limit?: number }

export async function searchHotels(params: PlaceSearch): Promise<Hotel[]> {
  return get<Hotel[]>(`/api/places/hotels${query({ ...params })}`);
}

export async function searchAttractions(params: PlaceSearch & { category?: string }): Promise<Attraction[]> {
  return get<Attraction[]>(`/api/places/attractions${query({ ...params })}`);
}

export async function searchEvents(params: { city?: string; latitude?: number; longitude?: number; radius?: number; startDate?: string; endDate?: string; category?: string; keyword?: string; limit?: number }): Promise<TravelEvent[]> {
  return get<TravelEvent[]>(`/api/events${query({ ...params })}`);
}

export async function listExternalItems(tripId: string): Promise<ExternalItemLink[]> {
  return get<ExternalItemLink[]>(`/api/trips/${tripId}/external-items`);
}

export async function addExternalItem(tripId: string, item: ExternalItem): Promise<ExternalItemAddResult> {
  return post<ExternalItemAddResult>(`/api/trips/${tripId}/external-items`, item);
}

export async function getTrackedTransport(tripId: string): Promise<TrackedTransport[]> {
  return get<TrackedTransport[]>(`/api/live/trips/${tripId}/tracked`);
}

// ---- Live Journey Pipeline (execution trace of real workflows on the demo journey) ------

export interface PipelineWorkflow {
  id: string;
  label: string;
  mode: 'live' | 'simulation';
  dataSource: 'demo' | 'live';
  description: string;
  available: boolean;
  note: string | null;
}

export interface PipelineDemo { trip: Trip; traveller: string; workflows: PipelineWorkflow[] }

export interface PipelineEvent {
  type: 'stage' | 'node';
  runId: string;
  seq: number;
  timestamp: string;
  elapsedMs: number;
  stage: string;
  status: string;
  spanId?: string;
  component?: string;
  function?: string;
  file?: string | null;
  line?: number | null;
  message?: string | null;
  durationMs?: number;
  detail?: Record<string, unknown> | null;
  error?: string;
  httpStatus?: number;
  // node events
  nodeId?: string;
  title?: string;
  category?: string;
  relation?: 'disrupted' | 'affected' | 'no_dependency_path' | 'buffer_absorbed';
  reason?: string;
  causedBy?: string | null;
  path?: string[];
  delayMinutes?: number;
  availableBufferMinutes?: number | null;
  requiredBufferMinutes?: number | null;
}

export interface PipelineRunState {
  runId: string;
  workflow: string;
  mode: 'live' | 'simulation';
  dataSource: 'demo' | 'live';
  paceMs: number;
  fault: string | null;
  done: boolean;
  error: string | null;
  startedAt: string;
  events: PipelineEvent[];
  result: { workflow: string; mode: string; dataSource: string; response: Record<string, unknown> | null; trip: Trip } | null;
}

export interface ArchitectureNode {
  id: string;
  layer: 'api' | 'service' | 'engine' | 'database' | 'table' | 'provider' | 'external';
  label: string;
  module: string | null;
  file: string | null;
  description: string;
  functions: { name: string; line: number }[];
}
export interface ArchitectureEdge { id: string; source: string; target: string; kind: string; calls: { caller: string; callee: string; file: string; line: number }[] }
export interface ArchitectureRoute {
  id: string; method: string; path: string; router: string; function: string; file: string | null; line: number | null;
  auth: boolean; requestSchema: string | null; responseSchema: string | null; calls: string[];
}
export interface Architecture { nodes: ArchitectureNode[]; edges: ArchitectureEdge[]; routes: ArchitectureRoute[]; layers: string[] }


export async function getPipelineDemo(): Promise<PipelineDemo> {
  return get<PipelineDemo>('/api/pipeline/demo');
}

export async function startPipelineRun(workflow: string, params: Record<string, unknown>, paceMs: number): Promise<PipelineRunState> {
  return post<PipelineRunState>('/api/pipeline/runs', { workflow, params, paceMs });
}

/** Long-poll: resolves as soon as the backend has new events for the run. */
export async function getPipelineEvents(runId: string, after: number): Promise<PipelineRunState> {
  return get<PipelineRunState>(`/api/pipeline/runs/${encodeURIComponent(runId)}/events?after=${after}&wait=8`);
}

export async function getArchitecture(): Promise<Architecture> {
  return get<Architecture>('/api/pipeline/architecture');
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
