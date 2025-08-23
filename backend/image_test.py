import requests
import os
import json
from dotenv import load_dotenv

# ------------------- Load Env -------------------
load_dotenv()
HF_KEY = os.getenv("HF_KEY")
HF_URL = "https://router.huggingface.co/v1/chat/completions"
HEADERS = {"Authorization": f"Bearer {HF_KEY}"}

# ------------------- Prepare Prompt -------------------
question = "What is the capital of Pakistan?"
prompt = f"Analyze General Knowledge:\n{question}\nRespond strictly in JSON with keys summary, insights, recommendations."

payload = {
    "model": "Qwen/Qwen3-Coder-480B-A35B-Instruct:cerebras",
    "messages": [
        {"role": "user", "content": prompt}
    ]
}

# ------------------- Call API -------------------
response = requests.post(HF_URL, headers=HEADERS, json=payload)

# ------------------- Handle Response -------------------
if response.status_code == 200:
    try:
        data = response.json()
        print("\n--- Model Response ---")
        print(data["choices"][0]["message"]["content"])
    except Exception as e:
        print("Parsing error:", e)
        print("Full response:", data)
else:
    print("Error:", response.status_code, response.text)
