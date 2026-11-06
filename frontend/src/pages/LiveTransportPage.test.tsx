import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { LiveTransportPage } from './LiveTransportPage';
import { ToastProvider } from '@/components/ui/ToastProvider';
import * as AppContextModule from '@/store/AppContext';
import * as api from '@/services/api';

const navigate = vi.fn();
vi.mock('@/store/AppContext', () => ({ useApp: vi.fn() }));
vi.mock('@/lib/router', () => ({ useRouter: () => ({ navigate, route: 'transport', params: {}, consumeParams: vi.fn() }) }));
vi.mock('@/components/live/DiscoveryMap', () => ({
  DiscoveryMap: ({ markers }: { markers: { kind: string; latitude: number }[] }) => <div data-testid="live-map" data-kind={markers[0]?.kind} data-lat={markers[0]?.latitude} />,
}));
vi.mock('@/services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/api')>();
  return {
    ...actual,
    getLiveHealth: vi.fn(),
    searchLiveFlights: vi.fn(),
    getLiveTrain: vi.fn(),
    listExternalItems: vi.fn(),
    addExternalItem: vi.fn(),
    getTrackedTransport: vi.fn(),
    simulateDisruption: vi.fn(),
  };
});

const FLIGHT: api.LiveTransport = {
  id: 'aviationstack:AI101:2026-09-27', mode: 'flight', provider: 'aviationstack', source: 'aviationstack', externalId: 'AI101@2026-09-27', dataSource: 'live',
  number: 'AI101', name: 'Air India', operator: 'Air India', origin: { code: 'BOM', name: 'Mumbai', latitude: null, longitude: null },
  destination: { code: 'DEL', name: 'Delhi', latitude: null, longitude: null }, status: 'en_route', delayMinutes: 12,
  currentLocation: { latitude: 22.5, longitude: 75.1 }, currentLocationName: null, speedKmh: 820, altitudeMeters: 9754, heading: 25, isOnGround: false, aircraft: 'B77W',
  scheduledDeparture: '2026-09-27T08:00:00+00:00', estimatedDeparture: null, actualDeparture: null, scheduledArrival: '2026-09-27T10:10:00+00:00',
  estimatedArrival: '2026-09-27T10:22:00+00:00', actualArrival: null, previousStop: null, nextStop: null, platform: null, route: [],
  journeyDate: '2026-09-27', notices: [], lastUpdatedAt: new Date().toISOString(), retrievedAt: new Date().toISOString(),
};
const TRAIN: api.LiveTransport = { ...FLIGHT, id: 'railradar:12951', mode: 'train', provider: 'railradar', source: 'railradar', externalId: '12951@2026-09-26',
  number: '12951', name: 'Mumbai Rajdhani', currentLocation: null, currentLocationName: 'Ujjain Jn', nextStop: { code: 'KOTA', name: 'Kota Jn', latitude: null, longitude: null }, speedKmh: 65 };

const triggerDisruption = vi.fn(async () => {});
const trip = { id: 'trip-1', name: 'Mumbai → Goa', startDate: '12 Sep 2025', endDate: '15 Sep 2025', days: [], nodes: [{ id: 'node-flight', title: 'AI101 BOM → DEL' }] };

beforeEach(() => {
  vi.mocked(AppContextModule.useApp).mockReturnValue({ trip, reload: vi.fn(), triggerDisruption, isBusy: false } as unknown as ReturnType<typeof AppContextModule.useApp>);
  vi.mocked(api.getLiveHealth).mockResolvedValue({
    flights: { provider: 'aviationstack', available: true, configured: true, detail: 'Ready' },
    trains: { provider: 'railradar', available: false, configured: false, detail: 'RAILRADAR_API_KEY is not configured on the server.' },
    places: { provider: 'openstreetmap', available: true, configured: true, detail: '' },
    events: { provider: 'ticketmaster', available: false, configured: false, detail: '' },
  });
  vi.mocked(api.listExternalItems).mockResolvedValue([]);
  vi.mocked(api.getTrackedTransport).mockResolvedValue([]);
  vi.mocked(api.searchLiveFlights).mockResolvedValue([FLIGHT]);
  triggerDisruption.mockClear();
  navigate.mockClear();
});

const renderPage = () => render(<ToastProvider><LiveTransportPage /></ToastProvider>);

