import pytest
import os
import pandas
import numpy as np
from app import app
from app import constants
import test_file_data


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
            "id": 4,
            "meatFrequency": 3,
            "transportationMode": 1,
            "digitalIntensity": 2,
            "purchasingStrategy": 2,
            "airTravelFrequency": 1,
        }
    ]
    response = client.post(
        "/api-su/compute", headers={"X-API-KEY": "1234"}, json=invalid_data
    )
    assert response.status_code == 400
    assert "heatSource" in response.json["error"]["0"]


def test_400_invalid_format(client):
    invalid_data = [
        {
            "id": 4,
            "meatFrequency": "un peu",
            "transportationMode": 1,
            "digitalIntensity": "beaucoup",
            "purchasingStrategy": 2,
            "airTravelFrequency": 1,
            "heatSource": 3,
        }
    ]
    response = client.post(
        "/api-su/compute", headers={"X-API-KEY": "1234"}, json=invalid_data
    )
    assert response.status_code == 400
    assert "meatFrequency" in response.json["error"]["0"]
    assert "digitalIntensity" in response.json["error"]["0"]


def test_200_compute_sus(client):
    valid_data = [
        {
            "id": 100,
            "meatFrequency": 1,
            "transportationMode": 3,
            "purchasingStrategy": 2,
            "airTravelFrequency": 3,
            "heatSource": 2,
            "digitalIntensity": 3,
        },
        {
            "id": 101,
            "meatFrequency": 1,
            "transportationMode": 3,
            "purchasingStrategy": 1,
            "airTravelFrequency": 3,
            "heatSource": 2,
            "digitalIntensity": 2,
        },
        {
            "id": 102,
            "meatFrequency": 2,
            "transportationMode": 3,
            "purchasingStrategy": 1,
            "airTravelFrequency": 3,
            "heatSource": 2,
            "digitalIntensity": 2,
        },
    ]
    response = client.post(
        "/api-su/compute", headers={"X-API-KEY": "1234"}, json=valid_data
    )
    assert response.status_code == 200
    assert len(response.json.get("computed_sus")) >= constants.CLUSTER_NB_MIN
    assert len(response.json.get("user_attributed_su")) == len(valid_data)


@pytest.mark.skip(reason="working only with specific constants")
def test_200_compute_sus_from_file(client):
    input_data, expected_sus = extract_from_file()
    response = client.post(
        "/api-su/compute", headers={"X-API-KEY": "1234"}, json=input_data
    )
    # print("Response:", response.get_data(as_text=True))
    assert response.status_code == 200
    sus = response.json.get("computed_sus")
    assert len(sus) == len(expected_sus)
    assert sorted(sus, key=lambda x: x["su"]) == sorted(
        expected_sus, key=lambda x: x["su"]
    )
    assert sorted(sus, key=lambda x: x["pop_percentage"]) == sorted(
        expected_sus, key=lambda x: x["pop_percentage"]
    )


def extract_from_file():
    file_path = os.path.join(os.path.dirname(__file__), test_file_data.FILENAME)
    df = pandas.read_csv(file_path, sep="\t")
    df.columns = ["id", "meatFrequency", "transportationMode", "digitalIntensity", "purchasingStrategy", "airTravelFrequency", "heatSource"]
    df = df.loc[df["id"].isin(test_file_data.L10)]
    for col, mapping in test_file_data.MAPPINGS.items():
        df[col] = df[col].apply(
            lambda x: mapping.index(x) + 1 if x in mapping else np.nan
        )

    return df.to_dict(orient="records"), test_file_data.EXPECTED_SUS
