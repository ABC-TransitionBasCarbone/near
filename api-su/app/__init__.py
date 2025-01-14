from flask import Flask
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)


@app.route("/")
@app.route("/index")
def index():
    return "Hello, World!"
