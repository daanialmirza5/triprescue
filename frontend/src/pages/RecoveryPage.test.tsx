import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { RecoveryPage } from './RecoveryPage';
import { ToastProvider } from '@/components/ui/ToastProvider';
import * as AppContextModule from '@/store/AppContext';
import * as api from '@/services/api';
import fixtures from '@/test/fixtures/ladakh.json';
import { defaultPreferences } from '@/data/mockData';
import type { Disruption, RecoveryOption, Trip } from '@/types';

// Responses captured from the real backend (see src/test/fixtures/README.md).
vi.mock('@/services/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/api')>()),
  getRecoveryNarrative: vi.fn(),
}));
vi.mock('@/store/AppContext', () => ({ useApp: vi.fn() }));
vi.mock('@/lib/router', () => ({ useRouter: () => ({ navigate: vi.fn(), route: 'recovery', params: {}, consumeParams: vi.fn() }) }));
vi.mock('@/components/layout/ShellActions', () => ({ useShellActions: () => ({ openSimulate: vi.fn(), openSupport: vi.fn() }) }));

let trip: Trip;
let options: RecoveryOption[];
const applyRecoveryPlan = vi.fn(async () => {});

beforeEach(() => {
  applyRecoveryPlan.mockClear();
  trip = structuredClone(fixtures.delayTrip) as unknown as Trip;
  options = structuredClone(fixtures.delayRecoveryOptions) as unknown as RecoveryOption[];
  const disruption = fixtures.delayDisruption as unknown as Disruption;
  vi.mocked(api.getRecoveryNarrative).mockResolvedValue(fixtures.delayNarrative as unknown as api.RecoveryNarrative);
  vi.mocked(AppContextModule.useApp).mockImplementation(() => ({
    trip, phase: 'recovering', activeDisruption: disruption, recoveryOptions: options,
    selectedRecovery: options[0].id, selectRecovery: vi.fn(), applyRecoveryPlan, appliedRecovery: null,
    preferences: defaultPreferences, setPreferences: vi.fn(), loadRecoveryOptions: vi.fn(), resetTrip: vi.fn(), isBusy: false,
  }) as unknown as ReturnType<typeof AppContextModule.useApp>);
});

const renderPage = () => render(<ToastProvider><RecoveryPage /></ToastProvider>);
const openConfirm = () => {
  fireEvent.click(screen.getByRole('button', { name: /Apply Recovery & Re-Validate/ }));
  return screen.getByRole('dialog', { name: 'Apply this recovery?' });
};

describe('RecoveryPage confirm-before-apply', () => {
  it('nothing is applied until the traveler confirms', async () => {
    renderPage();
    const dialog = openConfirm();
    expect(dialog).toHaveAccessibleDescription('Nothing changes until you confirm.');
    expect(within(dialog).getByText(options[0].name)).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog', { name: 'Apply this recovery?' })).toBeNull();
    openConfirm();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Apply this recovery?' })).toBeNull();
    expect(applyRecoveryPlan).not.toHaveBeenCalled();

    fireEvent.click(within(openConfirm()).getByRole('button', { name: /Confirm & Re-Validate/ }));
    await waitFor(() => expect(applyRecoveryPlan).toHaveBeenCalledWith(options[0].id));
    expect(applyRecoveryPlan).toHaveBeenCalledTimes(1);
  });
});
