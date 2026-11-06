# Safar Sathi travel-disruption domain knowledge

## Weather stress rules used by the Digital Twin

DigitalTwinEngine: a sandboxed, weather-driven copy of a trip.

The twin clones the itinerary graph (EngineNodes/EngineEdges are dataclasses;
every mutation happens on `dataclasses.replace` copies), applies a weather
scenario as simultaneous direct hits on the bookings it would plausibly
affect, and runs the same PropagationEngine the live system uses to find the
counterfactual cascade. Nothing here touches the database - the live itinerary
only changes when a traveler applies a plan via the digital twin service.

Stress rules (per booking type, only for bookings overlapping the storm window):
- Flights: visibility < 800 m -> ground stop (120-180 min); wind > 60 km/h ->
  crosswind holds; heavy rain -> flow control; extreme fog/wind -> cancellation.
- Road transfers: rainfall above 35 mm/h (25 on mountain roads) causes
  waterlogging diversions; above 60 (45 mountain) blocks the road outright.
- Trains: dense fog and extreme rain slow services.
- Outdoor activities: wind > 60 km/h or rain > 25 mm/h cancels them; extreme
  heat pushes them to cooler hours.
- Hotels: only extreme flooding threatens check-in; otherwise they are hit
  indirectly through late arrivals (the cascade).

## Dependency semantics

Hard dependencies (flight connections, timed trains) break when the available buffer falls below the required buffer. Soft dependencies (transfer -> hotel -> activity) shift flexible bookings later or flag fixed ones at risk. Bookings more than 24h after an unresolved break are treated as recoverable.

## Worked examples

### Severe Monsoon Deluge (trip-ladakh-2025)

“Severe Monsoon Deluge” brings low visibility during 12 Sep 06:30 - 12 Sep 10:30: Mumbai → Delhi is hit directly — Visibility 300 m is below CAT-I minima; ground stop. It also directly affects Delhi → Leh. Because Delhi Connection runs late, Delhi → Leh can no longer be made — only 0 of the 60 minutes it needs remain. Downstream, Delhi Connection, Airport Transfer, Grand Dragon Ladakh are at risk of late arrival. Highest risk: connection miss risk for Delhi → Leh at 96% (range 83–99%). Act before the weather does: rebook Delhi → Leh now, while alternatives still have seats. Recommended preemptive recovery: Wait It Out — Keep the trip, but move exposed legs to just after the storm and re-time the connections that depend on them. Cost +₹1,280, arrival impact 270 min, 7/7 commitments preserved (validated under the same storm). Alternative: Protect the Chain (+₹120, 6/7 preserved, 1 leg(s) still fail). Actions: Rebook Delhi → Leh at least 120 min later to restore its 60-min connection buffer. Widen the buffer before Airport Transfer by at least 60 min or pick a flexible fare. Ask Grand Dragon Ladakh to guarantee late check-in so the room is held.

### Dense Fog Ground Stop (trip-ladakh-2025)

“Dense Fog Ground Stop” brings low visibility during 12 Sep 06:30 - 12 Sep 13:30: Mumbai → Delhi is hit directly — Visibility 150 m is below CAT-I minima; ground stop. It also directly affects Delhi → Leh, Airport Transfer. Because Delhi Connection runs late, Delhi → Leh can no longer be made — only 0 of the 60 minutes it needs remain. Downstream, Delhi Connection, Grand Dragon Ladakh, Pangong Lake Tour are at risk of late arrival. Highest risk: connection miss risk for Delhi → Leh at 95% (range 81–99%). Act before the weather does: rebook Delhi → Leh now, while alternatives still have seats. Recommended preemptive recovery: Wait It Out — Keep the trip, but move exposed legs to just after the storm and re-time the connections that depend on them. Cost +₹1,376, arrival impact 450 min, 7/7 commitments preserved (validated under the same storm). Actions: Rebook Delhi → Leh at least 120 min later to restore its 60-min connection buffer. Widen the buffer before Airport Transfer by at least 60 min or pick a flexible fare. Ask Grand Dragon Ladakh to guarantee late check-in so the room is held.

### Cyclonic Storm (trip-ladakh-2025)

“Cyclonic Storm” brings heavy rain and high winds during 12 Sep 06:30 - 12 Sep 16:30: Mumbai → Delhi is hit directly — 110 km/h winds ground all departures for 10h; the airline cancels. It also directly affects Delhi → Leh, Airport Transfer. Downstream, Delhi Connection is at risk of late arrival. Highest risk: cancellation risk for Mumbai → Delhi at 99% (range 86–99%). Act before the weather does: rebook Mumbai → Delhi now, while alternatives still have seats. Recommended preemptive recovery: Wait It Out — Keep the trip, but move exposed legs to just after the storm and re-time the connections that depend on them. Cost +₹1,376, arrival impact 630 min, 6/7 commitments preserved (validated under the same storm). Actions: Secure an alternative to Mumbai → Delhi now — cancelled departures sell out fast once the storm is announced. Widen the buffer before Delhi Connection by at least 60 min or pick a flexible fare. Secure an alternative to Delhi → Leh now — cancelled departures sell out fast once the storm is announced.

