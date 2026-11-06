import { useCallback, useEffect, useMemo, useState } from 'react';
import * as api from '@/services/api';
import { useApp } from '@/store/AppContext';
import { useRouter } from '@/lib/router';
import { useToast } from '@/components/ui/ToastProvider';
import { PageHero } from '@/components/layout/PageHero';
import { useAddToTrip } from '@/hooks/useAddToTrip';
import { AddToTripButton } from '@/components/live/AddToTripButton';
import { LiveTransportCard } from '@/components/live/LiveTransportCard';
import { SourceBadge } from '@/components/live/SourceBadge';
import { DiscoveryMap } from '@/components/live/DiscoveryMap';
import { betweenTrainToItem, composeImpact, flightToItem, liveTrainToItem, timeAgo, toDateInput } from '@/lib/liveTravel';
import { cn } from '@/lib/utils';
import { Eye, Loader2, Plane, RefreshCw, Search, Sparkles, TrainFront, Zap } from 'lucide-react';

type Mode = 'flights' | 'trains';
const REFRESH_MS = 60_000; // matches the backend's live cache; no tighter polling
const field = 'rounded-tile border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

function ProviderPill({ health }: { health: api.ProviderHealth | undefined }) {
  if (!health) return null;
  return (
    <span className={cn('pill', health.available ? 'bg-safe-light text-safe' : 'bg-risk-light text-risk-dark')} title={health.detail}>
      {health.provider === 'aviationstack' ? 'Aviationstack' : 'RailRadar'} · {health.available ? 'ready' : 'not configured'}
    </span>
  );
}

/** Live view of one flight/train: provider position, never an estimate. */
function LiveView({ item, onRefresh, refreshing }: { item: api.LiveTransport; onRefresh: () => void; refreshing: boolean }) {
  const loc = item.currentLocation;
  const route = item.route.filter((s) => s.latitude != null && s.longitude != null).map((s) => [s.latitude!, s.longitude!] as [number, number]);
  return (
    <section className="card overflow-hidden" aria-label="Live view">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
        <h2 className="section-title">Live view · {item.number}</h2>
        <SourceBadge source={item.source} live updatedAt={item.lastUpdatedAt} />
        <button type="button" onClick={onRefresh} disabled={refreshing} className="btn-ghost ml-auto px-3 py-1.5 text-xs">
          <RefreshCw className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')} /> Refresh
        </button>
      </div>
      {loc ? (
        <DiscoveryMap
          markers={[{ id: item.id, kind: item.mode === 'flight' ? 'flight' : 'train', name: item.number ?? '', latitude: loc.latitude, longitude: loc.longitude, heading: item.heading }]}
          route={route}
          className="h-[300px] sm:h-[380px]"
        />
      ) : (
        <p className="bg-canvas px-5 py-10 text-center text-sm font-medium text-ink-muted">Live location unavailable</p>
      )}
      <dl className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
        <div>
          <dt className="text-[11px] text-ink-muted">{item.mode === 'flight' ? '✈ Current location' : '🚆 Current location'}</dt>
          <dd className="text-sm font-semibold text-ink">
            {item.mode === 'train' && item.currentLocationName ? item.currentLocationName : loc ? `${loc.latitude.toFixed(2)}° ${loc.latitude >= 0 ? 'N' : 'S'}, ${loc.longitude.toFixed(2)}° ${loc.longitude >= 0 ? 'E' : 'W'}` : 'Not provided'}
          </dd>
        </div>
        {item.mode === 'flight' ? (
          <div><dt className="text-[11px] text-ink-muted">Altitude</dt><dd className="text-sm font-semibold text-ink">{item.altitudeMeters !== null ? `${Math.round(item.altitudeMeters * 3.28084).toLocaleString('en-IN')} ft` : 'Not provided'}</dd></div>
        ) : (
          <div><dt className="text-[11px] text-ink-muted">Next station</dt><dd className="text-sm font-semibold text-ink">{item.nextStop?.name ?? 'Not provided'}</dd></div>
        )}
        <div><dt className="text-[11px] text-ink-muted">Speed</dt><dd className="text-sm font-semibold text-ink">{item.speedKmh !== null ? `${Math.round(item.speedKmh)} km/h` : 'Not provided'}</dd></div>
        <div><dt className="text-[11px] text-ink-muted">{item.mode === 'flight' ? 'Heading' : 'Platform'}</dt><dd className="text-sm font-semibold text-ink">{item.mode === 'flight' ? (item.heading !== null ? `${Math.round(item.heading)}°` : 'Not provided') : item.platform ?? 'Not provided'}</dd></div>
      </dl>
    </section>
  );
}

