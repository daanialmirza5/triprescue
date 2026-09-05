import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { ItineraryGraph } from '@/components/graph/ItineraryGraph';
import { ImpactAnalysisPanel } from '@/components/disruption/ImpactAnalysisPanel';
import { DisruptionModal } from '@/components/disruption/DisruptionModal';
import { MetricCard } from '@/components/ui/MetricCard';
import { statusColors } from '@/lib/status';
import { cn } from '@/lib/utils';
import type { NodeCategory } from '@/types';
import {
  Plane,
  AlertTriangle,
  ShieldCheck,
  Wallet,
  Zap,
  Activity,
  ArrowRight,
  GitCompare,
  Timer,
  Car,
  Bed,
  Mountain,
  MapPin,
} from 'lucide-react';

const categoryIconMap: Record<NodeCategory, typeof Plane> = {
  flight: Plane,
  connection: Timer,
  transfer: Car,
  hotel: Bed,
  activity: Mountain,
  return: Plane,
};

interface OverviewProps {
  onNavigate: (page: string) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const { trip, phase, activeDisruption, recoveryOptions, appliedRecovery } = useApp();
  const [disruptionOpen, setDisruptionOpen] = useState(false);

  const atRiskNodes = trip.nodes.filter((n) => n.status === 'at-risk').length;
  const brokenNodes = trip.nodes.filter((n) => n.status === 'broken').length;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">{greeting}, {trip.travelerName}</h1>
          <p className="mt-1 text-sm text-ink-400">
            {phase === 'idle' && `Your ${trip.destination} expedition is being monitored continuously.`}
            {phase === 'disrupted' && 'A disruption has been detected. Analyzing impact...'}
            {phase === 'analyzing' && 'Analyzing disruption impact across your itinerary...'}
            {phase === 'recovering' && `${recoveryOptions.length} recovery strategies available. Review and apply.`}
            {phase === 'recovered' && 'Recovery applied. Your itinerary has been stabilized.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(phase === 'idle' || phase === 'recovered') && (
            <button
              onClick={() => setDisruptionOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-glow-amber transition hover:brightness-110"
            >
              <Zap className="h-4 w-4" />
              {phase === 'recovered' ? 'Simulate Another Disruption' : 'Simulate Disruption'}
            </button>
          )}
          {phase === 'recovering' && (
            <button
              onClick={() => onNavigate('recovery')}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-500 to-electric-600 px-4 py-2 text-sm font-medium text-white shadow-glow-cyan transition hover:brightness-110 animate-pulse-soft"
            >
              <ArrowRight className="h-4 w-4" />
              View Recovery Options
            </button>
          )}
          {phase === 'recovered' && (
            <button
              onClick={() => onNavigate('recovery')}
              className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-500/20"
            >
              <GitCompare className="h-4 w-4" />
              View Recovery Results
            </button>
          )}
        </div>
      </div>

