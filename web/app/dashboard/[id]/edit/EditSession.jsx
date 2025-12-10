"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

export default function EditSessionClient({ id }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState("");
  const [saveErr, setSaveErr] = useState("");

  useEffect(() => {
    let abort = false;
    async function fetchSession() {
      setLoadErr("");
      try {
        const res = await fetch(`${API_BASE}/workouts/sessions`);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const sessions = await res.json();
        const s = Array.isArray(sessions)
          ? sessions.find((it) => String(it.id) === String(id))
          : null;
        if (!abort) {
          if (!s) {
            setLoadErr("Session not found.");
          } else {
            setNote(s.note || "");
          }
        }
      } catch (e) {
        if (!abort) setLoadErr(String(e.message || e));
      }
    }
    fetchSession();
    return () => {
      abort = true;
    };
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaveErr("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/workouts/sessions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
      }
      router.push("/dashboard?ok=session-updated");
    } catch (e) {
      setSaveErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Edit Session #{id}
        </h1>

        {loadErr ? (
          <>
            <p className="text-sm text-red-700 bg-red-50 p-2 rounded">
              {loadErr}
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              ← Back to Dashboard
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="e.g. Push Day"
              />
            </div>

            {saveErr && (
              <p className="text-sm text-red-700 bg-red-50 p-2 rounded">
                {saveErr}
              </p>
            )}

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="text-sm text-gray-700 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
