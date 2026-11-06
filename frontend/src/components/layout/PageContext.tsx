import { cn } from '@/lib/utils';
import { useRouter, type Route } from '@/lib/router';
import { useApp } from '@/store/AppContext';
import { ChevronRight, Home } from 'lucide-react';

export interface Crumb {
  label: string;
  /** Omit for the current page (rendered as plain text). */
  route?: Route;
}

/** Breadcrumb trail shared by page headers. The first crumb is always Dashboard. */
export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  const { navigate } = useRouter();
  const trail: Crumb[] = [{ label: 'Dashboard', route: 'dashboard' }, ...crumbs];
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-muted">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-ink-faint" aria-hidden="true" />}
              {crumb.route && !last ? (
                <button onClick={() => navigate(crumb.route!)} className="flex items-center gap-1 rounded-md font-medium transition hover:text-brand">
                  {i === 0 && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                  {crumb.label}
                </button>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={cn(last && 'font-semibold text-ink-soft')}>{crumb.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const statusStyle: Record<string, { dot: string; label: string }> = {
  operational: { dot: 'bg-safe', label: 'On track' },
  disrupted: { dot: 'bg-danger animate-pulse-soft', label: 'Disrupted' },
  recovering: { dot: 'bg-risk', label: 'Recovering' },
  recovered: { dot: 'bg-brand-cyan', label: 'Recovered' },
};

/** Which trip the page is showing, and its health, at a glance. Opens the itinerary. */
export function ActiveTripBadge({ className }: { className?: string }) {
  const { trip } = useApp();
  const { navigate } = useRouter();
  if (!trip.id) return null;
  const status = statusStyle[trip.status] ?? statusStyle.operational;
  return (
    <button
      onClick={() => navigate('trip')}
      className={cn('inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-white/85 px-3 py-1.5 text-xs font-semibold text-ink-soft shadow-card backdrop-blur transition hover:border-brand/30 hover:text-brand', className)}
      aria-label={`Active trip ${trip.route}: ${status.label}. Open itinerary`}
    >
      <span className={cn('h-2 w-2 shrink-0 rounded-full', status.dot)} aria-hidden="true" />
      <span className="truncate">{trip.route || trip.name}</span>
      <span className="shrink-0 font-medium text-ink-muted">· {status.label}</span>
    </button>
  );
}
