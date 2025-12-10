"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function NewSessionPage() {
  const router = useRouter();

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/workouts/sessions`, {
        method: "POST",
        headers,
        body: JSON.stringify({ note }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
      }

      setSuccess("Session created!");
      // tiny delay so the user can see the message
      setTimeout(() => router.push("/dashboard"), 700);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create session.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050510] text-pink-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl bg-gradient-to-br from-[#181828] to-[#11111e] border border-pink-500/40 p-6 md:p-8 shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-extrabold text-pink-200 mb-2">
          New SWEat Session
        </h1>
        <p className="text-sm text-pink-100/80 mb-6">
          Create a new workout session for today, then add sets for each
          exercise you do.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-pink-300/80 mb-1">
              Session Note / Title
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
              placeholder="e.g. Push day, heavy bench and shoulders"
            />
          </div>

          {error && (
            <p className="text-sm text-red-200 bg-red-950/60 border border-red-400/70 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-emerald-200 bg-emerald-950/60 border border-emerald-400/70 rounded-xl px-3 py-2">
              {success}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="text-xs text-pink-200 hover:underline"
            >
              ← Back to Dashboard
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-pink-500 hover:bg-pink-400 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md"
            >
              {loading ? "Creating..." : "Create Session"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
