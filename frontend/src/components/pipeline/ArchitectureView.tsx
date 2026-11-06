import { memo, useMemo } from 'react';
import ReactFlow, { Background, BackgroundVariant, Controls, Handle, Position, type Edge, type Node, type NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import type { Architecture, ArchitectureNode } from '@/services/api';
import { cn } from '@/lib/utils';

const COLUMNS: { layer: ArchitectureNode['layer']; title: string }[] = [
  { layer: 'api', title: 'API routers' },
  { layer: 'service', title: 'Services' },
  { layer: 'engine', title: 'Engines' },
  { layer: 'database', title: 'Repositories' },
  { layer: 'table', title: 'Database tables' },
  { layer: 'provider', title: 'Providers' },
  { layer: 'external', title: 'External APIs' },
];
const COL_W = 250;
const ROW_H = 58;

export type ArchState = 'idle' | 'running' | 'done' | 'failed';
interface ArchNodeData { node: ArchitectureNode; state: ArchState; routes: number; selected: boolean }

const ArchNodeCard = memo(function ArchNodeCard({ data }: NodeProps<ArchNodeData>) {
  const { node, state, routes, selected } = data;
  return (
    <div
      className={cn(
        'w-[210px] rounded-lg border bg-white px-3 py-2 text-left shadow-sm transition',
        state === 'running' && 'border-brand bg-brand-light ring-4 ring-brand/20',
        state === 'done' && 'border-brand/60 bg-brand-light/50',
        state === 'failed' && 'border-danger bg-danger-light',
        state === 'idle' && 'border-line',
        selected && 'outline outline-2 outline-offset-2 outline-brand',
      )}
    >
      <Handle type="target" position={Position.Left} className="!h-1.5 !w-1.5 !border-0 !bg-line-strong" />
      <p className="truncate text-[12px] font-semibold text-ink" title={node.module ?? node.label}>{node.label}</p>
      <p className="truncate text-[10px] text-ink-muted">{node.layer === 'api' ? `${routes} endpoint${routes === 1 ? '' : 's'}` : node.file ?? node.description}</p>
      <Handle type="source" position={Position.Right} className="!h-1.5 !w-1.5 !border-0 !bg-line-strong" />
    </div>
  );
});

const TitleNode = memo(function TitleNode({ data }: NodeProps<{ label: string }>) {
  return <p className="w-[210px] text-[13px] font-bold text-ink">{data.label}</p>;
});

const nodeTypes = { arch: ArchNodeCard, title: TitleNode };

interface ArchitectureViewProps {
  arch: Architecture;
  stateOf: (id: string) => ArchState;
  selectedId: string | null;
  onSelectNode: (id: string) => void;
  onSelectEdge: (id: string) => void;
  className?: string;
}

/** Every router, service, engine, repository, table, provider and external API
 * found in the backend source, connected by the call sites the source proves. */
export function ArchitectureView({ arch, stateOf, selectedId, onSelectNode, onSelectEdge, className }: ArchitectureViewProps) {
  const routeCount = useMemo(() => {
    const m = new Map<string, number>();
    arch.routes.forEach((r) => m.set(r.router, (m.get(r.router) ?? 0) + 1));
    return m;
  }, [arch.routes]);

  const { nodes, edges } = useMemo(() => {
    const flowNodes: Node[] = [];
    COLUMNS.forEach((col, ci) => {
      const inCol = arch.nodes.filter((n) => n.layer === col.layer).sort((a, b) => a.label.localeCompare(b.label));
      flowNodes.push({ id: `title-${col.layer}`, type: 'title', position: { x: ci * COL_W, y: -48 }, data: { label: `${col.title} (${inCol.length})` }, draggable: false, selectable: false });
      inCol.forEach((n, ri) => flowNodes.push({
        id: n.id, type: 'arch', position: { x: ci * COL_W, y: ri * ROW_H },
        data: { node: n, state: stateOf(n.id), routes: routeCount.get(n.id) ?? 0, selected: selectedId === n.id } satisfies ArchNodeData,
      }));
    });
    const flowEdges: Edge[] = arch.edges.map((e) => {
      const a = stateOf(e.source);
      const b = stateOf(e.target);
      const active = a !== 'idle' && b !== 'idle';
      return {
        id: e.id, source: e.source, target: e.target,
        animated: active && (a === 'running' || b === 'running'),
        style: { stroke: active ? (a === 'failed' || b === 'failed' ? '#EF4444' : '#1F6BFF') : '#D5DEEB', strokeWidth: active ? 2.2 : 1 },
      };
    });
    return { nodes: flowNodes, edges: flowEdges };
  }, [arch, stateOf, selectedId, routeCount]);

  return (
    <div className={cn('relative h-[640px] rounded-tile border border-line bg-white', className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        // Readable labels first: fit, but never below 0.6x - pan/zoom for the rest.
        fitViewOptions={{ padding: 0.08, minZoom: 0.6, maxZoom: 1 }}
        minZoom={0.2}
        maxZoom={1.8}
        nodesDraggable={false}
        nodesConnectable={false}
        onNodeClick={(_, n) => { if (!n.id.startsWith('title-')) onSelectNode(n.id); }}
        onEdgeClick={(_, e) => onSelectEdge(e.id)}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#E5EBF4" />
        <Controls showInteractive={false} position="top-right" />
      </ReactFlow>
    </div>
  );
}
