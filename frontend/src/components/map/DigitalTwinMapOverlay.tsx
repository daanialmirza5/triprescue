import { Fragment, useEffect, useMemo, type ReactNode } from 'react';
import L from 'leaflet';
import { Circle, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import type { CascadeLink } from '@/services/api';
import type { NodeStatus } from '@/types';
import { statusLabel, statusTone, toneClasses } from '@/lib/status';
import { cn } from '@/lib/utils';

export interface TwinMapPoint {
  id: string;
  title: string;
  status: NodeStatus;
  lat: number | null;
  lng: number | null;
  directHit?: boolean;
  delayMinutes?: number;
}

interface Site { key: string; lat: number; lng: number; points: TwinMapPoint[]; status: NodeStatus; hit: boolean }

const WORST: NodeStatus[] = ['cancelled', 'broken', 'at-risk', 'delayed', 'recovered', 'healthy'];
const siteKey = (lat: number, lng: number) => `${lat.toFixed(2)},${lng.toFixed(2)}`;

/** Gentle arc between two points (quadratic Bézier in lat/lng space). */
function arc(a: [number, number], b: [number, number], bend = 0.18, steps = 32): [number, number][] {
  const ctrl: [number, number] = [(a[0] + b[0]) / 2 + (b[1] - a[1]) * bend, (a[1] + b[1]) / 2 - (b[0] - a[0]) * bend];
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctrl[0] + t ** 2 * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctrl[1] + t ** 2 * b[1]];
  });
}

function siteIcon(site: Site) {
  const hex = toneClasses[statusTone[site.status]].hex;
  const label = site.points[0].title.split(/\s[→-]\s|,|\s&\s/)[0].slice(0, 22);
  return L.divIcon({
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div style="position:relative;width:22px;height:22px">
      <span style="position:absolute;inset:3px;border-radius:9999px;background:#fff;box-shadow:0 0 0 3px ${hex},0 4px 12px rgba(0,0,0,.4)"></span>
      <span style="position:absolute;inset:7px;border-radius:9999px;background:${hex}"></span>
      <span style="position:absolute;top:24px;left:50%;transform:translateX(-50%);color:#fff;font-weight:700;font-size:12px;text-shadow:0 2px 6px rgba(0,0,0,.8);white-space:nowrap">${label.replace(/[<>&]/g, '')}</span>
    </div>`,
  });
}

function FitSites({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  const key = bounds?.toBBoxString();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [60, 60], maxZoom: 7 });
    // re-fit only when the extent changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map]);
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

interface DigitalTwinMapOverlayProps {
  /** Bookings in itinerary order. */
  points: TwinMapPoint[];
  cascade?: CascadeLink[];
  /** 0..1 scenario severity; scales the radar footprint. */
  severity?: number;
  className?: string;
  children?: ReactNode;
}

/** Itinerary map with the twin's weather overlay: pulsing radar rings where the
 * storm hits a booking directly and red paths along the resulting cascade. */
export function DigitalTwinMapOverlay({ points, cascade = [], severity = 0, className, children }: DigitalTwinMapOverlayProps) {
  const sites = useMemo(() => {
    const map = new Map<string, Site>();
    for (const p of points) {
      if (p.lat == null || p.lng == null) continue;
      const key = siteKey(p.lat, p.lng);
      const site = map.get(key) ?? { key, lat: p.lat, lng: p.lng, points: [], status: 'healthy' as NodeStatus, hit: false };
      site.points.push(p);
      if (WORST.indexOf(p.status) < WORST.indexOf(site.status)) site.status = p.status;
      site.hit ||= !!p.directHit;
      map.set(key, site);
    }
    return [...map.values()];
  }, [points]);

  const siteOf = useMemo(() => {
    const byPoint = new Map<string, Site>();
    sites.forEach((s) => s.points.forEach((p) => byPoint.set(p.id, s)));
    return byPoint;
  }, [sites]);

  const extent = sites.map((s) => s.key).join('|');
  const bounds = useMemo(
    () => (sites.length ? L.latLngBounds(sites.map((s) => [s.lat, s.lng] as [number, number])) : null),
    // `extent` fully describes the site coordinates
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [extent],
  );

  // Route order: consecutive distinct sites.
  const route: Site[] = [];
  for (const p of points) {
    const s = siteOf.get(p.id);
    if (s && route[route.length - 1] !== s) route.push(s);
  }
  const cascadePaths = cascade
    .filter((c) => c.fromNodeId !== 'weather')
    .map((c) => ({ c, a: siteOf.get(c.fromNodeId), b: siteOf.get(c.toNodeId) }))
    .filter((d): d is { c: CascadeLink; a: Site; b: Site } => !!d.a && !!d.b && d.a !== d.b);
  const radius = 20_000 + severity * 90_000;

  return (
    <div className={cn('ss-map relative isolate overflow-hidden', className)}>
      <MapContainer center={[22, 78]} zoom={4} minZoom={2} maxZoom={10} zoomControl={false} scrollWheelZoom={false} className="absolute inset-0 h-full w-full" attributionControl>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics"
          maxNativeZoom={17}
        />
        <FitSites bounds={bounds} />
        {route.slice(1).map((b, i) => (
          <Polyline key={`route-${route[i].key}-${b.key}`} positions={arc([route[i].lat, route[i].lng], [b.lat, b.lng], 0.08)} pathOptions={{ color: '#FFFFFF', weight: 2, dashArray: '4 7', opacity: 0.55 }} />
        ))}
        {cascadePaths.map(({ c, a, b }) => (
          <Polyline
            key={`cascade-${c.fromNodeId}-${c.toNodeId}`}
            positions={arc([a.lat, a.lng], [b.lat, b.lng])}
            pathOptions={{ color: c.status === 'at-risk' || c.status === 'delayed' ? '#FBBF24' : '#FF4D4D', weight: 3.5, dashArray: '8 6', opacity: 0.95, className: 'ss-route-flow' }}
          >
            <Tooltip sticky>{`Cascade → ${statusLabel[c.status as NodeStatus] ?? c.status}`}</Tooltip>
          </Polyline>
        ))}
        {sites.filter((s) => s.hit).map((s) => (
          <Fragment key={`radar-${s.key}`}>
            <Circle center={[s.lat, s.lng]} radius={radius} pathOptions={{ color: '#EF4444', weight: 1.5, fillColor: '#EF4444', fillOpacity: 0.12, dashArray: '3 5' }} />
            {[1, 2, 3].map((n) => (
              <Circle key={n} center={[s.lat, s.lng]} radius={radius} pathOptions={{ color: '#FF6B6B', weight: 2, fillOpacity: 0, className: `ss-radar ss-radar-${n}` }} />
            ))}
          </Fragment>
        ))}
        {sites.map((s) => (
          <Marker key={s.key} position={[s.lat, s.lng]} icon={siteIcon(s)}>
            <Tooltip direction="top" offset={[0, -12]}>
              {s.points.map((p) => (
                <div key={p.id}><b>{p.title}</b> · {statusLabel[p.status]}{p.delayMinutes ? ` (+${p.delayMinutes} min)` : ''}{p.directHit ? ' · direct weather hit' : ''}</div>
              ))}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
      {children}
    </div>
  );
}
