"""With `require_authentication` on, an anonymous request must be rejected
rather than silently mapped to the seeded demo traveler (see app/api/deps.py)."""

from app.config import Settings


def test_anonymous_request_rejected_when_require_authentication_enabled(client, monkeypatch):
    strict_settings = Settings(_env_file=None, require_authentication=True)
    monkeypatch.setattr("app.api.deps.get_settings", lambda: strict_settings)

    resp = client.get("/api/trips")

    assert resp.status_code == 401
    assert "Authentication required" in resp.json()["detail"]
