import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/store/AppContext';
import * as api from '@/services/api';
import { useToast } from '@/components/ui/ToastProvider';
import { useRouter } from '@/lib/router';
import { useJourney } from '@/hooks/useTravelData';
import { PageHero } from '@/components/layout/PageHero';
import { useShellActions } from '@/components/layout/ShellActions';
import { JourneyRoute } from '@/components/travel/JourneyRoute';
import { ImpactSummary } from '@/components/dashboard/TripStatusCard';
import { PreferenceSelector } from '@/components/recovery/PreferenceSelector';
import { RecoveryPlanCard } from '@/components/recovery/RecoveryPlanCard';
import { ComparisonPanel } from '@/components/recovery/ComparisonPanel';
import { BeforeAfterView } from '@/components/recovery/BeforeAfterView';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { formatDateRange, formatINR, tripType } from '@/lib/journey';
import { optionRoute, priorityOf, priorityPresets, rankOptions, type Priority } from '@/lib/recovery';
import { toConciseBullets, toConciseLine } from '@/lib/concise';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, CheckCircle2, CircleDashed, Columns2, Loader2, RotateCcw, ShieldCheck, Sparkles, Zap } from 'lucide-react';

const VALIDATION_STEPS = ['Confirming new bookings', 'Re-propagating the itinerary graph', 'Validating every connection buffer', 'Updating trip health'];

