import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/store/AppContext';
import * as api from '@/services/api';
import { useToast } from '@/components/ui/ToastProvider';
import { useRouter } from '@/lib/router';
import { PageHero } from '@/components/layout/PageHero';
import { Modal } from '@/components/ui/Modal';
import { WeatherScenarioSliders } from '@/components/digitaltwin/WeatherScenarioSliders';
import { DigitalTwinComparison } from '@/components/digitaltwin/DigitalTwinComparison';
import { SCENARIO_PRESETS, asStatus } from '@/lib/digitalTwin';
import { SocialSignalsTicker } from '@/components/digitaltwin/SocialSignalsTicker';
import { DigitalTwinMapOverlay, type TwinMapPoint } from '@/components/map/DigitalTwinMapOverlay';
import { formatINR } from '@/lib/journey';
import { toConciseLine } from '@/lib/concise';
import { cn } from '@/lib/utils';
import { ArrowLeft, BrainCircuit, CheckCircle2, CloudSun, Layers, Loader2, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';

const when = (iso: string) => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
const minutes = (m: number) => (m === 0 ? 'no change' : m < 60 ? `+${m} min` : `+${Math.floor(m / 60)}h ${m % 60 ? `${m % 60}m` : ''}`.trim());

export function DigitalTwinPage() {
  const { trip, reload } = useApp();
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const [scenario, setScenario] = useState<api.WeatherScenarioRequest>(SCENARIO_PRESETS[0].scenario);
  const [sim, setSim] = useState<api.DigitalTwinSimulation | null>(null);
  const [running, setRunning] = useState(false);
  const [confirm, setConfirm] = useState<api.TwinOption | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState<api.DigitalTwinApplyResult | null>(null);
  const [weather, setWeather] = useState<api.TripWeather | null>(null);

  // A simulation belongs to one trip: switching trips clears it.
  useEffect(() => { setSim(null); setApplied(null); }, [trip.id]);

  useEffect(() => {
    if (!trip.id) return;
    let cancelled = false;
    api.getTripWeather(trip.id).then((w) => { if (!cancelled) setWeather(w); }).catch(() => { if (!cancelled) setWeather(null); });
    return () => { cancelled = true; };
  }, [trip.id, applied]);

  const run = async () => {
    if (!trip.id) return;
    setRunning(true);
    setApplied(null);
    try {
      const result = await api.simulateDigitalTwin(trip.id, scenario);
      setSim(result);
      const hit = result.nodes.filter((n) => n.directHit).length;
      addToast(hit ? 'info' : 'success', hit ? `${hit} booking(s) hit directly` : 'Journey holds up', hit ? `Twin health ${result.twin.healthScore} vs live ${result.live.healthScore}.` : 'This storm misses every scheduled leg.');
    } catch (err) {
      addToast('error', 'Simulation failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setRunning(false);
    }
  };

  const apply = async () => {
    if (!sim || !confirm) return;
    setApplying(true);
    try {
      const result = await api.applyDigitalTwin(trip.id, sim.simulationId, confirm.id);
      setApplied(result);
      setSim(null);
      setConfirm(null);
      await reload();
      addToast('success', 'Itinerary storm-proofed', `${result.appliedOption.name} applied · ${result.validation.totalCommitments - result.validation.atRiskCommitments}/${result.validation.totalCommitments} commitments validated.`);
    } catch (err) {
      setConfirm(null);
      addToast('error', 'Plan not applied', err instanceof Error ? err.message : 'Nothing was changed. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const order = useMemo(() => new Map(trip.nodes.map((n, i) => [n.id, i])), [trip.nodes]);
  const points: TwinMapPoint[] = useMemo(() => {
    if (sim) {
      return [...sim.nodes]
        .sort((a, b) => (order.get(a.nodeId) ?? 0) - (order.get(b.nodeId) ?? 0))
        .map((n) => ({ id: n.nodeId, title: n.title, status: asStatus(n.twinStatus), lat: n.lat, lng: n.lng, directHit: n.directHit, delayMinutes: n.delayMinutes }));
    }
    return trip.nodes.map((n) => ({ id: n.id, title: n.title, status: n.status, lat: n.lat ?? null, lng: n.lng ?? null }));
  }, [sim, trip.nodes, order]);

  const disrupted = trip.status === 'disrupted';
  const exposed = weather ? [...weather.nodes].sort((a, b) => b.exposure - a.exposure).slice(0, 4) : [];

  return (
    <div className="animate-fade-in">
      <PageHero
        crumbs={[{ label: 'Digital Twin' }]}
        showTripBadge
        title="Weather Digital Twin"
        titleAddon={<span className="pill bg-ai-light text-ai"><Layers className="h-3.5 w-3.5" /> Sandbox</span>}
        subtitle={<span className="text-[17px] sm:text-lg">Stress-test your journey against extreme weather before it happens.</span>}
        actions={<button onClick={() => navigate('dashboard')} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</button>}
      />

      <div className="relative z-10 space-y-5">
        {applied && (
          <section className="card flex flex-wrap items-center gap-4 border-safe/30 p-5 animate-fade-in-up" role="status">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-safe-light text-safe"><CheckCircle2 className="h-6 w-6" /></span>
            <div className="min-w-0 flex-1">
              <h2 className="section-title">{applied.appliedOption.name} applied</h2>
              <p className="text-sm text-ink-muted">
                Live itinerary updated and re-validated · health {applied.validation.healthScore} ·{' '}
                {applied.allConnectionsValid ? 'every connection holds' : `${applied.validation.atRiskCommitments} booking(s) still need attention`}.
              </p>
            </div>
            <button onClick={() => navigate('trip')} className="btn-outline">View itinerary</button>
          </section>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <WeatherScenarioSliders value={scenario} onChange={setScenario} nodes={trip.nodes} onRun={run} running={running} />

          <div className="min-w-0 space-y-5">
            <section className="card overflow-hidden" aria-label="Digital Twin map">
              <DigitalTwinMapOverlay points={points} cascade={sim?.cascade} severity={sim?.severity ?? 0} className="h-[380px] sm:h-[440px]">
                <div className="pointer-events-none absolute left-4 top-4 z-[500] flex flex-wrap gap-2">
                  <span className="pill bg-white/95 text-ink shadow-card">{sim ? `Twin · ${sim.scenarioName}` : 'Live itinerary'}</span>
                  {sim && <span className="pill bg-white/95 text-ink-soft shadow-card">Storm {when(sim.stormWindowStart)} – {when(sim.stormWindowEnd)}</span>}
                </div>
                {sim && (
                  <div className="pointer-events-none absolute bottom-4 left-4 z-[500] flex flex-wrap gap-3 rounded-xl bg-ink/75 px-3 py-2 text-[11px] font-medium text-white backdrop-blur">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-[#FF6B6B]" /> Radar: direct weather hit</span>
                    <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-[#FF4D4D]" /> Cascade</span>
                    <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-[#FBBF24]" /> At risk</span>
                  </div>
                )}
              </DigitalTwinMapOverlay>
            </section>

            {sim ? (
              <section className="card p-5" aria-labelledby="twin-reasoning-title">
                <div className="flex flex-wrap items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-ai" aria-hidden="true" />
                  <h2 id="twin-reasoning-title" className="section-title">Why the cascade happens</h2>
                  <span className={cn('pill', sim.explanationSource === 'nugen' ? 'bg-ai-light text-ai' : 'bg-canvas text-ink-muted')}>
                    {sim.explanationSource === 'nugen' ? `Nugen · ${sim.model ?? 'domain model'}` : 'Heuristic reasoning engine'}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5">
                  {[toConciseLine(sim.explanation, 140)].filter(Boolean).map((line) => (
                    <div key={line} className="flex items-start gap-2 text-[14px] leading-snug text-ink-soft">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ai" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
                {sim.mitigation.length > 0 && (
                  <ul className="mt-3 space-y-1.5 border-t border-line/60 pt-3">
                    {sim.mitigation.slice(0, 1).map((tip) => (
                      <li key={tip} className="flex gap-2 text-xs font-medium text-ink-soft"><Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />{tip}</li>
                    ))}
                  </ul>
                )}
              </section>
            ) : (
              <section className="card p-5" aria-labelledby="exposure-title">
                <div className="flex flex-wrap items-center gap-2">
                  <CloudSun className="h-5 w-5 text-brand" aria-hidden="true" />
                  <h2 id="exposure-title" className="section-title">Forecast exposure</h2>
                  <span className="pill bg-ai-light text-ai"><Layers className="h-3.5 w-3.5" aria-hidden="true" /> Digital Twin weather signal</span>
                  {weather && <span className="pill bg-canvas text-ink-muted">{weather.nodes.some((n) => n.source === 'open-meteo')
                    ? 'Open-Meteo 7-day forecast'
                    : weather.nodes.some((n) => n.source === 'open-meteo-current')
                      ? 'Open-Meteo live conditions (trip dates outside the forecast window)'
                      : 'Offline climatology'}</span>}
                </div>
                {!weather && <p className="mt-1 text-sm text-ink-muted">Checking the forecast…</p>}
                {exposed.length > 0 && (
                  <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {exposed.map((n) => (
                      <li key={n.nodeId} className="rounded-tile border border-line p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-ink">{n.title}</span>
                          <span className={cn('font-mono text-xs font-bold', n.exposure >= 50 ? 'text-danger' : n.exposure >= 25 ? 'text-risk-dark' : 'text-safe')}>{n.exposure}/100</span>
                        </div>
                        <p className="mt-0.5 text-xs text-ink-muted">{n.conditions ? `${Math.round(n.conditions.temperatureC)}°C · ${n.conditions.precipitationProbability}% rain` : 'No forecast'}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>
        </div>

        <SocialSignalsTicker tripId={trip.id} scenario={sim?.socialSignals ?? null} />

        {sim && (
          <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
            <DigitalTwinComparison sim={sim} />
            <section className="card p-5" aria-labelledby="twin-plans-title">
              <h2 id="twin-plans-title" className="section-title">Preemptive recovery</h2>
              <p className="mt-1 text-sm text-ink-muted">Each plan was re-simulated under the same storm.</p>
              {disrupted && (
                <p className="mt-3 flex gap-2 rounded-tile bg-risk-light px-3 py-2 text-[13px] text-risk-dark">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" /> Resolve the active disruption (Recovery Options) before applying a weather plan.
                </p>
              )}
              {sim.options.length === 0 ? (
                <div className="mt-4 flex items-center gap-3 rounded-tile bg-safe-light px-4 py-3 text-sm text-safe">
                  <ShieldCheck className="h-5 w-5" /> No preemptive action needed for this scenario.
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {sim.options.map((o) => (
                    <li key={o.id} className={cn('rounded-tile border p-4', o.recommended ? 'border-brand/40 bg-brand-light/40' : 'border-line')}>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-[15px] font-bold text-ink">{o.name}</h3>
                        {o.recommended && <span className="pill bg-brand text-white">Recommended</span>}
                        <span className="ml-auto font-mono text-xs font-semibold text-ink-muted">score {o.score}</span>
                      </div>
                      <p className="mt-1 text-[13px] leading-snug text-ink-soft">{toConciseLine(o.description, 90)}</p>
                      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] sm:grid-cols-4">
                        <div><dt className="text-ink-muted">Cost</dt><dd className="font-semibold text-ink">+{formatINR(o.deltaCost)}</dd></div>
                        <div><dt className="text-ink-muted">Timing</dt><dd className="font-semibold text-ink">{minutes(o.timeImpactMinutes)}</dd></div>
                        <div><dt className="text-ink-muted">Preserved</dt><dd className="font-semibold text-ink">{o.commitmentsPreserved}/{o.totalCommitments}</dd></div>
                        <div><dt className="text-ink-muted">Health</dt><dd className="font-semibold text-ink">{o.healthScore}</dd></div>
                      </dl>
                      {o.residualFailures > 0 && <p className="mt-2 text-[12px] font-medium text-danger">{o.residualFailures} booking(s) still fail under this storm.</p>}
                      <button onClick={() => setConfirm(o)} disabled={disrupted || applying} className={cn('mt-3 w-full justify-center disabled:opacity-50', o.recommended ? 'btn-primary' : 'btn-outline')}>
                        Apply Preemptive Recovery
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>

      <Modal open={!!confirm} onClose={() => !applying && setConfirm(null)} title={confirm ? `Apply “${confirm.name}”?` : ''} subtitle="These changes will be made to your live itinerary.">
        {confirm && (
          <div className="space-y-4">
            <ul className="space-y-2">
              {confirm.changes.map((c) => (
                <li key={c.nodeId} className="rounded-tile border border-line p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{c.title}</span>
                    <span className="text-xs font-medium text-ink-muted">{when(c.newStart)}</span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-ink-soft">{c.description}</p>
                </li>
              ))}
            </ul>
            <p className="text-sm text-ink-soft">
              Extra cost <b className="text-ink">+{formatINR(confirm.deltaCost)}</b> · {confirm.commitmentsPreserved}/{confirm.totalCommitments} commitments preserved under “{sim?.scenarioName}”.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirm(null)} disabled={applying} className="btn-ghost">Cancel</button>
              <button onClick={apply} disabled={applying} className="btn-primary">
                {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {applying ? 'Applying…' : 'Confirm & apply'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
