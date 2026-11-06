import type { NodeStatus } from '@/types';
import { statusLabel, statusTone, toneClasses } from '@/lib/status';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, CircleAlert, Clock3, RotateCcw, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: NodeStatus;
  size?: 'sm' | 'md';
  /** Overrides the default label (e.g. "Departed", "Confirmed"). */
  label?: string;
  className?: string;
}

const icons: Record<NodeStatus, typeof CheckCircle2> = {
  healthy: CheckCircle2,
  'at-risk': AlertTriangle,
  delayed: Clock3,
  broken: CircleAlert,
  cancelled: XCircle,
  recovered: RotateCcw,
};

export function StatusBadge({ status, size = 'sm', label, className }: StatusBadgeProps) {
  const Icon = icons[status];
  const tone = toneClasses[statusTone[status]];
  return (
    <span className={cn('pill', tone.pill, size === 'md' && 'px-3 py-1.5 text-xs', className)}>
      <Icon className={cn('h-3.5 w-3.5 shrink-0', status === 'broken' && 'animate-pulse-soft')} aria-hidden="true" />
      {label ?? statusLabel[status]}
    </span>
  );
}
