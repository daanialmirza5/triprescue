# Demo Guide

## Fastest path: Demo Mode

1. Start both servers (see `README.md`).
2. Open the app, land on **Overview**.
3. Click **Run Disruption Demo** in the top bar.
4. Watch: the trip resets → the 3-hour Mumbai→Delhi delay triggers → the
   graph cascades (bom-del delayed → del-connection → del-leh **broken** →
   airport-transfer/grand-dragon/pangong-tour **at-risk**, nubra-valley and
   the return flight stay healthy) → it navigates to Recovery Center → the
   top-ranked plan is applied → a success toast confirms bookings preserved.

Demo Mode is fully repeatable - run it again and it produces the identical
sequence, because Reset restores the exact seeded state and propagation is
deterministic.

## Manual walkthrough (to see the reasoning, not just the outcome)

1. **Overview** - note the health score (87) and the healthy graph.
2. **Simulate Disruption** → pick **Flight Delay**, leave it at 3h. The
   "Computed impact preview" box is a live call to the backend
   (`POST /simulate`) - it updates as you change the delay slider or switch
   disruption type, before you've committed to anything.
3. **Trigger Disruption**. Watch the impact analysis panel on the right: the
   "Failure Cascade" steps are the backend's actual cascade steps with real
   reasons (e.g. "Required buffer is 60 minutes but only 0 minutes remain"),
   not placeholder text.
4. **Recovery Center** - three plans, each with a real score and breakdown.
   Click **Compare** to open the side-by-side table, then drag the
   cost↔speed or disruption↔comfort sliders: the ranking visibly reorders
   (an instant client-side preview using the real per-plan scores), and after
   you stop dragging, the preferences are persisted and the plans are
   re-fetched from the backend with the new weights baked in.
5. Click **Details** on a plan to see every coordinated action (the cheapest
   plan is the interesting one - it rebooks the flight *and* reschedules
   Pangong Lake to the next day, because the recovery engine detected that
   date conflict automatically).
6. **Apply Recovery**. The trip flips to "recovered", the graph updates, and
   the "Changes Applied" list shows exactly what happened to every node.
7. **Risk Intelligence** - the resilience score and every card reflect the
   *post-recovery* state (refetches whenever the trip's health score
   changes).
8. **Trip Detail → Bookings/Map/Graph tabs** - all backed by the same live
   trip data; the map's markers come from each node's own lat/lng.
9. Open the **AI Assistant** and ask "Why is this recovery recommended?" -
   the answer cites the actual applied plan's real score breakdown and cost.
   Try "How much money could I lose?" before applying a recovery, or
   "Which option is cheapest?" while options are still open.
10. **Reset** at any time to return to the healthy baseline.

## Trying other disruption types

Every type in the picker is live (none are "coming soon"): try **Hotel
Cancellation** (a smaller-blast-radius scenario - only the hotel and Pangong
Lake are affected, nothing upstream) or **Transfer Failure** to see how the
same general engine produces a proportionate, different cascade without any
scenario-specific code.

## Other trips

`My Trips` shows the active trip (Ladakh by default) plus a card for each
other seeded trip - Goa and Rajasthan - under "Other Trips". Click one (or
use the trip switcher dropdown in the top bar) to make it active; every page
(graph, map, bookings, risk, recovery) then operates on that trip instead.
Goa and Rajasthan demonstrate branching/converging dependencies a simple
chain can't: Goa's hotel feeds two independent activities (a fork); Rajasthan
has that same fork *and* a join - two activities that must both finish before
the Jaipur→Agra transfer proceeds. Their graph layouts are computed
automatically (`src/lib/graphLayout.ts`) rather than hand-positioned like
Ladakh's.
