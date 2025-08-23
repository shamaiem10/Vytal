import sqlite3

# Database path
DB_PATH = 'vytal.db'

# Connect (creates if not exists)
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

# -------------------
# HEALTH DIARY TABLE (expanded schema)
# -------------------
c.execute('''
CREATE TABLE IF NOT EXISTS health_diary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    time TEXT,
    mood INTEGER,
    symptoms TEXT,   
    sugar REAL,
    bp TEXT,
    hr REAL,
    temp REAL,
    notes TEXT
)
''')

conn.commit()
conn.close()
print("✅ Database initialized successfully with expanded schema!")
