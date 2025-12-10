"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_BASE } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function EditSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [note, setNote] = useState("");
  const [name, setName] = useState("");

  // Load session info
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const token = getToken();
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}/workouts/sessions`, { headers });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`${res.status} ${res.statusText}: ${text}`);
        }

        const allSessions = await res.json();
        const match = allSessions.find((s) => String(s.id) === String(sessionId));

        if (!match) {
          throw new Error("Session not found");
        }

        setNote(match.note || "");
        setName(match.name || "");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load session.");
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) {
      load();
    }
  }, [sessionId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
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

      const body = {
        note,
        name: name || null,
      };

      const res = await fetch(`${API_BASE}/workouts/sessions/${sessionId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
      }

      setSuccess("Session updated!");
      setTimeout(() => router.push("/dashboard"), 700);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update session.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050510] text-pink-50 flex items-center justify-center">
        <p className="text-sm text-pink-100/80">Loading session...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050510] text-pink-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl bg-gradient-to-br from-[#181828] to-[#11111e] border border-pink-500/40 p-6 md:p-8 shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-extrabold text-pink-200 mb-2">
          Edit Session
        </h1>
        <p className="text-sm text-pink-100/80 mb-6">
          Update the name and note for this workout session.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-pink-300/80 mb-1">
              Session Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
              placeholder="e.g. Push Day"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-pink-300/80 mb-1">
              Session Note
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
              placeholder="What did you focus on? How did it feel?"
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
              disabled={saving}
              className="bg-pink-500 hover:bg-pink-400 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
