"""Architecture map: only hosts the code really calls count as external APIs."""

import ast

from app.services.architecture_service import _Visitor


def _hosts(source: str) -> set[str]:
    visitor = _Visitor("app.providers.example")
    visitor.visit(ast.parse(source))
    return visitor.urls


def test_called_urls_are_detected():
    assert _hosts('URL = "https://api.example.com/v1/search"\n') == {"api.example.com"}


def test_docstrings_and_link_fstrings_are_ignored():
    source = '''
"""See https://docs.example.com for the usage policy."""
def link(osm_id):
    """Docs at https://policy.example.org"""
    return f"https://www.openstreetmap.org/node/{osm_id}"
'''
    assert _hosts(source) == set()


def test_imports_and_uses_of_app_modules_are_recorded():
    source = "from app.services import trip_service\n\ndef handler():\n    return trip_service.get_trip()\n"
    visitor = _Visitor("app.api.routes.example")
    visitor.visit(ast.parse(source))
    assert ("handler", "app.services.trip_service", "get_trip") in [(c, m, s) for c, m, s, _ in visitor.uses]
