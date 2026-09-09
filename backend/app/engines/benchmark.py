"""TripRescue Itinerary Graph Scalability & Recovery Benchmark.

Empirically benchmarks GraphEngine, topological sorting, cycle detection,
and disruption cascade propagation across synthetic itineraries from N=10 to N=500 nodes.
"""

from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Dict, List, Tuple

from app.engines.graph_engine import GraphEngine


@dataclass
class BenchmarkMetric:
    num_nodes: int
    num_edges: int
    graph_build_us: float
    topological_sort_us: float
    cycle_detection_us: float
    downstream_bfs_us: float
    memory_estimate_kb: float


def generate_synthetic_itinerary_dag(num_nodes: int, branching_factor: int = 2) -> Tuple[List[str], List[Tuple[str, str]]]:
    """Generates a realistic multi-tier itinerary DAG (flights, transfers, hotels, tours)."""
    nodes = [f"node_{i:04d}" for i in range(num_nodes)]
    edges: List[Tuple[str, str]] = []

    for i in range(num_nodes - 1):
        # Primary sequence edge
        edges.append((nodes[i], nodes[i + 1]))
        # Secondary cross-dependency edges (e.g. hotel depends on flight + car rental)
        if branching_factor > 1 and i + 2 < num_nodes and i % 3 == 0:
            edges.append((nodes[i], nodes[i + 2]))

    return nodes, edges


def run_itinerary_graph_benchmark(node_counts: List[int] | None = None) -> List[BenchmarkMetric]:
    """Executes deterministic graph performance benchmarks across scale steps."""
    if node_counts is None:
        node_counts = [10, 50, 100, 250, 500]

    results: List[BenchmarkMetric] = []

    for count in node_counts:
        nodes, edges = generate_synthetic_itinerary_dag(count, branching_factor=2)

        # 1. Measure Graph Build
        start = time.perf_counter()
        graph = GraphEngine(node_ids=nodes, edges=edges)
        build_us = (time.perf_counter() - start) * 1_000_000.0

        # 2. Measure Topological Sort (Kahn's algorithm)
        start = time.perf_counter()
        topo_order = graph.topological_order()
        topo_us = (time.perf_counter() - start) * 1_000_000.0
        assert len(topo_order) == count

        # 3. Measure Cycle Detection (DFS 3-color)
        start = time.perf_counter()
        cycles = graph.detect_cycles()
        cycle_us = (time.perf_counter() - start) * 1_000_000.0
        assert len(cycles) == 0

        # 4. Measure Downstream Cascade Reachability (BFS)
        start = time.perf_counter()
        downstream = graph.get_downstream_nodes(nodes[0])
        bfs_us = (time.perf_counter() - start) * 1_000_000.0

        # Approximate memory footprint for adjacency lists
        mem_kb = (len(nodes) * 64 + len(edges) * 48) / 1024.0

        results.append(
            BenchmarkMetric(
                num_nodes=count,
                num_edges=len(edges),
                graph_build_us=round(build_us, 2),
                topological_sort_us=round(topo_us, 2),
                cycle_detection_us=round(cycle_us, 2),
                downstream_bfs_us=round(bfs_us, 2),
                memory_estimate_kb=round(mem_kb, 2),
            )
        )

    return results
