"""Source-derived architecture map for the Live Journey Pipeline.

Nothing here is hand-drawn. Nodes come from the running FastAPI route table and
from the backend's own modules (services, engines, repositories, providers);
edges come from parsing that source with `ast` - an edge exists only where a
module imports another app module AND actually calls/uses it, and each edge
records the calling function and line. Repositories are linked to the tables of
the models they use; providers to the external hosts found in their code and
settings.
"""

from __future__ import annotations

import ast
import functools
import re
from pathlib import Path
from typing import Any

from fastapi.routing import APIRoute

from app.core.pipeline_trace import source_of

_APP_DIR = Path(__file__).resolve().parents[1]
_REPO_ROOT = _APP_DIR.parents[1]
LAYERS = {
    "app.api.routes": "api",
    "app.services": "service",
    "app.engines": "engine",
    "app.repositories": "database",
    "app.providers": "provider",
    "app.core.nugen_client": "provider",
}
_SKIP_SERVICES = {"app.services.architecture_service", "app.services.pipeline_service", "app.services.converters"}
_URL_RE = re.compile(r"https?://([a-z0-9.-]+\.[a-z]{2,})", re.I)


def _module_name(path: Path) -> str:
    return ".".join(path.relative_to(_APP_DIR.parent).with_suffix("").parts)


def _layer(module: str) -> str | None:
    for prefix, layer in LAYERS.items():
        if module == prefix or module.startswith(prefix + "."):
            return layer
    return None


def _rel(path: Path) -> str:
    return path.resolve().relative_to(_REPO_ROOT).as_posix()


class _Visitor(ast.NodeVisitor):
    """Collects imports of app modules and where they are used, per function."""

    def __init__(self, module: str):
        self.module = module
        self.alias_module: dict[str, str] = {}  # local name -> app module
        self.alias_symbol: dict[str, tuple[str, str]] = {}  # local name -> (app module, symbol)
        self.functions: dict[str, int] = {}
        self.uses: list[tuple[str, str, str, int]] = []  # (caller function, target module, symbol, line)
        self._stack: list[str] = []
        self.urls: set[str] = set()

    def visit_Import(self, node: ast.Import) -> None:
        for a in node.names:
            if a.name.startswith("app."):
                self.alias_module[a.asname or a.name.split(".")[-1]] = a.name

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        if not node.module or not node.module.startswith("app"):
            return
        for a in node.names:
            full = f"{node.module}.{a.name}"
            if (_APP_DIR.parent / Path(*full.split("."))).with_suffix(".py").exists():
                self.alias_module[a.asname or a.name] = full  # imported a module
            else:
                self.alias_symbol[a.asname or a.name] = (node.module, a.name)

    def _enter(self, node: ast.AST, name: str) -> None:
        qual = ".".join(self._stack + [name])
        self.functions[qual] = node.lineno
        self._stack.append(name)
        self.generic_visit(node)
        self._stack.pop()

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        self._enter(node, node.name)

    visit_AsyncFunctionDef = visit_FunctionDef  # type: ignore[assignment]

    def visit_ClassDef(self, node: ast.ClassDef) -> None:
        self._stack.append(node.name)
        self.generic_visit(node)
        self._stack.pop()

    def visit_Attribute(self, node: ast.Attribute) -> None:
        if isinstance(node.value, ast.Name) and node.value.id in self.alias_module:
            self.uses.append((".".join(self._stack) or "<module>", self.alias_module[node.value.id], node.attr, node.lineno))
        self.generic_visit(node)

    def visit_Name(self, node: ast.Name) -> None:
        if isinstance(node.ctx, ast.Load) and node.id in self.alias_symbol:
            mod, sym = self.alias_symbol[node.id]
            self.uses.append((".".join(self._stack) or "<module>", mod, sym, node.lineno))

    def visit_Expr(self, node: ast.Expr) -> None:
        # Docstrings / bare strings document things; they are not calls.
        if isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
            return
        self.generic_visit(node)

    def visit_JoinedStr(self, node: ast.JoinedStr) -> None:
        # f-strings build links for the UI (e.g. openstreetmap.org/node/1), not requests.
        for value in node.values:
            if not isinstance(value, ast.Constant):
                self.visit(value)

    def visit_Constant(self, node: ast.Constant) -> None:
        if isinstance(node.value, str):
            self.urls.update(h.lower() for h in _URL_RE.findall(node.value))


def _parse(path: Path) -> _Visitor:
    visitor = _Visitor(_module_name(path))
    visitor.visit(ast.parse(path.read_text(encoding="utf-8")))
    return visitor


def _resolve_target(module: str, symbol: str, known: dict[str, Any]) -> str | None:
    """`from app.services import x` style: the target may be `module.symbol`."""
    if f"{module}.{symbol}" in known:
        return f"{module}.{symbol}"
    if module in known:
        return module
    return None


def _describe(module: str) -> str:
    try:
        tree = ast.parse((_APP_DIR.parent / Path(*module.split("."))).with_suffix(".py").read_text(encoding="utf-8"))
        doc = ast.get_docstring(tree) or ""
    except (OSError, SyntaxError):
        doc = ""
    return doc.strip().split("\n\n")[0].replace("\n", " ")[:220]


