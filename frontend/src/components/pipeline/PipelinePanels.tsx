import type { ReactNode } from 'react';
import type { Architecture, PipelineEvent } from '@/services/api';
import type { ItineraryNodeData, RecoveryOption } from '@/types';
import { JOURNEY_LABEL, PIPELINE_STAGES, STATUS_STYLE, nodeJourneyStatus, type LogLine, type RunSummary } from '@/lib/pipeline';
import { formatINR } from '@/lib/journey';
import { toConciseLine } from '@/lib/concise';
import { cn } from '@/lib/utils';
import { CheckCircle2, Loader2, ShieldAlert, X } from 'lucide-react';

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-line py-2 last:border-0">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{children}</dd>
    </div>
  );
}

const src = (file?: string | null, line?: number | null) => (file ? `${file}${line ? `:${line}` : ''}` : 'n/a');

export function DetailShell({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <aside className="card p-4" aria-label="Details">
      <div className="flex items-start justify-between gap-2">
        <h3 className="section-title">{title}</h3>
        <button type="button" onClick={onClose} className="rounded-lg p-1 text-ink-muted hover:bg-canvas" aria-label="Close details"><X className="h-4 w-4" /></button>
      </div>
      <dl className="mt-2">{children}</dl>
    </aside>
  );
}

export function NodeDetail({ node, event, engineEvent, simulated, onClose }: { node: ItineraryNodeData; event?: PipelineEvent; engineEvent?: PipelineEvent; simulated: boolean; onClose: () => void }) {
  const st = nodeJourneyStatus(node, event);
  return (
    <DetailShell title={node.title} onClose={onClose}>
      <Row label="Status"><span className={cn('pill', STATUS_STYLE[st].chip)}>{simulated && event ? '◌ SIMULATED · ' : ''}{JOURNEY_LABEL[st]}</span></Row>
      <Row label="Reason">{event?.reason ?? node.reason ?? 'No disruption has been evaluated for this booking yet.'}</Row>
      {event?.path && event.path.length > 1 && <Row label="Dependency path"><span className="font-mono text-[13px]">{event.path.join(' → ')}</span></Row>}
      {event && (event.delayMinutes || event.requiredBufferMinutes != null) && (
        <Row label="Impact">
          {event.delayMinutes ? `+${event.delayMinutes} min` : ''}
          {event.requiredBufferMinutes != null && ` · buffer ${event.availableBufferMinutes ?? 0} of ${event.requiredBufferMinutes} min needed`}
        </Row>
      )}
      {event?.relation && <Row label="Graph relation">{event.relation.replace(/_/g, ' ')}</Row>}
      <Row label="Booking">{node.subtitle} · {node.provider}</Row>
      <Row label="Decided by">{engineEvent ? <span className="font-mono text-[12px]">{engineEvent.function} · {src(engineEvent.file, engineEvent.line)}</span> : 'Not evaluated in this run'}</Row>
    </DetailShell>
  );
}

export function StageDetail({ stage, events, onClose }: { stage: string; events: PipelineEvent[]; onClose: () => void }) {
  const label = PIPELINE_STAGES.find((s) => s.id === stage)?.label ?? stage;
  const done = events.filter((e) => e.type === 'stage' && e.stage === stage && e.status !== 'running');
  return (
    <DetailShell title={label} onClose={onClose}>
      {done.length === 0 && <Row label="Status">Not executed in this run.</Row>}
      {done.slice(0, 12).map((e) => (
        <Row key={e.seq} label={`${e.status} · ${e.durationMs ?? 0} ms`}>
          <p className="font-medium">{e.message ?? e.function}</p>
          <p className="font-mono text-[11px] text-ink-muted">{e.function} · {src(e.file, e.line)}</p>
          {e.detail && <pre className="mt-1 max-h-28 overflow-auto rounded bg-canvas p-2 text-[11px] text-ink-soft">{JSON.stringify(e.detail, null, 1)}</pre>}
        </Row>
      ))}
      {done.length > 12 && <p className="pt-2 text-xs text-ink-muted">+{done.length - 12} more</p>}
    </DetailShell>
  );
}