### Severe Heatwave (trip-ladakh-2025)

“Severe Heatwave” brings extreme heat during 12 Sep 06:30 - 12 Sep 14:30: Mumbai → Delhi is hit directly — 47 °C cuts take-off performance; payload and slot delays. It also directly affects Delhi → Leh. Because Delhi Connection runs late, Delhi → Leh can no longer be made — only 45 of the 60 minutes it needs remain. Downstream, Delhi Connection, Airport Transfer, Grand Dragon Ladakh are at risk of late arrival. Highest risk: connection miss risk for Delhi → Leh at 95% (range 80–99%). Act before the weather does: rebook Delhi → Leh now, while alternatives still have seats. Recommended preemptive recovery: Wait It Out — Keep the trip, but move exposed legs to just after the storm and re-time the connections that depend on them. Cost +₹1,280, arrival impact 510 min, 7/7 commitments preserved (validated under the same storm). Alternative: Protect the Chain (+₹120, 6/7 preserved, 1 leg(s) still fail). Actions: Rebook Delhi → Leh at least 75 min later to restore its 60-min connection buffer. Widen the buffer before Airport Transfer by at least 60 min or pick a flexible fare. Ask Grand Dragon Ladakh to guarantee late check-in so the room is held.

### Mountain Cloudburst (trip-ladakh-2025)

“Mountain Cloudburst” brings heavy rain during 12 Sep 10:50 - 12 Sep 13:50: Airport Transfer is hit directly — 48 mm/h rain blocks the mountain road (landslide/flooding risk); the transfer cannot run. Downstream, Grand Dragon Ladakh, Pangong Lake Tour are at risk of late arrival. Highest risk: cancellation risk for Airport Transfer at 95% (range 81–99%). Act before the weather does: rebook Airport Transfer now, while alternatives still have seats. Recommended preemptive recovery: Wait It Out — Keep the trip, but move exposed legs to just after the storm and re-time the connections that depend on them. Cost +₹96, arrival impact 0 min, 6/7 commitments preserved (validated under the same storm). Actions: Ask Grand Dragon Ladakh to guarantee late check-in so the room is held. Widen the buffer before Pangong Lake Tour by at least 60 min or pick a flexible fare.

### Afternoon Squall at the Activity (trip-ladakh-2025)

“Afternoon Squall at the Activity” brings high winds during 13 Sep 05:00 - 13 Sep 07:00: Pangong Lake Tour is hit directly — 72 km/h winds make the outing unsafe; the operator cancels. Highest risk: cancellation risk for Pangong Lake Tour at 97% (range 81–99%). Act before the weather does: rebook Pangong Lake Tour now, while alternatives still have seats. Move outdoor plans out of the storm window rather than waiting for the operator to cancel. Recommended preemptive recovery: Protect the Chain — Accept the weather delay but rebook at-risk connections with generous buffers, and move outdoor plans out of the storm. Cost +₹480, arrival impact 0 min, 6/7 commitments preserved (validated under the same storm). Actions: Reschedule Pangong Lake Tour to the day after the storm; weather cancellations are rarely refundable on the day.

### Light Drizzle (trip-ladakh-2025)

Under “Light Drizzle” (12 Sep 06:30 - 12 Sep 09:30), none of your bookings are exposed: the weather misses every leg's scheduled window or stays within operating limits. No preemptive action is needed.

### Pre-monsoon Thunderstorm (trip-ladakh-2025)

“Pre-monsoon Thunderstorm” brings high winds during 12 Sep 06:30 - 12 Sep 09:30: Mumbai → Delhi is hit directly — 85 km/h crosswinds force holds and diversions. Because Delhi Connection runs late, Delhi → Leh can no longer be made — only 0 of the 60 minutes it needs remain. Downstream, Delhi Connection, Airport Transfer, Grand Dragon Ladakh are at risk of late arrival. Highest risk: connection miss risk for Delhi → Leh at 92% (range 77–99%). Act before the weather does: rebook Delhi → Leh now, while alternatives still have seats. Recommended preemptive recovery: Beat the Storm — Move exposed legs earlier so the journey is past the danger zone before the weather arrives. Cost +₹952, arrival impact 0 min, 7/7 commitments preserved (validated under the same storm). Alternative: Wait It Out (+₹544, 7/7 preserved). Actions: Rebook Delhi → Leh at least 120 min later to restore its 60-min connection buffer. Widen the buffer before Airport Transfer by at least 60 min or pick a flexible fare. Ask Grand Dragon Ladakh to guarantee late check-in so the room is held.