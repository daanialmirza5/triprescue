import type { NodeStatus } from '@/types';
import { statusColors, statusLabel } from '@/lib/status';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: NodeStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'sm', className }: StatusBadgeProps) {
  const c = statusColors[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        c.text,
        c.bg,
        c.border,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot, status === 'broken' && 'animate-pulse-soft')} />
      {statusLabel[status]}
    </span>
  );
}
