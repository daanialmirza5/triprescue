import type { ReactNode } from 'react';
import type { LiveTransport } from '@/services/api';
import { STATUS_LABEL, formatClock } from '@/lib/liveTravel';
import { SourceBadge } from '@/components/live/SourceBadge';
import { cn } from '@/lib/utils';
import { ArrowRight, Plane, TrainFront } from 'lucide-react';

const STATUS_TONE: Record<string, string> = {
  cancelled: 'bg-danger-light text-danger',
  diverted: 'bg-danger-light text-danger',
  delayed: 'bg-risk-light text-risk-dark',
  arrived: 'bg-safe-light text-safe',
  en_route: 'bg-brand-light text-brand',
  departed: 'bg-brand-light text-brand',
};

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] text-ink-muted">{label}</dt>
      <dd className="text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}

/** One live flight or train, exactly as the provider reported it. */
export function LiveTransportCard({ item, actions, selected }: { item: LiveTransport; actions?: ReactNode; selected?: boolean }) {
  const Icon = item.mode === 'flight' ? Plane : TrainFront;
  const delay = item.delayMinutes ?? 0;
  const arrival = item.actualArrival ?? item.estimatedArrival ?? item.scheduledArrival;
  return (
    <article className={cn('card p-4', selected && 'ring-2 ring-brand/40')} aria-label={`${item.mode} ${item.number ?? ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={item.source} live updatedAt={item.lastUpdatedAt} />
        <span className={cn('pill', STATUS_TONE[item.status] ?? 'bg-canvas text-ink-soft')}>{STATUS_LABEL[item.status]}</span>
      </div>
      <div className="mt-3 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand"><Icon className="h-5 w-5" /></span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold text-ink">{item.number ?? '—'}</h3>
          <p className="truncate text-sm text-ink-muted">{item.name ?? item.operator ?? 'Operator not provided'}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="min-w-0 truncate font-medium text-ink">{item.origin?.name ?? 'Origin not provided'}{item.origin?.code ? ` (${item.origin.code})` : ''}</span>
        <ArrowRight className="h-4 w-4 shrink-0 text-ink-faint" />
        <span className="min-w-0 truncate font-medium text-ink">{item.destination?.name ?? 'Destination not provided'}{item.destination?.code ? ` (${item.destination.code})` : ''}</span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Delay" value={item.delayMinutes === null ? 'Not provided' : delay > 0 ? <span className="text-risk-dark">+{delay} min</span> : 'On time'} />
        <Field label={item.actualArrival ? 'Arrived' : item.estimatedArrival ? 'Est. arrival' : 'Sched. arrival'} value={formatClock(arrival) ?? 'Not provided'} />
        {item.mode === 'train'
          ? <Field label="Current" value={item.currentLocationName ?? 'Not provided'} />
          : <Field label="Aircraft" value={item.aircraft ?? 'Not provided'} />}
        {item.mode === 'train'
          ? <Field label="Next" value={item.nextStop?.name ?? 'Not provided'} />
          : <Field label="Speed" value={item.speedKmh !== null ? `${Math.round(item.speedKmh)} km/h` : 'Not provided'} />}
      </dl>
      {item.notices.length > 0 && <p className="mt-2 text-xs font-medium text-danger">{item.notices.join(' · ')}</p>}
      {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
    </article>
  );
}
