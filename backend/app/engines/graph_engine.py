"""GraphEngine: represents an itinerary as a directed dependency graph.

Complexity notes (V = number of nodes, E = number of edges):
  - add_node / remove_node:            O(1) amortized / O(V + E) worst case for remove
  - add_edge / remove_edge:             O(1) amortized
  - get_downstream_nodes / upstream:    O(V + E)  (BFS)
  - validate_graph:                     O(V + E)
  - detect_cycles:                      O(V + E)  (DFS with recursion stack)
  - topological_order:                  O(V + E)  (Kahn's algorithm)
  - calculate_dependencies:             O(V + E)

The graph is stored as adjacency lists (dict[node_id, set[node_id]]) rather than an
adjacency matrix, since itineraries are sparse (a handful of edges per node) and
adjacency lists keep every operation above linear in graph size rather than O(V^2).

The graph is NOT assumed to be a simple chain: a node may have zero, one, or many
upstream/downstream dependencies (e.g. a hotel with two onward activities, or an
activity that depends on both a flight and a transfer).
"""

from __future__ import annotations

from collections import deque


class GraphValidationError(ValueError):
    pass


class GraphEngine:
    def __init__(self, node_ids: list[str] | None = None, edges: list[tuple[str, str]] | None = None):
        self._nodes: set[str] = set(node_ids or [])
        self._forward: dict[str, set[str]] = {n: set() for n in self._nodes}
        self._backward: dict[str, set[str]] = {n: set() for n in self._nodes}
        for source, target in edges or []:
            self.add_edge(source, target)

    # -- mutation -----------------------------------------------------------------

    def add_node(self, node_id: str) -> None:
        if node_id in self._nodes:
            return
        self._nodes.add(node_id)
        self._forward.setdefault(node_id, set())
        self._backward.setdefault(node_id, set())

    def remove_node(self, node_id: str) -> None:
        if node_id not in self._nodes:
            return
        for downstream in list(self._forward.get(node_id, ())):
            self._backward[downstream].discard(node_id)
        for upstream in list(self._backward.get(node_id, ())):
            self._forward[upstream].discard(node_id)
        self._nodes.discard(node_id)
        self._forward.pop(node_id, None)
        self._backward.pop(node_id, None)

    def add_edge(self, source: str, target: str) -> None:
        self.add_node(source)
        self.add_node(target)
        self._forward[source].add(target)
        self._backward[target].add(source)

    def remove_edge(self, source: str, target: str) -> None:
        self._forward.get(source, set()).discard(target)
        self._backward.get(target, set()).discard(source)

    # -- queries --------------------------------------------------------------

    @property
    def nodes(self) -> set[str]:
        return set(self._nodes)

    def edges(self) -> list[tuple[str, str]]:
        return [(s, t) for s, targets in self._forward.items() for t in targets]

    def get_downstream_nodes(self, node_id: str, include_self: bool = False) -> list[str]:
        return self._bfs(node_id, self._forward, include_self)

    def get_upstream_nodes(self, node_id: str, include_self: bool = False) -> list[str]:
        return self._bfs(node_id, self._backward, include_self)

    def _bfs(self, start: str, adjacency: dict[str, set[str]], include_self: bool) -> list[str]:
        if start not in self._nodes:
            return []
        visited: set[str] = {start}
        order: list[str] = []
        queue: deque[str] = deque(adjacency.get(start, ()))
        visited.update(adjacency.get(start, ()))
        order.extend(adjacency.get(start, ()))
        while queue:
            current = queue.popleft()
            for nxt in adjacency.get(current, ()):
                if nxt not in visited:
                    visited.add(nxt)
                    order.append(nxt)
                    queue.append(nxt)
        if include_self:
            order.insert(0, start)
        return order

    def calculate_dependencies(self) -> dict[str, int]:
        """Number of downstream nodes reachable from each node."""
        return {n: len(self.get_downstream_nodes(n)) for n in self._nodes}

    def validate_graph(self) -> list[str]:
        errors: list[str] = []
        for source, targets in self._forward.items():
            if source not in self._nodes:
                errors.append(f"Edge source '{source}' is not a known node.")
            for target in targets:
                if target not in self._nodes:
                    errors.append(f"Edge target '{target}' is not a known node.")
        cycles = self.detect_cycles()
        for cycle in cycles:
            errors.append(f"Cycle detected: {' -> '.join(cycle)}")
        return errors

    def detect_cycles(self) -> list[list[str]]:
        """Returns a list of cycles (each a list of node ids) found via DFS."""
        WHITE, GRAY, BLACK = 0, 1, 2
        color: dict[str, int] = {n: WHITE for n in self._nodes}
        cycles: list[list[str]] = []
        stack_path: list[str] = []

        def dfs(node: str) -> None:
            color[node] = GRAY
            stack_path.append(node)
            for neighbor in self._forward.get(node, ()):
                if color.get(neighbor, WHITE) == WHITE:
                    dfs(neighbor)
                elif color.get(neighbor) == GRAY:
                    idx = stack_path.index(neighbor)
                    cycles.append(stack_path[idx:] + [neighbor])
            stack_path.pop()
            color[node] = BLACK

        for node in list(self._nodes):
            if color[node] == WHITE:
                dfs(node)
        return cycles

    def topological_order(self) -> list[str]:
        """Kahn's algorithm. Raises GraphValidationError if the graph has a cycle."""
        in_degree = {n: len(self._backward.get(n, ())) for n in self._nodes}
        queue: deque[str] = deque(sorted(n for n, deg in in_degree.items() if deg == 0))
        order: list[str] = []
        while queue:
            node = queue.popleft()
            order.append(node)
            for downstream in sorted(self._forward.get(node, ())):
                in_degree[downstream] -= 1
                if in_degree[downstream] == 0:
                    queue.append(downstream)
        if len(order) != len(self._nodes):
            raise GraphValidationError("Graph contains a cycle; topological order is undefined.")
        return order
