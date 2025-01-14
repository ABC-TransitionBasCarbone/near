import os
from flask import Flask, request, abort
from flask_cors import CORS
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


@app.route("/api-su/compute", methods=["POST"])
def compute_su():
    return {"msg": "Not implemented yet"}
