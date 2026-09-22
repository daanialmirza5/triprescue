import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddAccommodationModal } from './AddAccommodationModal';
import { AppProvider } from '@/store/AppContext';
import * as api from '@/services/api';
import type { Trip } from '@/types';

vi.mock('@/services/api', async () => {
  const actual = await vi.importActual<typeof import('@/services/api')>('@/services/api');
  return {
    ...actual,
    getItinerary: vi.fn(),
    getActivity: vi.fn(),
    getNotifications: vi.fn(),
    getPreferences: vi.fn(),
    listTrips: vi.fn(),
    addNode: vi.fn(),
  };
});

function baseTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: 'trip-ladakh-2025',
    name: 'Ladakh Expedition 2025',
    travelerName: 'Sarah Chen',
    route: 'DEL → IXL',
    origin: 'DEL',
    destination: 'IXL',
    startDate: '2025-06-15',
    endDate: '2025-06-22',
    tripValue: 2450,
    healthScore: 94,
    status: 'operational',
    nodes: [],
    edges: [],
    days: [],
    ...overrides,
  };
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(api.getItinerary).mockResolvedValue(baseTrip());
  vi.mocked(api.getActivity).mockResolvedValue([]);
  vi.mocked(api.getNotifications).mockResolvedValue([]);
  vi.mocked(api.getPreferences).mockResolvedValue({
    costVsSpeed: 50,
    disruptionVsComfort: 50,
    recoveryPriorities: { minimizeCost: false, minimizeTime: false, minimizeDisruption: true, maximizeComfort: false },
  });
  vi.mocked(api.listTrips).mockResolvedValue([]);
});

async function renderModal(onAdded = vi.fn()) {
  const onClose = vi.fn();
  render(
    <Wrapper>
      <AddAccommodationModal open onClose={onClose} onAdded={onAdded} />
    </Wrapper>
  );
  await screen.findByLabelText(/Hotel \/ Property Name/i);
  await waitFor(() => expect(api.getPreferences).toHaveBeenCalled());
  return { onClose, onAdded };
}

function fillFields() {
  fireEvent.change(screen.getByLabelText(/Hotel \/ Property Name/i), { target: { value: 'Grand Mountain Resort' } });
  fireEvent.change(screen.getByLabelText(/Provider \/ Chain/i), { target: { value: 'Marriott' } });
  fireEvent.change(screen.getByLabelText(/Confirmation Code/i), { target: { value: 'HTL-9988' } });
  fireEvent.change(screen.getByLabelText(/Address \/ City Location/i), { target: { value: 'Fort Road, Leh' } });
  fireEvent.change(screen.getByLabelText(/Check-in Date & Time/i), { target: { value: '2026-05-01T14:00' } });
  fireEvent.change(screen.getByLabelText(/Check-out Date & Time/i), { target: { value: '2026-05-04T11:00' } });
  fireEvent.change(screen.getByLabelText(/Total Cost/i), { target: { value: '650' } });
}

describe('AddAccommodationModal', () => {
  it('renders the form with accessible fields', async () => {
    await renderModal();
    expect(screen.getByText('Add Hotel Stay to Itinerary')).toBeInTheDocument();
    expect(screen.getByLabelText(/Hotel \/ Property Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Provider \/ Chain/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmation Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address \/ City Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Check-in Date & Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Check-out Date & Time/i)).toBeInTheDocument();
  });

  it('validates required fields on empty submit', async () => {
    await renderModal();
    fireEvent.click(screen.getByRole('button', { name: /Add Stay/i }));

    expect(screen.getByText('Hotel/stay name is required')).toBeInTheDocument();
    expect(screen.getByText('Provider or booking platform is required')).toBeInTheDocument();
    expect(screen.getByText('Confirmation code is required')).toBeInTheDocument();
    expect(screen.getByText('Location or address is required')).toBeInTheDocument();
    expect(api.addNode).not.toHaveBeenCalled();
  });

  it('validates that check-out is after check-in', async () => {
    await renderModal();
    fillFields();
    fireEvent.change(screen.getByLabelText(/Check-in Date & Time/i), { target: { value: '2026-05-05T14:00' } });
    fireEvent.change(screen.getByLabelText(/Check-out Date & Time/i), { target: { value: '2026-05-01T11:00' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Stay/i }));

    expect(screen.getByText('Check-out must be after check-in')).toBeInTheDocument();
    expect(api.addNode).not.toHaveBeenCalled();
  });

  it('submits valid hotel form successfully', async () => {
    const onAdded = vi.fn();
    vi.mocked(api.addNode).mockResolvedValue(baseTrip());

    await renderModal(onAdded);
    fillFields();
    fireEvent.click(screen.getByRole('button', { name: /Add Stay/i }));

    await waitFor(() => {
      expect(api.addNode).toHaveBeenCalledWith(
        'trip-ladakh-2025',
        expect.objectContaining({
          category: 'hotel',
          title: 'Grand Mountain Resort',
          provider: 'Marriott',
          confirmation: 'HTL-9988',
          location: 'Fort Road, Leh',
          cost: 650,
        })
      );
      expect(onAdded).toHaveBeenCalled();
    });
  });

  it('displays API errors when submission fails', async () => {
    vi.mocked(api.addNode).mockRejectedValue(new api.ApiError('Invalid dates for reservation', 400));

    await renderModal();
    fillFields();
    fireEvent.click(screen.getByRole('button', { name: /Add Stay/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid dates for reservation');
  });
});
