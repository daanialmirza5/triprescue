import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { DisruptionModal } from './DisruptionModal';
import * as AppContextModule from '@/store/AppContext';
import * as api from '@/services/api';
import type { ItineraryNodeData, Trip } from '@/types';

vi.mock('@/store/AppContext', () => ({ useApp: vi.fn() }));
vi.mock('@/lib/router', () => ({ useRouter: () => ({ navigate: vi.fn() }) }));
vi.mock('@/services/api', async () => {
  const actual = await vi.importActual<typeof import('@/services/api')>('@/services/api');
  return { ...actual, simulateDisruption: vi.fn(), extractDisruption: vi.fn() };
});

function node(id: string, category: ItineraryNodeData['category'], title: string): ItineraryNodeData {
  return {
    id, category, title, label: title, subtitle: '', location: '', scheduledTime: '', provider: 'X', cost: 0,
    cancellationPolicy: '', refundable: false, riskLevel: 0, dependencyCount: 0, status: 'healthy', day: 1, icon: '',
  };
}

const trip: Trip = {
  id: 'trip-1', name: 'Ladakh', travelerName: 'A', route: 'BOM → IXL', origin: 'BOM', destination: 'IXL',
  startDate: '', endDate: '', tripValue: 0, healthScore: 90, status: 'operational', days: [], edges: [],
  nodes: [node('bom-del', 'flight', 'Mumbai → Delhi'), node('del-leh', 'flight', 'Delhi → Leh'), node('grand-dragon', 'hotel', 'Grand Dragon Ladakh')],
};

const triggerDisruption = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(AppContextModule.useApp).mockReturnValue({ triggerDisruption, tripId: 'trip-1', isBusy: false, trip } as unknown as ReturnType<typeof AppContextModule.useApp>);
  vi.mocked(api.simulateDisruption).mockResolvedValue({
    disruption: { id: 'preview', type: 'flight-delay', label: 'x', primaryNodeId: 'bom-del', impactLevel: 'low', directImpact: 1, downstreamImpact: 0, financialExposure: 0, refundExposure: 0, cascadeSteps: [], detectedAt: '' },
    impacts: [], sequence: [], tripHealthScore: 90,
  });
});

describe('DisruptionModal', () => {
  it('lets the traveler pick which booking, and previews that booking', async () => {
    render(<DisruptionModal open onClose={() => {}} />);
    const picker = screen.getByLabelText('Which booking?') as HTMLSelectElement;
    // Flight delay: only flights are offered.
    expect(Array.from(picker.options).map((o) => o.value)).toEqual(['', 'bom-del', 'del-leh']);

    fireEvent.change(picker, { target: { value: 'del-leh' } });

    await waitFor(() => expect(api.simulateDisruption).toHaveBeenLastCalledWith('trip-1', expect.objectContaining({ type: 'flight-delay', primaryNodeId: 'del-leh' })));
    fireEvent.click(screen.getByText('Confirm Disruption'));
    await waitFor(() => expect(triggerDisruption).toHaveBeenCalledWith('flight-delay', expect.objectContaining({ primaryNodeId: 'del-leh' })));
  });

  it('drops a booking that does not fit a newly chosen disruption type', async () => {
    render(<DisruptionModal open onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText('Which booking?'), { target: { value: 'del-leh' } });

    fireEvent.click(screen.getByText('Hotel Cancellation'));

    const picker = screen.getByLabelText('Which booking?') as HTMLSelectElement;
    expect(Array.from(picker.options).map((o) => o.value)).toEqual(['', 'grand-dragon']);
    fireEvent.click(screen.getByText('Confirm Disruption'));
    await waitFor(() => expect(triggerDisruption).toHaveBeenCalledWith('hotel-cancellation', expect.objectContaining({ primaryNodeId: undefined })));
  });

  it('debounces the impact preview while the delay slider moves', async () => {
    render(<DisruptionModal open onClose={() => {}} />);
    await waitFor(() => expect(api.simulateDisruption).toHaveBeenCalledTimes(1));
    const slider = screen.getByLabelText('Delay in minutes');
    for (const v of [100, 105, 110, 115, 120]) fireEvent.change(slider, { target: { value: String(v) } });

    await waitFor(() => expect(api.simulateDisruption).toHaveBeenLastCalledWith('trip-1', expect.objectContaining({ delayMinutes: 120 })));
    expect(api.simulateDisruption).toHaveBeenCalledTimes(2);
  });
});

describe('DisruptionModal voice reporting', () => {
  class FakeRecognition {
    static last: FakeRecognition | null = null;
    lang = '';
    interimResults = true;
    continuous = true;
    onresult: ((e: { results: { transcript: string }[][] }) => void) | null = null;
    onerror: ((e: { error: string }) => void) | null = null;
    onend: (() => void) | null = null;
    start = vi.fn(() => { FakeRecognition.last = this; });
    stop = vi.fn(() => this.onend?.());
  }

  afterEach(() => vi.unstubAllGlobals());

  it('hides the mic where the browser has no speech recognition', () => {
    render(<DisruptionModal open onClose={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Speak your report' })).toBeNull();
  });

  it('fills the report from speech, then analyzes it like typed text', async () => {
    vi.stubGlobal('webkitSpeechRecognition', FakeRecognition);
    vi.mocked(api.extractDisruption).mockResolvedValue({
      type: 'flight-delay', delayMinutes: 120, flightNumber: null, gate: null, primaryNodeId: 'bom-del', primaryNodeLabel: 'Mumbai → Delhi',
      nodeId: 'bom-del', confidence: 0.9, matchedSignals: [], summary: 'Mumbai → Delhi delayed by 120 min', source: 'fallback',
    } as unknown as api.DisruptionExtraction);
    render(<DisruptionModal open onClose={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Speak your report' }));
    expect(screen.getByRole('button', { name: 'Stop listening' })).toHaveAttribute('aria-pressed', 'true');
    const rec = FakeRecognition.last!;
    expect(rec.lang).toBe('en-IN');
    act(() => {
      rec.onresult?.({ results: [[{ transcript: 'my Mumbai flight is delayed by 2 hours' }]] });
      rec.onend?.();
    });

    expect(screen.getByLabelText('Describe what happened')).toHaveValue('my Mumbai flight is delayed by 2 hours');
    fireEvent.click(screen.getByRole('button', { name: 'Analyze' }));
    await waitFor(() => expect(api.extractDisruption).toHaveBeenCalledWith('my Mumbai flight is delayed by 2 hours', 'trip-1'));
  });

  it('explains a blocked microphone', () => {
    vi.stubGlobal('webkitSpeechRecognition', FakeRecognition);
    render(<DisruptionModal open onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Speak your report' }));
    act(() => {
      FakeRecognition.last!.onerror?.({ error: 'not-allowed' });
      FakeRecognition.last!.onend?.();
    });
    expect(screen.getByText(/Microphone access was blocked/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Speak your report' })).toBeInTheDocument();
  });
});
