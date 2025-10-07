import Link from "next/link";

export default function SessionCard({ session }) {
  // Try to read common fields safely
  const title =
    session.name || session.title || `Session #${session.id ?? "?"}`;

  const startedAt =
    session.started_at || session.start_time || session.date || null;

  const notes = session.notes || session.comment || "";

  const sets = Array.isArray(session.sets) ? session.sets : [];

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {startedAt && (
          <span className="text-sm text-gray-500">
            {new Date(startedAt).toLocaleString()}
          </span>
        )}
      </div>

      {notes && <p className="mt-1 text-sm text-gray-700">{notes}</p>}

      {sets.length > 0 ? (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Sets</h4>
          <ul className="space-y-1">
            {sets.map((s) => (
              <li
                key={s.id ?? `${s.exercise}-${Math.random()}`}
                className="text-sm text-gray-700"
              >
                • {s.exercise || "Exercise"} —{" "}
                {s.reps != null ? `${s.reps} reps` : "reps N/A"}
                {s.weight != null ? ` @ ${s.weight}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-500">No sets yet.</p>
      )}

      {/* Add Set Link (client-side navigation) */}
      <div className="mt-3">
        <Link
          href={`/dashboard/${session.id}/add-set`}
          className="text-sm text-blue-600 hover:underline"
        >
          ➕ Add Set
        </Link>
      </div>
    </div>
  );
}
