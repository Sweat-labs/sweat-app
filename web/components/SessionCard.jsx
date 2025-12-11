"use client";

import Link from "next/link";
import { API_BASE } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function SessionCard({ session }) {
  // Title: only use explicit name/title; do NOT fall back to note
  const title =
    session.name ||
    session.title ||
    `Session #${session.id ?? "?"}`;

  const startedAt =
    session.started_at || session.start_time || session.date || null;

  const notes = session.note || session.notes || session.comment || "";

  const sets = Array.isArray(session.sets) ? session.sets : [];

  async function handleDeleteSession(id) {
    if (!confirm("Delete this entire session? This cannot be undone.")) return;

    try {
      const token = getToken();
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/workouts/sessions/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
      }

      // Reload dashboard so the list updates
      window.location.href = "/dashboard?ok=session-deleted";
    } catch (e) {
      alert(`Failed to delete session: ${e.message || e}`);
    }
  }

  async function handleDeleteSet(setId) {
    if (!confirm("Delete this set?")) return;

    try {
      const token = getToken();
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/workouts/sets/${setId}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
      }

      window.location.reload();
    } catch (e) {
      alert(`Failed to delete set: ${e.message || e}`);
    }
  }

  return (
    <div className="rounded-2xl border border-pink-500/40 bg-gradient-to-br from-[#181828] to-[#11111e] p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xl font-semibold text-pink-100">{title}</h3>
        {startedAt && (
          <span className="text-xs text-pink-200/70">
            {new Date(startedAt).toLocaleString()}
          </span>
        )}
      </div>

      {notes && (
        <p className="mt-1 text-sm text-pink-100/80">
          {notes}
        </p>
      )}

      {sets.length > 0 ? (
        <div className="mt-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-pink-300/90 mb-1">
            Sets
          </h4>
          <ul className="space-y-1">
            {sets.map((s) => (
              <li
                key={s.id ?? `${s.exercise}-${Math.random()}`}
                className="text-sm text-pink-100/85 flex items-center justify-between"
              >
                <span>
                  • {s.exercise || "Exercise"} —{" "}
                  {s.reps != null ? `${s.reps} reps` : "reps N/A"}
                  {s.weight != null ? ` @ ${s.weight}` : ""}
                </span>
                {s.id != null && (
                  <button
                    onClick={() => handleDeleteSet(s.id)}
                    className="ml-3 text-xs text-red-300 hover:underline"
                    title="Delete set"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-3 text-sm text-pink-200/70">No sets yet.</p>
      )}

      <div className="mt-4 flex items-center gap-4 text-sm">
        <Link
          href={`/dashboard/${session.id}/add-set`}
          className="text-pink-300 hover:underline"
        >
          Add Set
        </Link>

        <Link
          href={`/dashboard/${session.id}/edit`}
          className="text-yellow-300 hover:underline"
          title="Edit session note/name"
        >
          Edit Session
        </Link>

        <button
          onClick={() => handleDeleteSession(session.id)}
          className="text-red-300 hover:underline"
          title="Delete session"
        >
          Delete Session
        </button>
      </div>
    </div>
  );
}
