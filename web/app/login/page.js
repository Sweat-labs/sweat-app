"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";
import { setToken, clearToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("string");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      clearToken();

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
      }

      const data = await res.json();
      if (!data.access_token) {
        throw new Error("No access_token in response");
      }

      // ✅ store token
      setToken(data.access_token);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050509] text-pink-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#181828] to-[#11111e] border border-pink-500/40 p-6 md:p-8 shadow-2xl">
          <h1 className="text-2xl md:text-3xl font-extrabold text-pink-200 mb-2">
            Welcome back to SWEat
          </h1>
          <p className="text-sm text-pink-100/80 mb-6">
            Sign in to view your dashboard, log your workouts, and track your
            progress.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-pink-300/80 mb-1">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-pink-300/80 mb-1">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-200 bg-red-950/60 border border-red-400/60 p-2 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-400 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Extra links */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="text-pink-200 hover:underline"
            >
              ← Back to Dashboard
            </button>

            <button
              type="button"
              onClick={() => router.push("/auth/signup")}
              className="text-pink-300 hover:underline"
            >
              Need an account? Sign up
            </button>
          </div>

          <p className="mt-3 text-[11px] text-pink-200/70">
            Make sure your backend is running at{" "}
            <span className="font-mono text-pink-100">{API_BASE}</span> to
            log in successfully.
          </p>
        </div>
      </div>
    </main>
  );
}
