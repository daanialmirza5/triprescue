import { shortText } from '@/lib/concise';
import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/store/AppContext';
import { useRouter } from '@/lib/router';
import { useAllTrips, useClock, useJourney, useRiskAnalysis, useStopWeather } from '@/hooks/useTravelData';
import { PageHero, LivePill } from '@/components/layout/PageHero';
import { RouteMap, type MapLayers } from '@/components/travel/RouteMap';
import { DestinationImage } from '@/components/travel/DestinationImage';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { riskTone, toneClasses } from '@/lib/status';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Modal } from '@/components/ui/Modal';
import { sceneImages } from '@/lib/destinationImages';
import { formatDateRange, formatTime, nodeKind, parseDate, routeCities, tripLifecycle } from '@/lib/journey';
import { cn } from '@/lib/utils';
import type { Alert, ItineraryNodeData, RiskScore, Trip } from '@/types';
import { AlertTriangle, ArrowRight, BedDouble, Car, Clock3, CloudSun, Plane, RadioTower, TrainFront, Wind } from 'lucide-react';

interface LiveAlert extends Alert { kind: 'flight' | 'train' | 'weather' | 'airport' | 'hotel' | 'info' }

const kindStyle = {
  flight: { icon: Plane, tile: 'bg-danger-light text-danger' },
  train: { icon: TrainFront, tile: 'bg-risk-light text-risk' },
  weather: { icon: CloudSun, tile: 'bg-brand-light text-brand' },
  airport: { icon: AlertTriangle, tile: 'bg-risk-light text-risk' },
  hotel: { icon: BedDouble, tile: 'bg-safe-light text-safe' },
  info: { icon: RadioTower, tile: 'bg-safe-light text-safe' },
};

const layerTabs: { id: keyof MapLayers; label: string; icon: typeof Plane }[] = [
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'trains', label: 'Trains', icon: TrainFront },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'airports', label: 'Airports', icon: RadioTower },
];

const riskBars: { key: Exclude<keyof RiskScore, 'tripResilience'>; label: string }[] = [
  { key: 'connectionRisk', label: 'Connection risk' },
  { key: 'scheduleRisk', label: 'Schedule risk' },
  { key: 'weatherRisk', label: 'Weather risk' },
  { key: 'vendorRisk', label: 'Vendor risk' },
];

