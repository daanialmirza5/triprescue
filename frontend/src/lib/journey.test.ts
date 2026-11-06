import { describe, expect, it } from 'vitest';
import type { ItineraryNodeData, Trip } from '@/types';
import { buildJourney, impactCounts, nodeKind, parseEndpoints, tripType } from './journey';

function n(overrides: Partial<ItineraryNodeData>): ItineraryNodeData {
  return {
    id: 'x', category: 'flight', label: '', title: '', subtitle: '', location: '', scheduledTime: '', provider: '',
    cost: 0, cancellationPolicy: '', refundable: false, riskLevel: 0, dependencyCount: 0, status: 'healthy', day: 1, icon: '',
    ...overrides,
  };
}

const trip = (nodes: ItineraryNodeData[], route = 'Mumbai → Delhi → Leh'): Trip => ({
  id: 't', name: 'Ladakh', travelerName: '', route, origin: 'Mumbai', destination: 'Leh', startDate: '12 Sep 2025', endDate: '16 Sep 2025',
  nodes, edges: [], tripValue: 0, healthScore: 80, status: 'disrupted', days: [],
});

describe('parseEndpoints', () => {
  it('reads cities from the title and codes from the label', () => {
    expect(parseEndpoints(n({ title: 'Mumbai → Delhi', label: 'BOM → DEL' }))).toEqual({ from: 'Mumbai', to: 'Delhi', fromCode: 'BOM', toCode: 'DEL' });
  });

  it('strips booking-type words such as "Transfer"', () => {
    expect(parseEndpoints(n({ title: 'Jaipur → Agra Transfer', label: 'Jaipur → Agra' }))?.to).toBe('Agra');
  });

  it('ignores local airport-to-hotel transfers', () => {
    expect(parseEndpoints(n({ title: 'Airport Transfer', subtitle: 'Leh Airport → Hotel', label: 'Airport Transfer' }))).toBeNull();
  });
});

describe('nodeKind', () => {
  it('detects trains among transfers', () => {
    expect(nodeKind(n({ category: 'transfer', title: 'Delhi → Agra', subtitle: 'Gatimaan Express' }))).toBe('train');
    expect(nodeKind(n({ category: 'transfer', title: 'Airport Transfer', subtitle: 'Cab' }))).toBe('transfer');
  });
});

describe('buildJourney', () => {
  const nodes = [
    n({ id: 'bom-del', title: 'Mumbai → Delhi', label: 'BOM → DEL', status: 'delayed', scheduledStart: '2025-09-12T06:30:00', scheduledEnd: '2025-09-12T08:45:00', actualEnd: '2025-09-12T10:20:00' }),
    n({ id: 'conn', category: 'connection', title: 'Delhi Connection', label: 'DEL Connection', status: 'at-risk' }),
    n({ id: 'del-leh', title: 'Delhi → Leh', label: 'DEL → IXL', status: 'at-risk', scheduledStart: '2025-09-12T10:15:00', scheduledEnd: '2025-09-12T11:30:00' }),
    n({ id: 'hotel', category: 'hotel', title: 'Grand Dragon', status: 'healthy' }),
    n({ id: 'ret', category: 'return', icon: 'plane', title: 'Leh → Delhi → Mumbai', label: 'Return' }),
  ];

  it('orders stops from the route and joins them with matching legs', () => {
    const j = buildJourney(trip(nodes));
    expect(j.stops.map((s) => s.city)).toEqual(['Mumbai', 'Delhi', 'Leh']);
    expect(j.legs.map((l) => l.node.id)).toEqual(['bom-del', 'del-leh']);
    expect(j.stops.map((s) => s.code)).toEqual(['BOM', 'DEL', 'IXL']);
  });

  it('carries leg status to the arrival stop and computes delays', () => {
    const j = buildJourney(trip(nodes));
    expect(j.stops[1].status).toBe('delayed');
    expect(j.stops[2].status).toBe('at-risk');
    expect(j.legs[0].delayMinutes).toBe(95);
  });

  it('counts impact per booking type, excluding internal connection windows', () => {
    expect(impactCounts(trip(nodes))).toMatchObject({ flightsDelayed: 2, connectionsAtRisk: 0, hotelsImpacted: 0 });
  });
});

describe('tripType', () => {
  it('labels trips by purpose and geography', () => {
    expect(tripType({ name: 'Goa Getaway', route: 'Mumbai → Goa', origin: 'Mumbai', destination: 'Goa' })).toBe('Leisure Trip');
    expect(tripType({ name: 'Paris', route: 'Delhi → Paris → Nice', origin: 'Delhi', destination: 'Nice' })).toBe('International Trip');
    expect(tripType({ name: 'Client Summit', route: 'Bengaluru → Singapore', origin: 'Bengaluru', destination: 'Singapore' })).toBe('Work Trip');
  });
});
