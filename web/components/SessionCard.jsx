"use client";

import Link from "next/link";
import { API_BASE } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function SessionCard({ session }) {
  // Title + basic fields
  const title =
    session.name || session.title || `Session #${session.id ?? "?"}`;

  const startedAt =
    session.started_at || session.start_time || session.date || null;

  // Backend uses "note"
  const notes = session.note || session.notes || session.comment || "";

  const sets = Array.isArray(session.sets) ? session.sets : [];

  async function handleDeleteSession(id) {
    if (!confirm("Delete this session? This cannot be undone.")) return;

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

      // Reload dashboard
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

      // Simple refresh to show updated sets
      window.location.reload();
    } catch (e) {
      alert(`Failed to delete set: ${e.message || e}`);
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#181828] to-[#11111e] border border-pink-500/40 p-4 md:p-5 shadow-md">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-pink-50">
            {title}
          </h3>
          {notes && (
            <p className="mt-1 text-xs md:text-sm text-pink-100/85">
              {notes}
            </p>
          )}
        </div>

        {startedAt && (
          <span className="inline-flex items-center rounded-full bg-pink-500/15 border border-pink-400/40 px-3 py-1 text-[11px] md:text-xs text-pink-100">
            {new Date(startedAt).toLocaleString()}
          </span>
        )}
      </div>

      {/* Sets list */}
      <div className="mt-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-pink-200/80 mb-2">
          Sets Logged
        </h4>

        {sets.length > 0 ? (
          <ul className="space-y-1.5">
            {sets.map((s) => (
              <li
                key={s.id ?? `${s.exercise}-${Math.random()}`}
                className="flex items-center justify-between text-xs md:text-sm text-pink-100/90 bg-[#151522] border border-pink-500/30 rounded-xl px-3 py-2"
              >
                <span>
                  <span className="font-semibold">
                    {s.exercise || "Exercise"}
                  </span>{" "}
                  —{" "}
                  {s.reps != null ? `${s.reps} reps` : "reps N/A"}
                  {s.weight != null ? ` @ ${s.weight}` : ""}
                </span>

                {s.id != null && (
                  <button
                    onClick={() => handleDeleteSet(s.id)}
                    className="ml-3 text-[11px] md:text-xs text-red-300 hover:text-red-200 underline"
                    title="Delete set"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs md:text-sm text-pink-200/75">
            No sets yet. Add your first set to this session.
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs md:text-sm">
        <Link
          href={`/dashboard/${session.id}/add-set`}
          className="inline-flex items-center rounded-full bg-pink-500 text-white px-4 py-1.5 font-semibold hover:bg-pink-400"
        >
          Add Set
        </Link>

        <Link
          href={`/dashboard/${session.id}/edit`}
          className="inline-flex items-center rounded-full border border-amber-400/80 text-amber-200 px-4 py-1.5 hover:bg-amber-400/10"
          title="Edit session note/name"
        >
          Edit Session
        </Link>

        <button
          onClick={() => handleDeleteSession(session.id)}
          className="inline-flex items-center rounded-full border border-red-400/70 text-red-200 px-4 py-1.5 hover:bg-red-500/10"
          title="Delete session"
        >
          Delete Session
        </button>
      </div>
    </div>
  );
}
