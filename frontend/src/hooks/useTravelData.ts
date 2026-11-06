import { useCallback, useEffect, useMemo, useState } from 'react';
import * as api from '@/services/api';
import { getWeather, type WeatherSnapshot } from '@/services/weather';
import { useApp } from '@/store/AppContext';
import type { Trip } from '@/types';
import { buildJourney, type JourneyStop } from '@/lib/journey';

/** The active trip normalized into stops and legs (see lib/journey.ts). */
export function useJourney() {
  const { trip, activeDisruption } = useApp();
  return useMemo(() => buildJourney(trip, activeDisruption), [trip, activeDisruption]);
}

/** Every trip the traveler owns, with full itineraries. The active trip is
 * always taken from AppContext so live cascade/recovery updates show up
 * everywhere immediately; the others are fetched from the API. */
let tripsCache: { mode: api.DataMode; trips: Trip[] } | null = null;

export function useAllTrips() {
  const { trip, tripId, phase } = useApp();
  const mode = api.getDataMode();
  const [others, setOthers] = useState<Trip[]>(() => (tripsCache?.mode === mode ? tripsCache.trips : []));
  const [loading, setLoading] = useState(!(tripsCache?.mode === mode));
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    api
      .listTrips()
      .then((summaries) => Promise.all(summaries.map((s) => api.getItinerary(s.id).catch(() => null))))
      .then((loaded) => {
        if (cancelled) return;
        const trips = loaded.filter((t): t is Trip => t !== null);
        tripsCache = { mode, trips };
        setOthers(trips);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof api.ApiError ? err.message : 'Could not load your trips.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, tripId, phase, trip.nodes.length, version]);

  const trips = useMemo(() => {
    if (!trip.id) return others;
    const merged = others.some((t) => t.id === trip.id) ? others.map((t) => (t.id === trip.id ? trip : t)) : [trip, ...others];
    return merged;
  }, [others, trip]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  return { trips, loading: loading && trips.length === 0, error, refresh };
}

/** Risk alerts for the active trip, refreshed whenever its state changes. */
export function useRiskAnalysis() {
  const { tripId, trip, phase } = useApp();
  const [data, setData] = useState<api.RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const statusKey = trip.nodes.map((n) => n.status).join(',');

  useEffect(() => {
    if (!trip.id) return;
    let cancelled = false;
    setLoading(true);
    api
      .getRiskAnalysis(tripId)
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tripId, trip.id, phase, statusKey]);

  return { data, loading, error };
}

export interface StopWeather {
  city: string;
  lat: number;
  lng: number;
  weather: WeatherSnapshot;
}

/** Current conditions (Open-Meteo) at each stop that has coordinates. */
export function useStopWeather(stops: JourneyStop[]) {
  const [items, setItems] = useState<StopWeather[]>([]);
  const key = stops.map((s) => `${s.city}:${s.lat}:${s.lng}`).join('|');

  useEffect(() => {
    let cancelled = false;
    const located = stops.filter((s): s is JourneyStop & { lat: number; lng: number } => s.lat != null && s.lng != null);
    Promise.all(
      located.map((s) =>
        getWeather(s.lat, s.lng)
          .then((weather) => ({ city: s.city, lat: s.lat, lng: s.lng, weather }))
          .catch(() => null)
      )
    ).then((results) => {
      if (!cancelled) setItems(results.filter((r): r is StopWeather => r !== null));
    });
    return () => {
      cancelled = true;
    };
    // `key` captures the stop identity; `stops` itself is rebuilt every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return items;
}

export function useClock(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
