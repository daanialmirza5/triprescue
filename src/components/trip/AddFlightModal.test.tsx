import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { AppProvider } from '@/store/AppContext';
import { AddFlightModal } from './AddFlightModal';
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
    addFlightNode: vi.fn(),
  };
});

import * as api from '@/services/api';

function baseTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: 'trip-1',
    name: 'My Trip',
    travelerName: 'Test Traveler',
    route: 'A to B',
    origin: 'A',
    destination: 'B',
    startDate: '2026-01-01',
    endDate: '2026-01-05',
    nodes: [],
    edges: [],
    tripValue: 0,
    healthScore: 100,
    status: 'operational',
    days: [],
    ...overrides,
  };
}

const Wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;

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
      <AddFlightModal open onClose={onClose} onAdded={onAdded} />
    </Wrapper>
  );
  await screen.findByLabelText(/flight title/i);
  // AppProvider's own mount-time reload() must fully resolve and flush its
  // resulting state update before any interaction below - otherwise that
  // unrelated re-render can land mid-keystroke and silently drop input
  // (see the identical, diagnosed issue in CreateTripModal.test.tsx).
  await waitFor(() => expect(api.getPreferences).toHaveBeenCalled());
  return { onClose, onAdded };
}

function fillRequiredTextFields() {
  fireEvent.change(screen.getByLabelText(/flight title/i), { target: { value: 'Delhi to Mumbai' } });
  fireEvent.change(screen.getByLabelText(/airline/i), { target: { value: 'IndiGo' } });
  fireEvent.change(screen.getByLabelText(/booking reference/i), { target: { value: '6E-999' } });
  fireEvent.change(screen.getByLabelText(/origin airport code/i), { target: { value: 'DEL' } });
  fireEvent.change(screen.getByLabelText(/destination airport code/i), { target: { value: 'BOM' } });
  fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '5500' } });
}

function fillTimes(start: string, end: string) {
  fireEvent.change(screen.getByLabelText(/scheduled departure/i), { target: { value: start } });
  fireEvent.change(screen.getByLabelText(/scheduled arrival/i), { target: { value: end } });
}

describe('AddFlightModal', () => {
  it('renders the form with accessible, labelled fields', async () => {
    await renderModal();
    expect(screen.getByLabelText(/flight title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/airline/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/booking reference/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/origin airport code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination airport code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/scheduled departure/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/scheduled arrival/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cost/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^add flight$/i })).toBeInTheDocument();
  });

  it('blocks submission and shows field errors when required fields are empty', async () => {
    const user = userEvent.setup();
    await renderModal();

    await user.click(screen.getByRole('button', { name: /^add flight$/i }));

    expect(await screen.findByText(/flight title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/airline\/provider is required/i)).toBeInTheDocument();
    expect(api.addFlightNode).not.toHaveBeenCalled();
  });

  it('rejects an invalid airport code', async () => {
    const user = userEvent.setup();
    await renderModal();

    fillRequiredTextFields();
    fireEvent.change(screen.getByLabelText(/origin airport code/i), { target: { value: 'TokyoHaneda' } });
    fillTimes('2026-04-10T09:00', '2026-04-10T10:30');
    await user.click(screen.getByRole('button', { name: /^add flight$/i }));

    expect(await screen.findByText(/must be a 3-letter airport code/i)).toBeInTheDocument();
    expect(api.addFlightNode).not.toHaveBeenCalled();
  });

  it('rejects arrival before departure', async () => {
    const user = userEvent.setup();
    await renderModal();

    fillRequiredTextFields();
    fillTimes('2026-04-10T10:30', '2026-04-10T09:00');
    await user.click(screen.getByRole('button', { name: /^add flight$/i }));

    expect(await screen.findByText(/arrival cannot be before departure/i)).toBeInTheDocument();
    expect(api.addFlightNode).not.toHaveBeenCalled();
  });

  it('rejects a negative cost', async () => {
    const user = userEvent.setup();
    await renderModal();

    fillRequiredTextFields();
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '-100' } });
    fillTimes('2026-04-10T09:00', '2026-04-10T10:30');
    await user.click(screen.getByRole('button', { name: /^add flight$/i }));

    expect(await screen.findByText(/cost must be a non-negative number/i)).toBeInTheDocument();
    expect(api.addFlightNode).not.toHaveBeenCalled();
  });

  it('calls the API and notifies the parent on successful submission', async () => {
    const updated = baseTrip({
      nodes: [
        {
          id: 'node-1', category: 'flight', label: 'Delhi to Mumbai', title: 'Delhi to Mumbai', subtitle: '',
          location: 'DEL', scheduledTime: '', provider: 'IndiGo', cost: 5500, cancellationPolicy: '',
          refundable: false, riskLevel: 0, dependencyCount: 0, status: 'healthy', day: 1, icon: 'plane',
        },
      ],
    });
    vi.mocked(api.addFlightNode).mockResolvedValue(updated);

    const user = userEvent.setup();
    const { onAdded } = await renderModal();

    fillRequiredTextFields();
    fillTimes('2026-04-10T09:00', '2026-04-10T10:30');
    await user.click(screen.getByRole('button', { name: /^add flight$/i }));

    await waitFor(() => expect(onAdded).toHaveBeenCalledTimes(1));
    // AppProvider's initial tripId is the hardcoded default - nothing in
    // this test switches trips, so that's what addFlightNode is called
    // against, regardless of what id the mocked getItinerary() response uses.
    expect(api.addFlightNode).toHaveBeenCalledWith('trip-ladakh-2025', {
      category: 'flight',
      title: 'Delhi to Mumbai',
      provider: 'IndiGo',
      confirmation: '6E-999',
      originCode: 'DEL',
      destinationCode: 'BOM',
      scheduledStart: '2026-04-10T09:00',
      scheduledEnd: '2026-04-10T10:30',
      cost: 5500,
    });
  });

  it('shows an honest, actionable error when the API call fails, and re-enables the form', async () => {
    vi.mocked(api.addFlightNode).mockRejectedValue(new api.ApiError('Could not reach the TripRescue backend.', 0));

    const user = userEvent.setup();
    await renderModal();

    fillRequiredTextFields();
    fillTimes('2026-04-10T09:00', '2026-04-10T10:30');
    await user.click(screen.getByRole('button', { name: /^add flight$/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not reach the TripRescue backend.');
    expect(screen.getByRole('button', { name: /^add flight$/i })).not.toBeDisabled();
  });

  it('disables the submit button while a request is in flight, preventing duplicate submissions', async () => {
    let resolveAdd: (trip: Trip) => void;
    vi.mocked(api.addFlightNode).mockReturnValue(
      new Promise<Trip>((resolve) => {
        resolveAdd = resolve;
      })
    );

    const user = userEvent.setup();
    await renderModal();

    fillRequiredTextFields();
    fillTimes('2026-04-10T09:00', '2026-04-10T10:30');

    const submitButton = screen.getByRole('button', { name: /^add flight$/i });
    await user.click(submitButton);
    const busyButton = await screen.findByRole('button', { name: /adding/i });
    expect(busyButton).toBeDisabled();
    await user.click(busyButton);

    expect(api.addFlightNode).toHaveBeenCalledTimes(1);

    resolveAdd!(baseTrip());
    await waitFor(() => expect(api.addFlightNode).toHaveBeenCalledTimes(1));
  });
});
