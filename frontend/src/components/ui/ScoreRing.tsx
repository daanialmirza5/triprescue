import { useId } from 'react';
import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
  color?: string;
  /** Blue→cyan brand gradient stroke (recovery scores, trip status). */
  gradient?: boolean;
  suffix?: string;
  valueClassName?: string;
}

export function ScoreRing({ score, size = 120, strokeWidth = 8, label, className, color, gradient = false, suffix = '', valueClassName }: ScoreRingProps) {
  const id = useId();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const autoColor = score >= 80 ? '#34d399' : score >= 50 ? '#f59e0b' : '#ef4444';
  const strokeColor = gradient ? `url(#${id})` : color ?? autoColor;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }} role="img" aria-label={`${label ?? 'Score'} ${score}${suffix}`}>
      <svg width={size} height={size} className="-rotate-90">
        {gradient && (
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#12B5E5" />
              <stop offset="100%" stopColor="#1F6BFF" />
            </linearGradient>
          </defs>
        )}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8EEF7" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-display text-2xl font-extrabold tabular-nums text-ink', valueClassName)}>{score}{suffix}</span>
        {label && <span className="mt-0.5 text-[10px] text-ink-muted">{label}</span>}
      </div>
    </div>
  );
}
