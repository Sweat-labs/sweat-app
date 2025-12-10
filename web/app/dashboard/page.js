"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";
import { getToken } from "@/lib/auth";
import SessionCard from "@/components/SessionCard";

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionsError, setSessionsError] = useState("");

  const [profile, setProfile] = useState(null);

  // Load profile from localStorage
  function loadProfile() {
    try {
      const raw = localStorage.getItem("sweat_profile");
      if (!raw) return;
      const data = JSON.parse(raw);
      setProfile(data);
    } catch (e) {
      console.error("Failed to load profile", e);
    }
  }

  // Load workout sessions from backend
  async function loadSessions() {
    setLoadingSessions(true);
    setSessionsError("");

    try {
      const token = getToken();
      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/workouts/sessions`, { headers });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
      }

      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSessionsError(err.message || "Failed to load sessions.");
    } finally {
      setLoadingSessions(false);
    }
  }

  useEffect(() => {
    loadProfile();
    loadSessions();
  }, []);

  // Derived profile info
  let bmi = null;
  let bmiText = "";
  let heightText = "";
  let activityText = "";
  let goalText = "";

  if (profile) {
    const { weightLbs, heightInches, heightFeet, heightExtraInches } = profile;

    if (weightLbs && (heightInches || (heightFeet && heightExtraInches))) {
      const totalInches =
        heightInches ?? (Number(heightFeet) * 12 + Number(heightExtraInches));
      const raw = (Number(weightLbs) / (totalInches ** 2)) * 703;
      bmi = Math.round(raw * 10) / 10;
      bmiText = `${bmi}`;
    }

    if (heightFeet != null && heightExtraInches != null) {
      heightText = `${heightFeet}'${heightExtraInches}"`;
    } else if (heightInches) {
      heightText = `${heightInches} in`;
    }

    if (profile.activity === "1-3") activityText = "1–3 days / week";
    else if (profile.activity === "3-5") activityText = "3–5 days / week";
    else if (profile.activity === "5-7") activityText = "5–7 days / week";

    if (profile.goal === "weight_loss") goalText = "Weight Loss";
    else if (profile.goal === "build_muscle") goalText = "Build Muscle";
    else if (profile.goal === "be_healthier") goalText = "Be Healthier";
  }

  return (
    <main className="min-h-screen bg-[#050510] px-4 py-8 text-pink-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-pink-300 drop-shadow-sm">
              SWEat Dashboard
            </h1>
            <p className="text-xs text-pink-200/70">Source: {API_BASE}</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/dashboard/new-session"
              className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 text-sm font-semibold shadow-md"
            >
              + New Session
            </a>
            <button
              onClick={loadSessions}
              className="border border-pink-500/60 rounded-full px-3 py-2 text-sm hover:bg-pink-500/10"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Profile + summary row */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {/* Profile summary card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#181828] to-[#11111e] border border-pink-500/40 p-5 shadow-lg">
            <h2 className="text-lg font-bold text-pink-200 mb-2">
              Your SWEat Profile
            </h2>

            {!profile && (
              <>
                <p className="text-sm text-pink-100/80 mb-3">
                  Tell us about you so we can personalize your goals and stats.
                </p>
                <Link
                  href="/account-info"
                  className="inline-block text-sm font-semibold text-pink-300 hover:underline"
                >
                  Complete your profile →
                </Link>
              </>
            )}

            {profile && (
              <>
                <p className="text-sm text-pink-100/80 mb-3">
                  Ready to SWEat? Here&apos;s a quick snapshot of your info.
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-pink-300/80">
                      Weight
                    </p>
                    <p className="text-base font-semibold">
                      {profile.weightLbs} lbs
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-pink-300/80">
                      Height
                    </p>
                    <p className="text-base font-semibold">
                      {heightText || "–"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-pink-300/80">
                      Activity Level
                    </p>
                    <p className="text-base font-semibold">
                      {activityText || "–"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-pink-300/80">
                      Main Goal
                    </p>
                    <p className="text-base font-semibold">
                      {goalText || "–"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-pink-300/80">
                      BMI (estimate)
                    </p>
                    <p className="text-lg font-bold">{bmiText || "–"}</p>
                  </div>
                  <Link
                    href="/account-info"
                    className="text-xs text-pink-300 hover:underline"
                  >
                    Edit profile
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Simple tips card */}
          <div className="rounded-2xl bg-[#11111e] border border-pink-500/30 p-5 shadow-md">
            <h2 className="text-lg font-bold text-pink-200 mb-2">
              Today&apos;s SWEat
            </h2>
            <p className="text-sm text-pink-100/85 mb-2">
              Create a session for today, log your sets, and watch your progress
              grow over time.
            </p>
            <ul className="text-xs text-pink-100/75 list-disc pl-4 space-y-1">
              <li>Start a new workout session for each training day.</li>
              <li>Add sets for each exercise you complete.</li>
              <li>Use your BMI and goals to guide intensity and volume.</li>
            </ul>
          </div>
        </div>

        {/* Sessions */}
        {sessionsError && (
          <div className="mb-4 rounded-xl border border-red-400/70 bg-red-950/60 p-3 text-sm text-red-100">
            <p className="font-semibold">Could not load sessions.</p>
            <p>{sessionsError}</p>
            <button
              onClick={loadSessions}
              className="mt-2 underline text-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {loadingSessions && (
          <p className="text-pink-100/80 text-sm">Loading sessions...</p>
        )}

        {!loadingSessions && !sessionsError && sessions.length === 0 && (
          <p className="text-pink-100/80 text-sm">
            No sessions yet. Create your first one to start tracking.
          </p>
        )}

        <div className="mt-4 space-y-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>
    </main>
  );
}
