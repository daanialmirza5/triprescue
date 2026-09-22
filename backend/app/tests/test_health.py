def test_liveness_probe(client):
    resp = client.get("/healthz")
    assert resp.status_code == 200
    assert resp.json() == {"status": "alive"}


def test_readiness_probe_healthy(client):
    resp = client.get("/readyz")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ready"
    assert data["database"]["status"] == "ok"
    assert isinstance(data["database"]["latencyMs"], (int, float))
    assert data["database"]["latencyMs"] >= 0


def test_legacy_api_health_endpoint(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
    assert resp.json()["database"] == "ok"
