import { useEffect, useState } from 'react';
import { SOURCE_LABEL, timeAgo } from '@/lib/liveTravel';
import { cn } from '@/lib/utils';

interface SourceBadgeProps {
  source: string;
  /** Live provider data (flights/trains). Discovery data (OSM, Ticketmaster) shows source only. */
  live?: boolean;
  simulation?: boolean;
  updatedAt?: string | null;
  className?: string;
}

/** Where a piece of data came from. Live data always says LIVE + provider +
 * age; simulated data always says SIMULATION - the two are never mixed. */
export function SourceBadge({ source, live, simulation, updatedAt, className }: SourceBadgeProps) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!updatedAt) return;
    const t = setInterval(() => tick((n) => n + 1), 15_000);
    return () => clearInterval(t);
  }, [updatedAt]);

  if (simulation) {
    return (
      <span className={cn('pill bg-ai-light text-ai', className)}>
        <span className="h-2 w-2 rounded-full bg-ai" aria-hidden="true" /> SIMULATION · SafarSathi Demo
      </span>
    );
  }
  const label = SOURCE_LABEL[source] ?? source;
  return (
    <span className={cn('pill', live ? 'bg-safe-light text-safe' : 'bg-canvas text-ink-muted', className)}>
      {live && (
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inset-0 animate-ping rounded-full bg-safe opacity-60 motion-reduce:hidden" />
          <span className="relative h-2 w-2 rounded-full bg-safe" />
        </span>
      )}
      {live ? `LIVE · ${label}` : label}
      {updatedAt && <span className="font-normal opacity-80">· Updated {timeAgo(updatedAt)}</span>}
    </span>
  );
}