export function LiveUpdatesPage() {
  const { trip, notifications, switchTrip, cascadeLinks } = useApp();
  const { navigate } = useRouter();
  const journey = useJourney();
  const { trips } = useAllTrips();
  const { data: risk, loading: riskLoading, error: riskError } = useRiskAnalysis();
  const weather = useStopWeather(journey.stops);
  const now = useClock();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [layers, setLayers] = useState<MapLayers>({ flights: true, trains: true, weather: true, airports: true });
  const [openAlert, setOpenAlert] = useState<LiveAlert | null>(null);

  const alerts = useMemo<LiveAlert[]>(() => {
    const byNode = new Map(trip.nodes.map((n) => [n.id, n]));
    const fromRisk: LiveAlert[] = (risk?.alerts ?? []).map((a) => {
      const node = a.nodeId ? byNode.get(a.nodeId) : undefined;
      const k = node ? nodeKind(node) : /weather|rain|snow|storm|heat/i.test(a.title) ? 'weather' : /congestion|airport/i.test(a.title) ? 'airport' : 'info';
      const kind: LiveAlert['kind'] = k === 'flight' || k === 'train' || k === 'hotel' || k === 'weather' || k === 'airport' ? k : k === 'transfer' || k === 'connection' ? 'train' : 'info';
      return { ...a, kind };
    });
    const fromWeather: LiveAlert[] = weather
      .filter((w) => w.weather.weatherCode >= 51 || w.weather.precipitationProbability >= 50 || w.weather.windSpeed >= 40)
      .map((w) => ({
        id: `wx-${w.city}`, kind: 'weather', severity: w.weather.weatherCode >= 95 ? 'high' : 'medium',
        title: `${w.weather.label} in ${w.city}`, reason: `${w.weather.temperature}°C, ${w.weather.precipitationProbability}% chance of precipitation, wind ${w.weather.windSpeed} km/h.`,
        impact: 'Weather can slow ground transfers and airport operations.', action: 'Allow extra buffer', timestamp: 'Live · Open-Meteo',
      }));
    const fromNotifications: LiveAlert[] = notifications.slice(0, 4).map((n) => ({
      id: `nt-${n.id}`, kind: n.category === 'recovery' ? 'info' : n.severity === 'high' ? 'flight' : 'info', severity: n.severity === 'system' ? 'info' : n.severity,
      title: n.title, reason: n.message, impact: '', action: n.category === 'risk' ? 'Review recovery options' : '', timestamp: n.timestamp,
    }));
    const seen = new Set<string>();
    return [...fromRisk, ...fromWeather, ...fromNotifications].filter((a) => (seen.has(a.title) ? false : (seen.add(a.title), true)));
  }, [risk, weather, notifications, trip.nodes]);

  const liveLegs = trip.nodes.filter((n) => n.category !== 'connection' && n.category !== 'activity' && n.category !== 'return');
  // The hook keeps the previous data when a refetch fails, so check the error too.
  const riskReady = !riskLoading && !riskError && risk !== null && risk.cards.length > 0;

  // Cosmetic staged indicator for the Trip Risk loader: stages advance on fixed
  // timers while the single risk request is in flight, not on backend progress.
  const [riskStep, setRiskStep] = useState(0);
  useEffect(() => {
    if (!riskLoading) {
      setRiskStep(4);
      return;
    }
    setRiskStep(0);
    const timers = [1, 2, 3].map((n, i) => window.setTimeout(() => setRiskStep(n), (i + 1) * 500));
    return () => timers.forEach(clearTimeout);
  }, [riskLoading]);

  return (
    <div className="animate-fade-in">
      <PageHero
        crumbs={[{ label: 'Live Updates' }]}
        title="Live Travel Updates"
        titleAddon={<LivePill />}
        subtitle={<span className="text-[17px] sm:text-lg">Track your trips, check for disruptions, and stay ahead with live updates.</span>}
        actions={
          <>
            <div className="flex rounded-2xl border border-line bg-white p-1.5 shadow-card" role="tablist" aria-label="View">
              {(['map', 'list'] as const).map((v) => (
                <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={cn('rounded-xl px-5 py-2.5 text-sm font-semibold transition', view === v ? 'bg-brand text-white shadow-glow' : 'text-ink-soft hover:bg-canvas')}>
                  {v === 'map' ? 'Map View' : 'List View'}
                </button>
              ))}
            </div>
            <div className="card flex items-center gap-3 px-4 py-2.5">
              <Clock3 className="h-6 w-6 text-ink-soft" />
              <div className="text-sm leading-tight">
                <div className="text-ink-soft">{now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
                <div className="font-semibold text-ink">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} <span className="font-normal text-ink-muted">({new Intl.DateTimeFormat('en-IN', { timeZoneName: 'short' }).formatToParts(now).find((p) => p.type === 'timeZoneName')?.value})</span></div>
              </div>
            </div>
          </>
        }
      />

      <div className="relative z-10 space-y-6">
        <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
          {view === 'map' ? (
            <RouteMap stops={journey.stops} legs={journey.legs} layers={layers} weather={weather} maxZoom={5}
              nodePositions={trip.nodes.map((n) => ({ id: n.id, lat: n.lat ?? null, lng: n.lng ?? null }))}
              cascade={cascadeLinks ?? undefined}
              className="h-[420px] rounded-card shadow-card sm:h-[480px]">
              <div className="absolute left-4 top-4 z-[500] flex max-w-[calc(100%-2rem)] gap-1 overflow-x-auto rounded-2xl border border-white/60 bg-white/90 p-1.5 shadow-card backdrop-blur scrollbar-none" role="group" aria-label="Map layers">
                {layerTabs.map(({ id, label, icon: Icon }) => (
                  <button key={id} aria-pressed={layers[id]} onClick={() => setLayers((l) => ({ ...l, [id]: !l[id] }))}
                    className={cn('flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition', layers[id] ? 'bg-brand-light text-brand' : 'text-ink-muted hover:bg-canvas')}>
                    <Icon className="h-4 w-4" />{label}
                  </button>
                ))}
              </div>
              <div className="absolute bottom-4 left-4 z-[500] hidden flex-wrap gap-4 rounded-xl bg-ink/70 px-4 py-2.5 text-xs font-medium text-white backdrop-blur sm:flex">
                <Legend color="bg-safe" label="On Time" /><Legend color="bg-risk" label="At Risk" /><Legend color="bg-danger" label="Delayed" /><Legend color="bg-[#A78BFA]" label="Weather Alert" />
              </div>
            </RouteMap>
          ) : (
            <ListView nodes={liveLegs} onOpen={() => navigate('trip')} />
          )}

          <section className="card flex max-h-[480px] flex-col p-5" aria-labelledby="alerts-title">
            <div className="flex items-center justify-between">
              <h2 id="alerts-title" className="section-title text-xl">Live Alerts</h2>
              <button onClick={() => setView('list')} className="flex items-center gap-1 text-sm font-semibold text-brand">View All <ArrowRight className="h-4 w-4" /></button>
            </div>
            <div className="-mx-2 mt-3 flex-1 space-y-1 overflow-y-auto px-2 scrollbar-thin">
              {riskLoading && alerts.length === 0 && [0, 1, 2].map((i) => <div key={i} className="skeleton h-14 w-full" />)}
              {riskError && <p className="rounded-xl bg-danger-light/60 p-3 text-sm text-danger">Live alerts are temporarily unavailable.</p>}
              {!riskLoading && alerts.length === 0 && !riskError && <p className="py-8 text-center text-sm text-ink-muted">No active alerts. Every connection looks healthy.</p>}
              {alerts.map((a) => {
                const style = kindStyle[a.kind];
                const Icon = style.icon;
                return (
                  <button key={a.id} onClick={() => setOpenAlert(a)} className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition hover:bg-canvas">
                    <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', style.tile)}><Icon className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold leading-snug text-ink" title={a.title}>{shortText(a.title, 70)}</span>
                    </span>
                    <span className="shrink-0 text-[11px] text-ink-faint">{a.timestamp}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {(riskLoading || riskReady) && (
          <section className="card p-5" aria-labelledby="trip-risk-title">
            <h2 id="trip-risk-title" className="section-title text-xl">Trip Risk</h2>
            {riskLoading ? (
              <div className="mt-4"><LoadingRisk step={riskStep} /></div>
            ) : risk && (
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
              <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col lg:items-stretch">
                <ScoreRing score={risk.score.tripResilience} size={104} strokeWidth={11} gradient label="Resilience" valueClassName="text-[22px]" className="shrink-0 self-center" />
                <ul className="w-full space-y-3">
                  {riskBars.map(({ key, label }) => (
                    <li key={key} className="flex items-center gap-3 text-sm">
                      <span className="w-32 shrink-0 text-ink-soft">{label}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-canvas"><div className="h-full rounded-full bg-brand-gradient" style={{ width: `${risk.score[key]}%` }} /></div>
                      <span className="w-8 text-right text-xs tabular-nums text-ink-muted">{risk.score[key]}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="space-y-3">
                {risk.cards.map((c) => (
                  <li key={`${c.nodeId}-${c.riskType}`} className="rounded-xl border border-line p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-ink">{c.nodeLabel}</div>
                        <div className="eyebrow mt-0.5">{c.riskType}</div>
                      </div>
                      <span className={cn('pill tabular-nums', toneClasses[riskTone[c.riskLevel] ?? 'muted'].pill)}>{c.riskPercent}%</span>
                    </div>
                    <p className="mt-2 text-xs text-ink-muted">{c.recommendation}</p>
                  </li>
                ))}
              </ul>
            </div>
            )}
          </section>
        )}

        <section className="card p-5" aria-labelledby="active-trips-title">
          <div className="flex items-center justify-between">
            <h2 id="active-trips-title" className="section-title text-xl">Your Active Trips ({trips.length})</h2>
            <button onClick={() => navigate('bookings')} className="flex items-center gap-1 text-sm font-semibold text-brand">View All Trips <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {trips.map((t) => <ActiveTripCard key={t.id} trip={t} current={t.id === trip.id} onOpen={() => { switchTrip(t.id); navigate('dashboard'); }} />)}
          </div>
        </section>

        <section className="card p-5" aria-labelledby="live-status-title">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="live-status-title" className="section-title flex flex-wrap items-center gap-2 text-xl">
              Live Status — {routeCities(trip).map((c, i) => <span key={`${c}-${i}`} className="flex items-center gap-2">{i > 0 && <ArrowRight className="h-5 w-5" />}{c}</span>)}
            </h2>
            <button onClick={() => navigate('trip')} className="flex items-center gap-1 text-sm font-semibold text-brand">View Details <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {liveLegs.map((n) => <LegStatusCard key={n.id} node={n} />)}
            {liveLegs.length === 0 && <p className="text-sm text-ink-muted">No bookings to track yet.</p>}
          </div>
        </section>

        <QuickActions />
      </div>

      <Modal open={!!openAlert} onClose={() => setOpenAlert(null)} title={openAlert?.title} subtitle={openAlert?.timestamp}>
        {openAlert && (
          <div className="space-y-4 text-sm">
            <p className="text-ink-soft">{openAlert.reason}</p>
            {openAlert.impact && <div className="rounded-xl bg-canvas p-3"><div className="eyebrow">Impact</div><p className="mt-1 text-ink">{openAlert.impact}</p></div>}
            <div className="flex flex-wrap gap-2">
              {openAlert.severity !== 'info' && openAlert.kind !== 'weather' && <button onClick={() => { setOpenAlert(null); navigate('recovery'); }} className="btn-primary">Review recovery options <ArrowRight className="h-4 w-4" /></button>}
              <button onClick={() => { setOpenAlert(null); navigate('assistant', { prompt: `Explain this alert: ${openAlert.title}` }); }} className="btn-outline">Ask AI Assistant</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/** Staged placeholder for the Trip Risk section (restored from the deleted
 * RiskIntelligence page). `step` is driven by timers, not backend progress. */
function LoadingRisk({ step }: { step: number }) {
  const items = ['Checking connections', 'Checking downstream bookings', 'Calculating exposure', 'Preparing recovery options'];
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
      <h2 className="text-sm font-bold text-ink">Building your risk picture</h2>
      <div className="mt-5 space-y-4">
        {items.map((x, i) => (
          <div key={x} className="flex items-center gap-3">
            <span className={cn('flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold', step > i ? 'bg-safe/10 text-safe' : step === i ? 'bg-brand/10 text-brand' : 'bg-canvas text-ink-faint')}>
              {step > i ? '✓' : step === i ? '●' : '○'}
            </span>
            <span className={cn('text-sm', step === i ? 'font-semibold text-ink' : 'text-ink-muted')}>{x}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="flex items-center gap-2"><span className={cn('h-2.5 w-2.5 rounded-full', color)} />{label}</span>;
}

const lifecycleBadge = {
  disrupted: { status: 'broken' as const, label: 'Disruption' },
  recovered: { status: 'recovered' as const, label: 'Recovered' },
  upcoming: { status: 'healthy' as const, label: 'On Track' },
  confirmed: { status: 'healthy' as const, label: 'On Track' },
  'in-progress': { status: 'healthy' as const, label: 'In Progress' },
  completed: { status: 'healthy' as const, label: 'Completed' },
};

function ActiveTripCard({ trip, current, onOpen }: { trip: Trip; current: boolean; onOpen: () => void }) {
  const cities = routeCities(trip);
  const affected = trip.nodes.filter((n) => n.category !== 'connection' && n.status !== 'healthy' && n.status !== 'recovered').length;
  const lc = lifecycleBadge[tripLifecycle(trip)];
  return (
    <button onClick={onOpen} className={cn('card card-hover flex items-center gap-4 p-3 text-left', current && 'border-brand/40')}>
      <DestinationImage destination={cities[cities.length - 1]} className="h-[84px] w-[110px] shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-bold text-ink">{cities.join(' → ')}</div>
        <div className="mt-0.5 text-xs text-ink-muted">{formatDateRange(trip.startDate, trip.endDate)}</div>
        <div className="mt-2">
          {affected > 0 ? <StatusBadge status="broken" label={`${affected} disruption${affected === 1 ? '' : 's'}`} /> : <StatusBadge status={lc.status} label={lc.label} />}
        </div>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-brand"><ArrowRight className="h-4 w-4" /></span>
    </button>
  );
}

function legScene(node: ItineraryNodeData) {
  const k = nodeKind(node);
  return k === 'flight' ? sceneImages.flight : k === 'train' ? sceneImages.train : k === 'transfer' ? sceneImages.transfer : undefined;
}

function LegStatusCard({ node }: { node: ItineraryNodeData }) {
  const k = nodeKind(node);
  const scheduled = parseDate(node.scheduledStart);
  const actual = parseDate(node.actualStart ?? undefined);
  const delayed = scheduled && actual && actual > scheduled;
  const Icon = k === 'flight' ? Plane : k === 'train' ? TrainFront : k === 'hotel' ? BedDouble : Car;
  return (
    <div className="card flex w-[300px] shrink-0 gap-3 p-2.5">
      <DestinationImage src={legScene(node)} destination={node.location} className="h-[104px] w-[104px] shrink-0 rounded-xl" />
      <div className="min-w-0 py-1">
        <div className="flex items-center gap-1.5 text-[15px] font-bold text-ink"><Icon className="h-4 w-4 text-brand" /><span className="truncate">{node.subtitle && k !== 'hotel' ? node.subtitle.split(' · ')[0] : node.title}</span></div>
        <div className="truncate text-xs text-ink-muted">{k === 'hotel' ? node.location : node.label}</div>
        <div className="mt-2"><StatusBadge status={node.status} label={node.status === 'healthy' && k === 'hotel' ? 'Confirmed' : undefined} /></div>
        <div className="mt-2 text-xs">
          {delayed ? (
            <>
              <span className="text-ink-faint line-through">{formatTime(scheduled)}</span>{' '}
              <span className="font-bold text-danger">{formatTime(actual)}</span>
            </>
          ) : (
            <span className="font-semibold text-ink">{k === 'hotel' ? 'Check-in ' : ''}{formatTime(scheduled)}</span>
          )}
          {node.availableBufferMinutes != null && node.status === 'at-risk' && <span className="ml-2 text-risk-dark">{node.availableBufferMinutes} min buffer</span>}
        </div>
      </div>
    </div>
  );
}

function ListView({ nodes, onOpen }: { nodes: ItineraryNodeData[]; onOpen: () => void }) {
  return (
    <section className="card overflow-hidden" aria-label="Journey list view">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-canvas/70 text-xs text-ink-muted">
            <tr><th className="px-5 py-3 font-semibold">Booking</th><th className="px-4 py-3 font-semibold">Route</th><th className="px-4 py-3 font-semibold">Scheduled</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Why</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {nodes.map((n) => (
              <tr key={n.id} onClick={onOpen} className="cursor-pointer hover:bg-canvas/60">
                <td className="px-5 py-3">
                  {/* The row is clickable for pointer users; this button is the keyboard-reachable equivalent. */}
                  <button type="button" onClick={(e) => { e.stopPropagation(); onOpen(); }} className="rounded text-left font-semibold text-ink hover:text-safar-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-safar-blue focus-visible:ring-offset-2">{n.subtitle || n.title}</button>
                  <div className="text-xs text-ink-muted">{n.provider}</div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{n.label}</td>
                <td className="px-4 py-3 text-ink-soft">{n.scheduledTime}</td>
                <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
                <td className="max-w-[260px] px-4 py-3 text-xs text-ink-muted"><span className="line-clamp-2">{n.reason ?? (n.status === 'healthy' ? 'On schedule' : '')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 border-t border-line px-5 py-3 text-xs text-ink-muted"><Wind className="h-3.5 w-3.5" /> Statuses update as the backend re-propagates your itinerary.</div>
    </section>
  );
}
