"""Unit tests verifying graph scalability, cycle edge cases, and performance benchmarks."""

import unittest
from app.engines.graph_engine import GraphEngine, GraphValidationError
from app.engines.benchmark import generate_synthetic_itinerary_dag, run_itinerary_graph_benchmark


class TestGraphScaleAndEdgeCases(unittest.TestCase):
    """Tests complex DAG structures, large topologies, and cycle edge cases."""

    def test_diamond_dependency_graph(self):
        # A -> B, A -> C, B -> D, C -> D (Diamond)
        edges = [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D")]
        graph = GraphEngine(node_ids=["A", "B", "C", "D"], edges=edges)

        order = graph.topological_order()
        self.assertEqual(order[0], "A")
        self.assertEqual(order[-1], "D")
        self.assertEqual(len(graph.detect_cycles()), 0)

        downstream_a = graph.get_downstream_nodes("A")
        self.assertEqual(set(downstream_a), {"B", "C", "D"})

    def test_multi_hop_cycle_detection(self):
        # A -> B -> C -> A
        edges = [("A", "B"), ("B", "C"), ("C", "A")]
        graph = GraphEngine(node_ids=["A", "B", "C"], edges=edges)

        cycles = graph.detect_cycles()
        self.assertGreaterEqual(len(cycles), 1)
        self.assertIn("A", cycles[0])
        self.assertIn("B", cycles[0])
        self.assertIn("C", cycles[0])

        with self.assertRaises(GraphValidationError):
            graph.topological_order()

    def test_self_loop_cycle_detection(self):
        # Node depending on itself: A -> A
        graph = GraphEngine(node_ids=["A"], edges=[("A", "A")])
        cycles = graph.detect_cycles()
        self.assertGreaterEqual(len(cycles), 1)

    def test_disconnected_components_graph(self):
        # Component 1: A -> B; Component 2: X -> Y; Isolated: Z
        edges = [("A", "B"), ("X", "Y")]
        graph = GraphEngine(node_ids=["A", "B", "X", "Y", "Z"], edges=edges)

        order = graph.topological_order()
        self.assertEqual(len(order), 5)
        self.assertEqual(graph.get_downstream_nodes("Z"), [])
        self.assertEqual(graph.get_upstream_nodes("Z"), [])

    def test_large_dag_scale_500_nodes(self):
        nodes, edges = generate_synthetic_itinerary_dag(500, branching_factor=2)
        graph = GraphEngine(node_ids=nodes, edges=edges)

        order = graph.topological_order()
        self.assertEqual(len(order), 500)
        self.assertEqual(order[0], nodes[0])
        self.assertEqual(len(graph.detect_cycles()), 0)

    def test_graph_benchmark_execution(self):
        metrics = run_itinerary_graph_benchmark(node_counts=[10, 50, 100])
        self.assertEqual(len(metrics), 3)
        for m in metrics:
            self.assertGreater(m.num_nodes, 0)
            self.assertGreater(m.num_edges, 0)
            self.assertGreater(m.topological_sort_us, 0.0)
            # Even 100 nodes should compute topological sort in < 5 milliseconds
            self.assertLess(m.topological_sort_us, 5000.0)


if __name__ == "__main__":
    unittest.main()
