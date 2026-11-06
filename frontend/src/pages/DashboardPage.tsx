import { useApp } from '@/store/AppContext';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from '@/lib/router';
import { useAllTrips, useJourney } from '@/hooks/useTravelData';
import { PageHero } from '@/components/layout/PageHero';
import { ItineraryStrip } from '@/components/brand/ItineraryArt';
import { MetricCard } from '@/components/ui/MetricCard';
import { JourneyRoute } from '@/components/travel/JourneyRoute';
import { RouteMap } from '@/components/travel/RouteMap';
import { TripStatusCard } from '@/components/dashboard/TripStatusCard';
import { HelpCard } from '@/components/dashboard/HelpCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDateRange, formatINR, tripType } from '@/lib/journey';
import { AlertCircle, ArrowRight, ArrowUp, Plane, ShieldCheck, Sparkles, WalletCards } from 'lucide-react';

function greeting(now = new Date()) {
  const h = now.getHours();
  return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
}

export function DashboardPage() {
  const { trip, phase, activeDisruption, recoveryOptions, activityLog, preDisruptionTrip, loading } = useApp();
  const { profile } = useAuth();
  const { navigate } = useRouter();
  const { trips } = useAllTrips();
  const journey = useJourney();

  const firstName = profile?.name.split(' ')[0] ?? 'Traveler';
  const affectedTrips = trips.filter((t) => t.status === 'disrupted' || t.status === 'recovering').length;
  const disruptions = activityLog.filter((e) => e.type === 'disruption').length;
  const resolved = Math.min(disruptions, activityLog.filter((e) => e.type === 'recovery').length);
  const healthDelta = preDisruptionTrip ? trip.healthScore - preDisruptionTrip.healthScore : null;
  const savings = activeDisruption
    ? activeDisruption.financialExposure + activeDisruption.refundExposure
    : trip.nodes.reduce((sum, n) => sum + (n.refundAmount ?? 0), 0);
  const isDisrupted = phase === 'disrupted' || phase === 'analyzing' || phase === 'recovering';
  const readyOptions = recoveryOptions.filter((o) => o.feasible !== false).length;

  return (
    <div className="animate-fade-in">
      <PageHero
        title={<>{greeting()}, {firstName} <span aria-hidden="true">👋</span></>}
        subtitle="Your journey, always with you."
        description="We monitor your trips, detect disruptions, and find the best recovery options — so you can focus on the journey, not the stress."
        art={<ItineraryStrip />}
      />

      <div className="relative z-10 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard value={trips.length} label="Active Trips" icon={<Plane />} accent="cyan" onClick={() => navigate('bookings')}
            sub={<>{trips.length - affectedTrips} On Track <span className="mx-1.5 text-line-strong">|</span> {affectedTrips} Affected</>} />
          <MetricCard value={trip.healthScore} suffix="%" label="Trip Health Score" icon={<ShieldCheck />} accent="green" onClick={() => navigate('trip')}
            sub={healthDelta != null && healthDelta !== 0
              ? <span className={healthDelta > 0 ? 'pill bg-safe-light text-safe' : 'pill bg-danger-light text-danger'}><ArrowUp className={healthDelta > 0 ? 'h-3 w-3' : 'h-3 w-3 rotate-180'} />{healthDelta > 0 ? '+' : ''}{healthDelta}%</span>
              : 'Current trip'} />
          <MetricCard value={disruptions} label="Disruptions Detected" icon={<AlertCircle />} accent="red" onClick={() => navigate('live')}
            sub={<>{resolved} Resolved <span className="mx-1.5 text-line-strong">|</span> {disruptions - resolved} In Progress</>} />
          <MetricCard value={savings} prefix="₹ " label="Potential Savings" icon={<WalletCards />} accent="amber" onClick={() => navigate('claims')} sub="Through rebooking & claims" />
        </div>

        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-5">
            <section className="card p-5 sm:p-6" aria-labelledby="current-trip-title">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 id="current-trip-title" className="section-title">Current Trip</h2>
                    {isDisrupted && <StatusBadge status="broken" label="Disruption Detected" size="md" />}
                    {phase === 'recovered' && <StatusBadge status="recovered" label="Recovered & Re-validated" size="md" />}
                  </div>
                  {loading && !trip.id ? (
                    <div className="skeleton mt-3 h-8 w-64" />
                  ) : (
                    <>
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 font-display text-2xl font-extrabold text-ink sm:text-[26px]">
                        {journey.stops.length ? journey.stops.map((s, i) => (
                          <span key={`${s.city}-${i}`} className="flex items-center gap-3">
                            {i > 0 && <ArrowRight className="h-6 w-6 text-ink" strokeWidth={2.5} />}
                            {s.city}
                          </span>
                        )) : trip.route}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
                        <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                        <span className="h-4 w-px bg-line-strong" />
                        <span className="pill bg-brand-light text-brand">{tripType(trip)}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {isDisrupted && (
                    <button onClick={() => navigate('recovery')} className="btn-primary">
                      <Sparkles className="h-4 w-4" /> Recovery Options
                    </button>
                  )}
                  <button onClick={() => navigate('trip')} className="btn-outline">View Details <ArrowRight className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-5">
                <JourneyRoute journey={journey} onSelectStop={() => navigate('trip')} />
              </div>
              {isDisrupted && activeDisruption && (
                <div className="ai-surface mt-5 p-3.5" aria-live="polite">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-safar-ai">✦ SAFARSATHI INSIGHT</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
                    <span><b>{activeDisruption.label}</b> · {activeDisruption.downstreamImpact} affected ({formatINR(activeDisruption.financialExposure)} at risk)</span>
                    <span className="font-semibold text-brand">
                      {readyOptions > 0 ? `${readyOptions} recovery option${readyOptions === 1 ? '' : 's'} ready` : 'Preparing recovery options…'}
                    </span>
                  </div>
                </div>
              )}
            </section>

            <RouteMap stops={journey.stops} legs={journey.legs} maxZoom={5} padding={36} className="h-[240px] rounded-card border border-line shadow-card sm:h-[260px]">
              <button onClick={() => navigate('live')} className="absolute bottom-4 left-4 z-[500] flex items-center gap-2 rounded-xl border border-white/25 bg-ink/70 px-3 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-ink/85">
                <span className="h-2 w-2 rounded-full bg-safe" /> Live Tracking
              </button>
            </RouteMap>
          </div>

          <div className="grid grid-cols-1 content-start gap-5 lg:grid-cols-2 2xl:grid-cols-1">
            <TripStatusCard trip={trip} phase={phase} disruption={phase === 'recovered' ? null : activeDisruption} hasOptions={recoveryOptions.length > 0} />
            <HelpCard />
          </div>
        </div>

        <QuickActions />
      </div>
    </div>
  );
}
