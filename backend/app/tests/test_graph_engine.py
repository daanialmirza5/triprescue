import pytest

from app.engines.graph_engine import GraphEngine, GraphValidationError


def test_add_and_remove_node():
    g = GraphEngine()
    g.add_node("a")
    assert "a" in g.nodes
    g.remove_node("a")
    assert "a" not in g.nodes


def test_add_edge_creates_nodes_implicitly():
    g = GraphEngine()
    g.add_edge("a", "b")
    assert g.nodes == {"a", "b"}
    assert ("a", "b") in g.edges()


def test_remove_edge():
    g = GraphEngine(["a", "b"], [("a", "b")])
    g.remove_edge("a", "b")
    assert g.edges() == []


def test_downstream_and_upstream_linear_chain():
    g = GraphEngine(["a", "b", "c", "d"], [("a", "b"), ("b", "c"), ("c", "d")])
    assert g.get_downstream_nodes("a") == ["b", "c", "d"]
    assert set(g.get_upstream_nodes("d")) == {"a", "b", "c"}


def test_downstream_with_branches():
    # a -> b -> c
    #      b -> d
    g = GraphEngine(["a", "b", "c", "d"], [("a", "b"), ("b", "c"), ("b", "d")])
    assert set(g.get_downstream_nodes("a")) == {"b", "c", "d"}
    assert set(g.get_downstream_nodes("b")) == {"c", "d"}


def test_downstream_with_multiple_dependencies_converging():
    # a -> c, b -> c (c depends on both a and b)
    g = GraphEngine(["a", "b", "c"], [("a", "c"), ("b", "c")])
    assert g.get_downstream_nodes("a") == ["c"]
    assert set(g.get_upstream_nodes("c")) == {"a", "b"}


def test_calculate_dependencies_counts_downstream_reach():
    g = GraphEngine(["a", "b", "c"], [("a", "b"), ("b", "c")])
    deps = g.calculate_dependencies()
    assert deps["a"] == 2
    assert deps["b"] == 1
    assert deps["c"] == 0


def test_validate_graph_clean():
    g = GraphEngine(["a", "b"], [("a", "b")])
    assert g.validate_graph() == []


def test_detect_cycles_finds_a_cycle():
    g = GraphEngine(["a", "b", "c"], [("a", "b"), ("b", "c"), ("c", "a")])
    cycles = g.detect_cycles()
    assert len(cycles) == 1


def test_topological_order_respects_dependencies():
    g = GraphEngine(["a", "b", "c", "d"], [("a", "b"), ("b", "c"), ("a", "d")])
    order = g.topological_order()
    assert order.index("a") < order.index("b") < order.index("c")
    assert order.index("a") < order.index("d")


def test_topological_order_raises_on_cycle():
    g = GraphEngine(["a", "b"], [("a", "b"), ("b", "a")])
    with pytest.raises(GraphValidationError):
        g.topological_order()


def test_validate_graph_reports_cycle_errors():
    g = GraphEngine(["a", "b"], [("a", "b"), ("b", "a")])
    errors = g.validate_graph()
    assert any("Cycle" in e for e in errors)
