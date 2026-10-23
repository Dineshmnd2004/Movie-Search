
import os

import requests
from flask import Flask, jsonify, render_template, request
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"


def tmdb_request(endpoint, params=None):
    if not API_KEY:
        return {"error": "TMDB_API_KEY is missing. Configure your .env file."}, 500

    params = params or {}
    params["api_key"] = API_KEY

    try:
        response = requests.get(
            f"{BASE_URL}/{endpoint}",
            params=params,
            timeout=10
        )
        response.raise_for_status()
        return response.json(), 200
    except requests.RequestException:
        return {"error": "Could not fetch movie data. Please try again."}, 502


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/popular")
def popular_movies():
    data, status = tmdb_request("movie/popular")
    return jsonify(data), status


@app.route("/api/search")
def search_movies():
    query = request.args.get("query", "").strip()

    if not query:
        return jsonify({"results": []}), 200

    data, status = tmdb_request(
        "search/movie",
        {"query": query, "include_adult": "false"}
    )
    return jsonify(data), status


@app.route("/api/movie/<int:movie_id>")
def movie_details(movie_id):
    data, status = tmdb_request(f"movie/{movie_id}")
    return jsonify(data), status


if __name__ == "__main__":
    app.run(debug=True)
