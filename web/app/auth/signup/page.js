"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // IMPORTANT: backend endpoint is /auth/register (not /auth/signup)
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Backend expects: username, email, password, full_name
        body: JSON.stringify({
          username: email,       // username = email to satisfy backend schema
          email,
          password,
          full_name: fullName,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
      }

      setSuccess("Account created. You can now sign in.");
      // Small delay so they see the success banner, then redirect
      setTimeout(() => router.push("/login"), 900);
    } catch (err) {
      console.error(err);
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050509] flex items-center justify-center px-4 py-10 text-pink-50">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-gradient-to-br from-[#181828] to-[#11111e] border border-pink-500/40 p-6 md:p-8 shadow-2xl">
          <h1 className="text-2xl md:text-3xl font-extrabold text-pink-200 mb-2">
            Create your SWEat account
          </h1>
          <p className="text-sm text-pink-100/80 mb-6">
            Sign up to start tracking your sessions, sets, and progress.
          </p>

          {error && (
            <div className="mb-3 rounded-xl border border-red-400/70 bg-red-950/60 px-3 py-2 text-xs text-red-100">
              <p className="font-semibold mb-1">Could not sign up</p>
              <p className="break-words">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-3 rounded-xl border border-emerald-400/70 bg-emerald-950/60 px-3 py-2 text-xs text-emerald-100">
              <p className="font-semibold mb-1">Success</p>
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-pink-300/80 mb-1">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                placeholder="e.g. John SWEat"
              />
            </div>

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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                placeholder="At least 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-400 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="mt-4 text-xs text-pink-200/80 text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-pink-300 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
