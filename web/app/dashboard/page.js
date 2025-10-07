"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getSessions } from "@/lib/api";
import SessionCard from "@/components/SessionCard";

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const ok = searchParams.get("ok"); // "session-created" | "set-added" | null

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const data = await getSessions();
      if (Array.isArray(data)) {
        setSessions(data);
      } else if (Array.isArray(data?.items)) {
        setSessions(data.items);
      } else {
        setSessions([]);
      }
      setStatus("ready");
    } catch (e) {
      console.error(e);
      setError(String(e.message || e));
      setStatus("error");
    }
  }, []);

  // initial load
  useEffect(() => {
    load();
  }, [load]);

  // tiny auto-refresh (every 30s). Remove if you don’t want polling.
  useEffect(() => {
    const t = setInterval(() => load(), 30_000);
    return () => clearInterval(t);
  }, [load]);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-4xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">SWEat Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Source:{" "}
              <code className="px-1 rounded bg-gray-200">
                {process.env.NEXT_PUBLIC_API_BASE_URL}
              </code>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/dashboard/new"
              className="rounded-lg bg-blue-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-blue-700 transition"
            >
              + New Session
            </a>
            <button
              onClick={load}
              className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              title="Reload sessions"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Success banner */}
        {ok && (
          <div className="mt-4 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800">
            {ok === "session-created" && "✅ Session created successfully."}
            {ok === "set-added" && "✅ Set added successfully."}
          </div>
        )}

        <div className="mt-6">
          {status === "loading" && (
            <p className="text-gray-700">Loading sessions…</p>
          )}

          {status === "error" && (
            <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              <p className="font-semibold">Could not load sessions.</p>
              <p className="mt-1 break-all">{error}</p>
              <button
                onClick={load}
                className="mt-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          {status === "ready" && (
            <>
              {sessions.length === 0 ? (
                <p className="text-gray-600">No sessions yet.</p>
              ) : (
                <div className="mt-2 grid gap-4">
                  {sessions.map((s) => (
                    <SessionCard key={s.id ?? Math.random()} session={s} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
