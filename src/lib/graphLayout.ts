import type { DependencyEdgeData } from '@/types';

/** Simple layered (Sugiyama-style) auto-layout: each node's layer is
 * 1 + max(layer of its predecessors), so dependencies always flow left to
 * right; nodes sharing a layer are stacked vertically. Used as a fallback
 * for any itinerary that doesn't have hand-authored positions in
 * mockData.nodePositions (currently just the Ladakh trip). */
export function computeLayeredLayout(
  nodeIds: string[],
  edges: DependencyEdgeData[],
  options: { xSpacing?: number; ySpacing?: number } = {}
): Record<string, { x: number; y: number }> {
  const xSpacing = options.xSpacing ?? 320;
  const ySpacing = options.ySpacing ?? 160;

  const incoming = new Map<string, string[]>();
  const outgoing = new Map<string, string[]>();
  for (const id of nodeIds) {
    incoming.set(id, []);
    outgoing.set(id, []);
  }
  for (const e of edges) {
    if (!incoming.has(e.target) || !outgoing.has(e.source)) continue;
    incoming.get(e.target)!.push(e.source);
    outgoing.get(e.source)!.push(e.target);
  }

  const layer = new Map<string, number>();
  const inDegree = new Map<string, number>();
  for (const id of nodeIds) inDegree.set(id, incoming.get(id)!.length);

  const queue = nodeIds.filter((id) => inDegree.get(id) === 0);
  queue.forEach((id) => layer.set(id, 0));

  let i = 0;
  const order = [...queue];
  while (i < order.length) {
    const current = order[i++];
    const currentLayer = layer.get(current)!;
    for (const next of outgoing.get(current) ?? []) {
      layer.set(next, Math.max(layer.get(next) ?? 0, currentLayer + 1));
      const remaining = (inDegree.get(next) ?? 0) - 1;
      inDegree.set(next, remaining);
      if (remaining === 0) order.push(next);
    }
  }
  // Any node not reached (shouldn't happen for a valid DAG, but guards
  // against a data issue) gets appended to its own layer at the end.
  for (const id of nodeIds) {
    if (!layer.has(id)) layer.set(id, order.length ? Math.max(...layer.values()) + 1 : 0);
  }

  const byLayer = new Map<number, string[]>();
  for (const id of nodeIds) {
    const l = layer.get(id)!;
    if (!byLayer.has(l)) byLayer.set(l, []);
    byLayer.get(l)!.push(id);
  }

  const positions: Record<string, { x: number; y: number }> = {};
  for (const [l, ids] of byLayer) {
    const offset = -((ids.length - 1) * ySpacing) / 2;
    ids.forEach((id, idx) => {
      positions[id] = { x: l * xSpacing, y: offset + idx * ySpacing };
    });
  }
  return positions;
}
