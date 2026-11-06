import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ExplorePage } from './ExplorePage';
import { ToastProvider } from '@/components/ui/ToastProvider';
import * as AppContextModule from '@/store/AppContext';
import * as api from '@/services/api';

vi.mock('@/store/AppContext', () => ({ useApp: vi.fn() }));
vi.mock('@/lib/router', () => ({ useRouter: () => ({ navigate: vi.fn(), route: 'explore', params: {}, consumeParams: vi.fn() }) }));
vi.mock('@/components/live/DiscoveryMap', () => ({
  DiscoveryMap: ({ markers }: { markers: { id: string; kind: string }[] }) => <div data-testid="map" data-markers={markers.map((m) => m.kind).join(',')} />,
}));
vi.mock('@/services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/api')>();
  return {
    ...actual,
    searchDestinations: vi.fn(),
    searchHotels: vi.fn(),
    searchAttractions: vi.fn(),
    searchEvents: vi.fn(),
    listExternalItems: vi.fn(),
    addExternalItem: vi.fn(),
  };
});

const GOA: api.Destination = { id: 'goa', name: 'Goa', state: 'Goa', latitude: 15.4909, longitude: 73.8278, airportCode: 'GOI', stationCode: 'MAO', regionMatch: null, source: 'catalog' };
const HOTEL: api.Hotel = { id: 'openstreetmap:node/101', type: 'hotel', source: 'openstreetmap', externalId: 'node/101', name: 'Hotel Mandovi', category: 'hotel',
  latitude: 15.49, longitude: 73.82, address: 'D B Marg, Panaji', city: 'Panaji', phone: null, website: null, stars: null, sourceUrl: '', lastUpdatedAt: '' };
const CASA: api.Hotel = { ...HOTEL, id: 'openstreetmap:way/202', externalId: 'way/202', name: 'Casa Goa' };
const FORT: api.Attraction = { id: 'openstreetmap:way/9', type: 'attraction', source: 'openstreetmap', externalId: 'way/9', name: 'Fort Aguada', category: 'fort',
  latitude: 15.49, longitude: 73.77, address: null, city: 'Goa', website: null, sourceUrl: '', lastUpdatedAt: '' };

const reload = vi.fn(async () => {});
const trip = { id: 'trip-1', name: 'Goa Getaway', startDate: '12 Sep 2025', endDate: '15 Sep 2025', days: [], nodes: [] };

beforeEach(() => {
  vi.mocked(AppContextModule.useApp).mockReturnValue({ trip, reload } as unknown as ReturnType<typeof AppContextModule.useApp>);
  vi.mocked(api.searchDestinations).mockResolvedValue([GOA]);
  vi.mocked(api.searchHotels).mockResolvedValue([HOTEL, CASA]);
  vi.mocked(api.searchAttractions).mockResolvedValue([FORT]);
  vi.mocked(api.listExternalItems).mockResolvedValue([{ nodeId: 'n1', kind: 'hotel', source: 'openstreetmap', externalId: 'way/202' }]);
  vi.mocked(api.addExternalItem).mockReset();
  reload.mockClear();
});

const openGoa = async () => {
  render(<ToastProvider><ExplorePage /></ToastProvider>);
  fireEvent.click(await screen.findByRole('button', { name: /Goa/ }));
};

describe('ExplorePage', () => {
  it('searches destinations and opens discovery tabs for one', async () => {
    await openGoa();
    expect(screen.getByRole('heading', { name: 'Goa' })).toBeInTheDocument();
    for (const tab of ['Flight', 'Train', 'Hotel', 'Place', 'Event']) expect(screen.getByRole('tab', { name: new RegExp(tab) })).toBeInTheDocument();
    expect(await screen.findByText('Hotel Mandovi')).toBeInTheDocument();
    expect(api.searchHotels).toHaveBeenCalledWith(expect.objectContaining({ latitude: 15.4909, longitude: 73.8278, city: 'Goa' }));
    expect(screen.getByTestId('map')).toHaveAttribute('data-markers', 'hotel,hotel');
    expect(screen.getByText(/Prices and availability are not provided/)).toBeInTheDocument();
  });

  it('adds a hotel with one tap and marks existing items as already added', async () => {
    vi.mocked(api.addExternalItem).mockResolvedValue({ trip: trip as unknown as api.ExternalItemAddResult['trip'], nodeId: 'n2', alreadyAdded: false,
      link: { nodeId: 'n2', kind: 'hotel', source: 'openstreetmap', externalId: 'node/101' } });
    await openGoa();
    const mandovi = (await screen.findByText('Hotel Mandovi')).closest('li')!;
    await waitFor(() => expect(within(screen.getByText('Casa Goa').closest('li')!).getByRole('button', { name: 'Already Added ✓' })).toBeDisabled());

    fireEvent.click(within(mandovi).getByRole('button', { name: 'Add to Trip' }));
    expect(await within(mandovi).findByRole('button', { name: 'Added ✓' })).toBeDisabled();
    expect(api.addExternalItem).toHaveBeenCalledWith('trip-1', expect.objectContaining({
      kind: 'hotel', source: 'openstreetmap', externalId: 'node/101', scheduledStart: '2025-09-12T14:00:00', scheduledEnd: '2025-09-15T11:00:00',
    }));
    expect(reload).toHaveBeenCalled();
  });

  it('adds places to the chosen day and filters by category', async () => {
    vi.mocked(api.addExternalItem).mockResolvedValue({ trip: trip as unknown as api.ExternalItemAddResult['trip'], nodeId: 'n3', alreadyAdded: false,
      link: { nodeId: 'n3', kind: 'attraction', source: 'openstreetmap', externalId: 'way/9' } });
    await openGoa();
    fireEvent.click(screen.getByRole('tab', { name: /Place/ }));
    fireEvent.click(await screen.findByRole('button', { name: 'Forts' }));
    await waitFor(() => expect(api.searchAttractions).toHaveBeenLastCalledWith(expect.objectContaining({ category: 'forts' })));
    fireEvent.click(screen.getByRole('button', { name: 'Day 2' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Add to Day 2' }));
    await waitFor(() => expect(api.addExternalItem).toHaveBeenCalledWith('trip-1', expect.objectContaining({ kind: 'attraction', scheduledStart: '2025-09-13T10:00:00' })));
  });

  it('uses the trip dates even when the trip finishes loading after the page opens', async () => {
    const loading = { ...trip, id: '', startDate: '', endDate: '' };
    vi.mocked(AppContextModule.useApp).mockReturnValue({ trip: loading, reload } as unknown as ReturnType<typeof AppContextModule.useApp>);
    const view = render(<ToastProvider><ExplorePage /></ToastProvider>);
    fireEvent.click(await screen.findByRole('button', { name: /Goa/ }));
    vi.mocked(AppContextModule.useApp).mockReturnValue({ trip, reload } as unknown as ReturnType<typeof AppContextModule.useApp>);
    view.rerender(<ToastProvider><ExplorePage /></ToastProvider>);
    await waitFor(() => expect(screen.getByLabelText('Check-in')).toHaveValue('2025-09-12'));
    expect(screen.getByLabelText('Check-out')).toHaveValue('2025-09-15');
  });

  it('shows provider errors instead of fake results', async () => {
    vi.mocked(api.searchEvents).mockRejectedValue(new api.ApiError('Live provider authentication is not configured.', 503));
    await openGoa();
    fireEvent.click(screen.getByRole('tab', { name: /Event/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Live provider authentication is not configured.');
  });
});
