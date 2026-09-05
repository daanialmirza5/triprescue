"""Shared test fixtures: a plain-dataclass model of Aisha's Ladakh itinerary,
built directly against the engine types (no database involved), so the
propagation/recovery/risk algorithms can be exercised in isolation.
"""

from __future__ import annotations

from datetime import datetime

from app.engines.types import EngineEdge, EngineNode


def ladakh_nodes() -> list[EngineNode]:
    return [
        EngineNode(
            id="bom-del",
            category="flight",
            title="Mumbai → Delhi",
            location="Mumbai (BOM)",
            scheduled_start=datetime(2025, 9, 12, 6, 30),
            scheduled_end=datetime(2025, 9, 12, 8, 45),
            flexible=False,
            cost=6800,
            refundable=True,
            refund_percentage=0.5,
            cancellation_deadline_hours=24,
            provider="IndiGo",
            confirmation="6E-3014-XK8",
            origin_code="BOM",
            destination_code="DEL",
        ),
        EngineNode(
            id="del-connection",
            category="connection",
            title="Delhi Connection",
            location="Delhi (DEL) T3",
            scheduled_start=datetime(2025, 9, 12, 8, 45),
            scheduled_end=datetime(2025, 9, 12, 8, 45),
            flexible=True,
            cost=0,
            refundable=False,
        ),
        EngineNode(
            id="del-leh",
            category="flight",
            title="Delhi → Leh",
            location="Delhi (DEL)",
            scheduled_start=datetime(2025, 9, 12, 10, 15),
            scheduled_end=datetime(2025, 9, 12, 11, 30),
            flexible=False,
            cost=9200,
            refundable=False,
            refund_percentage=0.0,
            cancellation_deadline_hours=24,
            provider="Go First",
            confirmation="G8-204",
            origin_code="DEL",
            destination_code="IXL",
        ),
        EngineNode(
            id="airport-transfer",
            category="transfer",
            title="Airport Transfer",
            location="Leh (IXL)",
            scheduled_start=datetime(2025, 9, 12, 11, 50),
            scheduled_end=datetime(2025, 9, 12, 12, 10),
            flexible=True,
            cost=1200,
            refundable=True,
            refund_percentage=0.5,
            cancellation_deadline_hours=2,
            provider="MakeMyTrip Transfers",
            confirmation="MMT-TR-882",
        ),
        EngineNode(
            id="grand-dragon",
            category="hotel",
            title="Grand Dragon Ladakh",
            location="Leh",
            scheduled_start=datetime(2025, 9, 12, 13, 0),
            scheduled_end=datetime(2025, 9, 16, 11, 0),
            flexible=True,
            fixed_end=True,
            cost=14400,
            refundable=True,
            refund_percentage=0.75,
            cancellation_deadline_hours=48,
            provider="Grand Dragon Ladakh",
            confirmation="GDL-8843",
        ),
        EngineNode(
            id="pangong-tour",
            category="activity",
            title="Pangong Lake Tour",
            location="Pangong Tso",
            scheduled_start=datetime(2025, 9, 13, 6, 0),
            scheduled_end=datetime(2025, 9, 13, 18, 0),
            flexible=False,
            cost=4800,
            refundable=False,
            refund_percentage=0.0,
            cancellation_deadline_hours=24,
            provider="Ladakh Adventures",
            confirmation="LA-PG-441",
        ),
        EngineNode(
            id="nubra-valley",
            category="activity",
            title="Nubra Valley Excursion",
            location="Nubra Valley",
            scheduled_start=datetime(2025, 9, 14, 7, 0),
            scheduled_end=datetime(2025, 9, 14, 19, 0),
            flexible=False,
            cost=5200,
            refundable=True,
            refund_percentage=0.5,
            cancellation_deadline_hours=48,
            provider="Ladakh Adventures",
            confirmation="LA-NV-442",
        ),
        EngineNode(
            id="leh-return",
            category="return",
            title="Leh → Delhi → Mumbai",
            location="Leh (IXL)",
            scheduled_start=datetime(2025, 9, 16, 12, 0),
            scheduled_end=datetime(2025, 9, 16, 16, 30),
            flexible=False,
            cost=1200,
            refundable=True,
            refund_percentage=1.0,
            cancellation_deadline_hours=24,
            provider="IndiGo",
            confirmation="6E-3015-QR2",
        ),
    ]


def ladakh_edges() -> list[EngineEdge]:
    return [
        EngineEdge("e1", "bom-del", "del-connection", "soft", min_buffer_minutes=0, risk_buffer_minutes=0),
        EngineEdge(
            "e2", "del-connection", "del-leh", "hard", min_buffer_minutes=60, risk_buffer_minutes=30
        ),
        EngineEdge("e3", "del-leh", "airport-transfer", "soft", min_buffer_minutes=20, risk_buffer_minutes=10),
        EngineEdge(
            "e4", "airport-transfer", "grand-dragon", "soft", min_buffer_minutes=10, risk_buffer_minutes=10
        ),
        EngineEdge(
            "e5", "grand-dragon", "pangong-tour", "soft", min_buffer_minutes=0, upstream_reference="start"
        ),
        EngineEdge(
            "e6", "grand-dragon", "nubra-valley", "soft", min_buffer_minutes=0, upstream_reference="start"
        ),
        EngineEdge("e7", "grand-dragon", "leh-return", "soft", min_buffer_minutes=0, upstream_reference="end"),
    ]
