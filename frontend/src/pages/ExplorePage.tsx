import { useEffect, useMemo, useState, type ReactNode } from 'react';
import * as api from '@/services/api';
import { useApp } from '@/store/AppContext';
import { useRouter } from '@/lib/router';
import { PageHero } from '@/components/layout/PageHero';
import { useAddToTrip } from '@/hooks/useAddToTrip';
import { AddToTripButton } from '@/components/live/AddToTripButton';
import { SourceBadge } from '@/components/live/SourceBadge';
import { LiveTransportCard } from '@/components/live/LiveTransportCard';
import { DiscoveryMap, type DiscoveryMarker } from '@/components/live/DiscoveryMap';
import { QuickAddBar, type QuickAddKind } from '@/components/live/QuickAddBar';
import {
  attractionToItem,
  betweenTrainToItem,
  eventToItem,
  flightToItem,
  hotelToItem,
  toDateInput,
  tripDayCount,
  tripStartDate,
} from '@/lib/liveTravel';
import { cn } from '@/lib/utils';
import { ArrowLeft, Loader2, MapPin, Search, TrainFront } from 'lucide-react';

const PLACE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'beaches', label: 'Beaches' },
  { id: 'forts', label: 'Forts' },
  { id: 'museums', label: 'Museums' },
  { id: 'nature', label: 'Nature' },
  { id: 'viewpoints', label: 'Viewpoints' },
  { id: 'monuments', label: 'Monuments' },
];
const EVENT_CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'music', label: 'Music' },
  { id: 'sports', label: 'Sports' },
  { id: 'theatre', label: 'Theatre' },
  { id: 'culture', label: 'Culture' },
];

interface Loadable<T> { loading: boolean; error: string | null; data: T | null }
const idle = <T,>(): Loadable<T> => ({ loading: false, error: null, data: null });

