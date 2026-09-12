# TripRescue — Technical Debt & Architectural Audit

**Repository**: `triprescue`  
**Status**: Tier 1 Flagship

## Prioritized Debt Items
- **[P1 — High] Real-Time Aviation API Integration**: Currently uses high-fidelity synthetic flight schedules. Integrate Amadeus / FlightAware Live API connectors with caching.
- **[P2 — Medium] Multi-City Route Graph Scaling**: For routes with >10 alternatives per leg, exhaustive Pareto search should transition to an A* multi-criteria shortest path algorithm.
- **[P3 — Low] Push Notification Webhook Subscriptions**: Add SMS/Email webhook triggers for automated disruption alerts.
