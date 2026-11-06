import { useEffect, useMemo, type ReactNode } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { cn } from '@/lib/utils';

export type MarkerKind = 'hotel' | 'attraction' | 'event' | 'flight' | 'train' | 'destination';

export interface DiscoveryMarker {
  id: string;
  kind: MarkerKind;
  name: string;
  latitude: number;
  longitude: number;
  /** Popup body: type, source, location, details, Add to Trip. */
  popup?: ReactNode;
  heading?: number | null;
}

const GLYPH: Record<MarkerKind, string> = { hotel: '🏨', attraction: '📍', event: '🎟', flight: '✈', train: '🚆', destination: '⭐' };

function icon(m: DiscoveryMarker) {
  const rotate = m.kind === 'flight' && m.heading != null ? `transform:rotate(${Math.round(m.heading - 45)}deg);` : '';
  return L.divIcon({
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    html: `<div style="width:34px;height:34px;border-radius:9999px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px #1F6BFF,0 6px 14px rgba(0,0,0,.35);font-size:17px"><span style="${rotate}display:inline-block">${GLYPH[m.kind]}</span></div>`,
  });
}

function Fit({ points }: { points: [number, number][] }) {
  const map = useMap();
  const key = points.map((p) => p.join(',')).join('|');
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) map.setView(points[0], 9);
    else map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 12 });
    // re-fit only when the marker set changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map]);
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

interface DiscoveryMapProps {
  markers: DiscoveryMarker[];
  center?: [number, number];
  /** Optional provider route (e.g. train halts) drawn under the markers. */
  route?: [number, number][];
  className?: string;
  children?: ReactNode;
}

/** Map layer for live and discovery results, in the same satellite style as
 * the itinerary map. Only provider coordinates are plotted - items without
 * coordinates simply have no marker. */
export function DiscoveryMap({ markers, center, route, className, children }: DiscoveryMapProps) {
  const points = useMemo(() => {
    const pts = markers.map((m) => [m.latitude, m.longitude] as [number, number]);
    return pts.length ? pts : center ? [center] : [];
  }, [markers, center]);
  return (
    <div className={cn('ss-map relative isolate overflow-hidden', className)}>
      <MapContainer center={center ?? [22, 79]} zoom={center ? 10 : 4} minZoom={3} maxZoom={17} zoomControl scrollWheelZoom={false} className="absolute inset-0 h-full w-full" attributionControl>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics · POIs &copy; OpenStreetMap contributors"
          maxNativeZoom={17}
        />
        <Fit points={points} />
        {route && route.length > 1 && <Polyline positions={route} pathOptions={{ color: '#FFFFFF', weight: 2.5, dashArray: '4 6', opacity: 0.8 }} />}
        {markers.map((m) => (
          <Marker key={m.id} position={[m.latitude, m.longitude]} icon={icon(m)} title={m.name}>
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>
      {children}
    </div>
  );
}
