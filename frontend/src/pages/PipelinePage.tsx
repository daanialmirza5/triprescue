import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as api from '@/services/api';
import type { ItineraryNodeData, RecoveryOption } from '@/types';
import { LogoMark } from '@/components/brand/Logo';
import { JourneyLayer } from '@/components/pipeline/JourneyLayer';
import { BackendPipeline } from '@/components/pipeline/BackendPipeline';
import { ArchitectureView, type ArchState } from '@/components/pipeline/ArchitectureView';
import { ArchEdgeDetail, ArchNodeDetail, ExecutionLog, NodeDetail, RecoveryPanel, StageDetail, StatusPanel, TwinPanel } from '@/components/pipeline/PipelinePanels';
import { activeComponents, logLines, nodeStates, runSummary, stageStates } from '@/lib/pipeline';
import { cn } from '@/lib/utils';
import { Loader2, Maximize2, Minimize2, Play, RotateCcw, Workflow } from 'lucide-react';

type Mode = 'live' | 'simulation';
type Tab = 'journey' | 'architecture';
type Selection = { kind: 'node' | 'stage' | 'arch-node' | 'arch-edge'; id: string } | null;

const PACE_OPTIONS = [{ ms: 0, label: 'Full speed' }, { ms: 350, label: 'Presentation' }, { ms: 800, label: 'Slow' }];

