"""Serve the standalone Live Journey Pipeline page (frontend/dist-pipeline) at
/pipeline/, so any laptop on the network can open http://<host>:8000/pipeline/
with nothing but a browser. The page calls this same backend (same origin)."""

from __future__ import annotations

import logging
import os
from pathlib import Path

from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import PlainTextResponse, RedirectResponse
from starlette.staticfiles import StaticFiles

logger = logging.getLogger("triprescue.pipeline_ui")
DEFAULT_DIR = Path(__file__).resolve().parents[3] / "frontend" / "dist-pipeline"


def mount_pipeline_ui(app: FastAPI, directory: str | Path | None = None) -> bool:
    folder = Path(directory or os.environ.get("PIPELINE_UI_DIR") or DEFAULT_DIR)
    if not (folder / "index.html").exists():
        async def not_built(request: Request) -> PlainTextResponse:
            return PlainTextResponse(
                "The Live Journey Pipeline page has not been built yet. In frontend/, run: npm run build:pipeline",
                status_code=404,
            )

        app.add_route("/pipeline", not_built, methods=["GET"])
        app.add_route("/pipeline/", not_built, methods=["GET"])
        logger.info("Pipeline UI not built (%s missing); /pipeline explains how to build it", folder / "index.html")
        return False

    async def to_slash(request: Request) -> RedirectResponse:
        return RedirectResponse(url=str(request.url.replace(path="/pipeline/")))

    app.add_route("/pipeline", to_slash, methods=["GET"])
    app.mount("/pipeline", StaticFiles(directory=folder, html=True), name="pipeline-ui")
    logger.info("Live Journey Pipeline served at /pipeline/ from %s", folder)
    return True
