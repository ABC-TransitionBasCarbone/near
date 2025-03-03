import os
from flask import Flask, request, abort, jsonify
from flask_cors import CORS
from marshmallow import Schema, fields, validate, ValidationError
from . import clustering
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config["NEAR_APP_URL"] = os.getenv("NEAR_APP_URL")
app.config["API_SU_KEY"] = os.getenv("API_SU_KEY")

CORS(app, resources={r"/*": {"origins": app.config["NEAR_APP_URL"]}})


@app.before_request
def check_api_key():
    api_key = request.headers.get("X-API-KEY")
    if api_key != app.config["API_SU_KEY"]:
        abort(401)  # Unauthorized


class AnswerData(Schema):
    meat_frequency = fields.Int(required=True)
    transportation_mode = fields.Int(required=True)
    purchasing_strategy = fields.Int(required=True)
    air_travel_frequency = fields.Int(required=True)
    heat_source = fields.Int(required=True)
    digital_intensity = fields.Int(required=True)


class UserAnswerData(AnswerData):
    id = fields.Int(required=True)


compute_su_request_schema = UserAnswerData(many=True)


@app.route("/api-su/compute", methods=["POST"])
def compute_sus():
    try:
        users_data = compute_su_request_schema.load(request.json)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400  # Bad request
    print(f"Compute SU for {len(users_data)} users")
    result = clustering.run(users_data)
    return jsonify(result)


class Su(Schema):
    su = fields.Int(required=True)
    barycenter = fields.List(
        fields.Float(), required=True, validate=validate.Length(equal=6)
    )


class AssignRequestSchema(Schema):
    sus = fields.List(fields.Nested(Su), required=True, validate=validate.Length(min=1))
    user_data = fields.Nested(AnswerData, required=True)


assign_su_request_schema = AssignRequestSchema()


@app.route("/api-su/assign", methods=["POST"])
def assign_su():
    try:
        request_data = assign_su_request_schema.load(request.json)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400  # Bad request
    clusters = clustering.convert_all_to_cluster(request_data["sus"])
    result = clustering.get_answer_attributed_su(request_data["user_data"], clusters)
    return jsonify(result)
