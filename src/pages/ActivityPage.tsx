import { useApp } from '@/store/AppContext';
import { cn } from '@/lib/utils';
import { History, Radio } from 'lucide-react';

export function ActivityPage() {
  const { activityLog } = useApp();

  const typeIcons = {
    monitoring: 'bg-emerald-400',
    risk: 'bg-amber-400',
    recovery: 'bg-accent-400',
    booking: 'bg-electric-400',
    system: 'bg-ink-400',
    disruption: 'bg-red-400',
  };

  const typeLabels = {
    monitoring: 'MONITORING',
    risk: 'RISK',
    recovery: 'RECOVERY',
    booking: 'BOOKING',
    system: 'SYSTEM',
    disruption: 'DISRUPTION',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-ink-400" />
            <h1 className="text-xl font-bold text-ink-100">Activity Log</h1>
          </div>
          <p className="mt-1 text-sm text-ink-400">Real-time system activity and event history.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5">
          <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse-soft" />
          <span className="text-xs font-medium text-emerald-700">Live feed</span>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        {activityLog.length === 0 ? (
          <div className="p-8 text-center text-sm text-ink-400">No activity recorded yet.</div>
        ) : (
          <div className="divide-y divide-ink-700">
            {activityLog.map((event, i) => (
              <div
                key={event.id}
                className="flex items-start gap-4 p-4 transition hover:bg-ink-800 animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex flex-col items-center shrink-0">
                  <span className={cn('h-2.5 w-2.5 rounded-full', typeIcons[event.type])} />
                  {i < activityLog.length - 1 && <span className="h-8 w-px bg-ink-700 mt-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider',
                      event.type === 'disruption' ? 'bg-red-500/10 text-red-700' :
                      event.type === 'recovery' ? 'bg-accent-500/10 text-accent-700' :
                      event.type === 'risk' ? 'bg-amber-500/10 text-amber-700' :
                      event.type === 'booking' ? 'bg-electric-500/10 text-electric-700' :
                      event.type === 'monitoring' ? 'bg-emerald-500/10 text-emerald-700' :
                      'bg-ink-700 text-ink-500'
                    )}>
                      {typeLabels[event.type]}
                    </span>
                    <span className="text-sm font-medium text-ink-100">{event.message}</span>
                  </div>
                  {event.detail && <p className="mt-1 text-xs text-ink-400">{event.detail}</p>}
                </div>
                <span className="text-xs font-mono text-ink-500 shrink-0">{event.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