      {phase === 'recovered' && appliedRecovery && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 animate-fade-in-up">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-ink-100">Recovery Successful</div>
            <div className="text-xs text-ink-400">
              {appliedRecovery.bookingsPreserved} / {appliedRecovery.totalBookings} commitments preserved ·
              +₹{appliedRecovery.costDelta.toLocaleString('en-IN')} additional cost ·
              Low residual risk
            </div>
          </div>
        </div>
      )}

      <div className="glass rounded-xl p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-electric-600/10 border border-accent-500/20">
              <Plane className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <div className="text-[10px] text-ink-500 uppercase tracking-wider">Trip Status</div>
              <div className={cn(
                'text-lg font-bold',
                phase === 'idle' ? 'text-emerald-600' :
                phase === 'recovered' ? 'text-accent-600' :
                'text-red-600'
              )}>
                {phase === 'idle' && 'Monitoring normally'}
                {phase === 'disrupted' && 'Disruption detected'}
                {phase === 'analyzing' && 'Analyzing impact'}
                {phase === 'recovering' && 'Recovery options ready'}
                {phase === 'recovered' && 'Recovery applied'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <div className="text-[10px] text-ink-500">Route</div>
              <div className="font-medium text-ink-100">{trip.route}</div>
            </div>
            <div>
              <div className="text-[10px] text-ink-500">Dates</div>
              <div className="font-medium text-ink-100">{trip.startDate} — {trip.endDate}</div>
            </div>
            <div className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
              phase === 'idle' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-700' :
              phase === 'recovered' ? 'border-accent-500/20 bg-accent-500/5 text-accent-700' :
              'border-red-500/20 bg-red-500/5 text-red-700'
            )}>
              <span className={cn('h-2 w-2 rounded-full animate-pulse-soft',
                phase === 'idle' ? 'bg-emerald-400' :
                phase === 'recovered' ? 'bg-accent-400' :
                'bg-red-400'
              )} />
              {phase === 'idle' ? 'All systems operational' : phase === 'recovered' ? 'Trip stabilized' : 'Action required'}
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-100">Trip Commitments</h2>
          <span className="text-[10px] text-ink-500">{trip.nodes.length} bookings</span>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-1">
          {trip.nodes.map((node) => {
            const Icon = categoryIconMap[node.category] ?? MapPin;
            const c = statusColors[node.status];
            return (
              <div
                key={node.id}
                className={cn('flex w-44 shrink-0 items-center gap-2.5 rounded-lg border p-2.5 transition hover:bg-white', c.border, c.bg)}
              >
                <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border', c.border, 'bg-white')}>
                  <Icon className={cn('h-4 w-4', c.text)} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-ink-100">{node.title}</div>
                  <div className="truncate text-[10px] text-ink-500">{node.scheduledTime}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard value={trip.nodes.length} label="Itinerary nodes" icon={<Activity className="h-5 w-5" />} accent="cyan" />
        <MetricCard value={atRiskNodes} label="At-risk connections" icon={<AlertTriangle className="h-5 w-5" />} accent={atRiskNodes > 0 ? 'amber' : 'green'} />
        <MetricCard value={brokenNodes} label="Broken bookings" icon={<AlertTriangle className="h-5 w-5" />} accent={brokenNodes > 0 ? 'red' : 'green'} />
        <MetricCard value={trip.tripValue} label="Trip value protected" prefix="₹" icon={<Wallet className="h-5 w-5" />} accent="cyan" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="glass rounded-xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-ink-100">Live Itinerary Graph</h2>
                <p className="mt-0.5 text-xs text-ink-400">Your trip is modeled as a network of dependent bookings.</p>
              </div>
              <button onClick={() => onNavigate('monitor')} className="flex items-center gap-1 text-xs text-accent-600 transition hover:text-accent-700">
                Full view <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="h-[420px]">
              <ItineraryGraph nodes={trip.nodes} edges={trip.edges} />
            </div>
          </div>
        </div>

        <div className="h-[480px]">
          {activeDisruption ? (
            <ImpactAnalysisPanel />
          ) : (
            <div className="glass rounded-xl p-5 h-full flex flex-col">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-accent-600" />
                <h2 className="text-sm font-semibold text-ink-100">System Status</h2>
              </div>
              <div className="mt-4 space-y-3 flex-1">
                <StatusRow label="Disruption monitoring" status="active" />
                <StatusRow label="Dependency graph engine" status="active" />
                <StatusRow label="Recovery AI" status="active" />
                <StatusRow label="Risk analysis" status="active" />
                <StatusRow label="Weather tracking" status="active" />
              </div>
              <div className="border-t border-ink-700 pt-4">
                <div className="flex items-center gap-2 rounded-lg bg-accent-500/5 border border-accent-500/20 p-3">
                  <Zap className="h-4 w-4 text-accent-600 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-ink-100">Ready for demo</div>
                    <div className="text-[10px] text-ink-400">Click "Simulate Disruption" to see the recovery engine in action.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DisruptionModal open={disruptionOpen} onClose={() => setDisruptionOpen(false)} />
    </div>
  );
}

function StatusRow({ label, status }: { label: string; status: 'active' | 'idle' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-ink-300">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', status === 'active' ? 'bg-emerald-400' : 'bg-ink-500')} />
          <span className={cn('relative inline-flex h-2 w-2 rounded-full', status === 'active' ? 'bg-emerald-400' : 'bg-ink-500')} />
        </span>
        <span className={cn('text-[10px] font-medium', status === 'active' ? 'text-emerald-600' : 'text-ink-500')}>
          {status === 'active' ? 'Active' : 'Idle'}
        </span>
      </div>
    </div>
  );
}