describe('LiveTransportPage', () => {
  it('labels provider readiness and live results with their source', async () => {
    renderPage();
    expect(await screen.findByText(/Aviationstack · ready/)).toBeInTheDocument();
    expect(screen.getByText(/RailRadar · not configured/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Flight number'), { target: { value: 'AI101' } });
    fireEvent.click(screen.getByRole('button', { name: /Search live/ }));
    const card = await screen.findByRole('article', { name: /flight AI101/ });
    expect(within(card).getByText(/LIVE · Aviationstack/)).toBeInTheDocument();
    expect(within(card).getByText('+12 min')).toBeInTheDocument();
    expect(api.searchLiveFlights).toHaveBeenCalledWith({ flightNumber: 'AI101', dep: undefined, arr: undefined });
  });

  it('shows the live position of a flight and says when a train has none', async () => {
    vi.mocked(api.getLiveTrain).mockResolvedValue(TRAIN);
    renderPage();
    fireEvent.change(screen.getByLabelText('Flight number'), { target: { value: 'AI101' } });
    fireEvent.click(screen.getByRole('button', { name: /Search live/ }));
    fireEvent.click(await screen.findByRole('button', { name: /View Live/ }));
    const view = screen.getByRole('region', { name: 'Live view' });
    expect(within(view).getByTestId('live-map')).toHaveAttribute('data-kind', 'flight');
    expect(within(view).getByText('22.50° N, 75.10° E')).toBeInTheDocument();
    expect(within(view).getByText('32,001 ft')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /Trains/ }));
    fireEvent.change(screen.getByLabelText('Train number'), { target: { value: '12951' } });
    fireEvent.click(screen.getByRole('button', { name: /Search live/ }));
    fireEvent.click(await screen.findByRole('button', { name: /View Live/ }));
    const trainView = screen.getByRole('region', { name: 'Live view' });
    expect(within(trainView).getByText('Live location unavailable')).toBeInTheDocument();
    expect(within(trainView).getByText('Kota Jn')).toBeInTheDocument();
  });

  it('runs the existing simulation on the live baseline without changing the live record', async () => {
    const live = Object.freeze({ ...FLIGHT });
    vi.mocked(api.getTrackedTransport).mockResolvedValue([{ nodeId: 'node-flight', kind: 'flight', source: 'aviationstack', externalId: 'AI101@2026-09-27', live, error: null }]);
    vi.mocked(api.simulateDisruption).mockResolvedValue({ disruption: {} as api.PropagationResult['disruption'], sequence: [], tripHealthScore: 71,
      impacts: [{ nodeId: 'node-flight', status: 'delayed', reason: null, causedBy: null, availableBufferMinutes: null, requiredBufferMinutes: null },
        { nodeId: 'hotel', status: 'at-risk', reason: null, causedBy: 'node-flight', availableBufferMinutes: 10, requiredBufferMinutes: 60 }] });
    renderPage();
    expect(await screen.findByText(/Simulated total impact/)).toBeInTheDocument();
    expect(screen.getByText('+132 min')).toBeInTheDocument();
    expect(screen.getByText(/SIMULATION · SafarSathi Demo/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Preview impact/ }));
    await waitFor(() => expect(api.simulateDisruption).toHaveBeenCalledWith('trip-1', { type: 'flight-delay', primaryNodeId: 'node-flight', delayMinutes: 132 }));
    expect(await screen.findByText(/Nothing was changed/)).toBeInTheDocument();
    expect(live.delayMinutes).toBe(12);

    fireEvent.click(screen.getByRole('button', { name: /Run in SafarSathi recovery/ }));
    await waitFor(() => expect(triggerDisruption).toHaveBeenCalledWith('flight-delay', { primaryNodeId: 'node-flight', delayMinutes: 132 }));
    expect(navigate).toHaveBeenCalledWith('recovery');
  });

  it('says when the provider reported no delay instead of showing a live +0', async () => {
    vi.mocked(api.getTrackedTransport).mockResolvedValue([{ nodeId: 'node-flight', kind: 'flight', source: 'aviationstack', externalId: 'AI101@2026-09-27', live: { ...FLIGHT, delayMinutes: null }, error: null }]);
    renderPage();
    expect(await screen.findByText(/not reported by Aviationstack/)).toBeInTheDocument();
    expect(screen.queryByText('+0 min')).not.toBeInTheDocument();
  });

  it('reports a missing live record instead of inventing one', async () => {
    vi.mocked(api.getTrackedTransport).mockResolvedValue([{ nodeId: 'node-flight', kind: 'flight', source: 'aviationstack', externalId: 'AI101@2026-09-27', live: null, error: 'Live provider temporarily unavailable.' }]);
    renderPage();
    expect(await screen.findByText('Live provider temporarily unavailable.')).toBeInTheDocument();
    expect(screen.getByText(/No live baseline right now/)).toBeInTheDocument();
  });
});
