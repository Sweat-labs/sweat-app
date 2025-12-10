"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (password !== confirm) {
        throw new Error("Passwords do not match.");
      }

      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // backend only needs email + password right now
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
      }

      setSuccess("Account created. You can now sign in.");
      // small pause, then go to login
      setTimeout(() => router.push("/login"), 800);
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050509] text-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header + glow, matching mobile style */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="h-24 w-24 rounded-full bg-pink-500/20 blur-xl absolute inset-0" />
            <div className="h-16 w-16 rounded-full bg-pink-500 flex items-center justify-center relative">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-wide">SWEat Web</h1>
          <p className="text-sm text-pink-200/80 mt-1">
            Create an account to start tracking your SWEat.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#101018] border border-pink-500/30 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-pink-50 mb-2">
            Create an Account
          </h2>
          <p className="text-xs text-pink-200/70 mb-4">
            Use a valid email and a password you will remember.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-pink-200 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-pink-500/40 bg-[#151522] px-3 py-2 text-sm text-pink-50
                           placeholder:text-pink-200/40 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400"
                placeholder="John SWEat"
              />
            </div>

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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-pink-500/40 bg-[#151522] px-3 py-2 text-sm text-pink-50
                           placeholder:text-pink-200/40 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-pink-200 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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

            {success && (
              <p className="text-xs text-emerald-300 bg-emerald-900/30 border border-emerald-500/40 p-2 rounded-lg">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-pink-500 hover:bg-pink-400 active:bg-pink-600
                         text-white font-semibold py-2 rounded-full text-sm transition
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-4 text-xs text-center text-pink-200/80">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-semibold underline underline-offset-2 hover:text-pink-100"
            >
              Login
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
