import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIAssistant } from './AIAssistant';
import * as AppContextModule from '@/store/AppContext';
import * as api from '@/services/api';

vi.mock('@/store/AppContext', () => ({
  useApp: vi.fn(),
}));

vi.mock('@/services/api', () => ({
  askAssistant: vi.fn(),
}));

describe('AIAssistant Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AppContextModule.useApp).mockReturnValue({
      tripId: 'trip-1',
      trip: { name: 'Ladakh Expedition' } as any,
    } as any);
  });

  it('renders nothing when open is false', () => {
    const { container } = render(<AIAssistant open={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders welcome message and suggested questions when open', () => {
    render(<AIAssistant open={true} onClose={() => {}} />);

    expect(screen.getByText('TripRescue AI')).toBeInTheDocument();
    expect(screen.getByText(/TripRescue AI assistant for Ladakh Expedition/)).toBeInTheDocument();
    expect(screen.getByText('Suggested questions')).toBeInTheDocument();
  });

  it('sends message to backend and streams response', async () => {
    vi.mocked(api.askAssistant).mockResolvedValue({
      content: 'The flight delay causes a cascade to your hotel booking.',
      references: [],
      source: 'deterministic',
    });

    render(<AIAssistant open={true} onClose={() => {}} />);

    const textarea = screen.getByPlaceholderText('Ask about your trip...');
    fireEvent.change(textarea, { target: { value: 'Why is there a delay?' } });

    const sendBtn = screen.getByLabelText('Send');
    fireEvent.click(sendBtn);

    expect(api.askAssistant).toHaveBeenCalledWith('trip-1', 'Why is there a delay?');

    await waitFor(() => {
      expect(screen.getByText(/Why is there a delay\?/)).toBeInTheDocument();
    });
  });

  it('invokes onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<AIAssistant open={true} onClose={handleClose} />);

    const closeBtn = screen.getByLabelText('Close');
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
