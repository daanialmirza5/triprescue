import { useApp } from '@/store/AppContext';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDuration, statusColors } from '@/lib/status';
import { Check, ArrowRight, GitCompare, Plane, Timer, Car, Bed, Mountain, MapPin } from 'lucide-react';
import type { ItineraryNodeData, NodeCategory } from '@/types';

const categoryIconMap: Record<NodeCategory, typeof Plane> = {
  flight: Plane,
  connection: Timer,
  transfer: Car,
  hotel: Bed,
  activity: Mountain,
  return: Plane,
};

export function BeforeAfterView() {
  const { trip, appliedRecovery, preDisruptionTrip } = useApp();

  // Real pre-disruption snapshot when available (captured the moment the
  // disruption started); falls back to the current trip if this view is ever
  // reached without one (e.g. a page refresh mid-flow).
  const beforeNodes = preDisruptionTrip?.nodes ?? trip.nodes;
  const afterNodes = trip.nodes;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GitCompare className="h-5 w-5 text-accent-600" />
        <h2 className="text-lg font-semibold text-ink-100">Before vs After</h2>
      </div>

      {appliedRecovery && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 animate-fade-in">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
            <Check className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink-100">{appliedRecovery.bookingsPreserved} / {appliedRecovery.totalBookings} itinerary commitments preserved</div>
            <div className="text-xs text-ink-400">+{formatCurrency(appliedRecovery.costDelta)} additional cost · {formatDuration(appliedRecovery.timeImpactMinutes)} delay</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BeforeColumn nodes={beforeNodes} />
        <AfterColumn nodes={afterNodes} appliedRecovery={appliedRecovery} />
      </div>

      {appliedRecovery && (
        <div className="rounded-xl border border-ink-700 bg-ink-900 p-5">
          <h3 className="text-sm font-semibold text-ink-100 mb-3">What Changed</h3>
          <div className="space-y-2">
            {appliedRecovery.changes.map((change, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-ink-700 bg-white/60 p-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <span className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold',
                  change.changeType === 'preserved' ? 'bg-emerald-500/20 text-emerald-600' :
                  change.changeType === 'rebooked' ? 'bg-accent-500/20 text-accent-600' :
                  'bg-amber-500/20 text-amber-600'
                )}>
                  {change.changeType === 'preserved' ? <Check className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                </span>
                <div className="flex-1">
                  <span className="text-xs font-medium text-ink-100">{change.nodeLabel}</span>
                  <span className="ml-2 text-xs text-ink-400">{change.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BeforeColumn({ nodes }: { nodes: ItineraryNodeData[] }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-md border border-ink-600 bg-white/60 px-2 py-0.5 text-[10px] font-bold tracking-wider text-ink-300">BEFORE DISRUPTION</span>
      </div>
      <div className="space-y-2">
        {nodes.map((node, i) => {
          const c = statusColors[node.status];
          return (
            <div key={node.id} className={cn('flex items-center gap-3 rounded-lg border p-3 animate-fade-in', c.border, c.bg)} style={{ animationDelay: `${i * 50}ms` }}>
              <NodeIcon category={node.category} />
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-medium text-ink-100">{node.title}</div>
                <div className="truncate text-[10px] text-ink-400">{node.scheduledTime}</div>
              </div>
              <span className={cn('flex h-5 w-5 items-center justify-center rounded-full', c.bg)}>
                <Check className={cn('h-3 w-3', c.text)} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AfterColumn({ nodes, appliedRecovery }: { nodes: ItineraryNodeData[]; appliedRecovery: ReturnType<typeof useApp>['appliedRecovery'] }) {
  const changeMap = new Map(appliedRecovery?.changes.map((c) => [c.nodeId, c.changeType]));

  return (
    <div className="rounded-xl border border-accent-500/20 bg-accent-500/5 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-md border border-accent-500/30 bg-accent-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-accent-700">AFTER RECOVERY</span>
      </div>
      <div className="space-y-2">
        {nodes.map((node, i) => {
          const changeType = changeMap.get(node.id);
          const c = statusColors[node.status];
          return (
            <div
              key={node.id}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 animate-fade-in',
                changeType === 'preserved' ? 'border-emerald-500/20 bg-emerald-500/5' :
                changeType === 'rebooked' ? 'border-accent-500/30 bg-accent-500/10' :
                changeType === 'rescheduled' ? 'border-amber-500/20 bg-amber-500/5' :
                'border-ink-700 bg-white/60'
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <NodeIcon category={node.category} />
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-medium text-ink-100">{node.title}</div>
                <div className="truncate text-[10px] text-ink-400">{node.scheduledTime}</div>
              </div>
              <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} title={node.status} />
              {changeType && (
                <span className={cn(
                  'rounded-md border px-1.5 py-0.5 text-[9px] font-bold',
                  changeType === 'preserved' ? 'border-emerald-500/30 text-emerald-700' :
                  changeType === 'rebooked' ? 'border-accent-500/30 text-accent-700' :
                  changeType === 'rescheduled' ? 'border-amber-500/30 text-amber-700' :
                  'border-red-500/30 text-red-700'
                )}>
                  {changeType.toUpperCase()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NodeIcon({ category }: { category: NodeCategory }) {
  const Icon = categoryIconMap[category] ?? MapPin;
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink-700 bg-white/70 text-ink-500">
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}