export function RecoveryPage() {
  const { trip, phase, activeDisruption, recoveryOptions, selectedRecovery, selectRecovery, applyRecoveryPlan, appliedRecovery, preferences, setPreferences, loadRecoveryOptions, resetTrip, isBusy } = useApp();
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { openSimulate } = useShellActions();
  const journey = useJourney();
  const [priority, setPriority] = useState<Priority>(() => priorityOf(preferences));
  const [reranking, setReranking] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [validating, setValidating] = useState<number | null>(null);

  const ranked = useMemo(() => rankOptions(recoveryOptions, priority), [recoveryOptions, priority]);
  const unavailable = recoveryOptions.filter((o) => o.feasible === false);
  const routes = useMemo(() => new Map(ranked.map((o) => [o.id, optionRoute(o, trip)])), [ranked, trip]);
  const selected = ranked.find((o) => o.id === selectedRecovery) ?? ranked[0] ?? null;
  const fastestId = [...ranked].sort((a, b) => a.timeImpactMinutes - b.timeImpactMinutes || b.scoreBreakdown.speed - a.scoreBreakdown.speed)[0]?.id;
  const cheapestId = [...ranked].sort((a, b) => a.costDelta - b.costDelta)[0]?.id;

  // Executive summary + narrative for the current ranking (refreshed whenever options change).
  const [summary, setSummary] = useState<api.RecoveryNarrative | null>(null);
  const optionKey = recoveryOptions.map((o) => `${o.id}:${o.score}`).join('|');
  useEffect(() => {
    if (!optionKey || !trip.id) { setSummary(null); return; }
    let cancelled = false;
    api.getRecoveryNarrative(trip.id).then((n) => { if (!cancelled) setSummary(n); }).catch(() => { if (!cancelled) setSummary(null); });
    return () => { cancelled = true; };
  }, [optionKey, trip.id]);

  // A disruption exists but options haven't been generated yet (e.g. restored session).
  useEffect(() => {
    if ((phase === 'disrupted') && recoveryOptions.length === 0 && !isBusy) loadRecoveryOptions();
  }, [phase, recoveryOptions.length, isBusy, loadRecoveryOptions]);

  const changePriority = async (next: Priority) => {
    if (next === priority) return;
    setPriority(next);
    setReranking(true);
    try {
      await setPreferences(priorityPresets[next](preferences));
      await loadRecoveryOptions();
      selectRecovery(null);
    } finally {
      setReranking(false);
    }
  };

  const apply = async () => {
    if (!selected) return;
    setConfirmOpen(false);
    setValidating(0);
    const ticker = setInterval(() => setValidating((s) => (s === null ? s : Math.min(s + 1, VALIDATION_STEPS.length - 1))), 450);
    try {
      await applyRecoveryPlan(selected.id);
      setValidating(VALIDATION_STEPS.length);
      addToast('success', 'Journey re-validated', `${selected.name} applied · ${selected.bookingsPreserved}/${selected.totalBookings} bookings preserved.`);
    } catch {
      addToast('error', 'Recovery could not be applied', 'Nothing was changed. Please try again.');
    } finally {
      clearInterval(ticker);
      setTimeout(() => setValidating(null), 500);
    }
  };

  const isRecovered = phase === 'recovered' && appliedRecovery;
  const heroTitle = isRecovered ? 'Your journey is back on track.' : phase === 'idle' ? 'Your journey is on track.' : 'We found a safer way forward.';
  const heroSubtitle = isRecovered
    ? 'Safar Sathi applied your recovery and re-validated every connection.'
    : phase === 'idle'
      ? 'No disruption right now. Recovery plans appear here the moment something changes.'
      : 'Safar Sathi analyzed the disruption and prepared recovery plans for your journey.';

  return (
    <div className="animate-fade-in">
      <PageHero crumbs={[{ label: 'Recovery Options' }]} showTripBadge
        title={heroTitle}
        subtitle={<span className="text-[17px] sm:text-lg">{heroSubtitle}</span>}
        actions={<button onClick={() => navigate('dashboard')} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</button>}
      />

      <div className="relative z-10 space-y-5">
        <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="card p-5" aria-labelledby="your-trip-title">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="your-trip-title" className="section-title">Your Trip</h2>
              {phase === 'idle' && <StatusBadge status="healthy" label="All connections healthy" size="md" />}
              {(phase === 'disrupted' || phase === 'analyzing' || phase === 'recovering') && <StatusBadge status="broken" label="Disruption Detected" size="md" />}
              {phase === 'recovered' && <StatusBadge status="recovered" label="Re-validated" size="md" />}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
              <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
              <span className="h-4 w-px bg-line-strong" />
              <span className="font-medium text-ink-soft">{tripType(trip)}</span>
              {activeDisruption && <><span className="h-4 w-px bg-line-strong" /><span className="font-medium text-danger">{activeDisruption.label}</span></>}
            </div>
            <div className="mt-4"><JourneyRoute journey={journey} compact /></div>
          </section>
          <section className="card p-5">
            <ImpactSummary trip={trip} disruption={phase === 'recovered' ? null : activeDisruption} />
          </section>
        </div>

        {phase === 'idle' && (
          <section className="card flex flex-col items-center gap-4 px-6 py-12 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-safe-light text-safe"><ShieldCheck className="h-8 w-8" /></span>
            <div>
              <h2 className="section-title">No recovery needed</h2>
              <p className="mt-1 max-w-md text-sm text-ink-muted">Every booking in {trip.route || 'this trip'} is on schedule. Run a what-if scenario to see how Safar Sathi would recover your journey.</p>
            </div>
            <button onClick={openSimulate} className="btn-primary"><Zap className="h-4 w-4" /> Simulate a disruption</button>
          </section>
        )}

        {isRecovered && appliedRecovery && (
          <section className="card p-6 animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-safe-light text-safe"><CheckCircle2 className="h-7 w-7" /></span>
                <div>
                  <h2 className="section-title">{appliedRecovery.name} applied</h2>
                  <p className="text-sm text-ink-muted">{appliedRecovery.bookingsPreserved}/{appliedRecovery.totalBookings} bookings preserved · {formatINR(Math.max(0, appliedRecovery.costDelta))} extra · trip health {trip.healthScore}%</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => navigate('trip')} className="btn-outline">View updated itinerary <ArrowRight className="h-4 w-4" /></button>
                {trip.resettable !== false && (
                  <button onClick={async () => { await resetTrip(); addToast('info', 'Journey reset', 'All bookings restored to their original schedule.'); }} className="btn-ghost" disabled={isBusy}><RotateCcw className="h-4 w-4" /> Reset journey</button>
                )}
              </div>
            </div>
            <div className="mt-6"><BeforeAfterView /></div>
          </section>
        )}

        {(phase === 'disrupted' || phase === 'analyzing' || phase === 'recovering') && (
          <>
            <PreferenceSelector value={priority} onChange={changePriority} busy={reranking} />

            {summary?.executiveSummary && ranked.length > 0 && (
              <section className="ai-surface flex items-start gap-3 p-4" aria-live="polite">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-ai shadow-card"><Sparkles className="h-4 w-4" /></span>
                <div className="min-w-0 text-sm">
                  <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-ai">Why these recommendations{summary.source === 'nugen' ? ' · Nugen' : summary.source === 'llm' ? ' · AI' : ''}</div>
                  <p className="mt-1 font-semibold text-ink">{toConciseLine(summary.executiveSummary.match(/Recommended:[\s\S]*$/)?.[0] ?? summary.executiveSummary, 150)}</p>
                  {summary.narrative && (
                    <ul className="mt-2 space-y-1">
                      {toConciseBullets(summary.narrative, 3).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-ink-soft">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ai" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            )}

            {unavailable.map((o) => (
              <div key={o.id} className="rounded-2xl border border-danger/20 bg-danger-light/60 p-4 text-sm">
                <div className="font-semibold text-danger">{o.name}</div>
                <p className="mt-1 text-ink-soft">{toConciseLine(o.providerReason || o.description, 140)}</p>
              </div>
            ))}

            {ranked.some((o) => o.dataSource === 'simulated' || !o.dataSource) && (
              <div className="flex items-center gap-2 rounded-xl border border-line bg-canvas px-3.5 py-2 text-xs text-ink-muted">
                <CircleDashed className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
                <span>Simulated pricing — connect a live provider for real-time availability</span>
              </div>
            )}

            {ranked.length === 0 ? (
              <GeneratingPlans />
            ) : (
              <div className={cn('grid gap-5 lg:grid-cols-2 2xl:grid-cols-3', reranking && 'opacity-60 transition-opacity')}>
                {ranked.map((option, i) => (
                  <RecoveryPlanCard
                    key={option.id}
                    option={option}
                    route={routes.get(option.id) ?? null}
                    rank={i}
                    selected={selected?.id === option.id}
                    isFastest={option.id === fastestId}
                    isCheapest={option.id === cheapestId && option.costDelta <= 0}
                    onSelect={() => selectRecovery(option.id)}
                  />
                ))}
              </div>
            )}

            {compareOpen && ranked.length > 0 && <ComparisonPanel options={ranked} routes={routes} selectedId={selected?.id ?? null} onSelect={(id) => selectRecovery(id)} />}

            <section className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <button onClick={() => setCompareOpen((v) => !v)} className="flex items-center gap-4 text-left" aria-expanded={compareOpen} disabled={ranked.length === 0}>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand"><Columns2 className="h-6 w-6" /></span>
                <span>
                  <span className="block text-[15px] font-bold text-ink">{compareOpen ? 'Hide Comparison' : 'Compare Plans'}</span>
                  <span className="block text-sm text-ink-muted">View side-by-side comparison</span>
                </span>
              </button>
              <div className="flex flex-col items-stretch gap-1.5 sm:min-w-[380px] sm:items-end">
                <button onClick={() => setConfirmOpen(true)} disabled={!selected || isBusy || reranking} className="btn-gradient py-3.5 text-base">
                  <Sparkles className="h-5 w-5" /> Apply Recovery &amp; Re-Validate <ArrowRight className="h-5 w-5" />
                </button>
                <span className="text-center text-xs text-ink-muted sm:text-right">This will confirm new bookings and update your itinerary.</span>
              </div>
            </section>
          </>
        )}
      </div>

      <Modal open={confirmOpen && !!selected} onClose={() => setConfirmOpen(false)} title="Apply this recovery?" subtitle="Nothing changes until you confirm.">
        {selected && (
          <>
            <div className="rounded-2xl border border-line bg-canvas/70 p-4">
              <div className="font-bold text-ink">{selected.name}</div>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {selected.changes.filter((c) => c.changeType !== 'preserved').map((c) => <li key={`${c.nodeId}-${c.description}`} className="flex gap-2"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{c.nodeLabel}: {c.description}</li>)}
              </ul>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div>Extra cost<b className="mt-0.5 block text-sm text-ink">{formatINR(Math.max(0, selected.costDelta))}</b></div>
                <div>Bookings kept<b className="mt-0.5 block text-sm text-safe">{selected.bookingsPreserved}/{selected.totalBookings}</b></div>
                <div>Risk<b className="mt-0.5 block text-sm capitalize text-ink">{selected.residualRisk}</b></div>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setConfirmOpen(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={apply} className="btn-primary flex-1"><ShieldCheck className="h-4 w-4" /> Confirm &amp; Re-Validate</button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={validating !== null} onClose={() => undefined} title="Re-validating your journey">
        <ol className="space-y-3">
          {VALIDATION_STEPS.map((step, i) => {
            const done = validating !== null && i < validating;
            const active = validating === i;
            return (
              <li key={step} className="flex items-center gap-3 text-sm">
                {done ? <CheckCircle2 className="h-5 w-5 text-safe" /> : active ? <Loader2 className="h-5 w-5 animate-spin text-brand" /> : <CircleDashed className="h-5 w-5 text-ink-faint" />}
                <span className={cn(done ? 'text-ink' : active ? 'font-semibold text-ink' : 'text-ink-muted')}>{step}</span>
              </li>
            );
          })}
        </ol>
      </Modal>
    </div>
  );
}

function GeneratingPlans() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3" aria-busy="true" aria-label="Generating recovery options">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card space-y-4 p-5">
          <div className="skeleton h-6 w-28" />
          <div className="skeleton h-6 w-3/4" />
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-14 w-full" />
          <div className="skeleton h-20 w-full" />
        </div>
      ))}
    </div>
  );
}
