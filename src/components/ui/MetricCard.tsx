import { cn } from '@/lib/utils';
import { CountUp } from '@/components/ui/CountUp';

interface MetricCardProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  accent?: 'default' | 'green' | 'amber' | 'red' | 'cyan';
  animate?: boolean;
  className?: string;
}

export function MetricCard({ value, label, prefix, suffix, icon, accent = 'default', animate = true, className }: MetricCardProps) {
  const accents = {
    default: 'text-ink-100',
    green: 'text-emerald-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
    cyan: 'text-accent-600',
  };
  const iconBadges = {
    default: 'bg-ink-800 border-ink-600 text-ink-400',
    green: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-600',
    red: 'bg-red-500/10 border-red-500/30 text-red-600',
    cyan: 'bg-accent-500/10 border-accent-500/30 text-accent-600',
  };

  return (
    <div
      className={cn(
        'glass rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-500/40 hover:shadow-lg',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className={cn('text-2xl font-bold tracking-tight', accents[accent])}>
            {animate ? <CountUp value={value} prefix={prefix} suffix={suffix} /> : `${prefix}${value.toLocaleString('en-IN')}${suffix}`}
          </div>
          <div className="mt-1 text-xs text-ink-400">{label}</div>
        </div>
        {icon && (
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border', iconBadges[accent])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
