import { useApp } from '@/store/AppContext';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/status';
import { TrendingDown, AlertTriangle, ShieldAlert, DollarSign } from 'lucide-react';

const impactLevelStyles: Record<string, string> = {
  low: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600',
  medium: 'border-amber-500/30 bg-amber-500/10 text-amber-600',
  high: 'border-red-500/30 bg-red-500/10 text-red-600',
  critical: 'border-red-500/30 bg-red-500/10 text-red-600',
};

export function ImpactAnalysisPanel() {
  const { activeDisruption, trip, phase } = useApp();

  if (!activeDisruption) return null;

  const primaryNode = trip.nodes.find((n) => n.id === activeDisruption.primaryNodeId);
  const steps = activeDisruption.cascadeSteps;

  return (
    <div className="glass-strong flex h-full w-full flex-col rounded-xl border-red-500/20 animate-slide-in-right">
      <div className="border-b border-ink-700 p-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-red-600" />
          <h2 className="text-sm font-semibold text-ink-100">Disruption Analysis</h2>
        </div>
        <div className={cn('mt-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5', impactLevelStyles[activeDisruption.impactLevel])}>
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-current" />
          <span className="text-[10px] font-bold">{activeDisruption.impactLevel.toUpperCase()} DISRUPTION</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        <div>
          <SectionLabel>Primary Disruption</SectionLabel>
          <div className="mt-1.5 rounded-lg border border-ink-700 bg-ink-900 p-3">
            <div className="text-sm font-medium text-ink-100">{primaryNode?.title ?? activeDisruption.primaryNodeId}</div>
            <div className="mt-1 text-xs text-orange-600">{activeDisruption.label}</div>
          </div>
        </div>

        <div>
          <SectionLabel>Impact & Exposure</SectionLabel>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            <StatCard icon={<AlertTriangle className="h-4 w-4 text-amber-600" />} label="Direct impact" value={`${activeDisruption.directImpact} booking`} />
            <StatCard icon={<TrendingDown className="h-4 w-4 text-red-600" />} label="Downstream impact" value={`${activeDisruption.downstreamImpact} bookings`} />
            <StatCard icon={<DollarSign className="h-4 w-4 text-red-600" />} label="Financial exposure" value={formatCurrency(activeDisruption.financialExposure)} />
            <StatCard icon={<DollarSign className="h-4 w-4 text-amber-600" />} label="Refund exposure" value={formatCurrency(activeDisruption.refundExposure)} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <SectionLabel>Failure Cascade</SectionLabel>
            <span className="text-[10px] text-ink-500">{steps.length} steps</span>
          </div>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold',
                      i === 0
                        ? 'border-orange-500/40 bg-orange-500/10 text-orange-600'
                        : i < 3
                        ? 'border-red-500/40 bg-red-500/10 text-red-600'
                        : 'border-amber-500/40 bg-amber-500/10 text-amber-600'
                    )}
                  >
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && <div className="h-6 w-px bg-gradient-to-b from-ink-600 to-transparent" />}
                </div>
                <span className="pt-1 text-xs text-ink-200">{step.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-accent-500/20 bg-accent-500/5 p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-accent-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
            </span>
            <span className="text-xs font-medium text-accent-700">
              {phase === 'analyzing' ? 'Analyzing impact...' : phase === 'recovering' ? 'Recovery plans generated' : 'Generating recovery plans...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{children}</h3>;
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900 p-3">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] text-ink-500">{label}</span>
      </div>
      <div className="mt-1 text-sm font-semibold text-ink-100">{value}</div>
    </div>
  );
}
