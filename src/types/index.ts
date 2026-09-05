export type NodeStatus = 'healthy' | 'at-risk' | 'broken' | 'delayed' | 'cancelled' | 'recovered';
export type EdgeStatus = 'healthy' | 'at-risk' | 'broken' | 'recovered';

export type NodeCategory =
  | 'flight'
  | 'connection'
  | 'transfer'
  | 'hotel'
  | 'activity'
  | 'return';

export interface ItineraryNodeData {
  id: string;
  category: NodeCategory;
  label: string;
  title: string;
  subtitle: string;
  location: string;
  scheduledTime: string;
  actualTime?: string;
  buffer?: string;
  provider: string;
  confirmation?: string;
  cost: number;
  cancellationPolicy: string;
  refundable: boolean;
  riskLevel: number;
  dependencyCount: number;
  status: NodeStatus;
  day: number;
  icon: string;
  description?: string;
  refundAmount?: number;
  lat?: number;
  lng?: number;

  // Additive backend-computed explainability fields (optional so mock/demo
  // data without them still satisfies this type).
  reason?: string | null;
  causedBy?: string | null;
  scheduledStart?: string;
  scheduledEnd?: string;
  actualStart?: string | null;
  actualEnd?: string | null;
  availableBufferMinutes?: number | null;
  requiredBufferMinutes?: number | null;
}

export interface DependencyEdgeData {
  id: string;
  source: string;
  target: string;
  status: EdgeStatus;
  label?: string;
  type?: 'dependency' | 'recovery';
  animated?: boolean;
}

export interface Trip {
  id: string;
  name: string;
  travelerName: string;
  route: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  nodes: ItineraryNodeData[];
  edges: DependencyEdgeData[];
  tripValue: number;
  healthScore: number;
  status: 'operational' | 'disrupted' | 'recovering' | 'recovered';
  days: TripDay[];
}

export interface TripDay {
  day: number;
  date: string;
  title: string;
  summary: string;
  nodeIds: string[];
}

export interface Disruption {
  id: string;
  type:
    | 'flight-delay'
    | 'flight-cancellation'
    | 'missed-connection'
    | 'hotel-conflict'
    | 'hotel-cancellation'
    | 'transfer-failure'
    | 'activity-cancellation'
    | 'activity-delay'
    | 'airport-closure';
  label: string;
  primaryNodeId: string;
  delayMinutes?: number;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  directImpact: number;
  downstreamImpact: number;
  financialExposure: number;
  refundExposure: number;
  cascadeSteps: CascadeStep[];
  detectedAt: string;
}

export interface CascadeStep {
  id: string;
  description: string;
  nodeId?: string;
  timestamp: string;
}

export interface RecoveryOption {
  id: string;
  name: string;
  tag: string;
  tagColor: 'cyan' | 'green' | 'amber' | 'blue' | 'violet';
  description: string;
  costDelta: number;
  timeImpactMinutes: number;
  bookingsPreserved: number;
  totalBookings: number;
  refundRecovered: number;
  residualRisk: 'low' | 'medium' | 'high';
  score: number;
  changes: RecoveryChange[];
  scoreBreakdown: ScoreBreakdown;
}

export interface RecoveryChange {
  nodeId: string;
  nodeLabel: string;
  changeType: 'rebooked' | 'rescheduled' | 'cancelled' | 'preserved' | 'new';
  description: string;
}

export interface ScoreBreakdown {
  cost: number;
  speed: number;
  preservation: number;
  comfort: number;
  risk: number;
}

export interface RiskScore {
  tripResilience: number;
  connectionRisk: number;
  scheduleRisk: number;
  vendorRisk: number;
  weatherRisk: number;
}

export interface RiskCardData {
  nodeId: string;
  nodeLabel: string;
  riskType: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskPercent: number;
  buffer?: string;
  recommended?: string;
  historicalRisk: string;
  downstreamImpact: number;
  recommendation: string;
}

export interface Alert {
  id: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  title: string;
  reason: string;
  impact: string;
  action: string;
  nodeId?: string;
  timestamp: string;
}

export interface Booking {
  id: string;
  category: 'flight' | 'hotel' | 'transfer' | 'activity' | 'return';
  provider: string;
  confirmation: string;
  date: string;
  time: string;
  cost: number;
  refundable: boolean;
  cancellationPolicy: string;
  status: NodeStatus;
  riskLevel: number;
  route?: string;
  nodeId: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'monitoring' | 'risk' | 'recovery' | 'booking' | 'system' | 'disruption';
  message: string;
  detail?: string;
}

export interface Notification {
  id: string;
  severity: 'high' | 'medium' | 'low' | 'system';
  category: 'risk' | 'recovery' | 'booking' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  references?: { type: 'node' | 'recovery' | 'risk'; id: string; label: string }[];
}

export interface TravelerPreferences {
  costVsSpeed: number;
  disruptionVsComfort: number;
  recoveryPriorities: {
    minimizeCost: boolean;
    minimizeTime: boolean;
    minimizeDisruption: boolean;
    maximizeComfort: boolean;
  };
}

export interface DisruptionType {
  id: Disruption['type'];
  label: string;
  description: string;
  icon: string;
}
