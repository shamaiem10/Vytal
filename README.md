<div align="center">

# 🩺💊 Vytal 🧬🩹
### *Your AI-Powered Health & Wellness Companion*

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=24&pause=1800&color=A855F7&center=true&vCenter=true&width=700&lines=Log+your+health.+Track+your+mood.;Let+AI+read+the+patterns.;Diary+%2B+OCR+%2B+Insights+%2B+Charts;Wellness%2C+reimagined+%F0%9F%8C%B1" alt="Typing Intro"/>

<br/>

[![Hackathon](https://img.shields.io/badge/🏆_Hackathon-NeuraVia-A855F7?style=for-the-badge&labelColor=1E1B4B)](#)
[![Stars](https://img.shields.io/github/stars/shamaiem10/Vytal?style=for-the-badge&color=FB7185&labelColor=1E1B4B)](https://github.com/shamaiem10/Vytal/stargazers)
[![Forks](https://img.shields.io/github/forks/shamaiem10/Vytal?style=for-the-badge&color=FBBF24&labelColor=1E1B4B)](https://github.com/shamaiem10/Vytal/network)
[![Issues](https://img.shields.io/github/issues/shamaiem10/Vytal?style=for-the-badge&color=2DD4BF&labelColor=1E1B4B)](https://github.com/shamaiem10/Vytal/issues)
[![License](https://img.shields.io/badge/License-MIT-38BDF8?style=for-the-badge&labelColor=1E1B4B)](LICENSE)

<br/>

![React](https://img.shields.io/badge/React-1E1B4B?style=for-the-badge&logo=react&logoColor=38BDF8)
![Vite](https://img.shields.io/badge/Vite-1E1B4B?style=for-the-badge&logo=vite&logoColor=A855F7)
![Tailwind](https://img.shields.io/badge/TailwindCSS-1E1B4B?style=for-the-badge&logo=tailwindcss&logoColor=2DD4BF)
![Flask](https://img.shields.io/badge/Flask-1E1B4B?style=for-the-badge&logo=flask&logoColor=FB7185)
![SQLite](https://img.shields.io/badge/SQLite-1E1B4B?style=for-the-badge&logo=sqlite&logoColor=FBBF24)
![HuggingFace](https://img.shields.io/badge/HuggingFace-1E1B4B?style=for-the-badge&logo=huggingface&logoColor=FBBF24)

🌸 ✦ ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ✦ 🌸

</div>

## 📖 Overview

**Vytal** is a full-stack project built during the **NeuraVia Hackathon** 🚀 — combining **AI, React, and Flask** to help users manage their health & wellness in one clean, colorful place.

<div align="center">

| | | |
|:---:|:---:|:---:|
| 📓 **Daily Health Diary** | 🧠 **AI Mood Analysis** | 💊 **Prescription OCR** |
| 📊 **Visual Insights** | ⚡ **Minimal Fast UI** | 🌱 **Wellness Tracking** |

</div>

---

## 🗂️ Table of Contents

<div align="center">

| | | |
|:---:|:---:|:---:|
| [✨ Features](#-features) | [🛠️ Tech Stack](#️-tech-stack) | [🚀 Getting Started](#-getting-started) |
| [📁 Project Structure](#-project-structure) | [🔑 API Setup](#-hugging-face-api-setup) | [🧪 Usage](#-usage) |

</div>

---

## ✨ Features

<div align="center">

| | Feature | Description |
|:---:|:---|:---|
| 📝 | **Diary Entries** | Log daily health, mood, and activities |
| 🧠 | **AI Insights** | Automatic feedback on mental & physical wellness |
| 📊 | **Dynamic Charts** | Track mood and wellness trends over time |
| 📷 | **Prescription Uploads** | OCR digitizes prescriptions instantly |
| 🔐 | **Secure Data** | Backend powered by Flask + SQLite |

</div>

---

## 🛠️ Tech Stack

<div align="center">

### 🎨 Frontend

| Technology | Purpose |
|:---:|:---|
| ⚛️ React + Vite | Fast, modern UI framework |
| 🎨 TailwindCSS + Shadcn UI | Styling & component library |
| 📊 Recharts | Mood and wellness visualizations |

### ⚙️ Backend

| Technology | Purpose |
|:---:|:---|
| 🐍 Flask (Python) | Core API server |
| 🗄️ SQLite | Lightweight database |
| 🤖 HuggingFace AI API | Powers wellness insights |

### 🧰 Others

| Technology | Purpose |
|:---:|:---|
| 🖼️ Tesseract OCR | Prescription scanning |
| ⚡ Node.js & npm | Frontend build tooling |
| 🔑 dotenv | Environment variable management |

</div>

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shamaiem10/Vytal.git
cd Vytal
```

### 2️⃣ Backend Setup (Flask)

```bash
cd backend
python -m venv venv
# activate venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

<div align="center">

The backend should now be running at 👉 **http://127.0.0.1:5000** 💜

</div>

### 3️⃣ Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

<div align="center">

The frontend should now be running at 👉 **http://localhost:5173** 💙

</div>

---

## 📁 Project Structure

```bash
Vytal/
│── backend/          # Flask API + OCR + AI logic
│   ├── app.py
│   ├── vytal.db
│   ├── requirements.txt
│   ├── venv/         # Virtual environment (ignored)
│── frontend/         # React + Vite app
│   ├── src/
│   ├── node_modules/ # Ignored in git
│   ├── package.json
│── .gitignore
│── README.md
```

---

## 🔑 Hugging Face API Setup

<div align="center">

| Step | Action |
|:---:|:---|
| 1️⃣ | Go to [Hugging Face](https://huggingface.co/settings/tokens) |
| 2️⃣ | Create a new token with **read** permissions |
| 3️⃣ | Add it to a `.env` file inside `backend/` |
| 4️⃣ | Make sure `.env` is listed in `.gitignore` |

</div>

```env
HF_KEY=your_huggingface_api_key
HF_URL=https://router.huggingface.co/v1/chat
```

> 🔒 Never commit your `.env` — the Flask app loads this key automatically for AI insights.

---

## 🧪 Usage

<div align="center">

| | |
|:---:|:---|
| 📓 | Log your daily health notes in the diary |
| 📷 | Upload prescriptions → app extracts info using OCR |
| 📊 | View charts & AI insights for trends |
| 🌱 | Track your progress and improve your lifestyle |

</div>

---

<div align="center">

🌸 ✦ ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ✦ 🌸

### 💜 Built with care during NeuraVia Hackathon 💜
*Vytal — because your wellness deserves more than a spreadsheet.*

⭐ **If Vytal helped you, consider giving it a star!** ⭐

</div>
