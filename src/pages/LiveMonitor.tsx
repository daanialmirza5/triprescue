import { useApp } from '@/store/AppContext';
import { ItineraryGraph } from '@/components/graph/ItineraryGraph';
import { ImpactAnalysisPanel } from '@/components/disruption/ImpactAnalysisPanel';
import { cn } from '@/lib/utils';
import { Activity, Radio, Zap } from 'lucide-react';

export function LiveMonitor() {
  const { trip, phase, activeDisruption, activityLog } = useApp();

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent-600" />
            <h1 className="text-xl font-bold text-ink-100">Live Monitor</h1>
          </div>
          <p className="mt-1 text-sm text-ink-400">Real-time itinerary dependency monitoring.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5">
          <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse-soft" />
          <span className="text-xs font-medium text-emerald-600">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 flex-1 min-h-0">
        <div className="lg:col-span-2 glass rounded-xl p-4 flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-100">Dependency Graph</h2>
            <span className="text-[10px] text-ink-500">{trip.nodes.length} nodes · {trip.edges.length} edges</span>
          </div>
          <div className="flex-1 min-h-[400px]">
            <ItineraryGraph nodes={trip.nodes} edges={trip.edges} />
          </div>
        </div>

        <div className="space-y-4 flex flex-col max-h-[600px]">
          {activeDisruption ? (
            <ImpactAnalysisPanel />
          ) : (
            <div className="glass rounded-xl p-5">
              <h2 className="text-sm font-semibold text-ink-100 mb-3">Event Timeline</h2>
              <div className="space-y-3">
                {activityLog.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'h-2 w-2 rounded-full',
                        event.type === 'disruption' ? 'bg-red-400' :
                        event.type === 'recovery' ? 'bg-accent-400' :
                        event.type === 'risk' ? 'bg-amber-400' :
                        'bg-emerald-400'
                      )} />
                      <div className="h-full w-px bg-ink-700 mt-1" />
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-ink-100">{event.message}</span>
                        <span className="text-[10px] text-ink-500 font-mono">{event.timestamp}</span>
                      </div>
                      {event.detail && <p className="mt-0.5 text-[10px] text-ink-400">{event.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass rounded-xl p-4">
            <h3 className="text-xs font-semibold text-ink-100 mb-2">Disruption Cascade Timeline</h3>
            {phase !== 'idle' && activeDisruption ? (
              <div className="space-y-2">
                {activeDisruption.cascadeSteps.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 200}ms` }}>
                    <span className="text-[10px] font-mono text-accent-600 w-12">{step.timestamp}</span>
                    <span className="h-1 w-1 rounded-full bg-accent-400" />
                    <span className="text-[11px] text-ink-200">{step.description}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-white/60 p-3">
                <Zap className="h-3.5 w-3.5 text-ink-500" />
                <span className="text-[11px] text-ink-500">No disruptions detected. Monitoring active.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
