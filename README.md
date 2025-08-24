# Vytal – Your AI-Powered Health & Wellness Companion 🩺💊🧬🩹

[![GitHub issues](https://img.shields.io/github/issues/shamaiem10/Vytal)](https://github.com/shamaiem10/Vytal/issues)
[![GitHub stars](https://img.shields.io/github/stars/shamaiem10/Vytal)](https://github.com/shamaiem10/Vytal/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/shamaiem10/Vytal)](https://github.com/shamaiem10/Vytal/network)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Hackathon](https://img.shields.io/badge/Hackathon-NeuraViaHackathon-purple)

---

## 📖 Overview
**Vytal** is a full-stack project built during the **NeuraVia Hackathon** 🚀.  
It combines **AI, React, and Flask** to help users manage their **health & wellness** with features like:
- 📓 Daily Health Diary
- 🧠 AI-powered Mood & Health Analysis
- 💊 Prescription Management (OCR-based)
- 📊 Visual Insights & Charts
- ⚡ Minimal & Fast UI with Shadcn, Tailwind, and React

---

## ✨ Features
- 📝 **Diary Entries** – Log daily health, mood, and activities.
- 🧠 **AI Insights** – Get automatic feedback on mental & physical wellness.
- 📊 **Dynamic Charts** – Track mood and wellness trends over time.
- 📷 **Prescription Uploads** – OCR to digitize prescriptions.
- 🔐 **Secure Data** – Backend powered by Flask + SQLite.

---

## 🛠️ Tech Stack
**Frontend**
- ⚛️ React + Vite
- 🎨 TailwindCSS + Shadcn UI
- 📊 Recharts

**Backend**
- 🐍 Flask (Python)
- 🗄️ SQLite Database
- 🤖 HuggingFace AI API (for insights)

**Others**
- 🖼️ Tesseract OCR (Prescription scanning)
- ⚡ Node.js & npm for frontend build
- 🔑 dotenv for environment variables

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/shamaiem10/Vytal.git
cd Vytal
```
### Backend Setup (Flask)
```bash
cd backend
python -m venv venv
# activate venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Run Flask server
python app.py

```
The backend should now be running at 👉 http://127.0.0.1:5000
### 3, Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
The frontend should now be running at 👉 http://localhost:5173
## Project Structure
```bash
Vytal/
│── backend/          # Flask API + OCR + AI logic
│   ├── app.py
|   |__ vytal.db
│   ├── requirements.txt
│   ├── venv/         # Virtual environment (ignored)
│── frontend/         # React + Vite app
│   ├── src/
│   ├── node_modules/ # Ignored in git
│   ├── package.json
│── .gitignore
│── README.md
```

## 🔑 Hugging Face API Setup

Vytal uses Hugging Face Inference API for AI-driven insights.

Get your Hugging Face API key:
```bash
Go to Hugging Face

Create a new token with "read" permissions.

Add your API key in a .env file inside the backend/ folder:

HF_KEY=your_huggingface_api_key
HF_URL=https://router.huggingface.co/v1/chat
```
Make sure .env is listed in .gitignore (so you don’t push your secret).
The backend Flask app will automatically load this key and use it for AI insights

## 🧪 Usage

- Log your daily health notes in the diary.

- Upload prescriptions → app extracts info using OCR.

- View charts & AI insights for trends.

- Track your progress and improve your lifestyle 🌱.
