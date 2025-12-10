<!-- SWEat – Web Fitness Tracker

A full-stack fitness tracking platform where users can log workouts, track sets, manage personal goals, and calculate BMI, all through a responsive modern UI. This project includes:

Backend: FastAPI, SQLAlchemy, JWT Auth

Frontend: Next.js 15, React, TailwindCSS

Storage: SQLite

Authentication: Secure JWT login & user-specific sessions



Features:

*User Accounts & Authentication

Create an account (Signup)

Log in using JWT-based authentication

Automatically attach workouts to correct user

Secure protected endpoints (requires token)

 *User Profile

Save weight, height, activity level, and fitness goals

Auto-calculate BMI on-the-fly

Dashboard displays personalized fitness summary

Edit profile anytime


*Workout Tracking

Create workout sessions

Add individual sets (exercise name, reps, weight)

Edit or delete sessions and sets

Displays sessions chronologically

Fully mobile-styled theme inspired by SWEat Mobile app


*UI/UX

Dark, sleek neon pink aesthetic

Fully responsive dashboard layout

Animated transitions & success/error banners

Matching theme across login, profile, dashboard, and session pages




Tech Stack:

*Frontend

Next.js 15 (App Router)

React

TailwindCSS

LocalStorage for profile management

Fetch API for backend communication


*Backend

FastAPI

SQLite + SQLAlchemy ORM

bcrypt / Passlib for Password Hashing

JWT tokens (pyjwt) -->



<!-- HOW TO RUN

1. Backend Setup (FastAPI)
cd api
python -m venv .venv
source .venv/bin/activate   # Mac/Linux (.venv\Scripts\activate on Windows)
pip install -r requirements.txt

2. Run API
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

*Backend will be live at: http://127.0.0.1:8000

3. Frontend Setup (Next.js)
cd web
npm install
npm run dev


*Frontend will be live at: http://localhost:3000
 -->