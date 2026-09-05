import { useState, useEffect } from 'react';
import { useApp } from '@/store/AppContext';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { ScoreBar } from '@/components/ui/ScoreBar';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import * as api from '@/services/api';
import { cn } from '@/lib/utils';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import type { RiskCardData, Alert } from '@/types';
import { ShieldAlert, AlertTriangle, Info, ArrowRight, TrendingDown, Cloud, Clock, Building2, Link2 } from 'lucide-react';

/** Below-threshold risk cards are still real data, just not surfaced as
 * needing attention right now - controlled by the Settings > Risk Thresholds
 * sliders (shared via the same localStorage key). */
function meetsThreshold(card: RiskCardData, thresholds: { connection: number; schedule: number }): boolean {
  const threshold = card.riskType.toLowerCase().includes('connection') ? thresholds.connection : thresholds.schedule;
  return card.riskPercent >= threshold;
}

export function RiskIntelligence() {
  const { tripId, trip } = useApp();
  const [risk, setRisk] = useState<api.RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thresholds] = useLocalStorageState('triprescue.settings.riskThresholds', { connection: 60, schedule: 50 });

  const load = () => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .getRiskAnalysis(tripId)
      .then((data) => {
        if (!cancelled) setRisk(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setRisk(null);
          setError(err instanceof api.ApiError ? err.message : 'Could not load risk analysis.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  };

  useEffect(load, [tripId, trip.healthScore]);
  // Re-fetch whenever the trip's health score changes - that's the signal
  // that a disruption or recovery has changed the underlying risk picture.

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <h1 className="text-xl font-bold text-ink-100">Risk Intelligence</h1>
        </div>
        <p className="mt-1 text-sm text-ink-400">Proactive analysis of your itinerary's vulnerabilities.</p>
      </div>

      {error ? (
        <div className="glass flex flex-col items-center gap-3 rounded-xl border border-red-500/20 p-8 text-center">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <p className="text-sm text-ink-100">{error}</p>
          <button
            onClick={load}
            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-500/10"
          >
            Retry
          </button>
        </div>
      ) : loading || !risk ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-56 rounded-xl lg:col-span-1" />
          <Skeleton className="h-56 rounded-xl lg:col-span-2" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="glass rounded-xl p-5 flex flex-col items-center justify-center">
              <ScoreRing score={risk.score.tripResilience} size={140} label="Resilience Score" />
              <div className="mt-3 text-center">
                <div className="text-sm font-semibold text-ink-100">Trip Resilience Score</div>
                <div className="mt-0.5 text-xs text-ink-400">Overall vulnerability assessment</div>
              </div>
            </div>

            <div className="glass rounded-xl p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-ink-100 mb-4">Risk Breakdown</h3>
              <div className="space-y-3">
                <ScoreBar label="Connection Risk" value={risk.score.connectionRisk} color="red" />
                <ScoreBar label="Schedule Risk" value={risk.score.scheduleRisk} color="amber" />
                <ScoreBar label="Vendor Risk" value={risk.score.vendorRisk} color="amber" />
                <ScoreBar label="Weather Risk" value={risk.score.weatherRisk} color="cyan" />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink-100">Risky Itinerary Nodes</h2>
              {(() => {
                const hidden = risk.cards.length - risk.cards.filter((c) => meetsThreshold(c, thresholds)).length;
                return hidden > 0 ? (
                  <span className="text-[10px] text-ink-500">
                    {hidden} below your alert threshold (see Settings)
                  </span>
                ) : null;
              })()}
            </div>
            {(() => {
              const shown = risk.cards.filter((c) => meetsThreshold(c, thresholds));
              return shown.length === 0 ? (
                <div className="rounded-xl border border-dashed border-ink-600 bg-ink-900 p-6 text-center text-sm text-ink-400">
                  No significant risks detected right now.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {shown.map((card, i) => (
                    <RiskCardItem key={card.nodeId} card={card} delay={i * 100} />
                  ))}
                </div>
              );
            })()}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-ink-100 mb-3">Proactive Alerts</h2>
            <div className="space-y-2">
              {risk.alerts.map((alert, i) => (
                <AlertCard key={alert.id} alert={alert} delay={i * 80} />
              ))}
            </div>
          </div>
        </>
      )}

      {risk && (
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-accent-600" />
            <h3 className="text-sm font-semibold text-ink-100">What Could Go Wrong?</h3>
          </div>
          {risk.cards.length === 0 ? (
            <p className="text-xs text-ink-400">No elevated risks detected in your current itinerary.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[...risk.cards]
                .sort((a, b) => b.riskPercent - a.riskPercent)
                .slice(0, 4)
                .map((card) => (
                  <ScenarioCard
                    key={card.nodeId}
                    icon={<ScenarioIcon riskType={card.riskType} />}
                    title={card.nodeLabel}
                    description={card.recommendation}
                    impact={`${card.downstreamImpact} downstream booking(s) · ${card.riskPercent}% risk`}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScenarioIcon({ riskType }: { riskType: string }) {
  const type = riskType.toLowerCase();
  if (type.includes('weather')) return <Cloud className="h-4 w-4 text-accent-600" />;
  if (type.includes('hotel') || type.includes('vendor')) return <Building2 className="h-4 w-4 text-ink-500" />;
  if (type.includes('connection')) return <Link2 className="h-4 w-4 text-amber-600" />;
  return <Clock className="h-4 w-4 text-amber-600" />;
}

function RiskCardItem({ card, delay }: { card: RiskCardData; delay: number }) {
  return (
    <div className="glass rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-ink-100">{card.nodeLabel}</div>
          <div className="mt-0.5 text-[10px] font-medium text-ink-400">{card.riskType}</div>
        </div>
        <RiskBadge level={card.riskLevel} percent={card.riskPercent} />
      </div>

      <div className="mt-3 space-y-2 text-xs">
        {card.buffer && (
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Buffer</span>
            <span className="text-ink-200">{card.buffer}</span>
          </div>
        )}
        {card.recommended && (
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Recommended</span>
            <span className="text-emerald-600">{card.recommended}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-ink-500">Historical risk</span>
          <span className={cn(card.historicalRisk === 'Elevated' ? 'text-amber-600' : 'text-emerald-600')}>{card.historicalRisk}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink-500">Downstream impact</span>
          <span className="text-ink-200">{card.downstreamImpact} bookings</span>
        </div>
      </div>

      <div className="mt-3 border-t border-ink-700 pt-3">
        <div className="flex items-start gap-2">
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-accent-600 mt-0.5" />
          <p className="text-[11px] text-ink-300">{card.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

function AlertCard({ alert, delay }: { alert: Alert; delay: number }) {
  const severityIcons: Record<string, React.ReactNode> = {
    high: <AlertTriangle className="h-4 w-4 text-red-600" />,
    medium: <AlertTriangle className="h-4 w-4 text-amber-600" />,
    low: <Info className="h-4 w-4 text-ink-400" />,
    info: <Info className="h-4 w-4 text-accent-600" />,
  };

  const severityBorders: Record<string, string> = {
    high: 'border-red-500/20',
    medium: 'border-amber-500/20',
    low: 'border-ink-700',
    info: 'border-accent-500/20',
  };

  return (
    <div className={cn('glass rounded-xl border p-4 animate-fade-in-up', severityBorders[alert.severity])} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{severityIcons[alert.severity]}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn(
              'rounded px-1.5 py-0.5 text-[9px] font-bold',
              alert.severity === 'high' ? 'bg-red-500/10 text-red-700' : alert.severity === 'medium' ? 'bg-amber-500/10 text-amber-700' : 'bg-ink-700 text-ink-500'
            )}>
              {alert.severity.toUpperCase()}
            </span>
            <span className="text-[10px] text-ink-500">{alert.timestamp}</span>
          </div>
          <p className="mt-1.5 text-sm text-ink-100">{alert.title}</p>
          <p className="mt-0.5 text-xs text-ink-400">{alert.reason}</p>
          <div className="mt-2 flex items-center gap-2 text-[11px]">
            <TrendingDown className="h-3 w-3 text-ink-500" />
            <span className="text-ink-300">{alert.impact}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px]">
            <ArrowRight className="h-3 w-3 text-accent-600" />
            <span className="text-accent-700">{alert.action}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScenarioCard({ icon, title, description, impact }: { icon: React.ReactNode; title: string; description: string; impact: string }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900 p-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium text-ink-100">{title}</span>
      </div>
      <p className="mt-2 text-[11px] text-ink-400">{description}</p>
      <div className="mt-2 text-[10px] text-amber-700">{impact}</div>
    </div>
  );
}
