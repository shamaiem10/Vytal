from flask import Flask, request, jsonify
import sqlite3
import os
from datetime import datetime
import requests   
from flask_cors import CORS 
import json
from PIL import Image
import pytesseract
from dotenv import load_dotenv

# ------------------- Setup -------------------
load_dotenv()
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
    # Stronger prompt asking for recommendations explicitly
    prompt = (
        f"Analyze the health diary for {period}:\n{text}\n"
        "Respond strictly in JSON format with the following keys:\n"
        "summary (string), insights (list of strings), recommendations (list of strings).\n"
        "Make sure 'recommendations' is always present and non-empty if possible."
    )

    payload = {
        "model": "Qwen/Qwen3-Coder-480B-A35B-Instruct:cerebras",
        "messages": [{"role": "user", "content": prompt}]
    }

    r = requests.post(HF_URL, headers=HEADERS, json=payload)
    r.raise_for_status()
    result = r.json()
    response_text = result["choices"][0]["message"]["content"].strip()

    try:
        output = json.loads(response_text)
    except:
        # fallback if model returns extra text
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        if start != -1 and end != -1:
            output = json.loads(response_text[start:end])
        else:
            output = {"summary": response_text, "insights": [], "recommendations": []}

    # Ensure recommendations key is always present and is a list
    if "recommendations" not in output or not isinstance(output["recommendations"], list):
        output["recommendations"] = []

    return output

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








pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"



# ------------------- DB Helper -------------------
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ------------------- OCR -------------------
def extract_text_from_image(file_path):
    try:
        text = pytesseract.image_to_string(Image.open(file_path)).strip()
        print("OCR Text:", text)
        return text
    except Exception as e:
        print("OCR Error:", e)
        return ""

# ------------------- AI Simplification for multiple medicines -------------------
def simplify_text_with_ai(original_text):
    """
    Extracts all medicines from prescription text and outputs an array of JSON objects.
    Each object contains: medication, dosage, instructions, duration, purpose, side_effects, follow_up, status
    """
    if not HF_KEY:
        print("No HF_KEY set")
        return []

    prompt = f"""
You are a medical AI assistant. The following is a prescription text:

{original_text}

Please extract **all medicines mentioned** and their details. It is **mandatory** to fill all fields.
- If the prescription text does not mention something, **use your medical knowledge** to reasonably fill it.
Return an **array of JSON objects**, each with these keys:
medication, dosage, instructions, duration, purpose, side_effects, follow_up, status

Return only valid JSON array. Example format:
[
  {{
    "medication": "Paracetamol",
    "dosage": "500mg",
    "instructions": "Take one tablet after meal",
    "duration": "5 days",
    "purpose": "Fever",
    "side_effects": "Nausea",
    "follow_up": "After 5 days",
    "status": "active"
  }},
  ...
]
"""
    try:
        payload = {
            "model":"Qwen/Qwen3-Coder-480B-A35B-Instruct:cerebras",
            "messages":[{"role":"user","content":prompt}]
        }
        r = requests.post(HF_URL, headers=HEADERS, json=payload, timeout=60)
        r.raise_for_status()
        result = r.json()
        response_text = result["choices"][0]["message"]["content"].strip()

        # Extract JSON array
        start = response_text.find("[")
        end = response_text.rfind("]") + 1
        medicines = json.loads(response_text[start:end])

    except Exception as e:
        print("AI Error:", e)
        medicines = []

    # Ensure all keys exist for each medicine
    for med in medicines:
        for key in ["medication","dosage","instructions","duration","purpose","side_effects","follow_up","status"]:
            if key not in med or med[key] is None or med[key] == "":
                med[key] = "active" if key=="status" else "Not specified, inferred by AI"

    return medicines

# ------------------- Upload Endpoint -------------------
@app.route('/api/prescriptions/upload', methods=['POST'])
def upload_prescription():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    # Save file
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    file_path = os.path.join('uploads', file.filename)
    file.save(file_path)
    print("Saved file:", file_path)

    # OCR
    original_text = extract_text_from_image(file_path)
    if not original_text:
        return jsonify({"error": "Failed to extract text"}), 500

    # AI Simplify - multiple medicines
    medicines = simplify_text_with_ai(original_text)

    # Save each medicine to DB
    try:
        with get_db() as conn:
            c = conn.cursor()
            for med in medicines:
                c.execute('''
                    INSERT INTO prescriptions
                    (original_text, medication, dosage, instructions, duration, purpose, side_effects, follow_up, upload_date, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    original_text,
                    med['medication'],
                    med['dosage'],
                    med['instructions'],
                    med['duration'],
                    med['purpose'],
                    med['side_effects'],
                    med['follow_up'],
                    datetime.now().strftime('%Y-%m-%d'),
                    med['status']
                ))
            conn.commit()
    except Exception as e:
        print("DB Error:", e)
        return jsonify({"error": "Failed to save to database"}), 500

    return jsonify({"message": "Prescription simplified successfully", "prescriptions": medicines})

if __name__=='__main__':
    app.run(debug=True)
