import { useState, useEffect } from 'react';
import { useApp } from '@/store/AppContext';
import * as api from '@/services/api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/status';
import type { Booking } from '@/types';
import { Plane, Bed, Car, Mountain, Search, Filter, AlertTriangle } from 'lucide-react';

const categoryIcons = {
  flight: Plane,
  hotel: Bed,
  transfer: Car,
  activity: Mountain,
  return: Plane,
};

const categories = ['all', 'flight', 'hotel', 'transfer', 'activity', 'return'] as const;

export function BookingsPage() {
  const { tripId, trip } = useApp();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<typeof categories[number]>('all');
  const [search, setSearch] = useState('');

  const loadBookings = () => {
    let cancelled = false;
    setLoadError(null);
    api
      .getBookings(tripId)
      .then((data) => {
        if (!cancelled) setBookings(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setBookings(null);
          setLoadError(err instanceof api.ApiError ? err.message : 'Could not load your bookings.');
        }
      });
    return () => {
      cancelled = true;
    };
  };

  useEffect(loadBookings, [tripId, trip.healthScore]);

  if (loadError) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-xl border border-red-500/20 p-8 text-center">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <p className="text-sm text-ink-100">{loadError}</p>
        <button
          onClick={loadBookings}
          className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-500/10"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!bookings) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const filtered = bookings.filter((b) => {
    const matchCategory = filter === 'all' || b.category === filter;
    const matchSearch = !search ||
      b.provider.toLowerCase().includes(search.toLowerCase()) ||
      b.confirmation.toLowerCase().includes(search.toLowerCase()) ||
      (b.route ?? '').toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalValue = bookings.reduce((sum, b) => sum + b.cost, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-100">Bookings</h1>
          <p className="mt-1 text-sm text-ink-400">{bookings.length} bookings · Total value {formatCurrency(totalValue)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by provider, confirmation, or route..."
            className="w-full rounded-lg border border-ink-600 bg-ink-800 pl-9 pr-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-accent-500/50 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-ink-500" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition',
                filter === cat ? 'bg-accent-500/15 text-accent-700 border border-accent-500/30' : 'text-ink-400 hover:bg-ink-800 hover:text-ink-100 border border-transparent'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((booking, i) => (
          <BookingCard key={booking.id} booking={booking} delay={i * 50} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-ink-600 bg-ink-900 p-8 text-center">
          <p className="text-sm text-ink-400">No bookings match your search.</p>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking, delay }: { booking: Booking; delay: number }) {
  const Icon = categoryIcons[booking.category];

  return (
    <div className="glass rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-700 bg-ink-800">
            <Icon className="h-4 w-4 text-accent-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-ink-100">{booking.provider}</div>
            <div className="text-[10px] text-ink-500 font-mono">{booking.confirmation}</div>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-[10px] text-ink-500">Date</div>
          <div className="text-ink-200">{booking.date}</div>
        </div>
        <div>
          <div className="text-[10px] text-ink-500">Time</div>
          <div className="text-ink-200">{booking.time}</div>
        </div>
        {booking.route && (
          <div>
            <div className="text-[10px] text-ink-500">Route</div>
            <div className="text-ink-200">{booking.route}</div>
          </div>
        )}
        <div>
          <div className="text-[10px] text-ink-500">Cost</div>
          <div className="text-ink-100 font-medium">{formatCurrency(booking.cost)}</div>
        </div>
      </div>

      <div className="mt-3 border-t border-ink-700 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn(
            'rounded px-1.5 py-0.5 text-[9px] font-medium',
            booking.refundable ? 'bg-emerald-500/10 text-emerald-700' : 'bg-red-500/10 text-red-700'
          )}>
            {booking.refundable ? 'REFUNDABLE' : 'NON-REFUND'}
          </span>
          {booking.riskLevel >= 30 && <RiskBadge level={booking.riskLevel >= 60 ? 'high' : 'medium'} percent={booking.riskLevel} />}
        </div>
        <span className="text-[10px] text-ink-500">{booking.cancellationPolicy}</span>
      </div>
    </div>
  );
}
