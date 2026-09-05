import { useState } from 'react';

/** Persists purely local, per-browser UI preferences (e.g. which notification
 * categories to show) to localStorage. Not a substitute for the backend-
 * persisted TravelerPreferences in AppContext - those drive real recovery
 * ranking and must round-trip through the API; this is for display-only
 * toggles that have no backend model. */
export function useLocalStorageState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  const update = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        /* storage unavailable - preference just won't survive a reload */
      }
      return resolved;
    });
  };

  return [value, update] as const;
}
