import type { DigitalTwinSimulation, TwinStateSummary } from '@/services/api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatINR } from '@/lib/journey';
import { asStatus } from '@/lib/digitalTwin';
import { cn } from '@/lib/utils';
import { ArrowRight, CloudLightning, Radio, ShieldCheck } from 'lucide-react';

function StateColumn({ title, icon: Icon, state, tone }: { title: string; icon: typeof Radio; state: TwinStateSummary; tone: 'live' | 'twin' }) {
  const healthTone = state.healthScore >= 80 ? 'text-safe' : state.healthScore >= 60 ? 'text-risk-dark' : 'text-danger';
  return (
    <div className={cn('rounded-tile border p-4', tone === 'twin' ? 'border-danger/25 bg-danger-light/40' : 'border-line bg-canvas/60')}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        <Icon className="h-4 w-4" aria-hidden="true" /> {title}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <dt className="text-[11px] text-ink-muted">Health</dt>
          <dd className={cn('font-display text-2xl font-extrabold', healthTone)}>{state.healthScore}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-muted">At risk</dt>
          <dd className="font-display text-2xl font-extrabold text-ink">{state.atRiskCommitments}<span className="text-sm font-semibold text-ink-muted">/{state.totalCommitments}</span></dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-muted">Exposure</dt>
          <dd className="font-display text-lg font-extrabold text-ink">{formatINR(state.costExposure)}</dd>
        </div>
      </dl>
    </div>
  );
}

/** Live itinerary vs its weather-stressed Digital Twin, booking by booking. */
export function DigitalTwinComparison({ sim }: { sim: DigitalTwinSimulation }) {
  const risks = new Map(sim.risks.map((r) => [r.nodeId, r]));
  const nodes = sim.nodes.filter((n) => n.category !== 'connection');
  return (
    <section className="card p-5" aria-labelledby="twin-compare-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="twin-compare-title" className="section-title">Live vs Digital Twin</h2>
        <span className={cn('pill', sim.healthDelta < 0 ? 'bg-danger-light text-danger' : 'bg-safe-light text-safe')}>
          Health {sim.healthDelta > 0 ? '+' : ''}{sim.healthDelta}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <StateColumn title="Live itinerary" icon={ShieldCheck} state={sim.live} tone="live" />
        <StateColumn title={`Twin · ${sim.scenarioName}`} icon={CloudLightning} state={sim.twin} tone="twin" />
      </div>

      <ul className="mt-4 divide-y divide-line" aria-label="Booking comparison">
        {nodes.map((n) => {
          const risk = risks.get(n.nodeId);
          const twin = asStatus(n.twinStatus);
          return (
            <li key={n.nodeId} className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-semibold text-ink">{n.title}</span>
                  {n.directHit && <span className="pill bg-ai-light text-ai">Direct hit · {n.driver}</span>}
                  {n.delayMinutes > 0 && <span className="pill bg-risk-light text-risk-dark">+{n.delayMinutes} min</span>}
                </div>
                {n.reason && twin !== 'healthy' && <p className="mt-1 text-[13px] leading-snug text-ink-muted">{n.reason}</p>}
                {risk && (
                  <div className="mt-2 flex items-center gap-2 text-[12px] text-ink-soft">
                    <span className="w-36 shrink-0 font-medium">{risk.label}</span>
                    <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-canvas" aria-hidden="true">
                      <span className="absolute inset-y-0 rounded-full bg-danger/25" style={{ left: `${risk.low * 100}%`, width: `${(risk.high - risk.low) * 100}%` }} />
                      <span className="absolute inset-y-0 w-1 rounded-full bg-danger" style={{ left: `calc(${risk.probability * 100}% - 2px)` }} />
                    </span>
                    <span className="w-24 shrink-0 text-right font-mono">{Math.round(risk.probability * 100)}% <span className="text-ink-faint">({Math.round(risk.low * 100)}–{Math.round(risk.high * 100)})</span></span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <StatusBadge status={asStatus(n.liveStatus)} />
                <ArrowRight className="h-3.5 w-3.5 text-ink-faint" aria-hidden="true" />
                <StatusBadge status={twin} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
