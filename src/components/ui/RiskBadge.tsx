import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
  percent?: number;
  className?: string;
}

export function RiskBadge({ level, percent, className }: RiskBadgeProps) {
  const colors = {
    low: 'text-emerald-700 bg-emerald-500/10 border-emerald-500/30',
    medium: 'text-amber-700 bg-amber-500/10 border-amber-500/30',
    high: 'text-red-700 bg-red-500/10 border-red-500/30',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium', colors[level], className)}>
      {percent !== undefined && <span className="font-mono">{percent}%</span>}
      {level.toUpperCase()} RISK
    </span>
  );
}
