import { cn } from '@/lib/utils';
import { formatCurrency, formatDuration } from '@/lib/status';
import type { RecoveryOption } from '@/types';
import { Check, Eye, Sparkles, TrendingUp, Clock, Shield, Wallet, RotateCcw } from 'lucide-react';
import { ScoreBar } from '@/components/ui/ScoreBar';

interface RecoveryCardProps {
  option: RecoveryOption;
  rank: number;
  selected: boolean;
  onSelect: () => void;
  onApply: () => void;
  onDetails: () => void;
  className?: string;
}

const tagColors = {
  cyan: 'border-accent-500/30 bg-accent-500/10 text-accent-700',
  green: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
  blue: 'border-electric-500/30 bg-electric-500/10 text-electric-700',
  violet: 'border-violet-500/30 bg-violet-500/10 text-violet-700',
};

export function RecoveryCard({ option, rank, selected, onSelect, onApply, onDetails, className }: RecoveryCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'group relative cursor-pointer rounded-xl border p-5 transition-all duration-300 animate-fade-in-up',
        selected ? 'border-accent-500/50 bg-accent-500/5 shadow-glow-cyan' : 'border-ink-700 bg-ink-900 hover:border-ink-600 hover:bg-white',
        className
      )}
      style={{ animationDelay: `${rank * 100}ms` }}
    >
      {rank === 0 && (
        <div className="absolute -top-2 left-4 flex items-center gap-1 rounded-full bg-gradient-to-r from-accent-500 to-electric-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-glow-cyan">
          <Sparkles className="h-2.5 w-2.5" />
          RECOMMENDED
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn('rounded-md border px-2 py-0.5 text-[9px] font-bold tracking-wider', tagColors[option.tagColor])}>
              {option.tag}
            </span>
            <span className="text-[10px] text-ink-500">#{rank + 1}</span>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-ink-100">{option.name}</h3>
          <p className="mt-1 text-xs text-ink-400 line-clamp-2">{option.description}</p>
        </div>

        <div className="ml-4 flex flex-col items-end">
          <div className="text-2xl font-bold text-ink-100">{option.score}</div>
          <div className="text-[10px] text-ink-500">/ 100</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Metric icon={<Wallet className="h-3.5 w-3.5" />} label="Cost" value={option.costDelta > 0 ? `+${formatCurrency(option.costDelta)}` : formatCurrency(Math.abs(option.costDelta))} valueClass={option.costDelta > 0 ? 'text-amber-600' : 'text-emerald-600'} />
        <Metric icon={<Clock className="h-3.5 w-3.5" />} label="Time" value={formatDuration(option.timeImpactMinutes)} />
        <Metric icon={<Shield className="h-3.5 w-3.5" />} label="Preserved" value={`${option.bookingsPreserved}/${option.totalBookings}`} valueClass="text-emerald-600" />
        <Metric icon={<TrendingUp className="h-3.5 w-3.5" />} label="Risk" value={option.residualRisk === 'low' ? 'Low' : option.residualRisk === 'medium' ? 'Medium' : 'High'} valueClass={option.residualRisk === 'low' ? 'text-emerald-600' : option.residualRisk === 'medium' ? 'text-amber-600' : 'text-red-600'} />
        {option.refundRecovered > 0 && (
          <Metric icon={<RotateCcw className="h-3.5 w-3.5" />} label="Refund" value={formatCurrency(option.refundRecovered)} valueClass="text-emerald-600" />
        )}
      </div>

      {selected && (
        <div className="mt-4 border-t border-ink-700 pt-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <ScoreBar label="Cost efficiency" value={option.scoreBreakdown.cost} color="emerald" />
            <ScoreBar label="Speed" value={option.scoreBreakdown.speed} color="cyan" />
            <ScoreBar label="Preservation" value={option.scoreBreakdown.preservation} color="blue" />
            <ScoreBar label="Comfort" value={option.scoreBreakdown.comfort} color="amber" />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onApply(); }}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-accent-500 to-electric-600 px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110 shadow-glow-cyan"
        >
          <Check className="h-3.5 w-3.5" />
          Apply Recovery
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDetails(); }}
          className="flex items-center gap-1.5 rounded-lg border border-ink-600 px-3 py-1.5 text-xs text-ink-300 transition hover:bg-ink-800 hover:text-ink-100"
        >
          <Eye className="h-3.5 w-3.5" />
          Details
        </button>
      </div>
    </div>
  );
}

function Metric({ icon, label, value, valueClass }: { icon: React.ReactNode; label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-white/60 p-2">
      <div className="flex items-center gap-1 text-ink-500">
        {icon}
        <span className="text-[10px]">{label}</span>
      </div>
      <div className={cn('mt-0.5 text-sm font-semibold', valueClass ?? 'text-ink-100')}>{value}</div>
    </div>
  );
}
