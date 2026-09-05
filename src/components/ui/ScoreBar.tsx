import { cn } from '@/lib/utils';

interface ScoreBarProps {
  label: string;
  value: number;
  max?: number;
  color?: 'emerald' | 'amber' | 'red' | 'cyan' | 'blue';
  className?: string;
}

export function ScoreBar({ label, value, max = 100, color = 'cyan', className }: ScoreBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  const colors = {
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    red: 'bg-red-400',
    cyan: 'bg-accent-400',
    blue: 'bg-electric-500',
  };

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-ink-300">{label}</span>
        <span className="font-mono text-ink-100">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink-700">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', colors[color])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
