import pytest
from app import app
from app import constants


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
    invalid_data = [
        {
            "user_id": 4,
            "food": 3,
            "mobility": 1,
            "digital": 2,
            "purchase": 2,
            "plane": 1,
        }
    ]
    response = client.post(
        "/api-su/compute", headers={"X-API-KEY": "1234"}, json=invalid_data
    )
    assert response.status_code == 400
    assert "home" in response.json["error"]["0"]


def test_400_invalid_format(client):
    invalid_data = [
        {
            "user_id": 4,
            "food": "un peu",
            "mobility": 1,
            "digital": "beaucoup",
            "purchase": 2,
            "plane": 1,
            "home": 3,
        }
    ]
    response = client.post(
        "/api-su/compute", headers={"X-API-KEY": "1234"}, json=invalid_data
    )
    assert response.status_code == 400
    assert "food" in response.json["error"]["0"]
    assert "digital" in response.json["error"]["0"]


def test_200_compute_su(client):
    valid_data = [
        {
            "user_id": 100,
            "food": 1,
            "mobility": 3,
            "purchase": 2,
            "plane": 3,
            "home": 2,
            "digital": 3,
        },
        {
            "user_id": 101,
            "food": 1,
            "mobility": 3,
            "purchase": 1,
            "plane": 3,
            "home": 2,
            "digital": 2,
        },
        {
            "user_id": 102,
            "food": 2,
            "mobility": 3,
            "purchase": 1,
            "plane": 3,
            "home": 2,
            "digital": 2,
        },
    ]
    response = client.post(
        "/api-su/compute", headers={"X-API-KEY": "1234"}, json=valid_data
    )
    # print("Response:", response.get_data(as_text=True))
    assert response.status_code == 200
    assert (
        len(response.json.get("computed_sus")) >= constants.CLUSTER_NB_MIN
    )
    assert len(response.json.get("user_attributed_su")) == len(valid_data)
