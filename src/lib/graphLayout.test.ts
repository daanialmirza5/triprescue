import { describe, expect, it } from 'vitest';
import { computeLayeredLayout } from './graphLayout';
import type { DependencyEdgeData } from '@/types';

function edge(id: string, source: string, target: string): DependencyEdgeData {
  return { id, source, target, status: 'healthy' };
}

describe('computeLayeredLayout', () => {
  it('places a root node with no dependencies at layer 0', () => {
    const positions = computeLayeredLayout(['a'], []);
    expect(positions.a).toEqual({ x: 0, y: 0 });
  });

  it('advances each node one layer past its dependency in a simple chain', () => {
    const positions = computeLayeredLayout(
      ['a', 'b', 'c'],
      [edge('e1', 'a', 'b'), edge('e2', 'b', 'c')]
    );
    expect(positions.a.x).toBe(0);
    expect(positions.b.x).toBe(320);
    expect(positions.c.x).toBe(640);
    // A straight chain has one node per layer, so every y stays centered.
    expect(positions.a.y).toBe(0);
    expect(positions.b.y).toBe(0);
    expect(positions.c.y).toBe(0);
  });

  it("uses a node's LATEST predecessor layer, not just any predecessor", () => {
    // a -> c (layer 1) and b -> c (layer 1) would both put c at layer 1, but
    // a -> b -> c means b sits at layer 1, so c (depending on both a and b)
    // must be pushed to layer 2 - the max of its predecessors' layers + 1.
    const positions = computeLayeredLayout(
      ['a', 'b', 'c'],
      [edge('e1', 'a', 'b'), edge('e2', 'a', 'c'), edge('e3', 'b', 'c')]
    );
    expect(positions.c.x).toBe(640); // layer 2
  });

  it('stacks sibling nodes in the same layer symmetrically around y=0', () => {
    const positions = computeLayeredLayout(
      ['root', 'left', 'right'],
      [edge('e1', 'root', 'left'), edge('e2', 'root', 'right')]
    );
    expect(positions.left.y).toBe(-80);
    expect(positions.right.y).toBe(80);
    expect(positions.left.x).toBe(positions.right.x);
  });

  it('respects custom spacing options', () => {
    const positions = computeLayeredLayout(['a', 'b'], [edge('e1', 'a', 'b')], {
      xSpacing: 100,
      ySpacing: 50,
    });
    expect(positions.b.x).toBe(100);
  });

  it('ignores edges that reference a node id outside the given set', () => {
    const positions = computeLayeredLayout(['a', 'b'], [edge('e1', 'a', 'ghost'), edge('e2', 'ghost', 'b')]);
    // Both edges are dropped (unknown endpoint), so a and b are independent roots.
    expect(positions.a.x).toBe(0);
    expect(positions.b.x).toBe(0);
  });

  it('assigns a position to every node even when a cycle prevents reaching it via BFS', () => {
    // a <-> b is not a valid DAG, but the layout must not crash or omit nodes.
    const positions = computeLayeredLayout(['a', 'b'], [edge('e1', 'a', 'b'), edge('e2', 'b', 'a')]);
    expect(Object.keys(positions).sort()).toEqual(['a', 'b']);
  });
});
