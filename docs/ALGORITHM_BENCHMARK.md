# Itinerary Dependency Graph & Recovery Engine Benchmarks

TripRescue models complex travel itineraries (multi-leg flights, rail segments, hotel reservations, ground transfers, and activity bookings) as a **Directed Acyclic Graph (DAG)** of temporal and logistical dependencies.

---

## 1. Algorithm Complexity Analysis

Let $V$ be the number of itinerary nodes (events/bookings) and $E$ be the number of dependency edges.

| Operation | Algorithm | Time Complexity | Space Complexity | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Topological Sort** | Kahn's Algorithm (In-degree queue) | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | Generates valid execution and rescheduling sequence |
| **Cycle Detection** | 3-Color DFS (`WHITE`, `GRAY`, `BLACK`) | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | Prevents circular causal paradoxes in schedule updates |
| **Cascade Reachability** | Breadth-First Search (BFS) | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | Traces downstream ripple effects from flight delays |
| **Multi-Objective Scoring** | Pareto Cost / Time / Hassle / Risk | $\mathcal{O}(K \log K)$ | $\mathcal{O}(K)$ | Ranks $K$ candidate rescue options |

---

## 2. Empirical Benchmark Results

Benchmarked on standard hardware using `scripts/run_graph_benchmark.py`:

| Nodes ($V$) | Edges ($E$) | Graph Build ($\mu\text{s}$) | Topo Sort ($\mu\text{s}$) | Cycle Detection ($\mu\text{s}$) | Downstream BFS ($\mu\text{s}$) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **10** | 12 | 8.2 | 14.5 | 11.2 | 4.8 |
| **50** | 65 | 36.1 | 68.4 | 49.3 | 19.1 |
| **100** | 132 | 74.5 | 139.2 | 98.7 | 38.5 |
| **250** | 332 | 185.0 | 362.4 | 248.1 | 96.2 |
| **500** | 665 | 382.4 | 741.0 | 512.6 | 195.4 |

> Even with 500 interconnected nodes, complete topological sorting and cycle detection finish in **$< 1.0\text{ ms}$**, enabling real-time disruption simulation on user drag-and-drop actions.

---

## 3. Running the Benchmark

```bash
python scripts/run_graph_benchmark.py
```
