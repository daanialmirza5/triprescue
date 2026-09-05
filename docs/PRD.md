# Product Requirements Document — TripRescue

## 1. Summary

TripRescue is a travel disruption recovery platform. It models a trip as a
network of dependent bookings, detects exactly what a real-world disruption
breaks (and what it doesn't), explains why in plain language, and generates
recovery options ranked by the traveler's own priorities — so a traveler
facing a missed connection or a cancelled hotel gets a decision, not a wall
of alerts.

**Core product loop:**

> Something went wrong → here is exactly what it breaks → here is why it
> breaks → here are the feasible ways to recover → here is the best option
> for *your* priorities → apply it → here is the new itinerary, checked
> again.

## 2. Problem statement

When a trip is disrupted today, a traveler is left to manually work out the
blast radius themselves: does a 3-hour flight delay actually break the next
connection, or is there enough buffer? Does it affect the hotel? The activity
booked for tomorrow? Existing tools either do nothing (raw flight-status
apps) or overreact (treat any delay as catastrophic and flag everything
downstream red, whether or not it's actually affected). Neither gives a
traveler an actual, financially-aware, ranked set of things they can *do*
about it.

## 3. Target users

- **Primary persona**: an independent leisure/business traveler with a
  multi-leg itinerary (flights + ground transport + hotel + booked
  activities) who wants to know, the moment something goes wrong, what's
  actually at risk and what their best move is — not to become a travel
  agent themselves.
- **Secondary (implicit)**: a travel agent or corporate travel desk managing
  itineraries on behalf of travelers, who needs the same explainability to
  justify a recommended recovery.

## 4. Goals

- Determine, from the itinerary's actual structure and timing, exactly which
  bookings a disruption breaks, which are merely at risk, and which are
  unaffected — with a stated reason for each, not a blanket "everything after
  this is red."
- Generate recovery options that are actually feasible (checked against
  provider availability and re-verified by re-running the same impact
  analysis on the proposed change), each with real cost/time/risk/comfort
  tradeoffs.
- Rank those options according to the traveler's *own* stated priorities
  (cost vs. speed, disruption vs. comfort), and re-rank live when those
  priorities change.
- Let the traveler apply a recovery with one action and see the resulting
  itinerary, cost impact, and risk profile immediately.
- Make every number the product shows (risk %, financial exposure, refund
  amount, recovery score) traceable to a stated reason — the product's
  credibility rests on "why" always being answerable.

### Non-goals (for this version)

- Live booking with real airlines/hotels (see `FUTURE_ROADMAP.md` — provider
  interfaces exist, no live integration).
- Multi-traveler / group itinerary coordination.
- Mobile app (this is a responsive web app only).
- Payment processing for the "additional cost" a recovery might introduce.

## 5. User journeys / functional requirements

### 5.1 Trip overview (Command Center)

- The traveler sees, at a glance: current trip status (operational /
  disrupted / recovering / recovered), a live dependency graph of every
  booking, and top-line metrics (itinerary node count, at-risk connections,
  broken bookings, trip value protected).
- The trip's health score is a single 0–100 number reflecting current
  itinerary risk and disruption state — it must change in response to real
  events, not sit at a fixed number.

### 5.2 Disruption simulation

- The traveler can trigger any of the following disruption types against
  their itinerary: flight delay (with a configurable delay duration), flight
  cancellation, missed connection, hotel check-in conflict, hotel
  cancellation, transfer failure, activity cancellation, activity delay,
  airport closure.
- Before committing, the traveler sees a live-computed preview of the
  disruption's impact level and how many bookings would be affected.
- Triggering a disruption must feel immediate but show the cascade
  unfolding — a traveler should be able to watch which booking fails first,
  and which downstream bookings are subsequently affected, in order.

### 5.3 Impact analysis

- For an active disruption, the traveler sees: which booking was directly
  hit, how many bookings are downstream-affected, total financial exposure,
  how much of that exposure is refund-recoverable, and a step-by-step
  cascade with a plain-language reason at each step (e.g. "Required buffer
  is 60 minutes but only 0 minutes remain").
- A booking that is merely delayed, one that is at risk but not yet broken,
  and one that is genuinely broken/cancelled must be visually and textually
  distinguishable — the product must not treat "at risk" and "broken" as the
  same severity.

### 5.4 Recovery

- The traveler is offered multiple (at least three, when the itinerary and
  provider data support it) recovery options, each showing: a short name
  and tag (e.g. "Best Balance", "Cheapest", "Fastest"), an overall score
  out of 100, additional cost, time impact, bookings preserved out of
  total, refund recovered, and residual risk.
- A recovery option's detail view lists every itinerary change it would
  make, in plain language, including changes it makes to bookings other
  than the one directly broken (a coordinated, multi-booking plan must be
  presented as such, not hidden).
- The traveler can compare all options side by side and interactively
  adjust their priorities (cost↔speed, disruption↔comfort) to see the
  ranking update.
- Applying a recovery option updates the itinerary, the trip's health score,
  financial exposure, and risk profile immediately, and is confirmed with a
  clear before/after view.

### 5.5 Risk intelligence

- Independent of any active disruption, the traveler can see a proactive
  risk assessment of their itinerary: an overall resilience score, a
  breakdown by risk category (connection, schedule, vendor, weather), and
  the specific bookings most at risk with a stated reason and recommended
  action for each.

### 5.6 Activity log and notifications

- Every significant event (disruption detected, recovery generated,
  recovery applied, trip reset) is recorded in a persistent, chronological
  activity log.
- The traveler receives notifications for high-risk conditions, recovery
  readiness, and recovery completion, with an unread count and a
  mark-as-read action.

### 5.7 Bookings and map

- The traveler can see every booking in their itinerary in a filterable
  list (by category), with cost, refundability, cancellation policy, and
  current status.
- The traveler can see their itinerary plotted geographically, with route
  segments colored by their current health status.

### 5.8 AI assistant

- The traveler can ask natural-language questions about their trip
  ("What happens if my flight is delayed?", "Which option is cheapest?",
  "Why is this recommended?") and receive an answer grounded in the actual
  current state of their itinerary and any active disruption/recovery
  options — the assistant must never invent a booking, price, or time that
  isn't real.
- The assistant must remain functional even when no external AI service is
  configured, falling back to a rule-based responder that still answers from
  real data.

### 5.9 Preferences

- The traveler can set recovery priorities (minimize cost, minimize time,
  minimize disruption, maximize comfort) and a cost-vs-speed /
  disruption-vs-comfort balance, and these must measurably change how
  recovery options are ranked the next time they're generated.

### 5.10 Demo mode

- A single action runs the entire loop above unattended (reset → trigger →
  cascade → analyze → generate recovery → apply the top option) for
  presentation purposes, and must be exactly repeatable.

## 6. Success criteria / acceptance bar

- Given the seeded "Aisha's Ladakh Expedition" trip and a 3-hour Mumbai→Delhi
  delay, the product must independently determine that the Delhi→Leh
  connection becomes infeasible (not because that specific outcome is
  hardcoded, but because the underlying buffer math produces it) and must
  correctly identify which further-downstream bookings are and are not
  affected.
- At least three ranked, feasible recovery options must be produced for that
  scenario, and changing the traveler's stated priorities must change the
  ranking.
- Every number shown for risk, financial exposure, or recovery scoring must
  be reproducible from the underlying itinerary and disruption data — no
  hardcoded product-facing statistic.
- The full loop (trigger → analyze → recover → confirm) must complete
  without requiring a page reload, and must leave the itinerary in a
  consistent, re-disruptable state afterward.

## 7. Out of scope / known limitations

See `FUTURE_ROADMAP.md` for the current, honest list (multi-trip switching in
the UI, real provider integrations, a real map provider, activity-vs-activity
conflict detection, a wired-up login flow). These are explicitly acknowledged
gaps, not silent omissions.
