import pytest
from app import app


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_no_api_key(client):
    response = client.post("/api-su/compute")
    assert response.status_code == 401


def test_wrong_api_key(client):
    response = client.post("/api-su/compute", headers={"X-API-KEY": "wrong-api-key"})
    assert response.status_code == 401


def test_correct_api_key(client):
    response = client.post("/api-su/compute", headers={"X-API-KEY": "1234"})
    assert response.status_code == 200
    assert response.json.get("msg") == "Not implemented yet"