export function PipelinePage() {
  const [demo, setDemo] = useState<api.PipelineDemo | null>(null);
  const [trip, setTrip] = useState<api.PipelineDemo['trip'] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [arch, setArch] = useState<api.Architecture | null>(null);
  const [archError, setArchError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('live');
  const [tab, setTab] = useState<Tab>('journey');
  const [run, setRun] = useState<api.PipelineRunState | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pace, setPace] = useState(350);
  const [selection, setSelection] = useState<Selection>(null);
  const [presenting, setPresenting] = useState(false);
  const [decided, setDecided] = useState<'applied' | 'kept' | null>(null);
  const [flightNumber, setFlightNumber] = useState('6E2175');
  const [lastOptions, setLastOptions] = useState<RecoveryOption[]>([]);
  const [online, setOnline] = useState<boolean | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    api.getPipelineDemo().then((d) => { setDemo(d); setTrip(d.trip); }).catch((e) => setLoadError(e instanceof Error ? e.message : 'Could not load the demo journey.'));
    api.getArchitecture().then(setArch).catch((e) => setArchError(e instanceof Error ? e.message : 'Could not load the architecture.'));
    api.checkHealth().then((ok) => { if (alive.current) setOnline(ok); });
    return () => { alive.current = false; };
  }, []);

  useEffect(() => {
    if (!presenting) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPresenting(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [presenting]);

  /** Start a real backend run and consume its trace as the backend emits it (long-poll). */
  const execute = useCallback(async (workflow: string, params: Record<string, unknown> = {}) => {
    if (busy) return;
    setBusy(true);
    setRunError(null);
    setSelection(null);
    if (workflow !== 'apply_recovery') { setDecided(null); setLastOptions([]); }
    try {
      let state = await api.startPipelineRun(workflow, params, pace);
      state = { ...state, events: [] };
      setRun(state);
      let after = 0;
      while (!state.done && alive.current) {
        const next = await api.getPipelineEvents(state.runId, after);
        after += next.events.length;
        state = { ...next, events: [...state.events, ...next.events] };
        setRun(state);
      }
      const result = state.result;
      if (result?.trip && (result.mode === 'live' || workflow === 'reset')) setTrip(result.trip);
      const options = (result?.response?.recoveryOptions as RecoveryOption[] | undefined) ?? [];
      if (options.length) setLastOptions(options);
      if (workflow === 'apply_recovery') setDecided(result?.response?.applyStatus === 200 ? 'applied' : null);
      if (state.error) setRunError(`The workflow stopped: ${state.error}`);
    } catch (err) {
      setRunError(err instanceof Error ? err.message : 'The pipeline run failed.');
    } finally {
      if (alive.current) setBusy(false);
    }
  }, [busy, pace]);

  const events = useMemo(() => run?.events ?? [], [run]);
  const simulated = run?.mode === 'simulation';
  // Applying a plan first re-reads the old disruption, then re-validates; the
  // saved trip (result.trip) is the journey's real state, so these runs show
  // that instead of the engine's first pass.
  const tripDriven = run?.workflow === 'apply_recovery' || run?.workflow === 'reset';
  const journeyEvents = useMemo(() => (tripDriven ? events.filter((e) => e.type !== 'node') : events), [events, tripDriven]);
  const stages = useMemo(() => stageStates(events), [events]);
  const nodes = useMemo(() => nodeStates(journeyEvents), [journeyEvents]);
  const lines = useMemo(() => logLines(journeyEvents, simulated), [journeyEvents, simulated]);
  const summary = useMemo(() => runSummary(run && { ...run, events: journeyEvents }), [run, journeyEvents]);
  const engineEvent = useMemo(() => events.find((e) => e.function === 'PropagationEngine.propagate' && e.status === 'completed'), [events]);
  const active = useMemo(() => activeComponents(events), [events]);
  const routerOfRoute = useMemo(() => new Map((arch?.routes ?? []).map((r) => [r.id, r.router])), [arch]);
  const stateOf = useCallback((id: string): ArchState => {
    if (active.failed.has(id)) return 'failed';
    if (active.running.has(id)) return 'running';
    if (active.done.has(id)) return 'done';
    for (const route of active.routes) if (routerOfRoute.get(route) === id) return 'done';
    return 'idle';
  }, [active, routerOfRoute]);

  const workflows = demo?.workflows ?? [];
  const byId = (id: string) => workflows.find((w) => w.id === id);
  const response = run?.result?.response ?? null;
  const twin = (response?.twin ?? null) as Parameters<typeof TwinPanel>[0]['twin'] | null;
  const forecastSource = ((response?.forecast as { nodes?: { source: string }[] } | undefined)?.nodes ?? [])[0]?.source ?? null;
  const liveFlight = (response?.live ?? null) as (Partial<api.LiveTransport> & { detail?: string }) | null;
  const tripNodes = (trip?.nodes ?? []) as ItineraryNodeData[];
  const selectedNode = selection?.kind === 'node' ? tripNodes.find((n) => n.id === selection.id) : undefined;

  const Controls = (
    <section className="card p-4" aria-label="Simulate event">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="section-title">Simulate event</h2>
        <div className="ml-auto flex rounded-full border border-line bg-canvas p-0.5" role="tablist" aria-label="Execution mode">
          {(['live', 'simulation'] as const).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
              className={cn('rounded-full px-3 py-1 text-xs font-bold tracking-wide', mode === m ? (m === 'live' ? 'bg-white text-safe shadow-card' : 'bg-white text-ai shadow-card') : 'text-ink-muted')}>
              {m === 'live' ? '● LIVE' : '◌ SIMULATION'}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-[12px] text-ink-muted">{mode === 'live' ? 'Writes to the isolated demo journey (never your trips).' : 'Dry runs and sandboxes — nothing is saved.'}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {mode === 'live' ? (
          <>
            <button type="button" disabled={busy} onClick={() => execute('flight_delay', { delayMinutes: 120 })} className="btn-primary px-3 py-2 text-sm">Flight delay +120 min</button>
            <button type="button" disabled={busy} onClick={() => execute('flight_cancellation')} className="btn-outline px-3 py-2 text-sm">Flight cancellation</button>
            <button type="button" disabled={busy} onClick={() => execute('event_change', { delayMinutes: 90 })} className="btn-outline px-3 py-2 text-sm">Event change +90 min</button>
            <button type="button" disabled={busy} onClick={() => execute('provider_failure')} className="btn-outline px-3 py-2 text-sm">Provider failure</button>
          </>
        ) : (
          <>
            <button type="button" disabled={busy} onClick={() => execute('what_if', { delayMinutes: 120 })} className="btn-primary px-3 py-2 text-sm">What if: flight +120 min</button>
            <button type="button" disabled={busy} onClick={() => execute('weather')} className="btn-outline px-3 py-2 text-sm">Weather disruption</button>
          </>
        )}
        <button type="button" disabled={busy} onClick={() => execute('reset')} className="btn-ghost px-3 py-2 text-sm"><RotateCcw className="h-4 w-4" /> Reset journey</button>
      </div>
      {mode === 'live' && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <label htmlFor="live-flight" className="text-[12px] font-semibold text-ink-soft">Live flight feed</label>
          <input id="live-flight" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} maxLength={8} className="w-28 rounded-tile border border-line px-2 py-1.5 text-sm uppercase" />
          <button type="button" disabled={busy || !byId('live_flight')?.available} onClick={() => execute('live_flight', { flightNumber, simulatedExtraMinutes: 0 })} className="btn-outline px-3 py-1.5 text-xs">Use real Aviationstack delay</button>
          {byId('live_flight') && !byId('live_flight')!.available && <span className="text-[11px] text-ink-muted">{byId('live_flight')!.note}</span>}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-ink-muted">
        <span>Pacing</span>
        {PACE_OPTIONS.map((p) => (
          <button key={p.ms} type="button" aria-pressed={pace === p.ms} onClick={() => setPace(p.ms)} className={cn('rounded-full border px-2.5 py-1', pace === p.ms ? 'border-brand bg-brand-light text-brand' : 'border-line')}>{p.label}</button>
        ))}
      </div>
    </section>
  );

  const detail = (() => {
    if (!selection) return null;
    const close = () => setSelection(null);
    if (selection.kind === 'node' && selectedNode) return <NodeDetail node={selectedNode} event={nodes[selectedNode.id]} engineEvent={engineEvent} simulated={simulated} onClose={close} />;
    if (selection.kind === 'stage') return <StageDetail stage={selection.id} events={events} onClose={close} />;
    if (selection.kind === 'arch-node' && arch) return <ArchNodeDetail arch={arch} id={selection.id} onClose={close} />;
    if (selection.kind === 'arch-edge' && arch) return <ArchEdgeDetail arch={arch} id={selection.id} onClose={close} />;
    return null;
  })();

  const body = (
    <div className={cn('space-y-4', presenting && 'text-[15px]')}>
      {loadError && <p role="alert" className="rounded-tile border border-danger/20 bg-danger-light/50 px-4 py-3 text-sm text-danger">{loadError}</p>}
      {runError && <p role="alert" className="rounded-tile border border-danger/20 bg-danger-light/50 px-4 py-3 text-sm text-danger">{runError}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-full border border-line bg-white p-0.5" role="tablist" aria-label="View">
          {(['journey', 'architecture'] as const).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className={cn('rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide', tab === t ? 'bg-brand text-white' : 'text-ink-muted')}>{t}</button>
          ))}
        </div>
        <button type="button" disabled={busy || !demo} onClick={() => { setMode('live'); setTab('journey'); execute('flight_delay', { delayMinutes: 120 }); }} className="btn-gradient px-4 py-2 text-sm">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Run live scenario
        </button>
        <button type="button" onClick={() => setPresenting((p) => !p)} className="btn-ghost px-3 py-2 text-sm">
          {presenting ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />} {presenting ? 'Exit presentation' : 'Presentation mode'}
        </button>
        <span className="ml-auto flex flex-wrap gap-2">
          {run && <span className={cn('pill', run.dataSource === 'live' ? 'bg-safe-light text-safe' : 'bg-risk-light text-risk-dark')}>{run.dataSource === 'live' ? 'LIVE DATA' : 'DEMO DATA'}</span>}
          {simulated && <span className="pill bg-ai-light text-ai">◌ SIMULATED</span>}
        </span>
      </div>

      <div className={cn('grid gap-4', presenting ? 'grid-cols-1' : 'grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_360px]')}>
        <div className="min-w-0 space-y-4">
          {tab === 'journey' ? (
            <>
              <section className="card p-4" aria-labelledby="journey-title">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id="journey-title" className="section-title">Real-life journey</h2>
                  <span className="text-[12px] text-ink-muted">{trip ? `${trip.name} · ${trip.route}` : 'Loading…'}</span>
                </div>
                <div className="mt-3">
                  <JourneyLayer nodes={tripNodes} events={nodes} simulated={simulated} selectedId={selection?.kind === 'node' ? selection.id : null} onSelect={(id) => setSelection({ kind: 'node', id })} large={presenting} />
                </div>
              </section>
              <div className="flex items-center gap-3 px-2 text-[12px] text-ink-muted" aria-hidden="true">
                <span className="h-px flex-1 bg-line-strong" />
                <Workflow className="h-4 w-4" /> the same event, inside Safar Sathi
                <span className="h-px flex-1 bg-line-strong" />
              </div>
              <section className="card p-4" aria-labelledby="backend-title">
                <h2 id="backend-title" className="section-title">Live backend pipeline</h2>
                <div className="mt-3">
                  <BackendPipeline stages={stages} simulated={simulated} selected={selection?.kind === 'stage' ? selection.id : null} onSelect={(id) => setSelection({ kind: 'stage', id })} large={presenting} />
                </div>
              </section>
            </>
          ) : arch ? (
            <ArchitectureView arch={arch} stateOf={stateOf} selectedId={selection?.kind === 'arch-node' ? selection.id : null}
              onSelectNode={(id) => setSelection({ kind: 'arch-node', id })} onSelectEdge={(id) => setSelection({ kind: 'arch-edge', id })}
              className={presenting ? 'h-[72vh]' : undefined} />
          ) : (
            <p className="card p-6 text-sm text-ink-muted">{archError ?? 'Loading the architecture from the backend source…'}</p>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <ExecutionLog lines={lines} large={presenting} />
            <div className="space-y-4">
              <StatusPanel summary={summary} workflow={run ? byId(run.workflow)?.label ?? run.workflow : null} simulated={simulated} dataSource={run?.dataSource ?? null} paceMs={run?.paceMs ?? 0} />
              {liveFlight && (liveFlight.number || liveFlight.detail) && (
                <section className="card p-4 text-sm" aria-label="Live provider data">
                  <span className="pill bg-safe-light text-safe">● LIVE · Aviationstack</span>
                  {liveFlight.number
                    ? <p className="mt-2 text-ink-soft">{liveFlight.number} {liveFlight.operator ?? ''} · {liveFlight.status} · delay {liveFlight.delayMinutes ?? 'not reported'}{liveFlight.delayMinutes != null ? ' min' : ''}</p>
                    : <p className="mt-2 text-danger">⚠ {liveFlight.detail}</p>}
                </section>
              )}
            </div>
          </div>

          {lastOptions.length > 0 && !simulated && (
            <RecoveryPanel options={lastOptions} busy={busy} decided={decided}
              onApply={(id) => execute('apply_recovery', { recoveryId: id })} onKeep={() => setDecided('kept')} />
          )}
          {twin && <TwinPanel twin={twin} forecastSource={forecastSource} />}
        </div>

        {!presenting && (
          <div className="space-y-4">
            {Controls}
            {detail ?? (
              <section className="card p-4 text-sm text-ink-muted">
                Click any journey booking, pipeline stage, architecture component or connection to see what the backend did and where in the source it happened.
              </section>
            )}
          </div>
        )}
        {presenting && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Controls}
            {detail}
          </div>
        )}
      </div>
    </div>
  );

  if (presenting) {
    return (
      <div className="fixed inset-0 z-[120] overflow-y-auto bg-canvas p-6" role="dialog" aria-label="Presentation mode">
        <div className="mb-4 flex items-center gap-3">
          <h1 className="font-display text-2xl font-extrabold text-ink">Safar Sathi — Live Journey Pipeline</h1>
          <span className="pill bg-safe-light text-safe">● LIVE SYSTEM</span>
          <span className="text-sm text-ink-muted">Intelligent Journey Protection</span>
        </div>
        {body}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1800px] animate-fade-in">
      <header className="mb-5 flex flex-wrap items-center gap-3">
        <LogoMark className="h-9 w-14" />
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold leading-tight text-ink sm:text-[30px]">Safar Sathi — Live Journey Pipeline</h1>
          <p className="text-sm text-ink-muted">What happens in the real world, what Safar Sathi does about it — traced as it runs.</p>
        </div>
        <span className={cn('pill ml-auto', online ? 'bg-safe-light text-safe' : online === false ? 'bg-danger-light text-danger' : 'bg-canvas text-ink-muted')}>
          {online ? '● LIVE SYSTEM · backend connected' : online === false ? '× Backend not reachable' : 'Connecting…'}
        </span>
      </header>
      {body}
    </div>
  );
}
