import { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { edgeColors } from '@/lib/status';
import { cn } from '@/lib/utils';
import { MapPin, Plane, Navigation } from 'lucide-react';

// Positions are derived entirely from each node's own lat/lng (the itinerary's
// real coordinates, computed by the backend) - there is no separate hardcoded
// location list to keep in sync with the itinerary.
function projectToViewBox(nodes: { id: string; lat?: number; lng?: number }[]) {
  const withCoords = nodes.filter((n): n is { id: string; lat: number; lng: number } => n.lat != null && n.lng != null);
  if (withCoords.length === 0) return new Map<string, { x: number; y: number }>();

  const lats = withCoords.map((n) => n.lat);
  const lngs = withCoords.map((n) => n.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;

  const map = new Map<string, { x: number; y: number }>();
  for (const n of withCoords) {
    const x = 10 + ((n.lng - minLng) / lngRange) * 80;
    const y = 10 + ((maxLat - n.lat) / latRange) * 80;
    map.set(n.id, { x, y });
  }
  return declutter(map);
}

/** Itinerary stops that are geographically close (e.g. a city, its hotel, and
 * a nearby excursion) can project to nearly the same point at this map's
 * scale, making markers/labels illegible. Nudges any pair closer than
 * MIN_DISTANCE apart along the line between them until they clear it, so
 * every marker stays distinguishable without moving distant points at all. */
function declutter(positions: Map<string, { x: number; y: number }>): Map<string, { x: number; y: number }> {
  const MIN_DISTANCE = 9;
  const ids = [...positions.keys()];
  const next = new Map(positions);

  for (let pass = 0; pass < 6; pass++) {
    let moved = false;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = next.get(ids[i])!;
        const b = next.get(ids[j])!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist >= MIN_DISTANCE) continue;
        moved = true;
        const angle = dist === 0 ? (i * 2.4 + j) : Math.atan2(dy, dx);
        const push = (MIN_DISTANCE - dist) / 2 + 0.5;
        const ux = Math.cos(angle);
        const uy = Math.sin(angle);
        next.set(ids[i], { x: a.x - ux * push, y: a.y - uy * push });
        next.set(ids[j], { x: b.x + ux * push, y: b.y + uy * push });
      }
    }
    if (!moved) break;
  }
  return next;
}

export function MapView() {
  const { trip } = useApp();

  const positions = useMemo(() => projectToViewBox(trip.nodes), [trip.nodes]);

  const markers = useMemo(
    () => trip.nodes.filter((n) => positions.has(n.id) && n.category !== 'connection'),
    [trip.nodes, positions]
  );

  const routes = useMemo(
    () =>
      trip.edges.filter(
        (e) => positions.has(e.source) && positions.has(e.target) && e.source !== e.target
      ),
    [trip.edges, positions]
  );

  const nodeById = useMemo(() => new Map(trip.nodes.map((n) => [n.id, n])), [trip.nodes]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-ink-100">Trip Map</h1>
        <p className="mt-1 text-sm text-ink-400">Geographic view of your itinerary route.</p>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-ink-950 bg-dot-grid">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            {routes.map((route) => {
              const from = positions.get(route.source)!;
              const to = positions.get(route.target)!;
              const color = edgeColors[route.status];
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2 - 5;
              const label = nodeById.get(route.target)?.label ?? route.id;
              return (
                <g key={route.id}>
                  <path
                    d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="0.4"
                    strokeDasharray={route.status === 'broken' || route.status === 'at-risk' ? '1.5 1' : '0'}
                    opacity="0.8"
                    className="transition-all duration-700"
                  />
                  <text x={midX} y={midY - 1} fill={color} fontSize="1.8" textAnchor="middle" className="font-mono opacity-70">
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>

          {markers.map((node) => {
            const pos = positions.get(node.id)!;
            const isAirportLike = node.category === 'flight' || node.category === 'return';
            const isHotel = node.category === 'hotel';
            return (
              <div
                key={node.id}
                className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-lg transition-all',
                    isAirportLike ? 'border-accent-400 bg-accent-500/20' : isHotel ? 'border-electric-400 bg-electric-500/20' : 'border-amber-400 bg-amber-500/10'
                  )}
                >
                  {isAirportLike ? (
                    <Plane className="h-3 w-3 text-accent-700" />
                  ) : isHotel ? (
                    <MapPin className="h-3 w-3 text-electric-700" />
                  ) : (
                    <Navigation className="h-3 w-3 text-amber-700" />
                  )}
                </div>
                <span className="mt-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-ink-100 backdrop-blur shadow-card">
                  {node.location.split('(')[0].trim()}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <MapLegend color="bg-emerald-400" label="Healthy route" />
          <MapLegend color="bg-red-400" label="Disrupted route" />
          <MapLegend color="bg-accent-400" label="Recovery route" />
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <h3 className="text-sm font-semibold text-ink-100 mb-3">Route Details</h3>
        <div className="space-y-2">
          {routes.map((route) => (
            <div key={route.id} className="flex items-center gap-3 rounded-lg border border-ink-700 bg-white/60 p-3">
              <Plane className="h-4 w-4 text-accent-600" />
              <span className="text-sm text-ink-100">{nodeById.get(route.target)?.label ?? route.id}</span>
              <span className="ml-auto text-xs text-ink-400">
                {nodeById.get(route.source)?.location} → {nodeById.get(route.target)?.location}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MapLegend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-2 w-6 rounded-full', color)} />
      <span className="text-xs text-ink-400">{label}</span>
    </div>
  );
}
