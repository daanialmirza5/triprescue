"""Build Safar Sathi's Nugen alignment dataset and (optionally) start alignment.

Pipeline:  base model -> Nugen alignment on this dataset -> domain model
           (NUGEN_MODEL_ID) -> used by app/services/nugen_service.py

How samples are generated
-------------------------
Every sample is produced by running the real Digital Twin engine (the same code
the API uses) over the seeded multi-leg trips against a grid of extreme-weather
scenarios - including mild/no-impact "negative" examples so the model learns
not to over-alarm. The instruction is the grounded JSON context the app sends
at inference time; the response is Safar Sathi's reference reasoning: cascade
explanation, headline risk with its uncertainty range, and the optimal
preemptive recovery the twin validated under the same storm.

Outputs (in backend/scripts/):
  nugen_alignment_dataset.jsonl   - one sample per line (instruction/response + metadata)
  nugen_benchmark.json            - [{"sample_num", "instruction", "response"}] for POST /api/v3/benchmarks/upload
  nugen_domain_document.md        - domain knowledge document for POST /api/v3/documents/create

Usage:
  python scripts/export_nugen_dataset.py            # build files (dry run, no network)
  python scripts/export_nugen_dataset.py --upload   # also upload + create the alignment project
      (requires NUGEN_API_KEY; optional NUGEN_BASE_MODEL_ID, default qwen-v2p5-0p5b-instruct)
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

from app import models  # noqa: E402,F401
from app.database.base import Base  # noqa: E402
from app.database.seed import seed_if_empty  # noqa: E402
from app.engines.digital_twin_engine import DigitalTwinEngine, WeatherScenario  # noqa: E402
from app.repositories.node_repository import NodeRepository  # noqa: E402
from app.services import nugen_service  # noqa: E402
from app.services.converters import to_engine_edge, to_engine_node  # noqa: E402

OUT = Path(__file__).resolve().parent
TRIPS = ["trip-ladakh-2025", "trip-goa-2026", "trip-rajasthan-2026"]
SCENARIOS = [
    dict(name="Severe Monsoon Deluge", rainfall_mm_per_hour=55, wind_speed_kmh=65, visibility_meters=300, temperature_celsius=28, storm_duration_hours=4),
    dict(name="Dense Fog Ground Stop", rainfall_mm_per_hour=0, wind_speed_kmh=6, visibility_meters=150, temperature_celsius=11, storm_duration_hours=7),
    dict(name="Cyclonic Storm", rainfall_mm_per_hour=85, wind_speed_kmh=110, visibility_meters=600, temperature_celsius=26, storm_duration_hours=10),
    dict(name="Severe Heatwave", rainfall_mm_per_hour=0, wind_speed_kmh=14, visibility_meters=8000, temperature_celsius=47, storm_duration_hours=8),
    dict(name="Mountain Cloudburst", rainfall_mm_per_hour=48, wind_speed_kmh=35, visibility_meters=900, temperature_celsius=14, storm_duration_hours=3, target="transfer"),
    dict(name="Afternoon Squall at the Activity", rainfall_mm_per_hour=30, wind_speed_kmh=72, visibility_meters=2500, temperature_celsius=24, storm_duration_hours=2, target="activity"),
    dict(name="Light Drizzle", rainfall_mm_per_hour=3, wind_speed_kmh=12, visibility_meters=7000, temperature_celsius=24, storm_duration_hours=3),
    # Broad storms at different intensities and durations.
    dict(name="Pre-monsoon Thunderstorm", rainfall_mm_per_hour=40, wind_speed_kmh=85, visibility_meters=1200, temperature_celsius=31, storm_duration_hours=3),
    dict(name="Coastal Gale", rainfall_mm_per_hour=25, wind_speed_kmh=120, visibility_meters=2000, temperature_celsius=27, storm_duration_hours=6),
    dict(name="Winter Blizzard", rainfall_mm_per_hour=20, wind_speed_kmh=95, visibility_meters=400, temperature_celsius=-6, storm_duration_hours=12),
    dict(name="Extended Monsoon Spell", rainfall_mm_per_hour=35, wind_speed_kmh=40, visibility_meters=1500, temperature_celsius=27, storm_duration_hours=24),
    dict(name="Morning Smog and Fog", rainfall_mm_per_hour=0, wind_speed_kmh=4, visibility_meters=400, temperature_celsius=9, storm_duration_hours=5),
    dict(name="Moderate Steady Rain", rainfall_mm_per_hour=12, wind_speed_kmh=25, visibility_meters=5000, temperature_celsius=25, storm_duration_hours=6),
    # Storms centred on one booking type, so the cascade starts mid-itinerary.
    dict(name="Thunderstorm over the Departure Airport", rainfall_mm_per_hour=40, wind_speed_kmh=90, visibility_meters=800, temperature_celsius=29, storm_duration_hours=2, target="flight"),
    dict(name="Flooding around the Hotel", rainfall_mm_per_hour=95, wind_speed_kmh=30, visibility_meters=1500, temperature_celsius=26, storm_duration_hours=6, target="hotel"),
    dict(name="Heatwave during the Activity", rainfall_mm_per_hour=0, wind_speed_kmh=10, visibility_meters=9000, temperature_celsius=46, storm_duration_hours=6, target="activity"),
    dict(name="Fog on the Transfer Route", rainfall_mm_per_hour=0, wind_speed_kmh=5, visibility_meters=120, temperature_celsius=8, storm_duration_hours=4, target="transfer"),
    dict(name="Storm on the Return Leg", rainfall_mm_per_hour=60, wind_speed_kmh=80, visibility_meters=500, temperature_celsius=24, storm_duration_hours=4, target="return"),
    # No-impact negatives: the model must not over-alarm on ordinary weather.
    dict(name="Breezy Clear Day", rainfall_mm_per_hour=0, wind_speed_kmh=30, visibility_meters=10000, temperature_celsius=22, storm_duration_hours=6),
    dict(name="Warm Afternoon", rainfall_mm_per_hour=0, wind_speed_kmh=12, visibility_meters=9000, temperature_celsius=36, storm_duration_hours=5),
]
INSTRUCTION = (
    "Given this Safar Sathi itinerary, weather scenario and Digital Twin simulation (JSON), explain which legs fail and why, "
    "state the key risk with its range, and recommend the best preemptive recovery.\n\n"
)


def _load(db, trip_id):
    repo = NodeRepository(db)
    return [to_engine_node(n) for n in repo.list_for_trip(trip_id)], [to_engine_edge(e) for e in repo.list_edges_for_trip(trip_id)]


def _response(ctx: dict, options: list) -> str:
    parts = [nugen_service.heuristic_explanation(ctx)]
    if options:
        best = options[0]
        parts.append(
            f"Recommended preemptive recovery: {best.name} — {best.description} "
            f"Cost +₹{best.delta_cost:,.0f}, arrival impact {best.time_impact_minutes} min, "
            f"{best.commitments_preserved}/{best.total_commitments} commitments preserved (validated under the same storm)."
        )
        if len(options) > 1:
            alt = options[1]
            parts.append(f"Alternative: {alt.name} (+₹{alt.delta_cost:,.0f}, {alt.commitments_preserved}/{alt.total_commitments} preserved"
                         + (f", {alt.residual_failures} leg(s) still fail" if alt.residual_failures else "") + ").")
    tips = nugen_service.heuristic_mitigation(ctx)
    if ctx["impacted"]:
        parts.append("Actions: " + " ".join(tips[:3]))
    return " ".join(parts)


def build_samples() -> list[dict]:
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    db = sessionmaker(bind=engine)()
    seed_if_empty(db)
    twin = DigitalTwinEngine()
    samples = []
    for trip_id in TRIPS:
        nodes, edges = _load(db, trip_id)
        for spec in SCENARIOS:
            spec = dict(spec)
            target_category = spec.pop("target", None)
            affected = None
            if target_category:
                affected = next((n.id for n in nodes if str(n.category) == target_category), None)
                if affected is None:
                    continue
            scenario = WeatherScenario(**spec, affected_node_id=affected)
            run = twin.run(nodes, edges, scenario)
            options = twin.preemptive_options(nodes, edges, scenario, run)
            ctx = nugen_service.build_context(nodes, scenario, run)
            samples.append({
                "sample_num": len(samples) + 1,
                "instruction": INSTRUCTION + json.dumps(ctx, ensure_ascii=False),
                "response": _response(ctx, options),
                "metadata": {"trip_id": trip_id, "scenario": scenario.name, "severity": scenario.severity,
                             "health_score": run.health_score, "impacted": len(ctx["impacted"]),
                             "recommended": options[0].name if options else None},
            })
    return samples


def domain_document(samples: list[dict]) -> str:
    rules = (DigitalTwinEngine.__module__ and sys.modules["app.engines.digital_twin_engine"].__doc__) or ""
    return (
        "# Safar Sathi travel-disruption domain knowledge\n\n"
        "## Weather stress rules used by the Digital Twin\n\n" + rules.strip() + "\n\n"
        "## Dependency semantics\n\n"
        "Hard dependencies (flight connections, timed trains) break when the available buffer falls below the required "
        "buffer. Soft dependencies (transfer -> hotel -> activity) shift flexible bookings later or flag fixed ones at risk. "
        "Bookings more than 24h after an unresolved break are treated as recoverable.\n\n"
        "## Worked examples\n\n" + "\n\n".join(f"### {s['metadata']['scenario']} ({s['metadata']['trip_id']})\n\n{s['response']}" for s in samples[:8])
    )


def upload(samples: list[dict], files: dict[str, Path]) -> None:
    import httpx
    from app.config import get_settings

    settings = get_settings()
    key = settings.nugen_api_key or os.environ.get("NUGEN_API_KEY")
    if not key:
        sys.exit("NUGEN_API_KEY is not set - rerun without --upload for a dry run.")
    base = (settings.nugen_base_url or os.environ.get("NUGEN_BASE_URL", "https://api.nugen.in")).rstrip("/")
    headers = {"Authorization": f"Bearer {key}"}
    with httpx.Client(timeout=60, headers=headers) as http:
        doc = http.post(f"{base}/api/v3/documents/create",
                        files=[("files", (files["document"].name, files["document"].read_bytes(), "text/markdown"))],
                        data={"names": "safar-sathi-domain", "categories": "travel"})
        doc.raise_for_status()
        doc_body = doc.json()
        print("documents/create ->", json.dumps(doc_body)[:400])
        document_ids = [d.get("document_id") or d.get("id") for d in (doc_body if isinstance(doc_body, list) else doc_body.get("documents", [doc_body]))]
        document_ids = [d for d in document_ids if d]
        bench = http.post(f"{base}/api/v3/benchmarks/upload",
                          files={"file": (files["benchmark"].name, files["benchmark"].read_bytes(), "application/json")},
                          data={"benchmark_name": "safar-sathi-weather-cascades", "document_id": document_ids[0] if document_ids else ""})
        bench.raise_for_status()
        bench_body = bench.json()
        print("benchmarks/upload ->", json.dumps(bench_body)[:400])
        project = http.post(f"{base}/api/v3/alignment-projects/create", json={
            "alignment_name": "safar-sathi-travel-twin-v1",
            "base_model_id": os.environ.get("NUGEN_BASE_MODEL_ID", "qwen-v2p5-0p5b-instruct"),
            "document_ids": document_ids,
            "benchmark_id": bench_body.get("benchmark_id") or bench_body.get("id"),
            "description": "Travel disruption cascade reasoning for Safar Sathi's weather Digital Twin.",
        })
        if project.status_code >= 400:
            print("alignment-projects/create error status:", project.status_code)
            print("alignment-projects/create response:", project.text)
        project.raise_for_status()
        print("alignment-projects/create ->", project.json())
        print("When alignment completes, deploy it (POST /api/v3/models/{model_id}/deployment) and set NUGEN_MODEL_ID.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--upload", action="store_true", help="upload to Nugen and create the alignment project")
    args = parser.parse_args()

    samples = build_samples()
    files = {"dataset": OUT / "nugen_alignment_dataset.jsonl", "benchmark": OUT / "nugen_benchmark.json", "document": OUT / "nugen_domain_document.md"}
    with files["dataset"].open("w", encoding="utf-8", newline="\n") as fh:
        for s in samples:
            fh.write(json.dumps(s, ensure_ascii=False) + "\n")
    files["benchmark"].write_text(json.dumps([{k: s[k] for k in ("sample_num", "instruction", "response")} for s in samples], ensure_ascii=False, indent=1), encoding="utf-8")
    files["document"].write_text(domain_document(samples), encoding="utf-8")
    impacted = sum(1 for s in samples if s["metadata"]["impacted"])
    print(f"Wrote {len(samples)} samples ({impacted} with cascades, {len(samples) - impacted} no-impact) to {files['dataset'].name}")
    if args.upload:
        upload(samples, files)
    else:
        print("Dry run: rerun with --upload (and NUGEN_API_KEY) to create the Nugen alignment project.")


if __name__ == "__main__":
    main()
