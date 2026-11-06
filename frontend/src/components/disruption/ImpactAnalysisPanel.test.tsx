import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ImpactAnalysisPanel } from './ImpactAnalysisPanel';
import { ToastProvider } from '@/components/ui/ToastProvider';
import * as AppContextModule from '@/store/AppContext';
import type { Disruption, Trip } from '@/types';

vi.mock('@/store/AppContext', () => ({
  useApp: vi.fn(),
}));

const mockTrip: Trip = {
  id: 'trip-1',
  name: 'Ladakh Expedition',
  travelerName: 'Aisha',
  route: 'DEL - IXL',
  origin: 'DEL',
  destination: 'IXL',
  startDate: '2025-06-01',
  endDate: '2025-06-07',
  tripValue: 75000,
  healthScore: 42,
  status: 'disrupted',
  nodes: [
    {
      id: 'node-flight-1',
      category: 'flight',
      label: 'Flight',
      title: 'AI-445 Delhi to Leh',
      subtitle: 'Air India',
      location: 'DEL',
      scheduledTime: '06:00',
      provider: 'Air India',
      confirmation: 'AI-1234',
      cost: 15000,
      cancellationPolicy: 'Non-refundable',
      refundable: false,
      riskLevel: 90,
      dependencyCount: 2,
      status: 'broken',
      day: 1,
      icon: 'plane',
      scheduledStart: '2025-06-01T06:00:00Z',
      scheduledEnd: '2025-06-01T07:30:00Z',
    },
  ],
  edges: [],
  days: [],
};

const mockDisruption: Disruption = {
  id: 'disruption-1',
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
  cascadeSteps: [
    {
      id: 'step-1',
      nodeId: 'node-flight-1',
      description: 'Flight AI-445 departure delayed by 180 minutes due to weather',
      timestamp: '2025-06-01T06:00:00Z',
    },
    {
      id: 'step-2',
      nodeId: 'node-transfer-1',
      description: 'Missed airport prepaid cab transfer in Leh',
      timestamp: '2025-06-01T06:05:00Z',
    },
  ],
};

type MockAppContext = ReturnType<typeof AppContextModule.useApp>;

describe('ImpactAnalysisPanel Component', () => {
  it('renders nothing when activeDisruption is null', () => {
    vi.mocked(AppContextModule.useApp).mockReturnValue({
      activeDisruption: null,
      trip: mockTrip,
      phase: 'monitoring',
    } as unknown as MockAppContext);

    render(<ImpactAnalysisPanel />);
    expect(screen.getByText('No active disruption')).toBeInTheDocument();
  });

  it('renders disruption details and cascade steps when activeDisruption exists', () => {
    vi.mocked(AppContextModule.useApp).mockReturnValue({
      activeDisruption: mockDisruption,
      trip: mockTrip,
      phase: 'analyzing',
    } as unknown as MockAppContext);

    vi.useFakeTimers();
    render(<ImpactAnalysisPanel />);
    vi.advanceTimersByTime(700);

    expect(screen.getByText('Disruption detected')).toBeInTheDocument();
    expect(screen.getByText(/CRITICAL impact/i)).toBeInTheDocument();
    expect(screen.getByText('AI-445 Delhi to Leh')).toBeInTheDocument();
    expect(screen.getByText('3 Hour Fog Delay at DEL')).toBeInTheDocument();
    expect(screen.getByText('1 booking')).toBeInTheDocument();
    expect(screen.getByText('3 bookings')).toBeInTheDocument();
    expect(screen.getByText(/Flight AI-445 departure delayed by 180 minutes/)).toBeInTheDocument();
    expect(screen.getByText(/Missed airport prepaid cab transfer in Leh/)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('shows the backend narrative when the disruption carries one', () => {
    vi.mocked(AppContextModule.useApp).mockReturnValue({
      activeDisruption: { ...mockDisruption, narrative: 'Because AI-445 runs late, the Leh transfer can no longer be made.' },
      trip: mockTrip,
      phase: 'analyzing',
    } as unknown as MockAppContext);

    render(<ImpactAnalysisPanel />);
    expect(screen.getByText('Because AI-445 runs late, the Leh transfer can no longer be made.')).toBeInTheDocument();
  });

  it('reveals the dependency graph behind the "Why?" toggle', () => {
    globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} } as unknown as typeof ResizeObserver;
    vi.mocked(AppContextModule.useApp).mockReturnValue({
      activeDisruption: mockDisruption,
      trip: mockTrip,
      phase: 'analyzing',
    } as unknown as MockAppContext);

    const { container } = render(<ToastProvider><ImpactAnalysisPanel /></ToastProvider>);
    expect(container.querySelector('.react-flow')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Why\? Show dependency view/ }));
    expect(container.querySelector('.react-flow')).not.toBeNull();
    expect(screen.getByText(/the graph is an explanation, not the primary interface/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Hide dependency view/ }));
    expect(container.querySelector('.react-flow')).toBeNull();
  });
});