@functools.lru_cache(maxsize=1)
def _static_graph() -> dict[str, Any]:
    files = [p for p in _APP_DIR.rglob("*.py") if "tests" not in p.parts and p.name != "__init__.py"]
    parsed = {v.module: (v, p) for p in files if _layer(_module_name(p)) for v in [_parse(p)]}
    parsed = {m: vp for m, vp in parsed.items() if m not in _SKIP_SERVICES}

    nodes: dict[str, dict[str, Any]] = {}
    for module, (v, path) in parsed.items():
        nodes[f"module:{module}"] = {
            "id": f"module:{module}", "layer": _layer(module), "label": module.rsplit(".", 1)[-1], "module": module,
            "file": _rel(path), "description": _describe(module),
            "functions": [{"name": n, "line": ln} for n, ln in sorted(v.functions.items(), key=lambda x: x[1]) if not n.split(".")[-1].startswith("__")][:40],
        }

    edges: dict[tuple[str, str], dict[str, Any]] = {}
    tables_by_model: dict[str, str] = {}
    for model_file in (_APP_DIR / "models").glob("*.py"):
        for cls in re.finditer(r"class (\w+)\(Base\):[\s\S]*?__tablename__ = \"(\w+)\"", model_file.read_text(encoding="utf-8")):
            tables_by_model[cls.group(1)] = cls.group(2)

    for module, (v, path) in parsed.items():
        src_id = f"module:{module}"
        for caller, target_mod, symbol, line in v.uses:
            target = _resolve_target(target_mod, symbol, parsed)
            if target and target != module:
                key = (src_id, f"module:{target}")
                edge = edges.setdefault(key, {"id": f"{src_id}->module:{target}", "source": src_id, "target": f"module:{target}",
                                              "kind": "calls", "calls": []})
                if len(edge["calls"]) < 12:
                    edge["calls"].append({"caller": caller, "callee": symbol, "file": _rel(path), "line": line})
            elif target_mod.startswith("app.models") and _layer(module) == "database" and symbol in tables_by_model:
                table = tables_by_model[symbol]
                tid = f"table:{table}"
                nodes.setdefault(tid, {"id": tid, "layer": "table", "label": table, "module": f"{target_mod}.{symbol}",
                                       "file": _rel(_APP_DIR / Path(*target_mod.split(".")[1:])) + ".py", "description": f"SQLAlchemy model {symbol}", "functions": []})
                edge = edges.setdefault((src_id, tid), {"id": f"{src_id}->{tid}", "source": src_id, "target": tid, "kind": "reads/writes", "calls": []})
                if len(edge["calls"]) < 6:
                    edge["calls"].append({"caller": caller, "callee": symbol, "file": _rel(path), "line": line})
        if _layer(module) == "provider":
            for host in sorted(v.urls):
                hid = f"external:{host}"
                nodes.setdefault(hid, {"id": hid, "layer": "external", "label": host, "module": None, "file": None,
                                       "description": "External HTTP API", "functions": []})
                edges.setdefault((src_id, hid), {"id": f"{src_id}->{hid}", "source": src_id, "target": hid, "kind": "http", "calls": []})
    # Hosts that live in settings (config.py) rather than provider code.
    config_urls = {m.group(1): m.group(2).lower() for m in re.finditer(r"(\w+_url): str = \"https?://([a-z0-9.-]+)", (_APP_DIR / "config.py").read_text(encoding="utf-8"))}
    provider_for_setting = {"aviationstack_base_url": "app.providers.live.aviationstack", "railradar_base_url": "app.providers.live.railradar",
                            "ticketmaster_base_url": "app.providers.live.ticketmaster", "overpass_url": "app.providers.live.overpass",
                            "nominatim_places_url": "app.providers.live.nominatim_places", "nugen_base_url": "app.core.nugen_client",
                            "amadeus_base_url": "app.providers.amadeus_flight_provider"}
    for setting, host in config_urls.items():
        mod = provider_for_setting.get(setting)
        if mod and f"module:{mod}" in nodes:
            hid = f"external:{host}"
            nodes.setdefault(hid, {"id": hid, "layer": "external", "label": host, "module": None, "file": "backend/app/config.py",
                                   "description": f"External HTTP API ({setting})", "functions": []})
            edges.setdefault((f"module:{mod}", hid), {"id": f"module:{mod}->{hid}", "source": f"module:{mod}", "target": hid, "kind": "http", "calls": []})
    return {"nodes": nodes, "edges": edges}


def architecture(app: Any) -> dict[str, Any]:
    static = _static_graph()
    nodes = dict(static["nodes"])
    edges = dict(static["edges"])
    routes = []
    for route in app.routes:
        if not isinstance(route, APIRoute) or route.path.startswith("/api/pipeline"):
            continue
        module = route.endpoint.__module__
        router_id = f"module:{module}"
        src = source_of(route.endpoint)
        deps = [getattr(d.call, "__name__", "") for d in route.dependant.dependencies]
        body = route.body_field
        method = sorted(route.methods or ["GET"])[0]
        routes.append({
            "id": f"api:{method} {route.path}", "method": method, "path": route.path, "router": router_id, "function": route.endpoint.__name__,
            "file": src["file"], "line": src["line"], "auth": "get_current_traveler_id" in deps,
            "requestSchema": getattr(getattr(body, "type_", None), "__name__", None) if body else None,
            "responseSchema": getattr(route.response_model, "__name__", None) if route.response_model else None,
            "calls": sorted({e["target"] for e in edges.values() if e["source"] == router_id
                             for c in e["calls"] if c["caller"] == route.endpoint.__name__}),
        })
    return {
        "nodes": list(nodes.values()),
        "edges": list(edges.values()),
        "routes": routes,
        "layers": ["api", "service", "engine", "database", "table", "provider", "external"],
    }
