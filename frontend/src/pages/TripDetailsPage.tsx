import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { useToast } from '@/components/ui/ToastProvider';
import { useRouter } from '@/lib/router';
import { useJourney, useStopWeather } from '@/hooks/useTravelData';
import { PageHero } from '@/components/layout/PageHero';
import { useShellActions } from '@/components/layout/ShellActions';
import { JourneyRoute } from '@/components/travel/JourneyRoute';
import { RouteMap } from '@/components/travel/RouteMap';
import { DestinationImage } from '@/components/travel/DestinationImage';
import { ItineraryGraph } from '@/components/graph/ItineraryGraph';
import { ImpactAnalysisPanel } from '@/components/disruption/ImpactAnalysisPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { formatDateRange, formatINR, nodeKind, routeCities, tripType } from '@/lib/journey';
import { cn } from '@/lib/utils';
import type { ItineraryNodeData } from '@/types';
import { AlertTriangle, ArrowLeft, BedDouble, CalendarDays, Car, GitBranch, Map as MapIcon, Plane, Plus, ShieldAlert, Sparkles, Ticket, Timer, TrainFront, Trash2 } from 'lucide-react';

type View = 'timeline' | 'impact' | 'graph' | 'map';
const kindIcon = { flight: Plane, train: TrainFront, transfer: Car, hotel: BedDouble, activity: Ticket, connection: Timer };

