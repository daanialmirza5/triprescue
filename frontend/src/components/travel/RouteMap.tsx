import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { cn } from '@/lib/utils';
import { formatTime, type JourneyLeg, type JourneyStop } from '@/lib/journey';
import { statusLabel, statusTone, toneClasses } from '@/lib/status';
import type { StopWeather } from '@/hooks/useTravelData';
import type { CascadeLink } from '@/services/api';
import type { NodeStatus } from '@/types';
import { Crosshair, Minus, Plus } from 'lucide-react';

export interface MapLayers {
  flights: boolean;
  trains: boolean;
  weather: boolean;
  airports: boolean;
}

interface RouteMapProps {
  stops: JourneyStop[];
  legs: JourneyLeg[];
  layers?: MapLayers;
  weather?: StopWeather[];
  maxZoom?: number;
  /** Edge padding (px) when fitting the journey into view. */
  padding?: number;
  className?: string;
  /** Overlays rendered above the map (legends, filters, badges). */
  children?: ReactNode;
  onSelectStop?: (stop: JourneyStop) => void;
  /** Per-booking coordinates, used only to place cascade arcs (legs and stops stay city-based). */
  nodePositions?: { id: string; lat: number | null; lng: number | null }[];
  /** Node-to-node links of the active disruption, drawn as animated arcs. */
  cascade?: CascadeLink[];
}

const ALL_LAYERS: MapLayers = { flights: true, trains: true, weather: true, airports: true };
type Located = JourneyStop & { lat: number; lng: number };
const located = (s?: JourneyStop): s is Located => !!s && s.lat != null && s.lng != null;

/** Great-circle-looking arc between two points (quadratic Bézier in lat/lng space). */
function arc(a: [number, number], b: [number, number], bend = 0.22, steps = 40): [number, number][] {
  const [lat1, lng1] = a;
  const [lat2, lng2] = b;
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const ctrl: [number, number] = [midLat + dLng * bend, midLng - dLat * bend];
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const lat = (1 - t) ** 2 * lat1 + 2 * (1 - t) * t * ctrl[0] + t ** 2 * lat2;
    const lng = (1 - t) ** 2 * lng1 + 2 * (1 - t) * t * ctrl[1] + t ** 2 * lng2;
    return [lat, lng];
  });
}

/** Cascade arcs use the Digital Twin overlay's curve (same function and defaults),
 * so real and hypothetical cascades look alike. */
function cascadeArc(a: [number, number], b: [number, number], bend = 0.18, steps = 32): [number, number][] {
  const ctrl: [number, number] = [(a[0] + b[0]) / 2 + (b[1] - a[1]) * bend, (a[1] + b[1]) / 2 - (b[0] - a[0]) * bend];
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctrl[0] + t ** 2 * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctrl[1] + t ** 2 * b[1]];
  });
}

// Same "same place" rule as the Digital Twin overlay's sites.
const positionKey = ([lat, lng]: [number, number]) => `${lat.toFixed(2)},${lng.toFixed(2)}`;

const legColor = (leg: JourneyLeg) => {
  if (leg.status === 'delayed' || leg.status === 'broken' || leg.status === 'cancelled') return '#FF5A5A';
  if (leg.status === 'at-risk') return '#FBBF24';
  if (leg.status === 'recovered') return '#38BDF8';
  return '#FFFFFF';
};

type LabelSide = 'below' | 'left' | 'right';

/** Labels sit below a marker unless another stop is close by, then on the far side. */
function labelSide(stop: Located, all: Located[]): LabelSide {
  const others = all.filter((o) => o !== stop);
  if (!others.length) return 'below';
  const nearest = others.reduce((a, b) => (Math.hypot(a.lat - stop.lat, a.lng - stop.lng) < Math.hypot(b.lat - stop.lat, b.lng - stop.lng) ? a : b));
  if (Math.hypot(nearest.lat - stop.lat, nearest.lng - stop.lng) > 7) return 'below';
  return nearest.lng >= stop.lng ? 'left' : 'right';
}