/** Existing SafarSathi simulation on top of a real live baseline. */
function LiveBaselineSimulator({ tracked, title }: { tracked: api.TrackedTransport; title: string }) {
  const { trip, triggerDisruption, isBusy } = useApp();
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const [extra, setExtra] = useState(120);
  const [preview, setPreview] = useState<api.PropagationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const live = tracked.live;
  const isFlight = tracked.kind === 'flight';
  // Flights: real delay + simulated delay. The existing engine models train
  // disruptions on transfer bookings as a failure, so trains simulate that.
  const impact = live ? composeImpact(live, extra) : null;
  const request: api.DisruptionRequest = isFlight
    ? { type: 'flight-delay', primaryNodeId: tracked.nodeId, delayMinutes: impact?.totalImpactMinutes ?? extra }
    : { type: 'transfer-failure', primaryNodeId: tracked.nodeId };

  const runPreview = async () => {
    setBusy(true);
    try {
      setPreview(await api.simulateDisruption(trip.id, request));
    } catch (err) {
      addToast('error', 'Simulation failed', err instanceof Error ? err.message : undefined);
    } finally {
      setBusy(false);
    }
  };
  const sendToRecovery = async () => {
    await triggerDisruption(request.type, { primaryNodeId: request.primaryNodeId, delayMinutes: request.delayMinutes });
    navigate('recovery');
  };

  return (
    <div className="rounded-tile border border-ai/20 bg-ai-light/30 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Sparkles className="h-4 w-4 text-ai" />
        <p className="text-sm font-semibold text-ink">Simulate on the live baseline · {title}</p>
        <SourceBadge source="simulation" simulation />
      </div>
      {isFlight ? (
        <>
          <label className="mt-3 block text-xs text-ink-muted" htmlFor={`extra-${tracked.nodeId}`}>Simulated additional delay: <b className="text-ink">+{extra} min</b></label>
          <input id={`extra-${tracked.nodeId}`} type="range" min={0} max={360} step={15} value={extra} onChange={(e) => { setExtra(Number(e.target.value)); setPreview(null); }} className="mt-1 w-full accent-ai" />
          {impact && (
            <p className="mt-2 text-sm text-ink-soft">
              Real delay {live?.delayMinutes == null
                ? <b className="text-ink">not reported by {live?.source === 'railradar' ? 'RailRadar' : 'Aviationstack'} (counted as 0)</b>
                : <><b className="text-ink">+{impact.realDelayMinutes} min</b> (live)</>} · Simulated <b className="text-ai">+{impact.simulatedDelayMinutes} min</b> · Simulated total impact <b className="text-ink">+{impact.totalImpactMinutes} min</b>
            </p>
          )}
          {!live && <p className="mt-2 text-xs text-ink-muted">No live baseline right now — the simulation uses the simulated delay only.</p>}
        </>
      ) : (
        <p className="mt-2 text-sm text-ink-soft">SafarSathi models train disruptions as a missed/failed train. Live delay stays as reported{live?.delayMinutes != null ? ` (+${live.delayMinutes} min)` : ''}.</p>
      )}
      {preview && (
        <p className="mt-2 text-sm text-ink-soft">
          Preview: <b className="text-ink">{preview.impacts.filter((i) => i.status !== 'healthy' && i.nodeId !== tracked.nodeId).length}</b> downstream booking(s) affected · trip health <b className="text-ink">{preview.tripHealthScore}</b>. Nothing was changed.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={runPreview} disabled={busy} className="btn-ghost px-3 py-1.5 text-xs">{busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />} Preview impact</button>
        <button type="button" onClick={sendToRecovery} disabled={isBusy} className="btn-primary px-3 py-1.5 text-xs"><Zap className="h-3.5 w-3.5" /> Run in SafarSathi recovery</button>
      </div>
    </div>
  );
}

export function LiveTransportPage() {
  const { trip } = useApp();
  const adder = useAddToTrip();
  const { addToast } = useToast();
  const [mode, setMode] = useState<Mode>('flights');
  const [health, setHealth] = useState<api.LiveHealth | null>(null);
  const [flightNumber, setFlightNumber] = useState('');
  const [dep, setDep] = useState('');
  const [arr, setArr] = useState('');
  const [trainNumber, setTrainNumber] = useState('');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [trainDate, setTrainDate] = useState(() => toDateInput(new Date()));
  const [results, setResults] = useState<api.LiveTransport[]>([]);
  const [between, setBetween] = useState<api.TrainsBetweenResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<api.LiveTransport | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tracked, setTracked] = useState<api.TrackedTransport[] | null>(null);
  const [trackedError, setTrackedError] = useState<string | null>(null);

  useEffect(() => {
    api.getLiveHealth().then(setHealth).catch((err) => setError(err instanceof Error ? err.message : null));
  }, []);

  const loadTracked = useCallback(() => {
    if (!trip.id) return;
    api.getTrackedTransport(trip.id).then((t) => { setTracked(t); setTrackedError(null); }).catch((err) => setTrackedError(err instanceof Error ? err.message : 'Could not load tracked transport.'));
  }, [trip.id]);
  useEffect(() => { loadTracked(); }, [loadTracked, trip.nodes.length]);

  const run = async (task: () => Promise<void>) => {
    setSearching(true);
    setError(null);
    try {
      await task();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed.');
    } finally {
      setSearching(false);
    }
  };

  const searchFlights = () => run(async () => {
    setBetween(null);
    setResults(await api.searchLiveFlights({ flightNumber: flightNumber.trim() || undefined, dep: dep.trim().toUpperCase() || undefined, arr: arr.trim().toUpperCase() || undefined }));
  });
  const searchTrains = () => run(async () => {
    if (trainNumber.trim()) {
      setBetween(null);
      setResults([await api.getLiveTrain(trainNumber.trim())]);
    } else {
      setResults([]);
      setBetween(await api.getTrainsBetween(fromStation.trim().toUpperCase(), toStation.trim().toUpperCase(), trainDate));
    }
  });

  const refresh = useCallback(async () => {
    if (!selected) return;
    setRefreshing(true);
    try {
      const next = selected.mode === 'flight'
        ? await api.getLiveFlight(selected.number ?? '', selected.journeyDate ?? undefined)
        : await api.getLiveTrain(selected.number ?? '', selected.journeyDate ?? undefined);
      setSelected(next);
    } catch (err) {
      addToast('error', 'Live refresh failed', err instanceof Error ? err.message : undefined);
    } finally {
      setRefreshing(false);
    }
  }, [selected, addToast]);

  const selectedId = selected?.id;
  useEffect(() => {
    if (!selectedId) return;
    const t = setInterval(() => { refresh(); }, REFRESH_MS);
    return () => clearInterval(t);
    // restart only when a different item is opened
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const titleOf = useMemo(() => new Map(trip.nodes.map((n) => [n.id, n.title])), [trip.nodes]);
  const buildFor = (item: api.LiveTransport) => () => (item.mode === 'flight' ? flightToItem(item) : liveTrainToItem(item));

  return (
    <div className="animate-fade-in">
      <PageHero
        crumbs={[{ label: 'Live Transport' }]}
        title="Live Transport"
        titleAddon={<span className="flex flex-wrap gap-2"><ProviderPill health={health?.flights} /><ProviderPill health={health?.trains} /></span>}
        subtitle={<span className="text-[17px] sm:text-lg">Real flights and Indian trains, straight from the providers.</span>}
      />
      <div className="relative z-10 space-y-5">
        <div className="flex gap-2" role="tablist" aria-label="Transport mode">
          {([['flights', 'Flights', Plane], ['trains', 'Trains', TrainFront]] as const).map(([id, label, Icon]) => (
            <button key={id} type="button" role="tab" aria-selected={mode === id} onClick={() => { setMode(id); setResults([]); setBetween(null); setError(null); }}
              className={cn('flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition', mode === id ? 'border-brand bg-brand text-white shadow-glow' : 'border-line bg-white text-ink-soft hover:border-brand/40')}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        <section className="card p-5">
          {mode === 'flights' ? (
            <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); searchFlights(); }}>
              <input aria-label="Flight number" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} placeholder="Flight number (AI101)" className={cn(field, 'w-44 uppercase')} />
              <span className="self-center text-xs text-ink-muted">or</span>
              <input aria-label="Departure airport" value={dep} onChange={(e) => setDep(e.target.value)} maxLength={3} placeholder="From (BOM)" className={cn(field, 'w-28 uppercase')} />
              <input aria-label="Arrival airport" value={arr} onChange={(e) => setArr(e.target.value)} maxLength={3} placeholder="To (DEL)" className={cn(field, 'w-28 uppercase')} />
              <button type="submit" disabled={searching || !(flightNumber.trim() || dep.trim() || arr.trim())} className="btn-primary px-4 py-2.5 text-sm disabled:opacity-60"><Search className="h-4 w-4" /> Search live</button>
            </form>
          ) : (
            <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); searchTrains(); }}>
              <input aria-label="Train number" value={trainNumber} onChange={(e) => setTrainNumber(e.target.value)} maxLength={5} inputMode="numeric" placeholder="Train no. (12951)" className={cn(field, 'w-40')} />
              <span className="self-center text-xs text-ink-muted">or</span>
              <input aria-label="From station" value={fromStation} onChange={(e) => setFromStation(e.target.value)} maxLength={5} placeholder="From (MMCT)" className={cn(field, 'w-28 uppercase')} />
              <input aria-label="To station" value={toStation} onChange={(e) => setToStation(e.target.value)} maxLength={5} placeholder="To (NDLS)" className={cn(field, 'w-28 uppercase')} />
              <input aria-label="Journey date" type="date" value={trainDate} onChange={(e) => setTrainDate(e.target.value)} className={cn(field, 'w-44')} />
              <button type="submit" disabled={searching || !(trainNumber.trim() || (fromStation.trim() && toStation.trim()))} className="btn-primary px-4 py-2.5 text-sm disabled:opacity-60"><Search className="h-4 w-4" /> Search live</button>
            </form>
          )}
          {searching && <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted"><Loader2 className="h-4 w-4 animate-spin" /> Asking the live provider…</p>}
          {error && <p role="alert" className="mt-3 rounded-tile border border-danger/20 bg-danger-light/50 px-4 py-3 text-sm text-danger">{error}</p>}
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-3">
            {results.map((item) => (
              <LiveTransportCard key={item.id} item={item} selected={selected?.id === item.id} actions={<>
                <button type="button" onClick={() => setSelected(item)} className="btn-ghost px-3 py-1.5 text-xs"><Eye className="h-3.5 w-3.5" /> View Live</button>
                <AddToTripButton state={adder.stateOf(item.source, item.externalId)} add={adder.add} build={buildFor(item)} />
              </>} />
            ))}
            {between && (
              <section className="card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="section-title">{between.origin.name} → {between.destination.name}</h2>
                  <SourceBadge source="railradar" />
                </div>
                {between.trains.length === 0 && <p className="mt-3 text-sm text-ink-muted">RailRadar returned no trains between these stations.</p>}
                <ul className="mt-2 divide-y divide-line">
                  {between.trains.map((t) => (
                    <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-semibold text-ink">{t.number} · {t.name}</p>
                        <p className="text-xs text-ink-muted">{t.departureTime ?? '—'} → {t.arrivalTime ?? '—'}{t.arrivalDayOffset ? ` (+${t.arrivalDayOffset}d)` : ''}{t.liveDelayMinutes ? ` · live +${t.liveDelayMinutes} min` : ''}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => run(async () => setSelected(await api.getLiveTrain(t.number, trainDate)))} className="btn-ghost px-3 py-1.5 text-xs"><Eye className="h-3.5 w-3.5" /> View Live</button>
                        <AddToTripButton state={adder.stateOf('railradar', `${t.number}@${trainDate}`)} add={adder.add} build={() => betweenTrainToItem(t, trainDate)} />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {!results.length && !between && !searching && !error && (
              <p className="card px-5 py-8 text-center text-sm text-ink-muted">Search a flight or train to see its live status. Only what you search is requested from the providers.</p>
            )}
          </div>
          <div className="min-w-0">
            {selected ? <LiveView item={selected} onRefresh={refresh} refreshing={refreshing} /> : (
              <section className="card flex h-full min-h-[200px] items-center justify-center p-6 text-center text-sm text-ink-muted">Choose “View Live” on a result to follow it on the map.</section>
            )}
          </div>
        </div>

        <section className="card p-5" aria-labelledby="tracked-title">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="tracked-title" className="section-title">Live transport in {trip.name || 'this trip'}</h2>
            <button type="button" onClick={loadTracked} className="btn-ghost ml-auto px-3 py-1.5 text-xs"><RefreshCw className="h-3.5 w-3.5" /> Refresh</button>
          </div>
          {trackedError && <p role="alert" className="mt-3 text-sm text-danger">{trackedError}</p>}
          {tracked && tracked.length === 0 && <p className="mt-3 text-sm text-ink-muted">No live flights or trains in this trip yet. Add one above to monitor it here.</p>}
          <div className="mt-3 space-y-4">
            {(tracked ?? []).map((t) => (
              <div key={t.nodeId} className="space-y-3">
                {t.live ? <LiveTransportCard item={t.live} /> : (
                  <div className="rounded-tile border border-line p-4 text-sm">
                    <p className="font-semibold text-ink">{titleOf.get(t.nodeId) ?? t.externalId}</p>
                    <p className="mt-1 text-ink-muted">{t.error ?? 'No live record found.'}</p>
                  </div>
                )}
                <LiveBaselineSimulator tracked={t} title={titleOf.get(t.nodeId) ?? t.externalId} />
                {t.live && <p className="text-[11px] text-ink-muted">Live record retrieved {timeAgo(t.live.retrievedAt)}; the simulation never changes it.</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
