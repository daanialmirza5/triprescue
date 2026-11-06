import { useApp } from '@/store/AppContext';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDuration, statusColors } from '@/lib/status';
import { Check, ArrowRight, GitCompare, Plane, Timer, Car, Bed, Mountain, MapPin, TrainFront } from 'lucide-react';
import type { ItineraryNodeData, NodeCategory } from '@/types';

const categoryIconMap: Record<NodeCategory, typeof Plane> = {
  flight: Plane,
  train: TrainFront,
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
        <GitCompare className="h-5 w-5 text-safar-blue" />
        <h2 className="text-lg font-semibold text-ink">Before vs After</h2>
      </div>

      {appliedRecovery && (
        <div className="flex items-center gap-3 rounded-xl border border-safar-safe/20 bg-safar-safe/5 p-4 animate-fade-in">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-safar-safe/20">
            <Check className="h-5 w-5 text-safar-safe" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">{appliedRecovery.bookingsPreserved} / {appliedRecovery.totalBookings} itinerary commitments preserved</div>
            <div className="text-xs text-ink-muted">+{formatCurrency(appliedRecovery.costDelta)} additional cost · {formatDuration(appliedRecovery.timeImpactMinutes)} delay</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BeforeColumn nodes={beforeNodes} />
        <AfterColumn nodes={afterNodes} appliedRecovery={appliedRecovery} />
      </div>

      {appliedRecovery && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink mb-3">What Changed</h3>
          <div className="space-y-2">
            {appliedRecovery.changes.map((change, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-line bg-white/60 p-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <span className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold',
                  change.changeType === 'preserved' ? 'bg-safar-safe/20 text-safar-safe' :
                  change.changeType === 'rebooked' ? 'bg-safar-blue/20 text-safar-blue' :
                  'bg-safar-risk/20 text-safar-risk'
                )}>
                  {change.changeType === 'preserved' ? <Check className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                </span>
                <div className="flex-1">
                  <span className="text-xs font-medium text-ink">{change.nodeLabel}</span>
                  <span className="ml-2 text-xs text-ink-muted">{change.description}</span>
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
    <div className="card p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-md border border-line-strong bg-white/60 px-2 py-0.5 text-[10px] font-bold tracking-wider text-ink-soft">BEFORE DISRUPTION</span>
      </div>
      <div className="space-y-2">
        {nodes.map((node, i) => {
          const c = statusColors[node.status];
          return (
            <div key={node.id} className={cn('flex items-center gap-3 rounded-lg border p-3 animate-fade-in', c.border, c.bg)} style={{ animationDelay: `${i * 50}ms` }}>
              <NodeIcon category={node.category} />
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-medium text-ink">{node.title}</div>
                <div className="truncate text-[10px] text-ink-muted">{node.scheduledTime}</div>
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
    <div className="rounded-card border border-brand/20 bg-brand-light/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-md border border-safar-blue/30 bg-safar-blue/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-safar-blue">AFTER RECOVERY</span>
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
                changeType === 'preserved' ? 'border-safar-safe/20 bg-safar-safe/5' :
                changeType === 'rebooked' ? 'border-safar-blue/30 bg-safar-blue/10' :
                changeType === 'rescheduled' ? 'border-safar-risk/20 bg-safar-risk/5' :
                'border-line bg-white/60'
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <NodeIcon category={node.category} />
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-medium text-ink">{node.title}</div>
                <div className="truncate text-[10px] text-ink-muted">{node.scheduledTime}</div>
              </div>
              <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} title={node.status} />
              {changeType && (
                <span className={cn(
                  'rounded-md border px-1.5 py-0.5 text-[9px] font-bold',
                  changeType === 'preserved' ? 'border-safar-safe/30 text-safar-safe' :
                  changeType === 'rebooked' ? 'border-safar-blue/30 text-safar-blue' :
                  changeType === 'rescheduled' ? 'border-safar-risk/30 text-safar-risk' :
                  'border-safar-broken/30 text-safar-broken'
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
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line bg-white/70 text-ink-muted">
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}
