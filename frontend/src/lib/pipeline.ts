import type { PipelineEvent, PipelineRunState } from '@/services/api';
import type { ItineraryNodeData } from '@/types';

/** Pure helpers that turn the backend's execution trace into what the Live
 * Journey Pipeline shows. Every value here is derived from trace events the
 * backend emitted while the code ran - nothing is scheduled or invented. */

export const PIPELINE_STAGES = [
  { id: 'event', label: 'Real-world event', short: 'Event' },
  { id: 'api', label: 'API', short: 'API' },
  { id: 'router', label: 'Router', short: 'Router' },
  { id: 'service', label: 'Service', short: 'Service' },
  { id: 'database', label: 'Database', short: 'Database' },
  { id: 'dependency_graph', label: 'Dependency graph', short: 'Graph' },
  { id: 'impact_engine', label: 'Impact engine', short: 'Impact' },
  { id: 'intelligence', label: 'Digital Twin · Nugen', short: 'Twin/Nugen' },
  { id: 'provider', label: 'Providers', short: 'Providers' },
  { id: 'recovery', label: 'Recovery engine', short: 'Recovery' },
  { id: 'response', label: 'Response', short: 'Response' },
] as const;

export type StageId = (typeof PIPELINE_STAGES)[number]['id'];
export type StageStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface StageState {
  status: StageStatus;
  runs: number;
  failures: number;
  last: PipelineEvent | null;
  totalMs: number;
}

export function stageStates(events: PipelineEvent[]): Record<string, StageState> {
  const out: Record<string, StageState> = {};
  const open = new Map<string, string>(); // spanId -> stage
  for (const s of PIPELINE_STAGES) out[s.id] = { status: 'idle', runs: 0, failures: 0, last: null, totalMs: 0 };
  for (const e of events) {
    if (e.type !== 'stage' || !out[e.stage]) continue;
    const st = out[e.stage];
    if (e.status === 'running') {
      if (e.spanId) open.set(e.spanId, e.stage);
    } else {
      if (e.spanId) open.delete(e.spanId);
      st.runs += 1;
      st.totalMs += e.durationMs ?? 0;
      if (e.status === 'failed') st.failures += 1;
    }
    st.last = e;
  }
  for (const s of PIPELINE_STAGES) {
    const st = out[s.id];
    const running = [...open.values()].includes(s.id);
    st.status = running ? 'running' : st.failures && st.last?.status === 'failed' ? 'failed' : st.runs ? 'completed' : 'idle';
  }
  return out;
}

/** The journey's state: one node event per booking from the disruption's own propagation. */
export function nodeStates(events: PipelineEvent[]): Record<string, PipelineEvent> {
  const out: Record<string, PipelineEvent> = {};
  for (const e of events) if (e.type === 'node' && e.nodeId) out[e.nodeId] = e;
  return out;
}

export type JourneyStatus = 'normal' | 'delayed' | 'affected' | 'at-risk' | 'unaffected' | 'cancelled' | 'recovered';

export function journeyStatus(engineStatus: string, relation?: string): JourneyStatus {
  if (engineStatus === 'recovered') return 'recovered';
  if (engineStatus === 'cancelled') return 'cancelled';
  if (engineStatus === 'broken') return 'affected';
  if (engineStatus === 'at-risk') return 'at-risk';
  // Delayed by the event itself = DELAYED; shifted by something upstream = AFFECTED.
  if (engineStatus === 'delayed') return relation === 'affected' ? 'affected' : 'delayed';
  return relation ? 'unaffected' : 'normal';
}

export const JOURNEY_LABEL: Record<JourneyStatus, string> = {
  normal: 'On track', delayed: 'DELAYED', affected: 'AFFECTED', 'at-risk': 'AT RISK', unaffected: 'UNAFFECTED', cancelled: 'CANCELLED', recovered: 'RECOVERED',
};

export const STATUS_STYLE: Record<JourneyStatus, { card: string; chip: string; icon: string }> = {
  normal: { card: 'border-line', chip: 'bg-safe-light text-safe', icon: '✓' },
  unaffected: { card: 'border-line', chip: 'bg-canvas text-ink-muted', icon: '—' },
  delayed: { card: 'border-danger/50 ring-2 ring-danger/15', chip: 'bg-danger-light text-danger', icon: '!' },
  affected: { card: 'border-danger/40 ring-2 ring-danger/10', chip: 'bg-danger-light text-danger', icon: '!' },
  cancelled: { card: 'border-danger/60 ring-2 ring-danger/20', chip: 'bg-danger text-white', icon: '×' },
  'at-risk': { card: 'border-risk/50 ring-2 ring-risk/10', chip: 'bg-risk-light text-risk-dark', icon: '⚠' },
  recovered: { card: 'border-brand/40 ring-2 ring-brand/10', chip: 'bg-brand-light text-brand', icon: '✓' },
};

export function nodeJourneyStatus(node: ItineraryNodeData, event: PipelineEvent | undefined): JourneyStatus {
  if (event) return journeyStatus(event.status, event.relation);
  return journeyStatus(node.status, undefined);
}


export interface LogLine { key: string; time: string; icon: '✓' | '●' | '!' | '—' | '⚠' | '×' | '◌' | '→'; text: string; tone: 'ok' | 'run' | 'warn' | 'bad' | 'muted' | 'sim' }

const clock = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour12: false });

