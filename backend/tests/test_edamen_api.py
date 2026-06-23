"""Edamen Media backend tests — covers health, auth, applications, contact, config."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://edamen-framework.preview.emergentagent.com").rstrip("/")
# Fallback to frontend .env file value if env var missing
if not BASE_URL or "PLACEHOLDER" in BASE_URL.upper():
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

ADMIN_EMAIL = "admin@edamenmedia.com"
ADMIN_PASSWORD = "EdamenAdmin#2026"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api_client):
    r = api_client.post(f"{BASE_URL}/api/auth/login",
                        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---------- Health & Config ----------
class TestHealthAndConfig:
    def test_health(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["ok"] is True
        assert "sheets_enabled" in data
        assert data["sheets_enabled"] is False  # env not configured
        assert "time" in data

    def test_config(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/config")
        assert r.status_code == 200
        data = r.json()
        assert "calendly_url" in data
        assert "statuses" in data
        assert isinstance(data["statuses"], list)
        for s in ["New", "Reviewing", "Qualified", "Call Scheduled", "Signed", "Rejected"]:
            assert s in data["statuses"]


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/auth/login",
                            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 10
        assert data["email"] == ADMIN_EMAIL

    def test_login_invalid(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/auth/login",
                            json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_requires_token(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        assert d["email"] == ADMIN_EMAIL
        assert d["role"] == "admin"


# ---------- Admin endpoints reject unauth ----------
class TestUnauthorized:
    def test_list_apps_unauth(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/applications")
        assert r.status_code == 401

    def test_stats_unauth(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/applications/stats")
        assert r.status_code == 401

    def test_patch_unauth(self, api_client):
        r = api_client.patch(f"{BASE_URL}/api/applications/nonexistent",
                             json={"status": "Reviewing"})
        assert r.status_code == 401

    def test_delete_unauth(self, api_client):
        r = api_client.delete(f"{BASE_URL}/api/applications/nonexistent")
        assert r.status_code == 401

    def test_list_contact_unauth(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 401


# ---------- Applications CRUD ----------
class TestApplications:
    created_ids = []

    def test_create_application(self, api_client):
        payload = {
            "full_name": "TEST_Applicant One",
            "email": "test_applicant_one@example.com",
            "phone": "+15551112222",
            "location": "NYC",
            "profession": "Creator",
            "primary_platform": "Instagram",
            "social_profiles": [
                {"platform": "Instagram", "handle": "@test1", "url": "https://ig.com/test1", "followers": "120k"}
            ],
            "audience_size": "150000",
            "twelve_month_goal": "TEST goal",
        }
        r = api_client.post(f"{BASE_URL}/api/applications", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["full_name"] == payload["full_name"]
        assert d["email"] == payload["email"]
        assert d["status"] == "New"
        assert "id" in d and isinstance(d["id"], str)
        assert len(d["social_profiles"]) == 1
        TestApplications.created_ids.append(d["id"])

    def test_create_application_validation(self, api_client):
        # Missing required email & name -> 422
        r = api_client.post(f"{BASE_URL}/api/applications", json={"phone": "1"})
        assert r.status_code == 422

    def test_list_applications(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/applications", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        ids = [a["id"] for a in data]
        assert TestApplications.created_ids[0] in ids

    def test_get_application_detail(self, api_client, auth_headers):
        app_id = TestApplications.created_ids[0]
        r = api_client.get(f"{BASE_URL}/api/applications/{app_id}", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        assert d["id"] == app_id
        assert d["full_name"] == "TEST_Applicant One"

    def test_stats_endpoint(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/applications/stats", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        assert "total" in d and "by_status" in d
        assert d["total"] >= 1
        assert "New" in d["by_status"]

    def test_filter_by_status(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/applications?status=New", headers=auth_headers)
        assert r.status_code == 200
        for a in r.json():
            assert a["status"] == "New"

    def test_patch_status_and_notes(self, api_client, auth_headers):
        app_id = TestApplications.created_ids[0]
        r = api_client.patch(f"{BASE_URL}/api/applications/{app_id}",
                             json={"status": "Reviewing", "notes": "TEST notes"},
                             headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        assert d["status"] == "Reviewing"
        assert d["notes"] == "TEST notes"
        # Verify persistence
        r2 = api_client.get(f"{BASE_URL}/api/applications/{app_id}", headers=auth_headers)
        assert r2.json()["status"] == "Reviewing"
        assert r2.json()["notes"] == "TEST notes"

    def test_patch_invalid_status(self, api_client, auth_headers):
        app_id = TestApplications.created_ids[0]
        r = api_client.patch(f"{BASE_URL}/api/applications/{app_id}",
                             json={"status": "BadStatus"}, headers=auth_headers)
        assert r.status_code == 400

    def test_delete_application(self, api_client, auth_headers):
        app_id = TestApplications.created_ids[0]
        r = api_client.delete(f"{BASE_URL}/api/applications/{app_id}", headers=auth_headers)
        assert r.status_code == 200
        # Verify gone
        r2 = api_client.get(f"{BASE_URL}/api/applications/{app_id}", headers=auth_headers)
        assert r2.status_code == 404


# ---------- Contact ----------
class TestContact:
    def test_create_contact(self, api_client):
        payload = {
            "name": "TEST_Contact",
            "email": "test_contact@example.com",
            "company": "TEST Co",
            "message": "Hi from tests",
        }
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200
        d = r.json()
        assert d["name"] == payload["name"]
        assert d["email"] == payload["email"]
        assert "id" in d

    def test_contact_without_phone_or_company(self, api_client):
        # Company is optional
        payload = {"name": "TEST_Contact2", "email": "t2@example.com", "message": "hello"}
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200

    def test_list_contact_admin(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/contact", headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)
