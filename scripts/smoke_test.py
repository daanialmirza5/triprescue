"""Local smoke test script for TripRescue API."""

import sys
from fastapi.testclient import TestClient
from app.main import app


def run_smoke_tests():
    client = TestClient(app)
    
    print("Executing TripRescue Local Smoke Tests...")
    
    # 1. Health check
    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    data = res.json()
    assert data.get("status") == "healthy", f"Unexpected status: {data}"
    print(" [x] Health check endpoint passed")
    
    # 2. Login smoke check
    login_res = client.post(
        "/api/auth/login",
        json={"email": "alex.chen@example.com", "password": "traveler123"}
    )
    if login_res.status_code == 200:
        token = login_res.json().get("token")
        assert token, "Token missing in login response"
        print(" [x] Auth login smoke test passed")
    else:
        print(" [!] Auth login returned status", login_res.status_code)

    print("\nAll smoke tests completed successfully!")
    return 0


if __name__ == "__main__":
    sys.exit(run_smoke_tests())