function dbWriteText(detail: Record<string, unknown> | null | undefined): string {
  const tables = (detail?.tables ?? {}) as Record<string, Record<string, number>>;
  return Object.entries(tables).map(([t, ops]) => `${t} (${Object.entries(ops).map(([op, n]) => `${n} ${op}`).join(', ')})`).join(', ');
}

/** Human log from real events; consecutive repeats of the same step are collapsed (×n). */
export function logLines(events: PipelineEvent[], simulated = false): LogLine[] {
  const lines: LogLine[] = [];
  let lastKey = '';
  for (const e of events) {
    let line: Omit<LogLine, 'key' | 'time'> | null = null;
    if (e.type === 'node') {
      const js = journeyStatus(e.status, e.relation);
      const title = e.title ?? e.nodeId ?? '';
      if (js === 'unaffected') line = { icon: '—', text: `${title} unaffected — ${e.reason ?? ''}`, tone: 'muted' };
      else if (js === 'at-risk') line = { icon: '⚠', text: `${title} at risk — ${e.reason ?? ''}`, tone: 'warn' };
      else line = { icon: simulated ? '◌' : '!', text: `${title} ${JOURNEY_LABEL[js].toLowerCase()} — ${e.reason ?? ''}`, tone: js === 'delayed' || js === 'affected' || js === 'cancelled' ? 'bad' : 'warn' };
    } else if (e.stage === 'api' && e.status === 'running') {
      line = { icon: '→', text: e.message ?? 'API request received', tone: 'run' };
    } else if (e.status === 'failed') {
      line = { icon: '×', text: `${e.message ?? e.function} failed${e.error ? ` (${e.error})` : ''}${e.httpStatus ? ` · HTTP ${e.httpStatus}` : ''}`, tone: 'bad' };
    } else if (e.status === 'completed') {
      if (e.stage === 'database' && (e.detail as Record<string, unknown> | null)?.operation === 'write') line = { icon: '✓', text: `Database write: ${dbWriteText(e.detail)}`, tone: 'ok' };
      else if (e.stage === 'database') line = { icon: '✓', text: `${e.message} (${(e.detail as Record<string, unknown> | null)?.rows ?? 0} rows)`, tone: 'ok' };
      else if (e.stage === 'api') continue; // the response line covers it
      else line = { icon: '✓', text: e.message ?? `${e.function} completed`, tone: e.stage === 'event' ? 'warn' : 'ok' };
    }
    if (!line) continue;
    const key = `${line.icon}|${line.text}`;
    const prev = lines[lines.length - 1];
    if (key === lastKey && prev) {
      const m = prev.text.match(/ ×(\d+)$/);
      const n = m ? Number(m[1]) + 1 : 2;
      prev.text = `${m ? prev.text.slice(0, -m[0].length) : prev.text} ×${n}`;
      continue;
    }
    lastKey = key;
    lines.push({ ...line, key: `${e.seq}`, time: clock(e.timestamp) });
  }
  return lines;
}

export interface RunSummary {
  status: 'idle' | 'running' | 'completed' | 'failed';
  current: string | null;
  completed: string[];
  pending: string[];
  affected: number;
  atRisk: number;
  unaffected: number;
  errors: number;
  durationMs: number;
}

export function runSummary(run: PipelineRunState | null): RunSummary {
  if (!run) return { status: 'idle', current: null, completed: [], pending: [], affected: 0, atRisk: 0, unaffected: 0, errors: 0, durationMs: 0 };
  const stages = stageStates(run.events);
  const nodes = Object.values(nodeStates(run.events));
  const used = PIPELINE_STAGES.filter((s) => stages[s.id].status !== 'idle');
  const running = PIPELINE_STAGES.find((s) => stages[s.id].status === 'running');
  const statuses = nodes.map((n) => journeyStatus(n.status, n.relation));
  return {
    status: run.error ? 'failed' : run.done ? 'completed' : 'running',
    current: running ? running.label : null,
    completed: used.filter((s) => stages[s.id].status === 'completed' || stages[s.id].status === 'failed').map((s) => s.label),
    pending: run.done ? [] : PIPELINE_STAGES.filter((s) => stages[s.id].status === 'idle').map((s) => s.label),
    affected: statuses.filter((s) => s === 'affected' || s === 'delayed' || s === 'cancelled').length,
    atRisk: statuses.filter((s) => s === 'at-risk').length,
    unaffected: statuses.filter((s) => s === 'unaffected').length,
    errors: run.events.filter((e) => e.type === 'stage' && e.status === 'failed').length,
    durationMs: run.events.length ? Math.round(run.events[run.events.length - 1].elapsedMs) : 0,
  };
}

/** Architecture nodes touched by the run (modules, routers, database, providers). */
export function activeComponents(events: PipelineEvent[]): { done: Set<string>; running: Set<string>; failed: Set<string>; routes: Set<string> } {
  const done = new Set<string>();
  const running = new Map<string, string>();
  const failed = new Set<string>();
  const routes = new Set<string>();
  for (const e of events) {
    if (e.type !== 'stage' || !e.component) continue;
    if (e.component.startsWith('api:')) routes.add(e.component);
    if (e.status === 'running' && e.spanId) running.set(e.spanId, e.component);
    else {
      if (e.spanId) running.delete(e.spanId);
      if (e.status === 'failed') failed.add(e.component);
      else done.add(e.component);
    }
  }
  return { done, running: new Set(running.values()), failed, routes };
}
