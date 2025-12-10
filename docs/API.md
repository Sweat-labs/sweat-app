<!-- # SWEat App — API & Web Guide

This document explains how to set up and run the SWEat backend and web app locally, and provides example API calls for testing.

## Project Layout
sweat-app-main/
│
├── api/              # FastAPI backend (Sebastian)
│   ├── app/          # Core backend code
│   ├── requirements.txt
│
├── web/              # Next.js + Tailwind web frontend (Geo)
│
├── mobile/           # Expo/React Native app (Anthony)
│
└── docs/             # Notes + API docs

## How to Run the Backend (FastAPI)
```bash
cd api

source ../.venv/bin/activate

pip install -r requirements.txt

run: 

python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

in /api

Visit http://127.0.0.1:8000/health


Expected response:

{"status":"ok"}

How to Run the Web Frontend (Next.js)

cd web
npm install
npm run dev

in /web

Then open http://localhost:3000


If FastAPI is running, the homepage should show:
SWEat Web
Backend API Status: Online
API Quick Reference

Base URL (local): http://127.0.0.1:8000
Health Check

GET /health

curl -i http://127.0.0.1:8000/health

Response:

{"status":"ok"}

Create a Session to:

POST /workouts/sessions

List Sessions

GET /workouts/sessions

Add a Set

====================

Web Frontend Features

Homepage (/) — checks backend /health
Dashboard (/dashboard) — lists sessions and sets
Create Session (/dashboard/new) — adds new session
Add Set (/dashboard/[id]/add-set) — adds set to session
Auto-refresh and success banners