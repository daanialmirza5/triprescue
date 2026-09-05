# Demo Script (5-7 minutes)

A judge-facing walkthrough of the actual running application - every number and screen below was verified live, not scripted from imagination. Reset the trip before starting (`Reset` button in the top bar, or fresh login) so the numbers match.

## 0. Open & log in (30s)

Open the app. Land on the login screen. Click **"Continue as Demo Traveler (Aisha Khan)"** - no password needed for the demo path. You're now on the Command Center, trip healthy (**health score 87**), route Mumbai → Delhi → Leh.

> *"This is Aisha's Ladakh Expedition - 8 itinerary nodes, 7 dependencies, all healthy right now."*

## 1. Show the itinerary graph (30s)

Point at the Live Itinerary Graph on Overview. Every node (flight, connection, hotel, activities) is a real dependency-graph node, not a static list - hover or tap one to show its real scheduled time, buffer, risk %, and cost.

## 2. Trigger the hero disruption (45s)

Click **Simulate Disruption** → select **Flight Delay** → leave the slider at the recommended **3h**. The preview panel already shows a computed impact (not a placeholder) before you even confirm. Click **Trigger Disruption**.

> *"I'm delaying the Mumbai → Delhi flight by 3 hours. Watch what happens - this isn't scripted per disruption type, it's a live buffer calculation."*

## 3. Watch the cascade, open Impact Analysis (45s)

The graph animates the cascade in real time. The Disruption Analysis panel shows:
- **Delhi → Leh: BROKEN** - `causedBy: del-connection`, reason *"Required buffer is 60 minutes but only 0 minutes remain."*
- Downstream: airport transfer, hotel, Pangong Lake tour all shift to **at-risk**
- **Financial exposure ≈ ₹36,400**, **refund exposure ≈ ₹7,400**

> *"The engine didn't hardcode 'a 3-hour delay breaks this flight' - it computed that the connection needed a 60-minute buffer and only had zero left. If I'd delayed it 20 minutes instead, this same connection stays healthy - I can show that buffer math live if asked."*

## 4. Recovery options (45s)

Navigate to **Recovery Center**. Three ranked options appear, each with real cost delta, time impact, bookings preserved, and residual risk - e.g. a same-day premium rebook, a next-available flight, and a next-day option with a refund. Click **Compare All** to show the side-by-side table.

## 5. Preferences actually change the ranking (45s)

In the comparison view (or Settings), push **Cost vs Speed** all the way to **Speed**. The ranking reorders live - the premium same-day option jumps to #1. Push it back toward **Cost** - the cheaper next-day option retakes the top spot.

> *"This isn't cosmetic - the sliders call the real scoring engine and it re-ranks server-side."*

## 6. Apply recovery, show before/after (45s)

Pick the top-ranked option, click **Apply Recovery**. The itinerary recalculates: graph updates, health score climbs back up, the previously-broken connection now shows **RECOVERED**, and Before/After (Trip Detail → Timeline) shows the concrete before/after state - not a fake diff.

## 7. Ask the AI assistant (30s)

Open **Ask TripRescue AI**, ask *"Why was this recovery recommended?"*. The answer cites the actual applied plan's real score breakdown and numbers - grounded in current state, not invented.

## 8. Re-disrupt without resetting (30s)

Without resetting, trigger a **second, different disruption** (e.g. Activity Cancellation on a different node). It propagates correctly from the *already-recovered* itinerary - proving the trip isn't a one-shot demo, it's a live, always-re-disruptable canonical state.

> *"Recovered isn't terminal. The same engine handles a second incident on top of the first recovery."*

## 9. Close: Demo Mode (20s, optional if time is short)

Reset, then click **Run Disruption Demo** - the exact same sequence you just did manually, run unattended through the same production API path. Run it twice to show it's deterministic (same cascade, same ranking, same applied plan both times).

---

**If something goes wrong live**: the app degrades gracefully - a backend hiccup shows a real error banner with Retry, never a blank screen; the AI assistant falls back to its deterministic responder with zero visible difference in UX if no LLM key is configured.
