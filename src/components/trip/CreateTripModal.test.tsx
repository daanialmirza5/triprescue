import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { AppProvider } from '@/store/AppContext';
import { CreateTripModal } from './CreateTripModal';
import type { Trip } from '@/types';

vi.mock('@/services/api', async () => {
  const actual = await vi.importActual<typeof import('@/services/api')>('@/services/api');
  return {
    ...actual,
    getItinerary: vi.fn(),
    getActivityLog: vi.fn(),
    getNotifications: vi.fn(),
    getPreferences: vi.fn(),
    createTrip: vi.fn(),
  };
});

import * as api from '@/services/api';

function baseTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: 'trip-1',
    name: 'Existing Trip',
    travelerName: 'Test Traveler',
    route: 'A to B',
    origin: 'A',
    destination: 'B',
    startDate: '2025-09-01',
    endDate: '2025-09-05',
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
});

async function renderModal(onCreated = vi.fn()) {
  const onClose = vi.fn();
  render(
    <Wrapper>
      <CreateTripModal open onClose={onClose} onCreated={onCreated} />
    </Wrapper>
  );
  await screen.findByLabelText(/trip name/i);
  // AppProvider's own mount-time reload() (four parallel API calls) must
  // fully resolve and flush its resulting state update before any typing
  // starts below - otherwise that unrelated re-render can land mid-keystroke
  // and silently drop characters from a controlled input.
  await waitFor(() => expect(api.getPreferences).toHaveBeenCalled());
  return { onClose, onCreated };
}

// Native <input type="date"> isn't a free-text field - real browsers accept
// per-segment keyboard entry, not a typed ISO string, and jsdom doesn't
// reliably simulate that via userEvent.type(). fireEvent.change (setting
// .value directly) is the standard, documented way to drive date inputs in
// Testing Library.
function fillDates(startDate: string, endDate: string) {
  fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: startDate } });
  fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: endDate } });
}

function fillTextFields() {
  fireEvent.change(screen.getByLabelText(/trip name/i), { target: { value: 'Kyoto Weekend' } });
  fireEvent.change(screen.getByLabelText(/^origin$/i), { target: { value: 'Tokyo' } });
  fireEvent.change(screen.getByLabelText(/^destination$/i), { target: { value: 'Kyoto' } });
}

describe('CreateTripModal', () => {
  it('renders the form with accessible, labelled fields', async () => {
    await renderModal();
    expect(screen.getByLabelText(/trip name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^origin$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^destination$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create trip/i })).toBeInTheDocument();
  });

  it('blocks submission and shows field errors when required fields are empty', async () => {
    const user = userEvent.setup();
    await renderModal();

    await user.click(screen.getByRole('button', { name: /create trip/i }));

    expect(await screen.findByText(/trip name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/origin is required/i)).toBeInTheDocument();
    expect(screen.getByText(/destination is required/i)).toBeInTheDocument();
    expect(api.createTrip).not.toHaveBeenCalled();
  });

  it('rejects an end date before the start date', async () => {
    const user = userEvent.setup();
    await renderModal();

    fillTextFields();
    fillDates('2026-04-13', '2026-04-10');
    await user.click(screen.getByRole('button', { name: /create trip/i }));

    expect(await screen.findByText(/end date cannot be before start date/i)).toBeInTheDocument();
    expect(api.createTrip).not.toHaveBeenCalled();
  });

  it('calls the API and notifies the parent on successful creation', async () => {
    const created = baseTrip({ id: 'trip-new', name: 'Kyoto Weekend' });
    vi.mocked(api.createTrip).mockResolvedValue(created);
    vi.mocked(api.getItinerary).mockResolvedValue(created); // the post-switchTrip reload

    const user = userEvent.setup();
    const { onCreated } = await renderModal();

    fillTextFields();
    fillDates('2026-04-10', '2026-04-13');
    await user.click(screen.getByRole('button', { name: /create trip/i }));

    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
    expect(api.createTrip).toHaveBeenCalledWith({
      name: 'Kyoto Weekend',
      origin: 'Tokyo',
      destination: 'Kyoto',
      startDate: '2026-04-10',
      endDate: '2026-04-13',
    });
  });

  it('shows an honest, actionable error when creation fails, and re-enables the form', async () => {
    vi.mocked(api.createTrip).mockRejectedValue(new api.ApiError('Could not reach the TripRescue backend.', 0));

    const user = userEvent.setup();
    await renderModal();

    fillTextFields();
    fillDates('2026-04-10', '2026-04-13');
    await user.click(screen.getByRole('button', { name: /create trip/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not reach the TripRescue backend.');
    expect(screen.getByRole('button', { name: /create trip/i })).not.toBeDisabled();
  });

  it('disables the submit button while a request is in flight, preventing duplicate submissions', async () => {
    let resolveCreate: (trip: Trip) => void;
    vi.mocked(api.createTrip).mockReturnValue(
      new Promise<Trip>((resolve) => {
        resolveCreate = resolve;
      })
    );

    const user = userEvent.setup();
    await renderModal();

    fillTextFields();
    fillDates('2026-04-10', '2026-04-13');

    const submitButton = screen.getByRole('button', { name: /create trip/i });
    await user.click(submitButton);
    // A second click while the first request is still in flight must not
    // trigger a second API call - the button now reads "Creating..." and is
    // disabled, so this click should land on nothing actionable.
    const busyButton = await screen.findByRole('button', { name: /creating/i });
    expect(busyButton).toBeDisabled();
    await user.click(busyButton);

    expect(api.createTrip).toHaveBeenCalledTimes(1);

    resolveCreate!(baseTrip({ id: 'trip-new' }));
    await waitFor(() => expect(api.createTrip).toHaveBeenCalledTimes(1));
  });
});
