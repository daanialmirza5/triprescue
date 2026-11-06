import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AddToTripButton } from './AddToTripButton';
import { ToastProvider } from '@/components/ui/ToastProvider';
import type { ExternalItem } from '@/services/api';

const item = { kind: 'hotel', source: 'openstreetmap', externalId: 'node/1', title: 'Hotel', scheduledStart: '', scheduledEnd: '' } as ExternalItem;
const renderButton = (props: Partial<Parameters<typeof AddToTripButton>[0]> = {}) =>
  render(<ToastProvider><AddToTripButton state="idle" add={vi.fn(async () => ({ state: 'added' as const }))} build={() => item} {...props} /></ToastProvider>);

describe('AddToTripButton', () => {
  it('adds with one tap', () => {
    const add = vi.fn(async () => ({ state: 'added' as const }));
    renderButton({ add });
    fireEvent.click(screen.getByRole('button', { name: 'Add to Trip' }));
    expect(add).toHaveBeenCalledTimes(1);
  });

  it('cannot add the same item twice', () => {
    const { rerender } = renderButton({ state: 'added' });
    expect(screen.getByRole('button', { name: 'Added ✓' })).toBeDisabled();
    rerender(<ToastProvider><AddToTripButton state="already" add={vi.fn()} build={() => item} /></ToastProvider>);
    expect(screen.getByRole('button', { name: 'Already Added ✓' })).toBeDisabled();
  });

  it('shows why an item could not be added', async () => {
    renderButton({ add: vi.fn(async () => ({ state: 'error' as const, message: 'Live provider temporarily unavailable.' })) });
    fireEvent.click(screen.getByRole('button', { name: 'Add to Trip' }));
    expect(await screen.findByText('Live provider temporarily unavailable.')).toBeInTheDocument();
  });
});
