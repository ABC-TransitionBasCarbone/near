import pytest
from app import app


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_401_no_api_key(client):
    response = client.post("/api-su/compute")
    assert response.status_code == 401


def test_401_wrong_api_key(client):
    response = client.post("/api-su/compute", headers={"X-API-KEY": "wrong-api-key"})
    assert response.status_code == 401

def test_400_missing_field(client):
    invalid_data = [{"user_id": 4, "food": 2000, "mobility": 0, "digital": 360, "purchase": 800, "plane": 0}]
    response = client.post("/api-su/compute", headers={"X-API-KEY": "1234"}, json=invalid_data)
    assert response.status_code == 400
    assert "home" in response.json["error"]["0"]

def test_400_invalid_format(client):
    invalid_data = [{"user_id": 4, "food": "un peu", "mobility": 0, "digital": "beaucoup", "purchase": 800, "plane": 0, "home": 8}]
    response = client.post("/api-su/compute", headers={"X-API-KEY": "1234"}, json=invalid_data)
    assert response.status_code == 400
    assert "food" in response.json["error"]["0"]
    assert "digital" in response.json["error"]["0"]

def test_200_compute_su(client):
    valid_data = [{"user_id": 4, "food": 2000, "mobility": 0, "digital": 360, "purchase": 800, "plane": 0, "home": 8}]
    response = client.post("/api-su/compute", headers={"X-API-KEY": "1234"}, json=valid_data)
    # print("Response:", response.get_data(as_text=True))
    assert response.status_code == 200
    assert response.json.get("msg") == "Not implemented yet"
