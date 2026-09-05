import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Plane, Timer, Car, Bed, Mountain, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { statusColors, delayLabel } from '@/lib/status';
import type { ItineraryNodeData, NodeCategory } from '@/types';

const iconMap: Record<NodeCategory, typeof Plane> = {
  flight: Plane,
  connection: Timer,
  transfer: Car,
  hotel: Bed,
  activity: Mountain,
  return: Plane,
};

export const ItineraryGraphNode = memo(({ data, selected }: NodeProps<ItineraryNodeData & { isAnimating?: boolean }>) => {
  const Icon = iconMap[data.category] ?? MapPin;
  const c = statusColors[data.status];

  return (
    <div
      className={cn(
        'group relative w-48 rounded-xl border-2 bg-white shadow-card backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg',
        c.border,
        c.glow,
        selected && 'ring-2 ring-accent-400/50'
      )}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <div className="flex items-start gap-3 p-3">
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border', c.bg, c.border)}>
          <Icon className={cn('h-[18px] w-[18px]', c.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="truncate text-xs font-semibold text-ink-100">{data.title}</span>
            <span className={cn('h-2 w-2 shrink-0 rounded-full', c.dot, data.status === 'broken' && 'animate-pulse-soft')} />
          </div>
          <div className="truncate text-[10px] text-ink-400">{data.subtitle}</div>
        </div>
      </div>

      <div className="border-t border-ink-700 px-3 py-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-ink-500">{data.scheduledTime.split('·')[1]?.trim() ?? data.scheduledTime}</span>
          <span className={cn('font-medium', c.text)}>{data.status === 'healthy' ? 'ON TIME' : data.status === 'delayed' ? delayLabel(data) : data.status.toUpperCase()}</span>
        </div>
        {data.buffer && (
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-ink-500">Buffer: {data.buffer}</span>
            <span className="text-ink-400">{data.riskLevel}% risk</span>
          </div>
        )}
      </div>
    </div>
  );
});

ItineraryGraphNode.displayName = 'ItineraryGraphNode';
