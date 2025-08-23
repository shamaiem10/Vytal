from flask import Flask, request, jsonify
import sqlite3
import os
import requests   # ✅ missing before
from flask_cors import CORS 
import json

app = Flask(__name__)
CORS(app)

DB_PATH = 'vytal.db'

# -------------------
# Helper: DB connection
# -------------------
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# -------------------
# Add health diary entry
# -------------------
@app.route('/api/diary', methods=['POST'])
def add_diary():
    data = request.json

    with get_db() as conn:
        c = conn.cursor()
        c.execute('''
            INSERT INTO health_diary (date, time, mood, symptoms, sugar, bp, hr, temp, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get("date"),
            data.get("time"),
            data.get("mood"),
            ",".join(data["symptoms"]) if isinstance(data.get("symptoms"), list) else data.get("symptoms"),
            data.get("sugar"),
            data.get("bp"),
            data.get("hr"),
            data.get("temp"),
            data.get("notes")
        ))
        conn.commit()

    return jsonify(data), 201

# -------------------
# Get all diary entries
# -------------------
@app.route('/api/diary', methods=['GET'])
def get_diary():
    with get_db() as conn:
        c = conn.cursor()
        c.execute('SELECT * FROM health_diary ORDER BY date DESC, time DESC')
        rows = [dict(row) for row in c.fetchall()]
    return jsonify(rows)

# -------------------
# Get latest entry
# -------------------
@app.route('/api/diary/latest', methods=['GET'])
def get_latest_entry():
    with get_db() as conn:
        c = conn.cursor()
        c.execute('SELECT * FROM health_diary ORDER BY date DESC, time DESC LIMIT 1')
        row = c.fetchone()
        if row:
            return jsonify(dict(row))
    return jsonify({"message": "No entries yet"}), 404


from dotenv import load_dotenv
import os

load_dotenv()  # load .env variables

HF_KEY = os.getenv("HF_KEY")
HF_URL = "https://router.huggingface.co/v1/chat/completions"
HEADERS = {"Authorization": f"Bearer {HF_KEY}"}


def analyze_health_text(text, period="Recent Entries"):
    prompt = f"Analyze the health diary for {period}:\n{text}\nRespond strictly in JSON with keys summary, insights, recommendations."
    payload = {
        "model": "Qwen/Qwen3-Coder-480B-A35B-Instruct:cerebras",
        "messages": [{"role": "user", "content": prompt}]
    }
    r = requests.post(HF_URL, headers=HEADERS, json=payload)
    r.raise_for_status()
    result = r.json()
    response_text = result["choices"][0]["message"]["content"].strip()
    try:
        return json.loads(response_text)
    except:
        # fallback if model returns extra text
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        if start != -1 and end != -1:
            return json.loads(response_text[start:end])
        return {"summary": response_text, "insights": [], "recommendations": []}

# -----------------------------
# Route: Single AI Analysis
# -----------------------------
@app.route("/api/summaries/ai", methods=["GET"])
def ai_summary():
    with get_db() as conn:
        c = conn.cursor()
        c.execute("""
            SELECT date, mood, symptoms, bp, hr, sugar
            FROM health_diary
            ORDER BY date ASC
            LIMIT 30
        """)
        rows = c.fetchall()

    if not rows:
        return jsonify({"message": "No data available"}), 404

    formatted_entries = []
    for row in rows:
        bp_text = "blood pressure not recorded"
        if row["bp"] and "/" in row["bp"]:
            try:
                sys, dia = row["bp"].split("/")
                bp_text = f"blood pressure was {sys} over {dia}"
            except:
                bp_text = f"blood pressure recorded as {row['bp']}"

        symptoms_text = f"Symptoms included {row['symptoms']}." if row["symptoms"] else "No symptoms were reported."

        entry = (
            f"On {row['date']}: Mood was {row['mood']}, {bp_text}, "
            f"heart rate was {row['hr']} bpm, sugar was {row['sugar']} mg/dL. {symptoms_text}"
        )
        formatted_entries.append(entry)

    text = " ".join(formatted_entries)
    analysis = analyze_health_text(text, period="Recent Entries")

    return jsonify({
        "period": "Recent Entries",
        "summary": analysis["summary"],
        "insights": analysis.get("insights", []),
        "recommendations": analysis.get("recommendations", [])
    })


if __name__ == "__main__":
    app.run(debug=True)
