import type { PipelineEvent } from '@/services/api';
import type { ItineraryNodeData } from '@/types';
import { JOURNEY_LABEL, STATUS_STYLE, nodeJourneyStatus } from '@/lib/pipeline';
import { cn } from '@/lib/utils';
import { BedDouble, Car, ChevronRight, Compass, Plane, Timer, TrainFront, User } from 'lucide-react';

const ICONS: Record<string, typeof Plane> = { flight: Plane, return: Plane, connection: Timer, transfer: Car, hotel: BedDouble, activity: Compass, train: TrainFront };

const time = (iso?: string) => (iso ? new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }) : '');

interface JourneyLayerProps {
  nodes: ItineraryNodeData[];
  events: Record<string, PipelineEvent>;
  simulated: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  large?: boolean;
}

/** Layer 1: the traveller's real journey, statuses straight from the engine. */
export function JourneyLayer({ nodes, events, simulated, selectedId, onSelect, large }: JourneyLayerProps) {
  const ordered = [...nodes].sort((a, b) => (a.scheduledStart ?? '').localeCompare(b.scheduledStart ?? ''));
  return (
    <div className="overflow-x-auto pb-2 scrollbar-thin">
      <ol className="flex min-w-max items-stretch gap-1.5" aria-label="Journey">
        <li className="flex items-center">
          <div className={cn('flex flex-col items-center justify-center rounded-tile border border-line bg-white px-4', large ? 'h-36 w-28' : 'h-32 w-24')}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand"><User className="h-5 w-5" /></span>
            <span className="mt-2 text-xs font-semibold text-ink">Demo Traveller</span>
          </div>
          <ChevronRight className="mx-0.5 h-5 w-5 shrink-0 text-ink-faint" />
        </li>
        {ordered.map((n, i) => {
          const ev = events[n.id];
          const st = nodeJourneyStatus(n, ev);
          const style = STATUS_STYLE[st];
          const Icon = ICONS[n.category] ?? Compass;
          const connection = n.category === 'connection';
          return (
            <li key={n.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onSelect(n.id)}
                aria-pressed={selectedId === n.id}
                aria-label={`${n.title}: ${JOURNEY_LABEL[st]}`}
                className={cn(
                  'flex flex-col rounded-tile border bg-white p-3 text-left transition hover:shadow-card',
                  style.card, selectedId === n.id && 'outline outline-2 outline-offset-2 outline-brand',
                  connection ? (large ? 'h-36 w-32' : 'h-32 w-28') : large ? 'h-36 w-48' : 'h-32 w-44',
                  simulated && ev && 'border-dashed',
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink-soft"><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 text-[11px] uppercase tracking-wide text-ink-muted">{n.category}</span>
                </span>
                <span className={cn('mt-2 line-clamp-2 font-semibold leading-tight text-ink', large ? 'text-[15px]' : 'text-sm')}>{n.title}</span>
                {!connection && <span className="truncate text-[11px] text-ink-muted">{time(n.scheduledStart)}</span>}
                <span className={cn('pill mt-auto w-fit', style.chip)}>
                  {simulated && ev ? '◌ ' : `${style.icon} `}{JOURNEY_LABEL[st]}
                  {ev?.delayMinutes && st === 'delayed' ? ` +${ev.delayMinutes}m` : ''}
                </span>
              </button>
              {i < ordered.length - 1 && <ChevronRight className="mx-0.5 h-5 w-5 shrink-0 text-ink-faint" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