export function ArchNodeDetail({ arch, id, onClose }: { arch: Architecture; id: string; onClose: () => void }) {
  const node = arch.nodes.find((n) => n.id === id);
  if (!node) return null;
  const label = (nid: string) => arch.nodes.find((n) => n.id === nid)?.label ?? nid;
  const incoming = arch.edges.filter((e) => e.target === id);
  const outgoing = arch.edges.filter((e) => e.source === id);
  const routes = arch.routes.filter((r) => r.router === id);
  return (
    <DetailShell title={node.label} onClose={onClose}>
      <Row label="Layer">{node.layer}</Row>
      {node.file && <Row label="File"><span className="font-mono text-[12px]">{node.file}</span></Row>}
      {node.description && <Row label="Purpose (from source)">{node.description}</Row>}
      {routes.length > 0 && (
        <Row label={`Endpoints (${routes.length})`}>
          <ul className="space-y-1">
            {routes.map((r) => (
              <li key={r.id} className="text-[12px]">
                <span className="font-mono font-semibold">{r.method} {r.path}</span>
                <span className="block text-ink-muted">{r.function}() · {r.auth ? 'traveller auth' : 'public'}{r.requestSchema ? ` · in: ${r.requestSchema}` : ''}{r.responseSchema ? ` · out: ${r.responseSchema}` : ''} · line {r.line}</span>
              </li>
            ))}
          </ul>
        </Row>
      )}
      <Row label={`Called by (${incoming.length})`}>{incoming.length ? incoming.map((e) => label(e.source)).join(', ') : '—'}</Row>
      <Row label={`Calls (${outgoing.length})`}>{outgoing.length ? outgoing.map((e) => label(e.target)).join(', ') : '—'}</Row>
      {node.functions.length > 0 && (
        <Row label="Functions">
          <span className="font-mono text-[11px] text-ink-soft">{node.functions.slice(0, 14).map((f) => `${f.name}:${f.line}`).join('  ')}</span>
        </Row>
      )}
    </DetailShell>
  );
}

export function ArchEdgeDetail({ arch, id, onClose }: { arch: Architecture; id: string; onClose: () => void }) {
  const edge = arch.edges.find((e) => e.id === id);
  if (!edge) return null;
  const label = (nid: string) => arch.nodes.find((n) => n.id === nid)?.label ?? nid;
  return (
    <DetailShell title={`${label(edge.source)} → ${label(edge.target)}`} onClose={onClose}>
      <Row label="Relationship">{edge.kind}</Row>
      {edge.calls.length === 0 && <Row label="Evidence">Host referenced by the provider&apos;s code or settings.</Row>}
      {edge.calls.map((c, i) => (
        <Row key={i} label={`Call site ${i + 1}`}>
          <span className="font-mono text-[12px]">{c.caller}() → {c.callee}</span>
          <span className="block font-mono text-[11px] text-ink-muted">{c.file}:{c.line}</span>
        </Row>
      ))}
    </DetailShell>
  );
}

const TONE: Record<LogLine['tone'], string> = { ok: 'text-safe', run: 'text-brand', warn: 'text-risk-dark', bad: 'text-danger', muted: 'text-ink-muted', sim: 'text-ai' };

