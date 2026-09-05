import { useState, useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { useToast } from '@/components/ui/ToastProvider';
import { RecoveryCard } from '@/components/recovery/RecoveryCard';
import { RecoveryComparison } from '@/components/recovery/RecoveryComparison';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDuration } from '@/lib/status';
import type { RecoveryOption } from '@/types';
import { LifeBuoy, AlertCircle, GitCompare, Check, ShieldCheck } from 'lucide-react';

export function RecoveryCenter() {
  const { recoveryOptions, selectedRecovery, selectRecovery, applyRecoveryPlan, activeDisruption, phase, appliedRecovery } = useApp();
  const { addToast } = useToast();
  const [compareOpen, setCompareOpen] = useState(false);
  const [detailsOption, setDetailsOption] = useState<RecoveryOption | null>(null);

  const sortedOptions = useMemo(() => {
    return [...recoveryOptions].sort((a, b) => b.score - a.score);
  }, [recoveryOptions]);

  const handleApply = async (option: RecoveryOption) => {
    try {
      await applyRecoveryPlan(option.id);
      addToast('success', 'Recovery Applied', `${option.bookingsPreserved}/${option.totalBookings} itinerary commitments preserved`);
    } catch {
      addToast('error', 'Could Not Apply Recovery', 'The backend may be unavailable. Please try again.');
    }
  };

  if (recoveryOptions.length === 0 && phase !== 'recovered') {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-ink-700 bg-ink-900">
            <LifeBuoy className="h-7 w-7 text-ink-500" />
          </div>
          <h2 className="text-lg font-semibold text-ink-100">No Active Disruption</h2>
          <p className="mt-2 text-sm text-ink-400">Recovery strategies will appear here when a disruption is detected. Try simulating a disruption from the command center.</p>
        </div>
      </div>
    );
  }

  if (phase === 'recovered' && appliedRecovery) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-accent-500/30 bg-accent-500/5 p-6 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/20">
              <Check className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink-100">Recovery Applied Successfully</h2>
              <p className="mt-0.5 text-sm text-ink-300">Your itinerary has been recalculated and stabilized.</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ResultStat label="Commitments preserved" value={`${appliedRecovery.bookingsPreserved}/${appliedRecovery.totalBookings}`} color="text-emerald-600" />
            <ResultStat label="Additional cost" value={`+${formatCurrency(appliedRecovery.costDelta)}`} color="text-amber-600" />
            <ResultStat label="Time impact" value={formatDuration(appliedRecovery.timeImpactMinutes)} color="text-orange-600" />
            <ResultStat label="Residual risk" value={appliedRecovery.residualRisk === 'low' ? 'Low' : 'Medium'} color="text-emerald-600" />
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/60 p-3">
            <ShieldCheck className="h-4 w-4 text-accent-600 shrink-0" />
            <p className="text-xs text-ink-300">Recovery plan: <span className="text-ink-100 font-medium">{appliedRecovery.name}</span></p>
          </div>
        </div>

        <div className="rounded-xl border border-ink-700 bg-ink-900 p-5">
          <h3 className="text-sm font-semibold text-ink-100 mb-3">Changes Applied</h3>
          <div className="space-y-2">
            {appliedRecovery.changes.map((change, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-ink-700 bg-white/60 p-3 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <span className={cn(
                  'rounded-md border px-2 py-0.5 text-[9px] font-bold',
                  change.changeType === 'preserved' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700' :
                  change.changeType === 'rebooked' ? 'border-accent-500/30 bg-accent-500/10 text-accent-700' :
                  change.changeType === 'rescheduled' ? 'border-amber-500/30 bg-amber-500/10 text-amber-700' :
                  'border-red-500/30 bg-red-500/10 text-red-700'
                )}>
                  {change.changeType.toUpperCase()}
                </span>
                <div className="flex-1">
                  <div className="text-xs font-medium text-ink-100">{change.nodeLabel}</div>
                  <div className="text-[11px] text-ink-400">{change.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <LifeBuoy className="h-5 w-5 text-accent-600" />
          <h1 className="text-xl font-bold text-ink-100">Recovery Center</h1>
        </div>
        <p className="mt-1 text-sm text-ink-400">Intelligent alternatives generated from your current itinerary.</p>
      </div>

      {activeDisruption && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <div className="flex-1">
            <span className="text-xs text-ink-500">DISRUPTION: </span>
            <span className="text-sm font-medium text-ink-100">{activeDisruption.label}</span>
          </div>
          <span className="text-xs text-red-600 font-medium">{activeDisruption.impactLevel.toUpperCase()}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-100">
          {recoveryOptions.length} recovery strategies found
        </h2>
        <button
          onClick={() => setCompareOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-ink-600 px-3 py-1.5 text-xs text-ink-300 transition hover:bg-ink-800 hover:text-ink-100"
        >
          <GitCompare className="h-3.5 w-3.5" />
          Compare All
        </button>
      </div>

      <div className="space-y-3">
        {sortedOptions.map((option, i) => (
          <RecoveryCard
            key={option.id}
            option={option}
            rank={i}
            selected={selectedRecovery === option.id}
            onSelect={() => selectRecovery(option.id)}
            onApply={() => handleApply(option)}
            onDetails={() => setDetailsOption(option)}
          />
        ))}
      </div>

      <RecoveryComparison open={compareOpen} onClose={() => setCompareOpen(false)} options={sortedOptions} onSelect={selectRecovery} />

      <Modal open={!!detailsOption} onClose={() => setDetailsOption(null)} title="Recovery Plan Details" subtitle={detailsOption?.name} className="max-w-2xl">
        {detailsOption && (
          <div className="space-y-4">
            <p className="text-sm text-ink-300">{detailsOption.description}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <DetailStat label="Cost" value={`+${formatCurrency(detailsOption.costDelta)}`} />
              <DetailStat label="Time impact" value={formatDuration(detailsOption.timeImpactMinutes)} />
              <DetailStat label="Bookings" value={`${detailsOption.bookingsPreserved}/${detailsOption.totalBookings}`} />
              <DetailStat label="Refund recovered" value={detailsOption.refundRecovered > 0 ? formatCurrency(detailsOption.refundRecovered) : '—'} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-ink-100">Itinerary Changes</h4>
              {detailsOption.changes.map((change, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-ink-700 bg-white/60 p-3">
                  <span className={cn(
                    'rounded-md border px-2 py-0.5 text-[9px] font-bold',
                    change.changeType === 'preserved' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700' :
                    change.changeType === 'rebooked' ? 'border-accent-500/30 bg-accent-500/10 text-accent-700' :
                    change.changeType === 'rescheduled' ? 'border-amber-500/30 bg-amber-500/10 text-amber-700' :
                    'border-red-500/30 bg-red-500/10 text-red-700'
                  )}>
                    {change.changeType.toUpperCase()}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-ink-100">{change.nodeLabel}</div>
                    <div className="text-[11px] text-ink-400">{change.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { handleApply(detailsOption); setDetailsOption(null); }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-500 to-electric-600 py-2.5 text-sm font-medium text-white transition hover:brightness-110 shadow-glow-cyan"
            >
              <Check className="h-4 w-4" />
              Apply This Recovery
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ResultStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-white/60 p-3">
      <div className="text-[10px] text-ink-500">{label}</div>
      <div className={cn('mt-0.5 text-lg font-bold', color)}>{value}</div>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900 p-3">
      <div className="text-[10px] text-ink-500">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-ink-100">{value}</div>
    </div>
  );
}
