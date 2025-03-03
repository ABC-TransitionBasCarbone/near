import pytest
from app import app


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_401_no_api_key(client):
    response = client.post("/api-su/assign")
    assert response.status_code == 401


def test_401_wrong_api_key(client):
    response = client.post("/api-su/assign", headers={"X-API-KEY": "wrong-api-key"})
    assert response.status_code == 401


def test_400_missing_field(client):
    invalid_data = {
        "sus": [],
        "user_data": {
            "meat_frequency": "un peu",
            "transportation_mode": 1,
            "digital_intensity": "beaucoup",
            "purchasing_strategy": 2,
            "air_travel_frequency": 1,
            "heat_source": 3,
        },
    }
    response = client.post(
        "/api-su/assign", headers={"X-API-KEY": "1234"}, json=invalid_data
    )
    assert response.status_code == 400
    assert "sus" in response.json["error"]
    assert "meat_frequency" in response.json["error"]["user_data"]
    assert "digital_intensity" in response.json["error"]["user_data"]


def test_400_invalid_format(client):
    invalid_data = {
        "sus": [
            {
                "barycenter": [200.0, 2300.0, 360.0, 800.0, 800.0, 1100.0],
                "su": "su name",
            },
            {
                "barycenter": [2000.0, 2300.0, 360.0, 1600.0, 800.0, 200.0],
                "su": 2,
            },
            {
                "barycenter": [2000.0, 300.0, 180.0, 800.0, 2000.0],
                "su": 3,
            },
        ],
        "user_data": {
            "meat_frequency": "un peu",
            "transportation_mode": 1,
            "digital_intensity": "beaucoup",
            "purchasing_strategy": 2,
            "air_travel_frequency": 1,
            "heat_source": 3,
        },
    }
    response = client.post(
        "/api-su/assign", headers={"X-API-KEY": "1234"}, json=invalid_data
    )
    assert response.status_code == 400
    assert "su" in response.json["error"]["sus"]["0"]
    assert "barycenter" in response.json["error"]["sus"]["2"]
    assert "meat_frequency" in response.json["error"]["user_data"]
    assert "digital_intensity" in response.json["error"]["user_data"]


def test_200_assign_su(client):
    valid_data = {
        "sus": [
            {
                "barycenter": [2000.0, 2300.0, 360.0, 1600.0, 800.0, 200.0],
                "su": 2,
            },
            {
                "barycenter": [200.0, 2300.0, 360.0, 800.0, 800.0, 1100.0],
                "su": 1,
            },
            {
                "barycenter": [2000.0, 300.0, 180.0, 800.0, 2000.0, 200.0],
                "su": 3,
            },
        ],
        "user_data": {
            "meat_frequency": 2,
            "transportation_mode": 3,
            "purchasing_strategy": 1,
            "air_travel_frequency": 3,
            "heat_source": 2,
            "digital_intensity": 2,
        },
    }
    response = client.post(
        "/api-su/assign", headers={"X-API-KEY": "1234"}, json=valid_data
    )
    assert response.status_code == 200
    assert response.json.get("su") == 1
