import { cn } from '@/lib/utils';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { LivePill } from '@/components/layout/PageHero';
import { formatINR, impactCounts } from '@/lib/journey';
import type { AppPhase } from '@/store/AppContext';
import type { Disruption, Trip } from '@/types';
import { BedDouble, IndianRupee, Plane, TrainFront } from 'lucide-react';

function tripStatusCopy(phase: AppPhase, affected: number, hasOptions: boolean) {
  if (phase === 'recovered') return { title: 'Journey Recovered', lines: ['All connections re-validated', 'Recovery applied successfully'] };
  if (phase === 'idle') return { title: 'Journey On Track', lines: ['All legs on schedule', 'Monitoring every connection'] };
  if (phase === 'analyzing') return { title: 'Analyzing Impact', lines: [`${affected} leg${affected === 1 ? '' : 's'} affected`, 'Finding recovery options…'] };
  return { title: 'Journey At Risk', lines: [`${affected} leg${affected === 1 ? '' : 's'} affected`, hasOptions ? 'Recovery options available' : 'Preparing recovery options'] };
}

export function ImpactSummary({ trip, disruption, className }: { trip: Trip; disruption: Disruption | null; className?: string }) {
  const counts = impactCounts(trip);
  const rows = [
    { icon: Plane, value: String(counts.flightsDelayed), label: 'Flight Delayed' },
    { icon: TrainFront, value: String(counts.connectionsAtRisk), label: 'Connection At Risk' },
    { icon: BedDouble, value: String(counts.hotelsImpacted), label: 'Hotel Impact' },
    { icon: IndianRupee, value: formatINR(disruption ? Math.max(0, disruption.financialExposure - disruption.refundExposure) : 0), label: 'Potential Cost Impact' },
  ];
  return (
    <div className={className}>
      <h3 className="text-[15px] font-bold text-ink">Impact Summary</h3>
      <ul className="mt-3 space-y-2.5">
        {rows.map(({ icon: Icon, value, label }) => (
          <li key={label} className="flex items-center gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-danger-light text-danger"><Icon className="h-[18px] w-[18px]" /></span>
            <span className="w-16 shrink-0 text-[15px] font-bold text-ink">{value}</span>
            <span className="text-sm text-ink-soft">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface TripStatusCardProps {
  trip: Trip;
  phase: AppPhase;
  disruption: Disruption | null;
  hasOptions: boolean;
  className?: string;
}

export function TripStatusCard({ trip, phase, disruption, hasOptions, className }: TripStatusCardProps) {
  const counts = impactCounts(trip);
  const copy = tripStatusCopy(phase, counts.affectedLegs, hasOptions);
  return (
    <section className={cn('card p-5', className)} aria-labelledby="trip-status-title">
      <div className="flex items-center justify-between">
        <h2 id="trip-status-title" className="section-title">Trip Status</h2>
        <LivePill label="Live" />
      </div>
      <div className="mt-4 flex items-center gap-5">
        <ScoreRing score={trip.healthScore} size={104} strokeWidth={11} gradient suffix="%" label="" valueClassName="text-[22px]" />
        <div className="min-w-0">
          <div className="font-display text-lg font-bold text-ink">{copy.title}</div>
          {copy.lines.map((l) => <div key={l} className="text-sm text-ink-muted">{l}</div>)}
        </div>
      </div>
      <ImpactSummary trip={trip} disruption={disruption} className="mt-6" />
    </section>
  );
}
