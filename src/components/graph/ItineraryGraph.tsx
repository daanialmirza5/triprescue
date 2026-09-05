import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  MarkerType,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ItineraryGraphNode } from '@/components/graph/ItineraryGraphNode';
import { edgeColors, delayLabel } from '@/lib/status';
import { nodePositions } from '@/data/mockData';
import { computeLayeredLayout } from '@/lib/graphLayout';
import type { ItineraryNodeData, DependencyEdgeData } from '@/types';
import { ZoomIn, ZoomOut, Maximize, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const nodeTypes: NodeTypes = {
  itinerary: ItineraryGraphNode,
};

interface ItineraryGraphProps {
  nodes: ItineraryNodeData[];
  edges: DependencyEdgeData[];
  onNodeClick?: (nodeId: string) => void;
  className?: string;
}

function GraphInner({ nodes, edges, onNodeClick, className }: ItineraryGraphProps) {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<ItineraryNodeData | null>(null);
  // Tap/click PINS the detail panel open - hover alone (desktop-only) isn't
  // reachable on a touch device, so this is the only way a phone/tablet user
  // can see a node's detail at all, not just a nice-to-have. Stored by id
  // (not a data snapshot) so the panel stays live if the node's status
  // changes while pinned (e.g. mid-cascade-animation).
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) ?? null : null;

  // Use the hand-authored layout only when it fully covers this node set
  // (the Ladakh trip); any other itinerary (different node ids) falls back
  // to an automatic layered layout so its nodes don't all collapse onto the
  // same {0,0} point.
  const positions = useMemo(() => {
    const hasManualLayout = nodes.every((n) => nodePositions[n.id]);
    return hasManualLayout ? nodePositions : computeLayeredLayout(nodes.map((n) => n.id), edges);
  }, [nodes, edges]);

  const rfNodes: Node<ItineraryNodeData & { isAnimating?: boolean }>[] = useMemo(
    () =>
      nodes.map((n) => ({
        id: n.id,
        type: 'itinerary',
        position: positions[n.id] ?? { x: 0, y: 0 },
        data: n,
      })),
    [nodes, positions]
  );

  const rfEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: e.animated,
        style: {
          stroke: edgeColors[e.status],
          strokeWidth: 3,
          filter: 'drop-shadow(0 1px 1.5px rgba(15, 23, 42, 0.18))',
          transition: 'stroke 0.5s ease, stroke-width 0.3s ease',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColors[e.status],
          width: 22,
          height: 22,
        },
      })),
    [edges]
  );

  useEffect(() => {
    const timer = setTimeout(() => fitView({ padding: 0.3, duration: 600 }), 100);
    return () => clearTimeout(timer);
  }, [fitView]);

  // Clear any pinned selection when the node set changes underneath it (trip
  // switch removes the previously-selected node entirely).
  useEffect(() => {
    setSelectedNodeId((prev) => (prev && nodes.some((n) => n.id === prev) ? prev : null));
  }, [nodes]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  const handleNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    setHoveredNode(node.data as ItineraryNodeData);
  }, []);

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  const brokenCount = nodes.filter((n) => n.status === 'broken').length;
  const atRiskCount = nodes.filter((n) => n.status === 'at-risk').length;
  const recoveredCount = nodes.filter((n) => n.status === 'recovered').length;

  return (
    <div ref={containerRef} className={cn('relative h-full w-full overflow-hidden rounded-xl', className)}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        fitView
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        nodesDraggable={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.5} color="rgba(15,23,42,0.08)" />
        <Controls showInteractive={false} />

        <Panel position="top-left">
          <div className="flex items-center gap-2 rounded-lg glass px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-ink-300">Healthy {nodes.filter((n) => n.status === 'healthy').length}</span>
            </div>
            {atRiskCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-[10px] text-ink-300">At Risk {atRiskCount}</span>
              </div>
            )}
            {brokenCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse-soft" />
                <span className="text-[10px] text-ink-300">Broken {brokenCount}</span>
              </div>
            )}
            {recoveredCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent-400" />
                <span className="text-[10px] text-ink-300">Recovered {recoveredCount}</span>
              </div>
            )}
          </div>
        </Panel>

        <Panel position="top-right">
          <div className="flex items-center gap-1.5 rounded-lg glass px-2 py-1.5">
            <button onClick={() => zoomIn({ duration: 300 })} className="rounded p-1 text-ink-400 transition hover:bg-ink-700 hover:text-ink-100" aria-label="Zoom in">
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => zoomOut({ duration: 300 })} className="rounded p-1 text-ink-400 transition hover:bg-ink-700 hover:text-ink-100" aria-label="Zoom out">
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => fitView({ duration: 600, padding: 0.3 })} className="rounded p-1 text-ink-400 transition hover:bg-ink-700 hover:text-ink-100" aria-label="Fit view">
              <Maximize className="h-3.5 w-3.5" />
            </button>
          </div>
        </Panel>
      </ReactFlow>

      {(hoveredNode ?? selectedNode) && (
        <NodeTooltip
          node={(hoveredNode ?? selectedNode)!}
          pinned={!hoveredNode && !!selectedNode}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}

function NodeTooltip({ node, pinned, onClose }: { node: ItineraryNodeData; pinned?: boolean; onClose?: () => void }) {
  const c = node.status === 'healthy' ? 'border-emerald-500/30' : node.status === 'at-risk' ? 'border-amber-500/30' : node.status === 'broken' ? 'border-red-500/30' : 'border-accent-500/30';

  return (
    <div className={cn('fixed bottom-6 left-1/2 z-50 -translate-x-1/2', pinned ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div className={cn('glass-strong rounded-xl border p-4 shadow-2xl w-80 animate-fade-in-up', c)}>
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-ink-100">{node.title}</div>
          <div className="flex items-center gap-2">
            <span className={cn('text-xs font-medium', node.status === 'healthy' ? 'text-emerald-600' : node.status === 'at-risk' ? 'text-amber-600' : node.status === 'broken' ? 'text-red-600' : 'text-accent-600')}>
              {node.status === 'healthy' ? 'ON TIME' : node.status === 'delayed' ? delayLabel(node) : node.status.toUpperCase()}
            </span>
            {pinned && (
              <button onClick={onClose} className="rounded p-0.5 text-ink-400 transition hover:bg-ink-700 hover:text-ink-100" aria-label="Close node detail">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-1 text-xs text-ink-400">{node.provider} · {node.confirmation}</div>

        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-ink-500">Scheduled</div>
            <div className="mt-0.5 text-ink-100">{node.scheduledTime}</div>
          </div>
          {node.actualTime && (
            <div>
              <div className="text-ink-500">Predicted</div>
              <div className="mt-0.5 text-orange-600">{node.actualTime}</div>
            </div>
          )}
          {node.buffer && (
            <div>
              <div className="text-ink-500">Buffer</div>
              <div className="mt-0.5 text-ink-100">{node.buffer}</div>
            </div>
          )}
          <div>
            <div className="text-ink-500">Dependencies</div>
            <div className="mt-0.5 text-ink-100">{node.dependencyCount} downstream</div>
          </div>
          <div>
            <div className="text-ink-500">Risk Level</div>
            <div className={cn('mt-0.5', node.riskLevel >= 60 ? 'text-red-600' : node.riskLevel >= 30 ? 'text-amber-600' : 'text-emerald-600')}>{node.riskLevel}%</div>
          </div>
          <div>
            <div className="text-ink-500">Cost</div>
            <div className="mt-0.5 text-ink-100">₹{node.cost.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {node.reason && (
          <div className="mt-3 border-t border-ink-700 pt-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
              <div>
                <div className="text-[10px] text-ink-500">Why</div>
                <div className="text-[11px] text-ink-300">{node.reason}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 border-t border-ink-700 pt-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-ink-500" />
            <div>
              <div className="text-[10px] text-ink-500">Cancellation Policy</div>
              <div className="text-[11px] text-ink-300">{node.cancellationPolicy}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ItineraryGraph(props: ItineraryGraphProps) {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
}
