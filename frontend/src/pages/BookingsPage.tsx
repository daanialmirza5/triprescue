import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '@/store/AppContext';
import { useToast } from '@/components/ui/ToastProvider';
import { useRouter } from '@/lib/router';
import { useAllTrips } from '@/hooks/useTravelData';
import * as api from '@/services/api';
import { PageHero } from '@/components/layout/PageHero';
import { ItineraryStrip } from '@/components/brand/ItineraryArt';
import { useShellActions } from '@/components/layout/ShellActions';
import { DestinationImage } from '@/components/travel/DestinationImage';
import { TravelCalendar } from '@/components/travel/TravelCalendar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { sceneImages } from '@/lib/destinationImages';
import { daysUntil, formatDateRange, formatDay, formatINR, formatTime, nodeKind, parseDate, routeCities, tripLifecycle, tripType, tripsOnDay, type NodeKind } from '@/lib/journey';
import { cn } from '@/lib/utils';
import type { ItineraryNodeData, Trip } from '@/types';
import { ArrowRight, ArrowUpDown, BedDouble, CalendarDays, Car, CheckCircle2, ChevronDown, ChevronRight, Download, MapPinned, MoreVertical, Plane, Plus, Settings2, Sparkles, TrainFront, TriangleAlert, X } from 'lucide-react';

type Tab = 'all' | 'flight' | 'train' | 'hotel' | 'transfer';
type Sort = 'upcoming' | 'latest' | 'health';

const tabs: { id: Tab; label: string; icon: typeof Plane }[] = [
  { id: 'all', label: 'All Trips', icon: CalendarDays },
  { id: 'flight', label: 'Flights', icon: Plane },
  { id: 'train', label: 'Trains', icon: TrainFront },
  { id: 'hotel', label: 'Hotels', icon: BedDouble },
  { id: 'transfer', label: 'Transfers', icon: Car },
];
const sortLabels: Record<Sort, string> = { upcoming: 'Upcoming First', latest: 'Latest First', health: 'Needs Attention' };
const kindIcon: Record<NodeKind, typeof Plane> = { flight: Plane, train: TrainFront, transfer: Car, hotel: BedDouble, activity: Sparkles, connection: ArrowRight };
const kindLabel: Record<NodeKind, string> = { flight: 'Flight', train: 'Train', transfer: 'Transfer', hotel: 'Hotel', activity: 'Activity', connection: 'Connection' };

const bookable = (t: Trip) => t.nodes.filter((n) => n.category !== 'connection');
const startTime = (t: Trip) => parseDate(t.startDate)?.getTime() ?? 0;

