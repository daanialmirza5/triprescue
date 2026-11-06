import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CountUp } from '@/components/ui/CountUp';

interface MetricCardProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  icon?: ReactNode;
  accent?: 'default' | 'green' | 'amber' | 'red' | 'cyan';
  animate?: boolean;
  /** Secondary line under the label, e.g. "2 On Track | 1 Affected". */
  sub?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const iconTiles = {
  default: 'bg-canvas text-ink-muted',
  green: 'bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-white shadow-card text-safar-safe',
  amber: 'bg-gradient-to-br from-[#FFE7C2] to-[#FFD699] text-risk-dark',
  red: 'bg-gradient-to-br from-[#FFE1E1] to-[#FFCACA] text-danger',
  cyan: 'bg-gradient-to-br from-[#E6EEFF] to-[#D3E1FF] text-brand',
};

export function MetricCard({ value, label, prefix = '', suffix = '', icon, accent = 'default', animate = true, sub, onClick, className }: MetricCardProps) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={cn('card card-hover flex w-full items-center gap-3.5 p-4 text-left 2xl:gap-4 2xl:p-5', className)}
    >
      {icon && (
        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl [&>svg]:h-6 [&>svg]:w-6 2xl:h-[60px] 2xl:w-[60px] 2xl:[&>svg]:h-7 2xl:[&>svg]:w-7', iconTiles[accent], accent === 'green' && '[&>svg]:text-white')}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className="whitespace-nowrap font-display text-[22px] font-extrabold leading-none tracking-tight text-ink 2xl:text-[26px]">
          {animate ? <CountUp value={value} prefix={prefix} suffix={suffix} /> : `${prefix}${value.toLocaleString('en-IN')}${suffix}`}
        </div>
        <div className="mt-1.5 text-[13px] font-medium leading-snug text-ink-soft 2xl:text-sm">{label}</div>
        {sub && <div className="mt-1 text-xs leading-snug text-ink-muted">{sub}</div>}
      </div>
    </Wrapper>
  );
}
