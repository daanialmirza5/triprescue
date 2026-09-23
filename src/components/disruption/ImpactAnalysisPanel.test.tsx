import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImpactAnalysisPanel } from './ImpactAnalysisPanel';
import * as AppContextModule from '@/store/AppContext';
import type { Disruption, Trip } from '@/types';

vi.mock('@/store/AppContext', () => ({
  useApp: vi.fn(),
}));

const mockTrip: Trip = {
  id: 'trip-1',
  name: 'Ladakh Expedition',
  route: 'DEL - IXL',
  startDate: '2025-06-01',
  endDate: '2025-06-07',
  tripValue: 75000,
  healthScore: 42,
  status: 'disrupted',
  nodes: [
    {
      id: 'node-flight-1',
      tripId: 'trip-1',
      category: 'flight',
      title: 'AI-445 Delhi to Leh',
      status: 'broken',
      impactSeverity: 'critical',
      scheduledStart: '2025-06-01T06:00:00Z',
      scheduledEnd: '2025-06-01T07:30:00Z',
      dependencies: [],
      cost: 15000,
      provider: 'Air India',
      confirmation: 'AI-1234',
    },
  ],
  edges: [],
};

const mockDisruption: Disruption = {
  id: 'disruption-1',
  tripId: 'trip-1',
  type: 'flight-delay',
  label: '3 Hour Fog Delay at DEL',
  primaryNodeId: 'node-flight-1',
  delayMinutes: 180,
  impactLevel: 'critical',
  directImpact: 1,
  downstreamImpact: 3,
  financialExposure: 35000,
  refundExposure: 20000,
  detectedAt: '2025-06-01T06:00:00Z',
  resolved: false,
  cascadeSteps: [
    {
      id: 'step-1',
      disruptionId: 'disruption-1',
      affectedNodeId: 'node-flight-1',
      impactType: 'delayed',
      description: 'Flight AI-445 departure delayed by 180 minutes due to weather',
      delayMinutes: 180,
      timeBufferUsed: 0,
      financialImpact: 0,
      sequenceOrder: 1,
    },
    {
      id: 'step-2',
      disruptionId: 'disruption-1',
      affectedNodeId: 'node-transfer-1',
      impactType: 'broken',
      description: 'Missed airport prepaid cab transfer in Leh',
      delayMinutes: 180,
      timeBufferUsed: 30,
      financialImpact: 2500,
      sequenceOrder: 2,
    },
  ],
};

describe('ImpactAnalysisPanel Component', () => {
  it('renders nothing when activeDisruption is null', () => {
    vi.mocked(AppContextModule.useApp).mockReturnValue({
      activeDisruption: null,
      trip: mockTrip,
      phase: 'monitoring',
    } as any);

    const { container } = render(<ImpactAnalysisPanel />);
    expect(container.firstChild).toBeNull();
  });

  it('renders disruption details and cascade steps when activeDisruption exists', () => {
    vi.mocked(AppContextModule.useApp).mockReturnValue({
      activeDisruption: mockDisruption,
      trip: mockTrip,
      phase: 'analyzing',
    } as any);

    render(<ImpactAnalysisPanel />);

    expect(screen.getByText('Disruption Analysis')).toBeInTheDocument();
    expect(screen.getByText(/CRITICAL DISRUPTION/i)).toBeInTheDocument();
    expect(screen.getByText('AI-445 Delhi to Leh')).toBeInTheDocument();
    expect(screen.getByText('3 Hour Fog Delay at DEL')).toBeInTheDocument();
    expect(screen.getByText('1 booking')).toBeInTheDocument();
    expect(screen.getByText('3 bookings')).toBeInTheDocument();
    expect(screen.getByText(/Flight AI-445 departure delayed by 180 minutes/)).toBeInTheDocument();
    expect(screen.getByText(/Missed airport prepaid cab transfer in Leh/)).toBeInTheDocument();
  });
});