export function TripDetailsPage() {
  const { trip, phase, deleteNode, activeDisruption } = useApp();
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { openAddBooking } = useShellActions();
  const journey = useJourney();
  const weather = useStopWeather(journey.stops);
  const [view, setView] = useState<View>(activeDisruption ? 'impact' : 'timeline');
  const [selected, setSelected] = useState<ItineraryNodeData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const cities = routeCities(trip);

  const views: { id: View; label: string; icon: typeof Plane; show: boolean }[] = [
    { id: 'timeline', label: 'Timeline', icon: CalendarDays, show: true },
    { id: 'impact', label: 'Impact', icon: ShieldAlert, show: !!activeDisruption },
    { id: 'graph', label: 'Dependencies', icon: GitBranch, show: true },
    { id: 'map', label: 'Map', icon: MapIcon, show: true },
  ];

  const remove = async (node: ItineraryNodeData) => {
    setDeleting(true);
    try {
      await deleteNode(node.id);
      addToast('success', 'Booking removed', `${node.title} was removed and the itinerary re-validated.`);
      setSelected(null);
    } catch {
      addToast('error', 'Could not remove booking', 'Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const days = trip.days.length ? trip.days : [{ day: 1, date: '', title: trip.route, summary: '', nodeIds: trip.nodes.map((n) => n.id) }];

  return (
    <div className="animate-fade-in">
      <PageHero crumbs={[{ label: 'My Bookings', route: 'bookings' }, { label: 'Itinerary' }]} showTripBadge
        title={trip.name || 'Your Itinerary'}
        subtitle={<span className="flex flex-wrap items-center gap-2 text-[17px]">{formatDateRange(trip.startDate, trip.endDate)} <span className="pill bg-brand-light text-brand">{tripType(trip)}</span></span>}
        actions={
          <>
            <button onClick={() => navigate('dashboard')} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Dashboard</button>
            <button onClick={openAddBooking} className="btn-primary"><Plus className="h-4 w-4" /> Add Booking</button>
          </>
        }
      />
      <div className="relative z-10 space-y-5">
        <section className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="section-title">{cities.join(' → ')}</h2>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <span>{trip.nodes.filter((n) => n.category !== 'connection').length} bookings · {formatINR(trip.tripValue)}</span>
              {(phase === 'disrupted' || phase === 'recovering') && <button onClick={() => navigate('recovery')} className="btn-primary px-3 py-2 text-xs"><Sparkles className="h-4 w-4" /> Recovery Options</button>}
            </div>
          </div>
          <JourneyRoute journey={journey} />
        </section>

        <div className="flex gap-1 overflow-x-auto rounded-2xl border border-line bg-white p-1.5 shadow-card scrollbar-none sm:inline-flex" role="tablist" aria-label="Itinerary view">
          {views.filter((v) => v.show).map(({ id, label, icon: Icon }) => (
            <button key={id} role="tab" aria-selected={view === id} onClick={() => setView(id)} className={cn('flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition', view === id ? 'bg-brand text-white shadow-glow' : 'text-ink-soft hover:bg-canvas')}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {view === 'timeline' && (
          <div className="space-y-5">
            {days.map((day) => {
              const nodes = day.nodeIds.map((id) => trip.nodes.find((n) => n.id === id)).filter((n): n is ItineraryNodeData => !!n);
              return (
                <section key={day.day} className="card p-5" aria-label={`Day ${day.day}`}>
                  <div className="mb-3 flex items-baseline gap-3">
                    <span className="pill bg-brand-light text-brand">Day {day.day}</span>
                    <span className="font-bold text-ink">{day.date}</span>
                    <span className="truncate text-sm text-ink-muted">{day.summary}</span>
                  </div>
                  {nodes.length === 0 && <p className="text-sm text-ink-muted">Free day — nothing booked.</p>}
                  <ul className="space-y-2">
                    {nodes.map((n) => {
                      const Icon = kindIcon[nodeKind(n)];
                      return (
                        <li key={n.id}>
                          <button onClick={() => setSelected(n)} className="flex w-full items-center gap-4 rounded-2xl border border-line p-3 text-left transition hover:border-brand/30 hover:bg-canvas/60">
                            <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', n.status === 'healthy' || n.status === 'recovered' ? 'bg-brand-light text-brand' : n.status === 'at-risk' ? 'bg-risk-light text-risk' : 'bg-danger-light text-danger')}><Icon className="h-5 w-5" /></span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2"><span className="font-semibold text-ink">{n.title}</span><StatusBadge status={n.status} /></div>
                              <div className="truncate text-sm text-ink-muted">{n.subtitle} · {n.scheduledTime}</div>
                              {n.reason && n.status !== 'healthy' && <div className="mt-1 flex items-start gap-1.5 text-xs text-risk-dark"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{n.reason}</div>}
                            </div>
                            <span className="hidden text-sm font-semibold text-ink sm:block">{n.cost ? formatINR(n.cost) : ''}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        )}

        {view === 'impact' && <ImpactAnalysisPanel fullPage onNavigate={(p) => navigate(p === 'recovery' ? 'recovery' : 'dashboard')} />}

        {view === 'graph' && (
          <section className="card p-3">
            <div className="px-2 pb-3 pt-1">
              <h2 className="section-title">Dependency view</h2>
              <p className="text-sm text-ink-muted">How each booking depends on the one before it — this is what Safar Sathi uses to propagate a disruption.</p>
            </div>
            <div className="h-[560px]"><ItineraryGraph nodes={trip.nodes} edges={trip.edges} /></div>
          </section>
        )}

        {view === 'map' && <RouteMap stops={journey.stops} legs={journey.legs} weather={weather} className="h-[520px] rounded-card shadow-card" onSelectStop={(s) => setSelected(trip.nodes.find((n) => n.location.includes(s.city)) ?? null)} />}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title} subtitle={selected?.subtitle}>
        {selected && (
          <div className="space-y-4">
            <DestinationImage destination={selected.location} className="h-36 rounded-2xl" />
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="Status" value={<StatusBadge status={selected.status} />} />
              <Detail label="Provider" value={selected.provider} />
              <Detail label="Scheduled" value={selected.scheduledTime} />
              <Detail label="Reference" value={selected.confirmation || '—'} />
              <Detail label="Cost" value={formatINR(selected.cost)} />
              <Detail label="Depends on it" value={`${selected.dependencyCount} booking${selected.dependencyCount === 1 ? '' : 's'}`} />
            </dl>
            <p className="rounded-xl bg-canvas p-3 text-xs text-ink-soft">{selected.cancellationPolicy}</p>
            {selected.reason && <p className="rounded-xl border border-risk/30 bg-risk-light/60 p-3 text-sm text-ink-soft">{selected.reason}</p>}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setSelected(null); navigate('assistant', { prompt: `Tell me about my ${selected.title} booking` }); }} className="btn-outline"><Sparkles className="h-4 w-4" /> Ask AI</button>
              {selected.category !== 'connection' && (
                <button onClick={() => remove(selected)} disabled={deleting} className="btn border border-danger/30 bg-white text-danger hover:bg-danger-light"><Trash2 className="h-4 w-4" /> {deleting ? 'Removing…' : 'Remove booking'}</button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}