export function BookingsPage() {
  const { trip: current, switchTrip } = useApp();
  const { navigate, params, consumeParams } = useRouter();
  const { addToast } = useToast();
  const { openAddBooking, openCreateTrip } = useShellActions();
  const { trips, loading, error, refresh } = useAllTrips();
  const [tab, setTab] = useState<Tab>(() => (params.tab as Tab) ?? 'all');
  const [sort, setSort] = useState<Sort>('upcoming');
  const [day, setDay] = useState<Date | null>(null);

  useEffect(() => { if (params.tab) consumeParams(); }, [params.tab, consumeParams]);

  const counts = useMemo(() => {
    const all = trips.flatMap(bookable);
    const by = (k: NodeKind) => all.filter((n) => nodeKind(n) === k).length;
    return { all: trips.length, flight: by('flight'), train: by('train'), hotel: by('hotel'), transfer: by('transfer') };
  }, [trips]);

  const visibleTrips = useMemo(() => {
    const now = Date.now();
    const list = day ? tripsOnDay(trips, day) : [...trips];
    const completed = (t: Trip) => tripLifecycle(t) === 'completed';
    if (sort === 'upcoming') list.sort((a, b) => Number(completed(a)) - Number(completed(b)) || Math.abs(startTime(a) - now) - Math.abs(startTime(b) - now));
    if (sort === 'latest') list.sort((a, b) => startTime(b) - startTime(a));
    if (sort === 'health') list.sort((a, b) => a.healthScore - b.healthScore);
    return list;
  }, [trips, sort, day]);

  const nextTrip = useMemo(() => [...trips].filter((t) => tripLifecycle(t) !== 'completed').sort((a, b) => startTime(a) - startTime(b))[0] ?? trips[0], [trips]);

  const openTrip = (t: Trip) => { switchTrip(t.id); navigate('trip'); };

  const exportItinerary = async () => {
    try {
      const data = await api.exportTrip(current.id);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${current.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'trip'}-itinerary.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('success', 'Itinerary exported', `${current.name} downloaded as JSON.`);
    } catch {
      addToast('error', 'Export failed', 'Could not export this itinerary. Please try again.');
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHero crumbs={[{ label: 'My Bookings' }]} title="My Bookings" subtitle="All your travel plans in one place." art={<ItineraryStrip />} />

      <div className="relative z-10 space-y-5">
        <div className="card flex flex-col gap-3 p-2.5 lg:flex-row lg:items-center">
          <div className="flex flex-1 gap-1 overflow-x-auto scrollbar-none" role="tablist" aria-label="Booking type">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn('flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-medium transition', tab === id ? 'bg-brand-light text-brand' : 'text-ink-soft hover:bg-canvas')}>
                <Icon className="h-5 w-5" /> {label} ({counts[id]})
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openAddBooking} className="btn-primary"><Plus className="h-4 w-4" /> Add Booking</button>
            <SortMenu value={sort} onChange={setSort} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="min-w-0 space-y-4">
            {day && (
              <div className="flex items-center gap-2 text-sm text-ink-soft">
                <CalendarDays className="h-4 w-4 text-brand" /> Showing trips on <b className="text-ink">{formatDay(day)}</b>
                <button onClick={() => setDay(null)} className="pill bg-canvas text-ink-muted hover:text-ink"><X className="h-3 w-3" /> Clear</button>
              </div>
            )}
            {error && <div className="flex items-center justify-between rounded-2xl border border-danger/20 bg-danger-light/60 p-4 text-sm text-danger"><span>{error}</span><button onClick={refresh} className="btn-ghost px-3 py-1.5 text-xs">Retry</button></div>}
            {loading && [0, 1, 2].map((i) => <div key={i} className="card flex gap-4 p-3"><div className="skeleton h-[180px] w-[210px]" /><div className="flex-1 space-y-3 py-3"><div className="skeleton h-5 w-32" /><div className="skeleton h-7 w-64" /><div className="skeleton h-14 w-full" /></div></div>)}

            {!loading && tab === 'all' && visibleTrips.map((t) => <TripCard key={t.id} trip={t} current={t.id === current.id} onOpen={() => openTrip(t)} onMakeCurrent={() => { switchTrip(t.id); addToast('info', 'Current trip changed', `${t.route} is now shown on your dashboard.`); }} onAsk={() => { switchTrip(t.id); navigate('assistant', { prompt: 'Check my trip status' }); }} />)}
            {!loading && tab === 'all' && visibleTrips.length === 0 && <EmptyState text={day ? 'No trips on this day.' : 'No trips yet. Add your first booking to start monitoring.'} onAdd={openCreateTrip} />}

            {!loading && tab !== 'all' && <BookingList trips={day ? tripsOnDay(trips, day) : trips} kind={tab} onOpen={openTrip} onAdd={openAddBooking} />}

            <section className="relative overflow-hidden rounded-card shadow-card">
              <img src={sceneImages.bannerMountains} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B3A8C]/90 via-[#1F6BFF]/60 to-transparent" />
              <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-white">
                  <h2 className="font-display text-xl font-bold">More Trips Ahead?</h2>
                  <p className="mt-1 max-w-md text-sm text-white/90">Add your upcoming bookings to get real-time updates, recovery options and a hassle-free journey.</p>
                </div>
                <button onClick={openAddBooking} className="btn bg-white text-brand shadow-card hover:bg-brand-light">Add Booking <ArrowRight className="h-4 w-4" /></button>
              </div>
            </section>
          </div>

          <aside className="grid grid-cols-1 content-start gap-5 lg:grid-cols-2 2xl:grid-cols-1">
            {nextTrip && (
              <section className="card p-5" aria-labelledby="upcoming-title">
                <h2 id="upcoming-title" className="section-title">{tripLifecycle(nextTrip) === 'completed' ? 'Recent Trip Summary' : 'Upcoming Trip Summary'}</h2>
                <button onClick={() => openTrip(nextTrip)} className="mt-4 flex w-full items-center gap-3 text-left">
                  <DestinationImage destination={routeCities(nextTrip)[1] ?? routeCities(nextTrip)[0]} className="h-[76px] w-[86px] shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-bold text-ink">{routeCities(nextTrip).join(' → ')}</div>
                    <div className="text-xs text-ink-muted">{formatDateRange(nextTrip.startDate, nextTrip.endDate)}</div>
                    <div className="mt-1.5"><TripHealthPill trip={nextTrip} /></div>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-brand"><ArrowRight className="h-4 w-4" /></span>
                </button>
              </section>
            )}
            <section className="card p-5" aria-labelledby="bk-qa-title">
              <h2 id="bk-qa-title" className="section-title">Quick Actions</h2>
              <div className="mt-3 space-y-2">
                <ActionRow icon={Plus} tone="bg-brand-light text-brand" label="Add New Booking" onClick={openAddBooking} />
                <ActionRow icon={MapPinned} tone="bg-ai-light text-ai" label="Create New Trip" onClick={openCreateTrip} />
                <ActionRow icon={Download} tone="bg-safe-light text-safe" label="Export Itinerary" onClick={exportItinerary} />
                <ActionRow icon={Settings2} tone="bg-ai-light text-ai" label="Manage Preferences" onClick={() => navigate('settings')} />
              </div>
            </section>
            <TravelCalendar trips={trips} selectedDay={day} onSelectDay={(d) => { setDay(d); if (d) setTab('all'); }} initialMonth={parseDate(nextTrip?.startDate)} key={nextTrip?.id ?? 'none'} />
          </aside>
        </div>
      </div>
    </div>
  );
}

