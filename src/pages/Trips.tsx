import { useState, useEffect } from 'react';
import { useApp } from '@/store/AppContext';
import { cn } from '@/lib/utils';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/status';
import * as api from '@/services/api';
import { Plane, MapPin, Calendar, ArrowRight, Plus, AlertTriangle } from 'lucide-react';

interface TripsProps {
  onNavigate: (page: string) => void;
}

function statusFor(status: string): 'healthy' | 'recovered' | 'broken' {
  return status === 'operational' ? 'healthy' : status === 'recovered' ? 'recovered' : 'broken';
}

export function Trips({ onNavigate }: TripsProps) {
  const { trip, tripId, switchTrip } = useApp();
  const [summaries, setSummaries] = useState<api.TripSummary[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadTrips = () => {
    let cancelled = false;
    setLoadError(null);
    api
      .listTrips()
      .then((data) => {
        if (!cancelled) setSummaries(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setSummaries(null);
          setLoadError(err instanceof api.ApiError ? err.message : 'Could not load your other trips.');
        }
      });
    return () => {
      cancelled = true;
    };
  };

  useEffect(loadTrips, [trip.healthScore]);
  // Re-fetch when the active trip's health score changes so the "current
  // trip" summary card (if it appears in the other-trips list too) stays
  // in sync without a manual refresh.

  const otherTrips = (summaries ?? []).filter((s) => s.id !== tripId);

  const handleSwitch = (id: string) => {
    switchTrip(id);
    onNavigate('trip-detail');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-100">My Trips</h1>
          <p className="mt-1 text-sm text-ink-400">Manage and monitor your travel itineraries.</p>
        </div>
        <button
          disabled
          title="Creating new trips isn't available yet - this demo works against seeded itineraries."
          className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-ink-600 px-3 py-1.5 text-xs text-ink-500 opacity-60"
        >
          <Plus className="h-3.5 w-3.5" />
          New Trip
        </button>
      </div>

      <div className="glass rounded-xl p-5 hover:border-ink-500/40 transition cursor-pointer" onClick={() => onNavigate('trip-detail')}>
        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500/20 to-electric-600/10 border border-accent-500/20">
            <Plane className="h-7 w-7 text-accent-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-ink-100">{trip.name}</h2>
              <StatusBadge status={statusFor(trip.status)} />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-ink-400">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {trip.route}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {trip.startDate} — {trip.endDate}</span>
              <span>{trip.nodes.length} nodes · {trip.edges.length} dependencies</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <TripStat label="Trip value" value={formatCurrency(trip.tripValue)} />
              <TripStat label="Nodes" value={`${trip.nodes.length}`} />
              <TripStat label="Days" value={`${trip.days.length}`} />
              <TripStat label="Status" value={trip.status === 'operational' ? 'Operational' : trip.status === 'recovered' ? 'Recovered' : 'Disrupted'} valueClass={trip.status === 'operational' ? 'text-emerald-600' : trip.status === 'recovered' ? 'text-accent-600' : 'text-red-600'} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={trip.healthScore} size={80} strokeWidth={6} label="Health" />
            <button onClick={() => onNavigate('trip-detail')} className="flex items-center gap-1 text-[10px] text-accent-600 transition hover:text-accent-700">
              View details <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {loadError ? (
        <div className="glass flex flex-col items-center gap-3 rounded-xl border border-red-500/20 p-8 text-center">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <p className="text-sm text-ink-100">{loadError}</p>
          <button
            onClick={loadTrips}
            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-500/10"
          >
            Retry
          </button>
        </div>
      ) : summaries === null ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : otherTrips.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-600 bg-ink-900 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-ink-700 bg-white">
            <Plus className="h-5 w-5 text-ink-500" />
          </div>
          <p className="text-sm text-ink-400">No other trips planned yet.</p>
          <p className="mt-1 text-xs text-ink-500">Add a new trip to start monitoring its dependencies.</p>
        </div>
      ) : (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-ink-100">Other Trips</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {otherTrips.map((summary) => (
              <button
                key={summary.id}
                onClick={() => handleSwitch(summary.id)}
                className="glass flex items-start gap-3 rounded-xl p-4 text-left transition hover:border-ink-500/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500/20 to-electric-600/10 border border-accent-500/20">
                  <Plane className="h-5 w-5 text-accent-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-ink-100">{summary.name}</span>
                    <StatusBadge status={statusFor(summary.status)} size="sm" />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-ink-400">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {summary.route}</span>
                    <span>{summary.startDate} — {summary.endDate}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-[11px] text-ink-400">
                    <span>{formatCurrency(summary.tripValue)}</span>
                    <span>{summary.nodeCount} nodes</span>
                    <span className={cn('font-medium', summary.healthScore >= 70 ? 'text-emerald-600' : summary.healthScore >= 40 ? 'text-amber-600' : 'text-red-600')}>
                      {summary.healthScore}/100 health
                    </span>
                  </div>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-500" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TripStat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-white/60 p-2.5">
      <div className="text-[10px] text-ink-500">{label}</div>
      <div className={cn('mt-0.5 text-sm font-semibold', valueClass ?? 'text-ink-100')}>{value}</div>
    </div>
  );
}
