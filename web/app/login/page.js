"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";
import { saveToken, clearToken } from "@/lib/auth";

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
      // clear any old token first
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

      saveToken(data.access_token);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050509] text-pink-50 flex items-center justify-center px-4">
      {/* Glow circle + logo text */}
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="h-24 w-24 rounded-full bg-pink-500/20 blur-xl absolute inset-0" />
            <div className="h-16 w-16 rounded-full bg-pink-500 flex items-center justify-center relative">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-wide">SWEat Web</h1>
          <p className="text-sm text-pink-200/80 mt-1">
            Welcome back. Ready to SWEat?
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#101018] border border-pink-500/30 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-pink-50 mb-2">
            Sign in to your account
          </h2>
          <p className="text-xs text-pink-200/70 mb-4">
            Use the same email and password as the mobile app.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-pink-200 mb-1">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-pink-500/40 bg-[#151522] px-3 py-2 text-sm text-pink-50
                           placeholder:text-pink-200/40 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-pink-200 mb-1">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-pink-500/40 bg-[#151522] px-3 py-2 text-sm text-pink-50
                           placeholder:text-pink-200/40 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-300 bg-red-900/40 border border-red-500/40 p-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-pink-500 hover:bg-pink-400 active:bg-pink-600
                         text-white font-semibold py-2 rounded-full text-sm transition
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-xs text-center text-pink-200/80">
            <span>Need an account? </span>
            <button
              type="button"
              onClick={() => router.push("/auth/signup")}
              className="font-semibold underline underline-offset-2 hover:text-pink-100"
            >
              Create one
            </button>
          </div>

          <div className="mt-2 text-xs text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-pink-300/80 hover:text-pink-100 underline underline-offset-2"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
