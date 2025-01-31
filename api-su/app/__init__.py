import os
from flask import Flask, request, abort, jsonify
from flask_cors import CORS
from marshmallow import Schema, fields, ValidationError
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


class UserDataRequestSchema(Schema):
    user_id = fields.Int(required=True)
    food = fields.Int(required=True)
    mobility = fields.Int(required=True)
    purchase = fields.Int(required=True)
    plane = fields.Int(required=True)
    home = fields.Int(required=True)
    digital = fields.Int(required=True)


compute_su_request_schema = UserDataRequestSchema(many=True)


@app.route("/api-su/compute", methods=["POST"])
def compute_sus():
    try:
        users_data = compute_su_request_schema.load(request.json)
        print(f"Compute SU for {len(users_data)} users")
        result = clustering.run(users_data)
        return jsonify(result)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400  # Bad request
