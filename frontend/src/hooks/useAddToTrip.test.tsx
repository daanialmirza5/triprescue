import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import * as api from '@/services/api';
import { useApp } from '@/store/AppContext';
import { useAddToTrip } from './useAddToTrip';

vi.mock('@/store/AppContext', () => ({ useApp: vi.fn() }));
vi.mock('@/services/api', () => ({ listExternalItems: vi.fn(), addExternalItem: vi.fn() }));

const item = { kind: 'hotel', source: 'openstreetmap', externalId: 'node/7', title: 'Hotel', scheduledStart: '', scheduledEnd: '' } as api.ExternalItem;
const reload = vi.fn(async () => {});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useApp).mockReturnValue({ trip: { id: 'trip-1', name: 'Ladakh' }, reload } as unknown as ReturnType<typeof useApp>);
  vi.mocked(api.listExternalItems).mockResolvedValue([]);
});

describe('useAddToTrip', () => {
  it('marks items already linked to the trip', async () => {
    vi.mocked(api.listExternalItems).mockResolvedValue([{ source: 'openstreetmap', externalId: 'node/7' }] as Awaited<ReturnType<typeof api.listExternalItems>>);
    const { result } = renderHook(() => useAddToTrip());
    await waitFor(() => expect(result.current.stateOf('openstreetmap', 'node/7')).toBe('already'));
    expect(result.current.stateOf('openstreetmap', 'node/8')).toBe('idle');
  });

  it('adds a new item and reloads the trip', async () => {
    vi.mocked(api.addExternalItem).mockResolvedValue({ alreadyAdded: false } as Awaited<ReturnType<typeof api.addExternalItem>>);
    const { result } = renderHook(() => useAddToTrip());
    let outcome;
    await act(async () => { outcome = await result.current.add(() => item); });
    expect(outcome).toEqual({ state: 'added' });
    expect(api.addExternalItem).toHaveBeenCalledWith('trip-1', item);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(result.current.stateOf('openstreetmap', 'node/7')).toBe('added');
  });

  it('does not reload when the server already had the item', async () => {
    vi.mocked(api.addExternalItem).mockResolvedValue({ alreadyAdded: true } as Awaited<ReturnType<typeof api.addExternalItem>>);
    const { result } = renderHook(() => useAddToTrip());
    await act(async () => { await result.current.add(() => item); });
    expect(reload).not.toHaveBeenCalled();
    expect(result.current.stateOf('openstreetmap', 'node/7')).toBe('already');
  });

  it('reports items that cannot be built without calling the server', async () => {
    const { result } = renderHook(() => useAddToTrip());
    let outcome;
    await act(async () => { outcome = await result.current.add(() => { throw new Error('No date for this event.'); }); });
    expect(outcome).toEqual({ state: 'error', message: 'No date for this event.' });
    expect(api.addExternalItem).not.toHaveBeenCalled();
  });

  it('lets the traveller retry after a failed add', async () => {
    vi.mocked(api.addExternalItem).mockRejectedValue(new Error('Live provider temporarily unavailable.'));
    const { result } = renderHook(() => useAddToTrip());
    let outcome;
    await act(async () => { outcome = await result.current.add(() => item); });
    expect(outcome).toEqual({ state: 'error', message: 'Live provider temporarily unavailable.' });
    expect(result.current.stateOf('openstreetmap', 'node/7')).toBe('idle');
  });
});
