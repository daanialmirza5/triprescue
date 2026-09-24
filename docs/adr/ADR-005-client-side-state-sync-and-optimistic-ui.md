# ADR-005: Client-Side State Synchronization and Optimistic UI Updates

## Context and Problem Statement
TripRescue is an emergency disruption management console. During high-stress flight cancellations or hotel overbookings, travelers and operations dispatchers require instantaneous visual feedback when applying recovery plans, accepting recommendations, or simulating flight changes.
Network latency or transient connection drops must not leave the UI in an ambiguous or unresponsive state.

## Decision Drivers
* Instantaneous visual response (<16ms) to user actions (accept recovery, toggle preferences).
* Robust rollback and toast notification in case the backend atomic transaction fails.
* Consistent graph topology state across multiple dashboard tabs (Command Center, Graph View, Map View).

## Decision Outcome
Implement a dual-layer state strategy in `AppContext.tsx`:
1. **Optimistic Local Mutation:** The graph nodes, edges, and recovery status immediately update in local React state upon user confirmation.
2. **Transactional Backend Sync:** The client dispatches a POST/PATCH request to the FastAPI backend.
3. **Rollback & Error Toast:** If the HTTP request fails, the local state automatically reverts to the pre-action snapshot, and an alert toast is rendered explaining the root cause (e.g., node locking, provider seat inventory conflict).

## Consequences
### Positive
* Fluid, snappy user experience matching desktop-class application performance.
* Zero cognitive delay for travelers rushing to catch alternate connections.

### Negative
* Requires caching the pre-mutation state snapshot before initiating optimistic async dispatch.