export function ExecutionLog({ lines, large }: { lines: LogLine[]; large?: boolean }) {
  return (
    <section className="card flex min-h-0 flex-col p-4" aria-label="Execution log">
      <h3 className="section-title">Execution log</h3>
      <ol className={cn('mt-2 space-y-1 overflow-y-auto pr-1 font-mono scrollbar-thin', large ? 'max-h-[340px] text-[13px]' : 'max-h-[280px] text-[12px]')} aria-live="polite">
        {lines.length === 0 && <li className="text-ink-muted">Waiting for an event…</li>}
        {lines.map((l) => (
          <li key={l.key} className="flex gap-2">
            <span className="shrink-0 text-ink-faint">{l.time}</span>
            <span className={cn('w-3 shrink-0 text-center font-bold', TONE[l.tone])}>{l.icon}</span>
            <span className="min-w-0 break-words text-ink-soft">{l.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function StatusPanel({ summary, workflow, simulated, dataSource, paceMs }: { summary: RunSummary; workflow: string | null; simulated: boolean; dataSource: string | null; paceMs: number }) {
  const tone = summary.status === 'running' ? 'bg-brand-light text-brand' : summary.status === 'failed' ? 'bg-danger-light text-danger' : summary.status === 'completed' ? 'bg-safe-light text-safe' : 'bg-canvas text-ink-muted';
  return (
    <section className="card p-4" aria-label="Current execution">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="section-title">Current execution</h3>
        <span className={cn('pill', tone)}>{summary.status === 'running' && <Loader2 className="h-3 w-3 animate-spin" />}{summary.status.toUpperCase()}</span>
        {simulated && <span className="pill bg-ai-light text-ai">◌ SIMULATED</span>}
        {dataSource && <span className={cn('pill', dataSource === 'live' ? 'bg-safe-light text-safe' : 'bg-risk-light text-risk-dark')}>{dataSource === 'live' ? 'LIVE DATA' : 'DEMO DATA'}</span>}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div><dt className="text-[11px] text-ink-muted">Workflow</dt><dd className="font-semibold text-ink">{workflow ?? '—'}</dd></div>
        <div><dt className="text-[11px] text-ink-muted">Running now</dt><dd className="font-semibold text-ink">{summary.current ?? '—'}</dd></div>
        <div><dt className="text-[11px] text-ink-muted">Affected / at risk</dt><dd className="font-semibold text-danger">{summary.affected} / <span className="text-risk-dark">{summary.atRisk}</span></dd></div>
        <div><dt className="text-[11px] text-ink-muted">Unaffected</dt><dd className="font-semibold text-ink">{summary.unaffected}</dd></div>
        <div><dt className="text-[11px] text-ink-muted">Errors</dt><dd className={cn('font-semibold', summary.errors ? 'text-danger' : 'text-ink')}>{summary.errors}</dd></div>
        <div><dt className="text-[11px] text-ink-muted">Duration</dt><dd className="font-semibold text-ink">{summary.durationMs} ms</dd></div>
      </dl>
      {summary.completed.length > 0 && <p className="mt-3 text-[12px] text-ink-muted"><b className="text-ink-soft">Executed:</b> {summary.completed.join(' → ')}</p>}
      {summary.pending.length > 0 && <p className="mt-1 text-[12px] text-ink-faint"><b>Not reached yet:</b> {summary.pending.join(', ')}</p>}
      {paceMs > 0 && <p className="mt-2 text-[11px] text-ink-faint">Presentation pacing: the backend pauses {paceMs} ms before each stage; durations shown exclude the pause.</p>}
    </section>
  );
}

export function RecoveryPanel({ options, onApply, onKeep, busy, decided }: { options: RecoveryOption[]; onApply: (id: string) => void; onKeep: () => void; busy: boolean; decided: 'applied' | 'kept' | null }) {
  const feasible = options.filter((o) => o.feasible !== false);
  return (
    <section className="card p-4" aria-label="Recovery options">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="section-title">Recovery options</h3>
        <span className="pill bg-canvas text-ink-muted">RECOMMENDATION · nothing is booked until applied</span>
      </div>
      {feasible.length === 0 && (
        <p className="mt-3 flex gap-2 rounded-tile bg-risk-light px-3 py-2 text-sm text-risk-dark">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />⚠ Provider unavailable — {options[0]?.providerReason ?? options[0]?.description ?? 'no alternatives could be fetched.'}
        </p>
      )}
      <ul className="mt-3 space-y-2">
        {feasible.slice(0, 3).map((o, i) => (
          <li key={o.id} className={cn('rounded-tile border p-3', i === 0 ? 'border-brand/40 bg-brand-light/40' : 'border-line')}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-ink">{String.fromCharCode(65 + i)} · {o.name}</span>
              {i === 0 && <span className="pill bg-brand text-white">Best match</span>}
            </div>
            <p className="mt-0.5 text-[12px] text-ink-muted">{toConciseLine(o.description, 90)}</p>
            <p className="mt-1 text-[12px] text-ink-soft">
              Additional cost {o.costDelta > 0 ? `+${formatINR(o.costDelta)}` : 'none'} · time impact {o.timeImpactMinutes} min · {o.bookingsPreserved}/{o.totalBookings} bookings preserved
            </p>
            {!decided && <button type="button" disabled={busy} onClick={() => onApply(o.id)} className={cn('mt-2 px-3 py-1.5 text-xs', i === 0 ? 'btn-primary' : 'btn-outline')}>Apply recovery</button>}
          </li>
        ))}
      </ul>
      {!decided && feasible.length > 0 && <button type="button" onClick={onKeep} disabled={busy} className="btn-ghost mt-3 px-3 py-1.5 text-xs">Keep current plan</button>}
      {decided === 'applied' && <p className="mt-3 flex items-center gap-2 text-sm font-medium text-safe"><CheckCircle2 className="h-4 w-4" /> Recovery applied and journey re-validated.</p>}
      {decided === 'kept' && <p className="mt-3 text-sm text-ink-muted">Traveller kept the current plan — nothing was changed.</p>}
    </section>
  );
}

const FORECAST_LABEL: Record<string, string> = {
  'open-meteo': 'Open-Meteo (live forecast)',
  'open-meteo-current': 'Open-Meteo (current conditions; trip dates outside the 7-day window)',
  fallback: 'Open-Meteo unavailable → offline climatology',
  unavailable: 'no coordinates',
};

interface TwinResponse { live?: { healthScore: number }; twin?: { healthScore: number }; explanation?: string; explanationSource?: string; model?: string | null; mitigation?: string[]; options?: { name: string; description: string }[] }

export function TwinPanel({ twin, forecastSource }: { twin: TwinResponse; forecastSource: string | null }) {
  return (
    <section className="card p-4" aria-label="Digital Twin result">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="section-title">Digital Twin result</h3>
        <span className="pill bg-ai-light text-ai">◌ SIMULATED · sandbox copy</span>
        <span className="pill bg-canvas text-ink-muted">{twin.explanationSource === 'nugen' ? `Nugen · ${twin.model ?? 'model'}` : 'Heuristic reasoning (Nugen fallback)'}</span>
        {forecastSource && <span className="pill bg-canvas text-ink-muted">Forecast: {FORECAST_LABEL[forecastSource] ?? forecastSource}</span>}
      </div>
      {twin.live && twin.twin && <p className="mt-2 text-sm text-ink-soft">Journey health <b className="text-ink">{twin.live.healthScore}</b> → twin <b className="text-danger">{twin.twin.healthScore}</b> under heavy rain.</p>}
      {twin.explanation && <p className="mt-2 text-sm text-ink-soft">• {toConciseLine(twin.explanation, 140)}</p>}
      {twin.options && twin.options.length > 0 && <p className="mt-2 text-[12px] text-ink-muted">Preemptive plans: {twin.options.map((o) => o.name).join(' · ')}</p>}
    </section>
  );
}
