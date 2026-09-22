import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddActivityModal } from './AddActivityModal';
import { AppProvider } from '@/store/AppContext';
import * as api from '@/services/api';
import type { Trip } from '@/types';

vi.mock('@/services/api', async () => {
  const actual = await vi.importActual<typeof import('@/services/api')>('@/services/api');
  return {
    ...actual,
    getItinerary: vi.fn(),
    getActivityLog: vi.fn(),
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
  vi.mocked(api.getActivityLog).mockResolvedValue([]);
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
      <AddActivityModal open onClose={onClose} onAdded={onAdded} />
    </Wrapper>
  );
  await screen.findByLabelText(/Activity \/ Tour Name/i);
  await waitFor(() => expect(api.getPreferences).toHaveBeenCalled());
  return { onClose, onAdded };
}

function fillFields() {
  fireEvent.change(screen.getByLabelText(/Activity \/ Tour Name/i), { target: { value: 'Pangong Tso Sunrise Expedition' } });
  fireEvent.change(screen.getByLabelText(/Guide \/ Tour Operator/i), { target: { value: 'Ladakh Adventures' } });
  fireEvent.change(screen.getByLabelText(/Booking Confirmation/i), { target: { value: 'ACT-67210' } });
  fireEvent.change(screen.getByLabelText(/Meeting Point \/ Location/i), { target: { value: 'Leh Main Bazaar' } });
  fireEvent.change(screen.getByLabelText(/Activity Start Time/i), { target: { value: '2026-05-02T06:00' } });
  fireEvent.change(screen.getByLabelText(/Activity End Time/i), { target: { value: '2026-05-02T15:00' } });
  fireEvent.change(screen.getByLabelText(/Cost \(\$\)/i), { target: { value: '180' } });
}

describe('AddActivityModal', () => {
  it('renders activity modal fields properly', async () => {
    await renderModal();
    expect(screen.getByText('Add Tour / Activity to Itinerary')).toBeInTheDocument();
    expect(screen.getByLabelText(/Activity \/ Tour Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Guide \/ Tour Operator/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Booking Confirmation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Meeting Point \/ Location/i)).toBeInTheDocument();
  });

  it('validates empty inputs on submit', async () => {
    await renderModal();
    fireEvent.click(screen.getByRole('button', { name: /Add Activity/i }));

    expect(screen.getByText('Activity title is required')).toBeInTheDocument();
    expect(screen.getByText('Tour operator or provider is required')).toBeInTheDocument();
    expect(screen.getByText('Booking confirmation is required')).toBeInTheDocument();
    expect(screen.getByText('Meeting point or location is required')).toBeInTheDocument();
    expect(api.addNode).not.toHaveBeenCalled();
  });

  it('submits valid activity and invokes onAdded callback', async () => {
    const onAdded = vi.fn();
    vi.mocked(api.addNode).mockResolvedValue(baseTrip());

    await renderModal(onAdded);
    fillFields();
    fireEvent.click(screen.getByRole('button', { name: /Add Activity/i }));

    await waitFor(() => {
      expect(api.addNode).toHaveBeenCalledWith(
        'trip-ladakh-2025',
        expect.objectContaining({
          category: 'activity',
          title: 'Pangong Tso Sunrise Expedition',
          provider: 'Ladakh Adventures',
          confirmation: 'ACT-67210',
          location: 'Leh Main Bazaar',
          cost: 180,
        })
      );
      expect(onAdded).toHaveBeenCalled();
    });
  });
});