/** Run `load` whenever `key` changes (null = don't run); latest call wins. */
function useLoad<T>(key: string | null, load: () => Promise<T>): Loadable<T> {
  const [state, setState] = useState<Loadable<T>>(idle);
  useEffect(() => {
    if (key === null) { setState(idle()); return; }
    let cancelled = false;
    setState({ loading: true, error: null, data: null });
    load()
      .then((data) => { if (!cancelled) setState({ loading: false, error: null, data }); })
      .catch((err) => { if (!cancelled) setState({ loading: false, error: err instanceof Error ? err.message : 'Search failed.', data: null }); });
    return () => { cancelled = true; };
    // `key` fully describes the request
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state;
}

function useDebounced<T>(value: T, ms = 350): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function Chips<T extends string>({ options, value, onChange, label }: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}
          className={cn('rounded-full border px-3 py-1.5 text-xs font-semibold transition', value === o.id ? 'border-brand bg-brand-light text-brand' : 'border-line bg-white text-ink-soft hover:border-brand/40')}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Status({ state, empty }: { state: Loadable<unknown[]>; empty: string }) {
  if (state.loading) return <p className="flex items-center gap-2 py-6 text-sm text-ink-muted"><Loader2 className="h-4 w-4 animate-spin" /> Searching…</p>;
  if (state.error) return <p role="alert" className="rounded-tile border border-danger/20 bg-danger-light/50 px-4 py-3 text-sm text-danger">{state.error}</p>;
  if (state.data && state.data.length === 0) return <p className="py-6 text-sm text-ink-muted">{empty}</p>;
  return null;
}

const field = 'w-full rounded-tile border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

export function ExplorePage() {
  const { trip } = useApp();
  const { navigate } = useRouter();
  const adder = useAddToTrip();
  const [query, setQuery] = useState('');
  const debounced = useDebounced(query.trim());
  const [selected, setSelected] = useState<api.Destination | null>(null);
  const [tab, setTab] = useState<QuickAddKind>('hotels');

  // Tab controls
  const tripStart = useMemo(() => tripStartDate(trip), [trip]);
  const days = tripDayCount(trip);
  const [hotelQuery, setHotelQuery] = useState('');
  const hotelName = useDebounced(hotelQuery.trim());
  const [checkIn, setCheckIn] = useState(() => toDateInput(tripStart));
  const [checkOut, setCheckOut] = useState(() => toDateInput(new Date(tripStart.getFullYear(), tripStart.getMonth(), tripStart.getDate() + Math.max(1, days - 1))));
  const [placeCategory, setPlaceCategory] = useState('all');
  const [placeDay, setPlaceDay] = useState(1);
  const [eventRange, setEventRange] = useState<'week' | 'month'>('month');
  const [eventCategory, setEventCategory] = useState('');
  const [flightFrom, setFlightFrom] = useState('');
  const [trainFrom, setTrainFrom] = useState('');
  const [trainDate, setTrainDate] = useState(() => toDateInput(tripStart));
  // The trip may still be loading on first render (e.g. opening #/explore
  // directly): re-seed the default dates once its real dates arrive.
  useEffect(() => {
    if (!trip.startDate) return;
    setCheckIn(toDateInput(tripStart));
    setCheckOut(toDateInput(new Date(tripStart.getFullYear(), tripStart.getMonth(), tripStart.getDate() + Math.max(1, days - 1))));
    setTrainDate(toDateInput(tripStart));
    // `tripStart`/`days` derive from these trip fields
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.id, trip.startDate, trip.endDate]);

  const destinations = useLoad(`dest:${debounced}`, () => api.searchDestinations(debounced || undefined));
  const d = selected;
  const base = d ? { latitude: d.latitude, longitude: d.longitude, city: d.name } : null;

  const hotels = useLoad(d && tab === 'hotels' ? `h:${d.id}:${hotelName}` : null, () => api.searchHotels({ ...base!, query: hotelName || undefined, radius: 6000, limit: 30 }));
  const places = useLoad(d && tab === 'places' ? `p:${d.id}:${placeCategory}` : null, () => api.searchAttractions({ ...base!, category: placeCategory === 'all' ? undefined : placeCategory, radius: 12000, limit: 30 }));
  const eventWindow = useMemo(() => {
    const start = new Date();
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + (eventRange === 'week' ? 7 : 31));
    return { startDate: toDateInput(start), endDate: toDateInput(end) };
  }, [eventRange]);
  const events = useLoad(d && tab === 'events' ? `e:${d.id}:${eventRange}:${eventCategory}` : null, () => api.searchEvents({ ...base!, radius: 60, ...eventWindow, category: eventCategory || undefined, limit: 20 }));
  const [flightKey, setFlightKey] = useState<string | null>(null);
  const flights = useLoad(d && tab === 'flights' ? flightKey : null, () => api.searchLiveFlights({ arr: d!.airportCode ?? undefined, dep: flightFrom.trim().toUpperCase() || undefined, limit: 20 }));
  const [trainKey, setTrainKey] = useState<string | null>(null);
  const trains = useLoad(d && tab === 'trains' ? trainKey : null, () => api.getTrainsBetween(trainFrom.trim().toUpperCase(), d!.stationCode!, trainDate));

  const pick = (dest: api.Destination) => {
    setSelected(dest);
    setTab('hotels');
    setFlightKey(dest.airportCode ? `f:${dest.id}:` : null);
    setTrainKey(null);
  };

  const popup = (title: string, kind: string, source: string, detail: string | null, action: ReactNode) => (
    <div className="min-w-[180px] space-y-1">
      <p className="font-semibold text-ink">{title}</p>
      <p className="text-xs text-ink-muted">{kind} · {source}</p>
      {detail && <p className="text-xs text-ink-soft">{detail}</p>}
      <div className="pt-1">{action}</div>
    </div>
  );

  const markers: DiscoveryMarker[] = useMemo(() => {
    if (!d) return [];
    if (tab === 'hotels') return (hotels.data ?? []).map((h) => ({ id: h.id, kind: 'hotel' as const, name: h.name, latitude: h.latitude, longitude: h.longitude,
      popup: popup(h.name, 'Hotel', 'OpenStreetMap', h.address, <AddToTripButton state={adder.stateOf(h.source, h.externalId)} add={adder.add} build={() => hotelToItem(h, checkIn, checkOut)} />) }));
    if (tab === 'places') return (places.data ?? []).map((a) => ({ id: a.id, kind: 'attraction' as const, name: a.name, latitude: a.latitude, longitude: a.longitude,
      popup: popup(a.name, a.category, 'OpenStreetMap', a.address, <AddToTripButton state={adder.stateOf(a.source, a.externalId)} add={adder.add} build={() => attractionToItem(a, trip, placeDay)} />) }));
    if (tab === 'events') return (events.data ?? []).filter((e) => e.latitude != null && e.longitude != null).map((e) => ({ id: e.id, kind: 'event' as const, name: e.name, latitude: e.latitude!, longitude: e.longitude!,
      popup: popup(e.name, 'Event', 'Ticketmaster', e.venue, <AddToTripButton state={adder.stateOf(e.source, e.externalId)} add={adder.add} build={() => eventToItem(e)} />) }));
    if (tab === 'flights') return (flights.data ?? []).filter((f) => f.currentLocation).map((f) => ({ id: f.id, kind: 'flight' as const, name: f.number ?? 'Flight', latitude: f.currentLocation!.latitude, longitude: f.currentLocation!.longitude, heading: f.heading }));
    return [];
    // popups close over the current add state and dates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d, tab, hotels.data, places.data, events.data, flights.data, adder.stateOf, checkIn, checkOut, placeDay, trip]);

  if (!d) {
    return (
      <div className="animate-fade-in">
        <PageHero crumbs={[{ label: 'Explore India' }]} title="Explore India" subtitle={<span className="text-[17px] sm:text-lg">Find hotels, places, events, flights and trains — then add them to {trip.name || 'your trip'} in one tap.</span>} />
        <div className="relative z-10 space-y-5">
          <section className="card p-5">
            <label htmlFor="dest-search" className="section-title">Search a destination</label>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input id="dest-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Goa, Kerala, Kashmir, Jaipur…" className={cn(field, 'pl-9')} autoComplete="off" />
            </div>
          </section>
          <Status state={destinations as Loadable<unknown[]>} empty="No destination found. Try a city or state name." />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Destinations">
            {(destinations.data ?? []).map((dest) => (
              <li key={dest.id}>
                <button type="button" onClick={() => pick(dest)} className="card card-hover flex w-full items-start gap-3 p-4 text-left">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand"><MapPin className="h-5 w-5" /></span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink">{dest.name}</span>
                    <span className="block truncate text-xs text-ink-muted">{dest.regionMatch && dest.regionMatch !== dest.state ? `${dest.regionMatch} · ` : ''}{dest.state}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHero
        crumbs={[{ label: 'Explore India', route: 'explore' }, { label: d.name }]}
        title={d.name}
        subtitle={<span className="text-[17px] sm:text-lg">{d.state}{d.airportCode ? ` · Airport ${d.airportCode}` : ''}{d.stationCode ? ` · Station ${d.stationCode}` : ''}</span>}
        actions={<button type="button" onClick={() => setSelected(null)} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> All destinations</button>}
      />
      <div className="relative z-10 space-y-5">
        <QuickAddBar active={tab} onSelect={setTab} />
        <p className="text-xs text-ink-muted">Adding to <b className="text-ink">{trip.name || 'your trip'}</b>. Items join your itinerary and SafarSathi monitoring; nothing is booked or paid for.</p>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="card min-w-0 p-5" aria-label="Results">
            {tab === 'hotels' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input aria-label="Search hotels" value={hotelQuery} onChange={(e) => setHotelQuery(e.target.value)} placeholder="Search hotels…" className={field} />
                  <label className="text-xs text-ink-muted">Check-in<input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={cn(field, 'mt-1')} /></label>
                  <label className="text-xs text-ink-muted">Check-out<input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={cn(field, 'mt-1')} /></label>
                </div>
                <Status state={hotels as Loadable<unknown[]>} empty={`OpenStreetMap lists no hotels near ${d.name} matching this search.`} />
                <ul className="divide-y divide-line">
                  {(hotels.data ?? []).map((h) => (
                    <li key={h.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{h.name}</p>
                        <p className="text-xs text-ink-muted">{h.address ?? h.city ?? 'Address not provided'} · {h.category.replace('_', ' ')}{h.stars ? ` · ${h.stars}★ (OSM tag)` : ''}</p>
                        <SourceBadge source="openstreetmap" className="mt-1" />
                      </div>
                      <AddToTripButton state={adder.stateOf(h.source, h.externalId)} add={adder.add} build={() => hotelToItem(h, checkIn, checkOut)} />
                    </li>
                  ))}
                </ul>
                {hotels.data && hotels.data.length > 0 && <p className="text-[11px] text-ink-muted">Prices and availability are not provided by OpenStreetMap.</p>}
              </div>
            )}

            {tab === 'places' && (
              <div className="space-y-4">
                <Chips label="Place categories" options={PLACE_CATEGORIES} value={placeCategory} onChange={setPlaceCategory} />
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                  <span>Add to</span>
                  <Chips label="Trip day" options={Array.from({ length: Math.min(days, 14) }, (_, i) => ({ id: String(i + 1), label: `Day ${i + 1}` }))} value={String(placeDay)} onChange={(v) => setPlaceDay(Number(v))} />
                </div>
                <Status state={places as Loadable<unknown[]>} empty={`OpenStreetMap lists no places in this category near ${d.name}.`} />
                <ul className="divide-y divide-line">
                  {(places.data ?? []).map((a) => (
                    <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{a.name}</p>
                        <p className="text-xs capitalize text-ink-muted">{a.category.replace('_', ' ')}{a.city ? ` · ${a.city}` : ''}</p>
                        <SourceBadge source="openstreetmap" className="mt-1" />
                      </div>
                      <AddToTripButton state={adder.stateOf(a.source, a.externalId)} add={adder.add} build={() => attractionToItem(a, trip, placeDay)} label={`Add to Day ${placeDay}`} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === 'events' && (
              <div className="space-y-4">
                <Chips label="Event dates" options={[{ id: 'week', label: 'This Week' }, { id: 'month', label: 'Next 30 days' }]} value={eventRange} onChange={setEventRange} />
                <Chips label="Event categories" options={EVENT_CATEGORIES} value={eventCategory} onChange={setEventCategory} />
                <Status state={events as Loadable<unknown[]>} empty={`Ticketmaster lists no events near ${d.name} for these dates. Its Indian coverage is partial.`} />
                <ul className="divide-y divide-line">
                  {(events.data ?? []).map((e) => (
                    <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{e.name}</p>
                        <p className="text-xs text-ink-muted">{e.venue ?? 'Venue not provided'} · {e.startTime ? new Date(e.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : e.startDate ?? 'Date not provided'}</p>
                        <SourceBadge source="ticketmaster" className="mt-1" />
                      </div>
                      <div className="flex gap-2">
                        {e.ticketUrl && <a href={e.ticketUrl} target="_blank" rel="noreferrer noopener" className="btn-ghost px-3 py-1.5 text-xs">Tickets</a>}
                        <AddToTripButton state={adder.stateOf(e.source, e.externalId)} add={adder.add} build={() => eventToItem(e)} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === 'flights' && (
              <div className="space-y-4">
                {d.airportCode ? (
                  <form className="flex flex-wrap gap-2" onSubmit={(ev) => { ev.preventDefault(); setFlightKey(`f:${d.id}:${flightFrom.trim().toUpperCase()}:${Date.now()}`); }}>
                    <input aria-label="From airport code" value={flightFrom} onChange={(e) => setFlightFrom(e.target.value)} maxLength={3} placeholder="From (e.g. BOM)" className={cn(field, 'w-40 uppercase')} />
                    <span className="self-center text-sm text-ink-muted">→ {d.airportCode}</span>
                    <button type="submit" className="btn-primary px-4 py-2 text-sm"><Search className="h-4 w-4" /> Live flights</button>
                  </form>
                ) : <p className="text-sm text-ink-muted">{d.name} has no airport of its own in the catalog.</p>}
                <Status state={flights as Loadable<unknown[]>} empty={`Aviationstack returned no flights into ${d.airportCode ?? d.name} for this search.`} />
                <div className="space-y-3">
                  {(flights.data ?? []).map((f) => (
                    <LiveTransportCard key={f.id} item={f} actions={<AddToTripButton state={adder.stateOf(f.source, f.externalId)} add={adder.add} build={() => flightToItem(f)} />} />
                  ))}
                </div>
              </div>
            )}

            {tab === 'trains' && (
              <div className="space-y-4">
                {d.stationCode ? (
                  <form className="flex flex-wrap gap-2" onSubmit={(ev) => { ev.preventDefault(); if (trainFrom.trim()) setTrainKey(`t:${d.id}:${trainFrom.trim().toUpperCase()}:${trainDate}`); }}>
                    <input aria-label="From station code" value={trainFrom} onChange={(e) => setTrainFrom(e.target.value)} maxLength={5} placeholder="From station (e.g. CSMT)" className={cn(field, 'w-48 uppercase')} />
                    <span className="self-center text-sm text-ink-muted">→ {d.stationCode}</span>
                    <input aria-label="Journey date" type="date" value={trainDate} onChange={(e) => setTrainDate(e.target.value)} className={cn(field, 'w-44')} />
                    <button type="submit" className="btn-primary px-4 py-2 text-sm"><TrainFront className="h-4 w-4" /> Find trains</button>
                  </form>
                ) : <p className="text-sm text-ink-muted">{d.name} has no railway station of its own in the catalog.</p>}
                <Status state={{ ...trains, data: trains.data?.trains ?? null } as Loadable<unknown[]>} empty="RailRadar returned no trains between these stations." />
                <ul className="divide-y divide-line">
                  {(trains.data?.trains ?? []).map((t) => (
                    <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{t.number} · {t.name}</p>
                        <p className="text-xs text-ink-muted">{t.departureTime ?? '—'} → {t.arrivalTime ?? '—'}{t.arrivalDayOffset ? ` (+${t.arrivalDayOffset}d)` : ''}{t.liveDelayMinutes ? ` · live delay +${t.liveDelayMinutes} min` : ''}</p>
                        <SourceBadge source="railradar" live={t.liveDelayMinutes !== null} className="mt-1" />
                      </div>
                      <AddToTripButton state={adder.stateOf('railradar', `${t.number}@${trainDate}`)} add={adder.add} build={() => betweenTrainToItem(t, trainDate)} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="card overflow-hidden" aria-label="Map">
            <DiscoveryMap markers={markers} center={[d.latitude, d.longitude]} className="h-[360px] sm:h-[520px]">
              <div className="pointer-events-none absolute left-3 top-3 z-[500] rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-card">
                {markers.length} on map{tab === 'flights' ? ' · live aircraft positions only' : ''}
              </div>
            </DiscoveryMap>
          </section>
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={() => navigate('trip')} className="btn-outline">View my itinerary</button>
        </div>
      </div>
    </div>
  );
}
