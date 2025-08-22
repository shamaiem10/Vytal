import sqlite3
from hashlib import sha256

# Database path inside backend folder
DB_PATH = 'vytal.db'  # relative to this script

# Connect to database (creates if not exists)
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

# -------------------
# USERS TABLE
# -------------------
c.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL  -- store hashed password
)
''')

# -------------------
# HEALTH DIARY TABLE
# -------------------
c.execute('''
CREATE TABLE IF NOT EXISTS health_diary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    mood TEXT,
    symptoms TEXT,
    sugar REAL,
    bp TEXT,
    hr REAL,
    temp REAL,
    FOREIGN KEY(user_id) REFERENCES users(id)
)
''')



conn.commit()

# -------------------
# SAMPLE USERS
# -------------------
def hash_password(password):
    return sha256(password.encode()).hexdigest()

# Only insert if table is empty
c.execute('SELECT COUNT(*) FROM users')
if c.fetchone()[0] == 0:
    users = [
        ('Alice', 'alice@example.com', hash_password('password123')),
        ('Bob', 'bob@example.com', hash_password('mypassword')),
    ]
    c.executemany('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', users)
    conn.commit()
    print("Sample users added: Alice and Bob")

conn.close()
print("Database initialized successfully in backend folder!")
