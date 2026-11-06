import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import { DestinationImage } from '@/components/travel/DestinationImage';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { durationBetween, formatDay, formatMinutes, formatTime, type Journey, type JourneyLeg, type JourneyStop } from '@/lib/journey';
import { AlertTriangle, ArrowRight, Car, Plane, TrainFront } from 'lucide-react';

const modeIcon = { flight: Plane, train: TrainFront, transfer: Car };

interface JourneyRouteProps {
  journey: Journey;
  compact?: boolean;
  onSelectStop?: (stop: JourneyStop) => void;
}

/** Stop cards joined by leg connectors - the core "Mumbai → Delhi → Agra" visual. */
export function JourneyRoute({ journey, compact = false, onSelectStop }: JourneyRouteProps) {
  if (journey.stops.length === 0) {
    return <div className="rounded-2xl border border-dashed border-line-strong p-6 text-center text-sm text-ink-muted">Add a flight, train or transfer to see this trip's route.</div>;
  }
  return (
    <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-0">
      {journey.stops.map((stop, i) => (
        <Fragment key={`${stop.city}-${i}`}>
          <StopCard stop={stop} compact={compact} onClick={onSelectStop ? () => onSelectStop(stop) : undefined} />
          {i < journey.stops.length - 1 && <LegConnector leg={journey.legs[i]} />}
        </Fragment>
      ))}
    </div>
  );
}

function stopBadge(stop: JourneyStop): string | undefined {
  if (stop.role === 'origin') return stop.status === 'healthy' ? 'Confirmed' : undefined;
  return undefined;
}

function StopCard({ stop, compact, onClick }: { stop: JourneyStop; compact: boolean; onClick?: () => void }) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper onClick={onClick} className={cn('card min-w-0 flex-1 overflow-hidden p-2 text-left', onClick && 'card-hover')}>
      <DestinationImage destination={stop.city} className={cn('rounded-xl', compact ? 'h-[92px]' : 'h-[112px]')} />
      <div className="px-2 pb-1 pt-3">
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
          <div className="min-w-0">
            <div className="font-display text-base font-bold leading-tight text-ink">{stop.city}</div>
            {stop.code && <div className="text-sm text-ink-muted">{stop.code}</div>}
          </div>
          <StatusBadge status={stop.status} label={stopBadge(stop)} />
        </div>
        {!compact && stop.time && (
          <div className="mt-1 text-right">
            <div className="text-sm font-bold text-ink">{formatTime(stop.time)}</div>
            <div className="text-xs text-ink-muted">{formatDay(stop.time)}</div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

function LegConnector({ leg }: { leg?: JourneyLeg }) {
  const Icon = leg ? modeIcon[leg.mode] : ArrowRight;
  const status = leg?.status ?? 'healthy';
  const tone = status === 'delayed' || status === 'broken' || status === 'cancelled' ? 'danger' : status === 'at-risk' ? 'risk' : 'brand';
  const color = { danger: 'text-danger', risk: 'text-risk-dark', brand: 'text-brand' }[tone];
  const line = { danger: 'bg-danger', risk: 'bg-[repeating-linear-gradient(90deg,#F59E0B_0_6px,transparent_6px_11px)]', brand: 'bg-[repeating-linear-gradient(90deg,#1F6BFF_0_6px,transparent_6px_11px)]' }[tone];

  let caption: string;
  if (!leg) caption = '';
  else if (status === 'delayed' && leg.delayMinutes > 0) caption = leg.delayMinutes <= 180 ? `+${leg.delayMinutes} min delay` : `+${formatMinutes(leg.delayMinutes)} delay`;
  else if (status === 'delayed') caption = 'Delayed';
  else if (status === 'at-risk') caption = 'Connection at risk';
  else if (status === 'broken') caption = 'Connection broken';
  else if (status === 'cancelled') caption = 'Cancelled';
  else if (status === 'recovered') caption = 'Rebooked';
  else caption = durationBetween(leg.start, leg.end) ?? '';

  return (
    <div className="flex shrink-0 items-center justify-center gap-3 px-2 py-1 md:w-[112px] md:flex-col md:gap-1.5 md:px-1 md:py-0" aria-label={leg ? `${leg.mode} from ${leg.from} to ${leg.to}: ${caption}` : undefined}>
      <Icon className={cn('h-6 w-6', color)} strokeWidth={1.9} />
      <div className="relative hidden h-[2px] w-full md:block">
        <div className={cn('absolute inset-0 origin-left animate-draw-line rounded-full', line)} />
        <span className={cn('absolute -right-1 -top-[5px] h-0 w-0 border-y-[6px] border-l-[8px] border-y-transparent', tone === 'danger' ? 'border-l-danger' : tone === 'risk' ? 'border-l-risk' : 'border-l-brand')} />
      </div>
      <div className={cn('flex items-center gap-1 text-center text-[13px] font-semibold leading-tight md:flex-col', color)}>
        {(tone === 'danger' || tone === 'risk') && <AlertTriangle className="h-5 w-5 md:order-first" />}
        <span className="md:max-w-[96px]">{caption}</span>
      </div>
    </div>
  );
}
