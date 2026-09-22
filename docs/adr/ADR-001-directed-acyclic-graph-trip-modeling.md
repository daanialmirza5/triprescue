# ADR-001: Directed Acyclic Graph (DAG) for Itinerary Dependency Modeling

## Status
Accepted

## Context
Traditional travel applications model trips as simple chronological lists of bookings. This fails during travel disruptions because real-world travel commitments have rich dependency relationships:
- Hard dependencies: Flight connections where missing leg 1 renders boarding leg 2 physically impossible.
- Soft dependencies: Hotel check-ins or tour meetings that can absorb variable delays before requiring cancellation or rescheduling.
- Cascading impacts: A 3-hour delay on Day 1 can propagate downstream to Day 3 activities, ground transfers, and hotel reservations.

## Decision
We model every trip as a Directed Acyclic Graph (DAG) $G = (V, E)$:
- **Vertices $V$**: Nodes representing discrete travel commitments (flights, hotels, ground transfers, activities).
- **Edges $E$**: Directed edges $(u, v)$ where node $v$ depends on completion or arrival of node $u$.
- **Edge Metadata**: Each edge defines `dependency_type` (`HARD` vs `SOFT`), `min_buffer_minutes`, and `risk_buffer_minutes`.

## Consequences
### Positive
- Enables topological sorting and deterministic impact propagation when disruptions occur.
- Allows real-time calculation of buffer exhaustion and at-risk downstream commitments.
- Separates immutable schedule constraints from flexible buffers.

### Negative / Trade-offs
- Graph cycles must be prevented at node/edge creation time using cycle detection algorithms.
- Graph layout in the frontend requires specialized topological layout computation.
