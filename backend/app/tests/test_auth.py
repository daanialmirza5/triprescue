def _register(client, name="Test Traveler", email="test.traveler@example.com", password="hunter2"):
    resp = client.post("/api/auth/register", json={"name": name, "email": email, "password": password})
    assert resp.status_code == 200, resp.text
    return resp.json()


def _auth_header(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_register_then_login_round_trip(client):
    registered = _register(client)
    assert registered["name"] == "Test Traveler"
    assert registered["email"] == "test.traveler@example.com"
    assert registered["token"]

    resp = client.post("/api/auth/login", json={"email": "test.traveler@example.com", "password": "hunter2"})
    assert resp.status_code == 200
    assert resp.json()["travelerId"] == registered["travelerId"]


def test_login_with_wrong_password_is_401(client):
    _register(client)
    resp = client.post("/api/auth/login", json={"email": "test.traveler@example.com", "password": "wrong"})
    assert resp.status_code == 401


def test_register_duplicate_email_is_409(client):
    _register(client)
    resp = client.post(
        "/api/auth/register", json={"name": "Someone Else", "email": "test.traveler@example.com", "password": "x"}
    )
    assert resp.status_code == 409


def test_demo_account_can_access_seeded_ladakh_trip(client):
    demo = client.get("/api/auth/demo-account").json()
    resp = client.get("/api/trips/trip-ladakh-2025", headers=_auth_header(demo["token"]))
    assert resp.status_code == 200
    assert resp.json()["name"] == "Aisha's Ladakh Expedition"


def test_me_returns_the_authenticated_traveler(client):
    registered = _register(client)
    resp = client.get("/api/auth/me", headers=_auth_header(registered["token"]))
    assert resp.status_code == 200
    body = resp.json()
    assert body["travelerId"] == registered["travelerId"]
    assert body["email"] == "test.traveler@example.com"


def test_unauthenticated_requests_still_see_the_demo_travelers_trips(client):
    """No Authorization header at all falls back to the seeded demo traveler,
    so the pre-login frontend keeps working exactly as before."""
    resp = client.get("/api/trips")
    ids = {t["id"] for t in resp.json()}
    assert "trip-ladakh-2025" in ids


def test_a_new_traveler_starts_with_no_trips_and_cannot_see_the_demo_trip(client):
    registered = _register(client)
    resp = client.get("/api/trips", headers=_auth_header(registered["token"]))
    assert resp.status_code == 200
    assert resp.json() == []

    resp = client.get("/api/trips/trip-ladakh-2025", headers=_auth_header(registered["token"]))
    assert resp.status_code == 404


def test_a_new_traveler_cannot_disrupt_recover_or_ask_about_a_trip_they_do_not_own(client):
    """Trip ownership must be enforced on the mutation surface too, not just
    the read/list routes - disrupting, generating/applying a recovery, or
    asking the assistant about someone else's trip must all 404."""
    registered = _register(client)
    headers = _auth_header(registered["token"])

    resp = client.post(
        "/api/trips/trip-ladakh-2025/disruptions", json={"type": "flight-delay", "delayMinutes": 180}, headers=headers
    )
    assert resp.status_code == 404

    resp = client.post("/api/trips/trip-ladakh-2025/simulate", json={"type": "flight-delay"}, headers=headers)
    assert resp.status_code == 404

    resp = client.post("/api/trips/trip-ladakh-2025/recovery-options/generate", headers=headers)
    assert resp.status_code == 404

    resp = client.post(
        "/api/trips/trip-ladakh-2025/recovery/apply", json={"recoveryId": "does-not-matter"}, headers=headers
    )
    assert resp.status_code == 404

    resp = client.post(
        "/api/assistant", json={"tripId": "trip-ladakh-2025", "message": "What is the risk?"}, headers=headers
    )
    assert resp.status_code == 404

    # Sanity: the demo traveler (who actually owns it) can still do all of this.
    demo = client.get("/api/auth/demo-account").json()
    demo_headers = _auth_header(demo["token"])
    resp = client.post(
        "/api/trips/trip-ladakh-2025/disruptions", json={"type": "flight-delay", "delayMinutes": 180}, headers=demo_headers
    )
    assert resp.status_code == 200
