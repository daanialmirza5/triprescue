import { useCallback, useEffect, useState } from 'react';
import * as api from '@/services/api';
import { useApp } from '@/store/AppContext';
import { itemKey } from '@/lib/liveTravel';

export type AddState = 'idle' | 'adding' | 'added' | 'already';
export interface AddOutcome { state: AddState | 'error'; message?: string }

/** One-tap "Add to Trip" for live/discovery items. Adds to the current trip
 * through the backend adapter, then reloads the trip so every existing screen
 * (itinerary, graph, recovery) sees the new booking. Items already linked to
 * the trip show as "Already Added". */
export function useAddToTrip() {
  const { trip, reload } = useApp();
  const [states, setStates] = useState<Record<string, AddState>>({});

  useEffect(() => {
    if (!trip.id) return;
    let cancelled = false;
    api.listExternalItems(trip.id).then((links) => {
      if (cancelled) return;
      const next: Record<string, AddState> = {};
      links.forEach((l) => { next[itemKey(l.source, l.externalId)] = 'already'; });
      setStates(next);
    }).catch(() => { /* not fatal: duplicates are still refused server-side */ });
    return () => { cancelled = true; };
  }, [trip.id]);

  const add = useCallback(async (build: () => api.ExternalItem): Promise<AddOutcome> => {
    let item: api.ExternalItem;
    try {
      item = build();
    } catch (err) {
      return { state: 'error', message: err instanceof Error ? err.message : 'This item cannot be added.' };
    }
    const key = itemKey(item.source, item.externalId);
    setStates((s) => ({ ...s, [key]: 'adding' }));
    try {
      const result = await api.addExternalItem(trip.id, item);
      const state: AddState = result.alreadyAdded ? 'already' : 'added';
      setStates((s) => ({ ...s, [key]: state }));
      if (!result.alreadyAdded) await reload();
      return { state };
    } catch (err) {
      setStates((s) => ({ ...s, [key]: 'idle' }));
      return { state: 'error', message: err instanceof Error ? err.message : 'Could not add this item.' };
    }
  }, [trip.id, reload]);

  const stateOf = useCallback((source: string, externalId: string): AddState => states[itemKey(source, externalId)] ?? 'idle', [states]);

  return { tripId: trip.id, tripName: trip.name, add, stateOf };
}
