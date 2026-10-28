
from flask import Flask, jsonify, request
from flask_cors import CORS
from urllib.parse import urlparse
import re

app = Flask(__name__)
CORS(app)


def analyze_url(value):
    url = value.strip()

    if not url:
        return {
            "url": url,
            "risk": "High",
            "reasons": ["URL is required"]
        }

    candidate = url if re.match(
        r"^[a-zA-Z][a-zA-Z\d+.-]*:", url
    ) else f"https://{url}"

    try:
        parsed = urlparse(candidate)
        hostname = parsed.hostname

        if not parsed.scheme or not hostname:
            raise ValueError("Invalid URL")

    except ValueError:
        return {
            "url": url,
            "risk": "High",
            "reasons": ["Invalid URL format"]
        }

    reasons = []

    if parsed.scheme.lower() != "https":
        reasons.append("HTTPS is not being used")

    if parsed.username or parsed.password:
        reasons.append("URL contains embedded credentials")

    host = hostname.lower()

    if host.startswith("xn--") or ".xn--" in host:
        reasons.append(
            "Domain contains an internationalized hostname"
        )

    if any(len(part) > 25 for part in host.split(".")):
        reasons.append("Unusually long hostname component")

    if len(host.split(".")) >= 5:
        reasons.append("Hostname contains many subdomains")

    if "-" in host or re.search(
        r"login|verify|secure|account",
        parsed.geturl(),
        re.IGNORECASE
    ):
        reasons.append(
            "Check domain spelling and security-related wording"
        )

    if len(reasons) >= 3:
        risk = "High"
    elif len(reasons) > 0:
        risk = "Medium"
    else:
        risk = "Low"

    if not reasons:
        reasons = ["No basic warning indicators found"]

    return {
        "url": url,
        "risk": risk,
        "reasons": reasons
    }


@app.get("/")
def home():
    return jsonify({
        "message": "PhishGuard API is running",
        "status": "ok"
    })


@app.get("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "PhishGuard API"
    })


@app.post("/api/analyze-url")
def analyze_url_endpoint():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Request body must be a JSON object"
        }), 400

    url = data.get("url")

    if not isinstance(url, str) or not url.strip():
        return jsonify({
            "error": "Please provide a non-empty URL string"
        }), 400

    return jsonify(analyze_url(url))


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