function stopIcon(stop: JourneyStop, side: LabelSide) {
  const hex = toneClasses[statusTone[stop.status]].hex;
  const label = stop.code ?? stop.city;
  return L.divIcon({
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="position:relative;width:28px;height:28px">
      <span style="position:absolute;inset:0;border-radius:9999px;background:${hex};opacity:.35;animation:pulseRing 2s cubic-bezier(.4,0,.6,1) infinite"></span>
      <span style="position:absolute;inset:5px;border-radius:9999px;background:#fff;box-shadow:0 0 0 3px ${hex},0 4px 12px rgba(0,0,0,.35)"></span>
      <span style="position:absolute;inset:10px;border-radius:9999px;background:${hex}"></span>
      <span style="position:absolute;${side === 'below' ? 'top:32px;left:50%;transform:translateX(-50%)' : side === 'left' ? 'right:34px;top:50%;transform:translateY(-50%)' : 'left:34px;top:50%;transform:translateY(-50%)'};color:#fff;font-weight:800;font-size:15px;letter-spacing:.02em;text-shadow:0 2px 6px rgba(0,0,0,.75);white-space:nowrap">${label}</span>
    </div>`,
  });
}

function delayIcon(minutes: number) {
  return L.divIcon({
    className: '',
    iconSize: [80, 26],
    iconAnchor: [-8, 36],
    html: `<span style="display:inline-block;background:#EF4444;color:#fff;font-weight:700;font-size:13px;padding:4px 9px;border-radius:8px;box-shadow:0 6px 16px -6px rgba(239,68,68,.9);white-space:nowrap">+${minutes} min</span>`,
  });
}

function planeIcon(angleDeg: number) {
  return L.divIcon({
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    html: `<svg width="34" height="34" viewBox="0 0 24 24" style="transform:rotate(${angleDeg}deg);filter:drop-shadow(0 3px 6px rgba(0,0,0,.55))"><path fill="#fff" d="M21.5 12c0-.6-.5-1-1.1-1H15l-4.6-7.2c-.2-.3-.5-.5-.9-.5H8.3l2.3 7.7H5.9L4.3 8.8c-.1-.2-.4-.3-.6-.3H2.5l1.2 3.5-1.2 3.5h1.2c.2 0 .5-.1.6-.3l1.6-2.2h4.7l-2.3 7.7h1.2c.4 0 .7-.2.9-.5L15 13h5.4c.6 0 1.1-.4 1.1-1z"/></svg>`,
  });
}

function weatherIcon(w: StopWeather) {
  const code = w.weather.weatherCode;
  const glyph = code >= 95 ? '⛈' : code >= 71 && code <= 86 ? '❄' : code >= 51 ? '🌧' : code >= 45 ? '🌫' : code >= 1 ? '⛅' : '☀';
  const severe = code >= 61 || w.weather.precipitationProbability >= 60;
  return L.divIcon({
    className: '',
    iconSize: [150, 44],
    iconAnchor: [-18, 50],
    html: `<div style="display:flex;align-items:center;gap:8px;background:rgba(11,27,58,.78);backdrop-filter:blur(6px);border:1px solid ${severe ? 'rgba(251,191,36,.6)' : 'rgba(255,255,255,.18)'};color:#fff;border-radius:12px;padding:6px 10px;white-space:nowrap;box-shadow:0 8px 20px -10px rgba(0,0,0,.6)">
      <span style="font-size:18px;line-height:1">${glyph}</span>
      <span style="line-height:1.15"><b style="font-size:13px">${w.city} · ${w.weather.temperature}°C</b><br/><span style="font-size:11px;opacity:.85">${w.weather.label}</span></span>
    </div>`,
  });
}

function MapControls({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      L.DomEvent.disableClickPropagation(ref.current);
      L.DomEvent.disableScrollPropagation(ref.current);
    }
  }, []);
  const btn = 'flex h-10 w-10 items-center justify-center text-ink transition hover:bg-canvas hover:text-brand';
  return (
    <div ref={ref} className="absolute right-4 top-1/2 z-[500] flex -translate-y-1/2 flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
        <button className={btn} onClick={() => map.zoomIn()} aria-label="Zoom in"><Plus className="h-5 w-5" /></button>
        <div className="h-px bg-line" />
        <button className={btn} onClick={() => map.zoomOut()} aria-label="Zoom out"><Minus className="h-5 w-5" /></button>
      </div>
      <button className={cn(btn, 'rounded-xl border border-line bg-white shadow-card')} onClick={() => (bounds ? map.flyToBounds(bounds, { padding: [70, 70], maxZoom: 5, duration: 0.8 }) : map.flyTo([22, 60], 2))} aria-label="Center on my journey">
        <Crosshair className="h-5 w-5" />
      </button>
    </div>
  );
}

function FitToJourney({ bounds, maxZoom, padding }: { bounds: L.LatLngBounds | null; maxZoom: number; padding: number }) {
  const map = useMap();
  const key = bounds?.toBBoxString();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [padding, padding], maxZoom });
    // re-fit only when the journey's extent changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, maxZoom, padding, map]);
  useEffect(() => {
    // The container can resize with the layout (sidebar collapse, tab switch).
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

export function RouteMap({ stops, legs, layers = ALL_LAYERS, weather = [], maxZoom = 5, padding = 70, className, children, onSelectStop, nodePositions, cascade }: RouteMapProps) {
  const points = stops.filter(located);
  const extentKey = points.map((p) => `${p.lat},${p.lng}`).join('|');
  const bounds = useMemo(
    () => (points.length ? L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number])) : null),
    // `extentKey` fully describes `points`
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [extentKey]
  );

  const positionsKey = (nodePositions ?? []).map((p) => `${p.id}:${p.lat},${p.lng}`).join('|');
  const nodePosition = useMemo(
    () => new Map((nodePositions ?? []).flatMap((p) => (p.lat != null && p.lng != null ? [[p.id, [p.lat, p.lng] as [number, number]] as const] : []))),
    // `positionsKey` fully describes `nodePositions`
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [positionsKey]
  );
  // Cascade arcs render only when both props are given; otherwise the map is unchanged.
  const cascadePaths = cascade?.length && nodePositions?.length
    ? cascade
        .filter((c) => c.fromNodeId !== 'weather')
        .map((c) => ({ c, a: nodePosition.get(c.fromNodeId), b: nodePosition.get(c.toNodeId) }))
        .filter((d): d is { c: CascadeLink; a: [number, number]; b: [number, number] } => !!d.a && !!d.b && positionKey(d.a) !== positionKey(d.b))
    : [];

  const stopByCity = new Map(points.map((s) => [s.city, s]));
  const drawn = legs
    .map((leg) => ({ leg, a: stopByCity.get(leg.from), b: stopByCity.get(leg.to) }))
    .filter((d): d is { leg: JourneyLeg; a: Located; b: Located } => !!d.a && !!d.b)
    .filter(({ leg }) => (leg.mode === 'flight' ? layers.flights : layers.trains));

  // The live aircraft sits on the first flight that hasn't completed yet.
  const activeFlight = drawn.find(({ leg }) => leg.mode === 'flight' && leg.status !== 'healthy') ?? drawn.find(({ leg }) => leg.mode === 'flight');

  return (
    <div className={cn('ss-map relative isolate overflow-hidden', className)}>
      <MapContainer center={[22, 60]} zoom={2} minZoom={2} maxZoom={10} zoomControl={false} worldCopyJump scrollWheelZoom={false} className="absolute inset-0 h-full w-full" attributionControl>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics"
          maxNativeZoom={17}
        />
        <FitToJourney bounds={bounds} maxZoom={maxZoom} padding={padding} />
        {drawn.map(({ leg, a, b }) => {
          const path = arc([a.lat, a.lng], [b.lat, b.lng], leg.mode === 'flight' ? 0.22 : 0.06);
          const color = legColor(leg);
          return (
            <Polyline
              key={leg.node.id}
              positions={path}
              pathOptions={{ color, weight: leg.mode === 'flight' ? 2.6 : 2.2, dashArray: leg.mode === 'flight' ? '7 7' : '3 6', opacity: 0.95, className: leg.status !== 'healthy' ? 'ss-route-flow' : undefined }}
            >
              <Tooltip sticky>{`${leg.node.subtitle || leg.node.title} · ${statusLabel[leg.status]}`}</Tooltip>
            </Polyline>
          );
        })}
        {cascadePaths.map(({ c, a, b }) => (
          <Polyline
            key={`cascade-${c.fromNodeId}-${c.toNodeId}`}
            positions={cascadeArc(a, b)}
            pathOptions={{ color: c.status === 'at-risk' || c.status === 'delayed' ? '#FBBF24' : '#FF5A5A', weight: 3.5, dashArray: '8 6', opacity: 0.95, className: 'ss-route-flow' }}
          >
            <Tooltip sticky>{`Cascade → ${statusLabel[c.status as NodeStatus] ?? c.status}`}</Tooltip>
          </Polyline>
        ))}
        {activeFlight && layers.flights && (() => {
          const path = arc([activeFlight.a.lat, activeFlight.a.lng], [activeFlight.b.lat, activeFlight.b.lng]);
          const i = Math.floor(path.length * 0.45);
          const [p1, p2] = [path[i], path[i + 1]];
          const angle = (Math.atan2(-(p2[0] - p1[0]), p2[1] - p1[1]) * 180) / Math.PI;
          return (
            <Marker position={path[i]} icon={planeIcon(angle)} keyboard={false}>
              <Tooltip direction="top" offset={[0, -14]}>
                <b>{activeFlight.leg.node.subtitle}</b>
                <br />
                {activeFlight.leg.from} → {activeFlight.leg.to} · {statusLabel[activeFlight.leg.status]}
              </Tooltip>
            </Marker>
          );
        })()}
        {layers.airports && points.map((stop) => (
          <Marker key={stop.city} position={[stop.lat, stop.lng]} icon={stopIcon(stop, labelSide(stop, points))} eventHandlers={onSelectStop ? { click: () => onSelectStop(stop) } : undefined}>
            <Tooltip direction="top" offset={[0, -16]}>
              <b>{stop.city}{stop.code ? ` (${stop.code})` : ''}</b>
              <br />
              {statusLabel[stop.status]}{stop.time ? ` · ${formatTime(stop.time)}` : ''}
            </Tooltip>
          </Marker>
        ))}
        {layers.flights && drawn
          .filter(({ leg }) => leg.status === 'delayed' && leg.delayMinutes > 0)
          .map(({ leg, b }) => <Marker key={`delay-${leg.node.id}`} position={[b.lat, b.lng]} icon={delayIcon(leg.delayMinutes)} interactive={false} />)}
        {layers.weather && weather.map((w) => <Marker key={`wx-${w.city}`} position={[w.lat, w.lng]} icon={weatherIcon(w)} interactive={false} />)}
        <MapControls bounds={bounds} />
      </MapContainer>
      {children}
    </div>
  );
}
