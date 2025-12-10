"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function HomePage() {
  const [status, setStatus] = useState("checking");
  const [statusMessage, setStatusMessage] = useState("");
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check if user has a token saved
    const token = getToken();
    setHasToken(!!token);

    // Check API /health
    async function checkHealth() {
      try {
        const res = await fetch(`${API_BASE}/health`);
        if (!res.ok) {
          setStatus("offline");
          setStatusMessage(`API responded with ${res.status}`);
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (data && data.status === "ok") {
          setStatus("online");
          setStatusMessage("API is healthy");
        } else {
          setStatus("online");
          setStatusMessage("API reachable");
        }
      } catch (e) {
        setStatus("offline");
        setStatusMessage("Could not reach API");
      }
    }

    checkHealth();
  }, []);

  const statusColor =
    status === "online"
      ? "bg-emerald-500"
      : status === "offline"
      ? "bg-red-500"
      : "bg-yellow-400";

  const statusLabel =
    status === "online"
      ? "Online"
      : status === "offline"
      ? "Offline"
      : "Checking...";

  return (
    <main className="min-h-screen bg-[#050509] text-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        {/* Top logo / branding */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-14 w-14 rounded-full bg-pink-500/20 blur-xl absolute inset-0" />
              <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center relative">
                <span className="text-lg font-bold text-white">S</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
                SWEat Web
              </h1>
              <p className="text-xs text-pink-200/80">
                Track your workouts across web and mobile.
              </p>
            </div>
          </div>

          {/* API Status pill */}
          <div className="flex flex-col items-end gap-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#101018] border border-pink-500/40 px-3 py-1">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${statusColor}`}
              />
              <span className="text-xs font-semibold">{statusLabel}</span>
            </div>
            <p className="text-[10px] text-pink-200/60">
              {statusMessage || "Checking backend status..."}
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Left: getting started / auth */}
          <div className="bg-[#101018] border border-pink-500/40 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg md:text-xl font-bold text-pink-200 mb-2">
              Get started with SWEat
            </h2>
            <p className="text-sm text-pink-100/85 mb-4">
              Log in or create an account to start tracking your workout
              sessions and sets.
            </p>

            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center bg-pink-500 hover:bg-pink-400 text-white font-semibold py-2 rounded-full text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="w-full text-center border border-pink-400/70 text-pink-100 hover:bg-pink-500/10 font-semibold py-2 rounded-full text-sm"
              >
                Create an Account
              </Link>
              {hasToken && (
                <Link
                  href="/dashboard"
                  className="w-full text-center text-pink-300 hover:text-pink-100 underline underline-offset-2 text-xs mt-1"
                >
                  Go to Dashboard (you&apos;re already logged in)
                </Link>
              )}
            </div>
          </div>

          {/* Right: project info / status */}
          <div className="bg-[#11111e] border border-pink-500/30 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-pink-200 mb-2">
                SWEat Project Status
              </h2>
              <p className="text-sm text-pink-100/85 mb-3">
                This web app is connected to a FastAPI backend that stores your
                workout sessions and sets in a SQLite database. It&apos;s built
                to mirror the mobile experience.
              </p>
              <ul className="text-xs text-pink-100/75 list-disc pl-4 space-y-1">
                <li>JWT-based login and signup</li>
                <li>Per-user workout sessions and sets</li>
                <li>Profile info and BMI estimate on the dashboard</li>
                <li>Shared design language with the SWEat mobile app</li>
              </ul>
            </div>

            <p className="mt-4 text-[11px] text-pink-200/70">
              Backend base URL: <span className="font-mono">{API_BASE}</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
