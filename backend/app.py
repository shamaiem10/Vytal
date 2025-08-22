from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from hashlib import sha256
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)  # allow frontend to call backend

DB_PATH = 'vytal.db'  # database inside backend folder

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password):
    return sha256(password.encode()).hexdigest()
@app.route('/')
def home():
    return "Vytal Backend Running!"

# ------------------ SIGNUP ------------------
@app.route('/api/users', methods=['POST'])
def signup():
    data = request.json
    name = data['name']
    email = data['email']
    password = hash_password(data['password'])
    
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, password))
        conn.commit()
        user_id = c.lastrowid
        return jsonify({"message": "User registered", "user_id": user_id}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400
    finally:
        conn.close()

# ------------------ LOGIN ------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = hash_password(data['password'])
    
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password))
    user = c.fetchone()
    conn.close()
    
    if user:
        return jsonify({"message": "Login successful", "user_id": user['id']})
    return jsonify({"error": "Invalid credentials"}), 401


# Add new diary entry
@app.route('/api/diary', methods=['POST'])
def add_diary():
    data = request.json
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        INSERT INTO health_diary (user_id, date, mood, symptoms, sugar, bp, hr, temp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['user_id'],
        data.get('date', datetime.now().strftime('%Y-%m-%d')),
        data['mood'],
        data['symptoms'],
        data['sugar'],
        data['bp'],
        data['hr'],
        data['temp']
    ))
    conn.commit()
    conn.close()
    return jsonify({"message": "Diary entry added"}), 201

# Get all diary entries for a user
@app.route('/api/diary/<int:user_id>', methods=['GET'])
def get_diary(user_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM health_diary WHERE user_id = ?', (user_id,))
    rows = c.fetchall()
    conn.close()
    diary = [dict(row) for row in rows]
    return jsonify(diary)


@app.route('/api/diary/analysis/<int:user_id>', methods=['GET'])
def diary_analysis(user_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM health_diary WHERE user_id = ? ORDER BY date', (user_id,))
    rows = c.fetchall()
    conn.close()

    if not rows:
        return jsonify({"message": "No diary entries found"}), 404

    diary = [dict(r) for r in rows]

    # Prepare chart-ready data
    dates = [d['date'] for d in diary]
    sugar = [float(d['sugar']) for d in diary if d['sugar'] is not None]
    hr = [float(d['hr']) for d in diary if d['hr'] is not None]
    temp = [float(d['temp']) for d in diary if d['temp'] is not None]
    bp_raw = [d['bp'] for d in diary if d['bp']]

    # Split systolic/diastolic
    systolic = []
    diastolic = []
    for b in bp_raw:
        try:
            sys, dia = b.split("/")
            systolic.append(float(sys))
            diastolic.append(float(dia))
        except:
            pass

    moods = [d['mood'] for d in diary if d['mood']]

    analysis = {
        "chart_data": {
            "dates": dates,
            "sugar": sugar,
            "systolic": systolic,
            "diastolic": diastolic,
            "hr": hr,
            "temp": temp,
            "moods": moods
        },
        "summaries": {
            "avg_sugar": round(sum(sugar) / len(sugar), 2) if sugar else None,
            "avg_hr": round(sum(hr) / len(hr), 2) if hr else None,
            "avg_temp": round(sum(temp) / len(temp), 2) if temp else None,
            "avg_systolic": round(sum(systolic) / len(systolic), 2) if systolic else None,
            "avg_diastolic": round(sum(diastolic) / len(diastolic), 2) if diastolic else None,
            "common_mood": max(set(moods), key=moods.count) if moods else None
        },
        "trends": {
            "sugar_trend": "increasing" if len(sugar) > 1 and sugar[-1] > sugar[0] else "decreasing" if len(sugar) > 1 else None,
            "hr_trend": "increasing" if len(hr) > 1 and hr[-1] > hr[0] else "decreasing" if len(hr) > 1 else None,
            "temp_trend": "increasing" if len(temp) > 1 and temp[-1] > temp[0] else "decreasing" if len(temp) > 1 else None,
            "bp_trend": "increasing" if len(systolic) > 1 and systolic[-1] > systolic[0] else "decreasing" if len(systolic) > 1 else None
        }
    }

    return jsonify(analysis)




if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)