function SortMenu({ value, onChange }: { value: Sort; onChange: (s: Sort) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="btn-ghost" aria-haspopup="listbox" aria-expanded={open}>
        <ArrowUpDown className="h-4 w-4" /> <span className="hidden sm:inline">{sortLabels[value]}</span> <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div role="listbox" className="absolute right-0 top-full z-30 mt-2 w-48 rounded-2xl border border-line bg-white p-1.5 shadow-lift animate-scale-in">
          {(Object.keys(sortLabels) as Sort[]).map((s) => (
            <button key={s} role="option" aria-selected={value === s} onClick={() => { onChange(s); setOpen(false); }} className={cn('flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm', value === s ? 'bg-brand-light text-brand' : 'text-ink-soft hover:bg-canvas')}>
              {sortLabels[s]} {value === s && <CheckCircle2 className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const lifecycleMeta = {
  disrupted: { label: 'Disruption Detected', cls: 'bg-danger-light text-danger-dark', dot: 'bg-danger' },
  recovered: { label: 'Recovered', cls: 'bg-brand-light text-brand', dot: 'bg-brand' },
  upcoming: { label: 'Upcoming Trip', cls: 'bg-safe-light text-safe', dot: 'bg-safe' },
  'in-progress': { label: 'In Progress', cls: 'bg-safe-light text-safe', dot: 'bg-safe' },
  confirmed: { label: 'Confirmed', cls: 'bg-safe-light text-safe', dot: 'bg-safe' },
  completed: { label: 'Completed', cls: 'bg-canvas text-ink-muted', dot: 'bg-ink-faint' },
};

function TripHealthPill({ trip }: { trip: Trip }) {
  const affected = trip.nodes.filter((n) => n.status !== 'healthy' && n.status !== 'recovered' && n.category !== 'connection').length;
  if (affected > 0) return <StatusBadge status="broken" label={`${affected} Disruption${affected === 1 ? '' : 's'}`} />;
  if (trip.status === 'recovered') return <StatusBadge status="recovered" label="Recovered" />;
  return <StatusBadge status="healthy" />;
}

function TripCard({ trip, current, onOpen, onMakeCurrent, onAsk }: { trip: Trip; current: boolean; onOpen: () => void; onMakeCurrent: () => void; onAsk: () => void }) {
  const [menu, setMenu] = useState(false);
  const cities = routeCities(trip);
  const lc = tripLifecycle(trip);
  const meta = lifecycleMeta[lc];
  const nodes = bookable(trip).filter((n) => n.category !== 'activity' && n.category !== 'return').slice(0, 3);
  const left = daysUntil(trip.startDate);
  const affected = bookable(trip).filter((n) => n.status !== 'healthy' && n.status !== 'recovered').length;

  return (
    <article className={cn('card flex flex-col gap-4 p-3 sm:flex-row', current && 'border-brand/40')}>
      <DestinationImage destination={cities[1] ?? cities[0]} className="h-44 shrink-0 rounded-2xl sm:h-auto sm:min-h-[180px] sm:w-[210px]" />
      <div className="flex min-w-0 flex-1 flex-col gap-3 py-1 pr-1 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className={cn('pill', meta.cls)}><span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />{meta.label}</span>
            <div className="relative flex items-center gap-2 text-xs text-ink-muted">
              <span>{bookable(trip).length} segments • {lc === 'completed' ? 'Completed' : left != null && left > 0 ? `${left} days left` : 'In progress'}</span>
              <button onClick={() => setMenu((v) => !v)} className="rounded-full border border-line p-1.5 text-ink hover:bg-canvas" aria-label="Trip actions" aria-expanded={menu}><MoreVertical className="h-4 w-4" /></button>
              {menu && (
                <div className="absolute right-0 top-full z-20 mt-1 w-52 rounded-2xl border border-line bg-white p-1.5 text-sm shadow-lift animate-scale-in" onMouseLeave={() => setMenu(false)}>
                  <button onClick={() => { setMenu(false); onOpen(); }} className="w-full rounded-xl px-3 py-2 text-left text-ink-soft hover:bg-canvas">View itinerary</button>
                  <button onClick={() => { setMenu(false); onMakeCurrent(); }} disabled={current} className="w-full rounded-xl px-3 py-2 text-left text-ink-soft hover:bg-canvas disabled:opacity-40">{current ? 'Current trip' : 'Show on dashboard'}</button>
                  <button onClick={() => { setMenu(false); onAsk(); }} className="w-full rounded-xl px-3 py-2 text-left text-ink-soft hover:bg-canvas">Ask AI about this trip</button>
                </div>
              )}
            </div>
          </div>
          <h3 className="mt-2 flex flex-wrap items-center gap-x-2.5 font-display text-xl font-bold text-ink">
            {cities.map((c, i) => <span key={`${c}-${i}`} className="flex items-center gap-2.5">{i > 0 && <ArrowRight className="h-5 w-5" />}{c}</span>)}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            {formatDateRange(trip.startDate, trip.endDate)} <span className="h-4 w-px bg-line-strong" /> <span className="pill bg-brand-light text-brand">{tripType(trip)}</span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {nodes.map((n) => <Segment key={n.id} node={n} />)}
            {nodes.length === 0 && <p className="text-sm text-ink-muted sm:col-span-3">No bookings yet.</p>}
          </div>
        </div>
        <div className="flex shrink-0 flex-row gap-2 lg:w-[170px] lg:flex-col lg:justify-center">
          {lc !== 'completed' && (
            affected > 0
              ? <div className="flex flex-1 items-center gap-2 rounded-xl bg-danger-light px-3 py-2.5 text-sm font-semibold text-danger-dark lg:flex-none"><TriangleAlert className="h-4 w-4" />{affected} Disruption{affected === 1 ? '' : 's'}</div>
              : <div className="flex flex-1 items-center gap-2 rounded-xl bg-safe-light px-3 py-2.5 text-sm font-semibold text-safe lg:flex-none"><CheckCircle2 className="h-4 w-4" />{trip.status === 'recovered' ? 'Recovered' : 'On Track'}</div>
          )}
          <button onClick={onOpen} className="btn-outline flex-1 lg:flex-none">{lc === 'completed' ? 'Trip Summary' : 'View Details'} <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    </article>
  );
}

function Segment({ node }: { node: ItineraryNodeData }) {
  const k = nodeKind(node);
  const Icon = kindIcon[k];
  const start = parseDate(node.scheduledStart);
  const end = parseDate(node.scheduledEnd);
  const tone = node.status === 'healthy' ? 'bg-brand-light text-brand' : node.status === 'recovered' ? 'bg-brand-light text-brand' : node.status === 'at-risk' ? 'bg-risk-light text-risk' : 'bg-danger-light text-danger';
  return (
    <div className="flex items-start gap-2.5">
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', tone)}><Icon className="h-4 w-4" /></span>
      <div className="min-w-0 text-xs">
        <div className="text-sm font-semibold text-ink">{kindLabel[k]}</div>
        <div className="truncate text-ink-soft">{k === 'hotel' ? node.title : node.label}</div>
        <div className="truncate text-ink-muted">{k === 'hotel' ? `${formatDay(start)} – ${formatDay(end)}` : `${formatDay(start)}, ${formatTime(start)}`}</div>
      </div>
    </div>
  );
}

function BookingList({ trips, kind, onOpen, onAdd }: { trips: Trip[]; kind: Exclude<Tab, 'all'>; onOpen: (t: Trip) => void; onAdd: () => void }) {
  const rows = trips.flatMap((t) => bookable(t).filter((n) => nodeKind(n) === kind).map((n) => ({ t, n })));
  const Icon = kindIcon[kind];
  if (rows.length === 0) return <EmptyState text={`No ${kindLabel[kind].toLowerCase()} bookings yet.`} onAdd={onAdd} />;
  return (
    <div className="space-y-3">
      {rows.map(({ t, n }) => (
        <button key={`${t.id}-${n.id}`} onClick={() => onOpen(t)} className="card card-hover flex w-full flex-col gap-3 p-4 text-left sm:flex-row sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand"><Icon className="h-6 w-6" /></span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><span className="text-[15px] font-bold text-ink">{n.title}</span><StatusBadge status={n.status} /></div>
            <div className="mt-0.5 truncate text-sm text-ink-muted">{n.subtitle} · {n.provider}{n.confirmation ? ` · Ref ${n.confirmation}` : ''}</div>
          </div>
          <div className="text-sm sm:text-right">
            <div className="font-semibold text-ink">{n.scheduledTime}</div>
            <div className="text-xs text-ink-muted">{t.route} · {formatINR(n.cost)}</div>
          </div>
          <ChevronRight className="hidden h-5 w-5 text-ink-faint sm:block" />
        </button>
      ))}
    </div>
  );
}

function ActionRow({ icon: Icon, tone, label, onClick }: { icon: typeof Plus; tone: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-line px-3 py-2.5 text-left transition hover:border-brand/30 hover:bg-canvas">
      <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl', tone)}><Icon className="h-5 w-5" /></span>
      <span className="flex-1 text-[15px] font-medium text-ink">{label}</span>
      <ChevronRight className="h-4 w-4 text-ink-faint" />
    </button>
  );
}

function EmptyState({ text, onAdd }: { text: string; onAdd: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand"><CalendarDays className="h-7 w-7" /></span>
      <p className="text-sm text-ink-muted">{text}</p>
      <button onClick={onAdd} className="btn-primary"><Plus className="h-4 w-4" /> Add Booking</button>
    </div>
  );
}
