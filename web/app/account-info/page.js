"use client";

import { useEffect, useState } from "react";

export default function AccountInfoPage() {
  const [weightLbs, setWeightLbs] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInchesExtra, setHeightInchesExtra] = useState("");
  const [activity, setActivity] = useState("3-5");
  const [goal, setGoal] = useState("build_muscle");

  const [bmi, setBmi] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load saved profile on first render
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sweat_profile");
      if (!raw) return;
      const data = JSON.parse(raw);

      if (data.weightLbs != null) setWeightLbs(String(data.weightLbs));
      if (data.heightFeet != null) setHeightFeet(String(data.heightFeet));
      if (data.heightExtraInches != null)
        setHeightInchesExtra(String(data.heightExtraInches));
      if (data.activity) setActivity(data.activity);
      if (data.goal) setGoal(data.goal);
    } catch (e) {
      console.error("Failed to load profile from storage", e);
    }
  }, []);

  // Recalculate BMI when weight / height change
  useEffect(() => {
    const w = Number(weightLbs);
    const feet = Number(heightFeet);
    const extra = Number(heightInchesExtra);

    if (!w || (!feet && !extra)) {
      setBmi(null);
      return;
    }

    const totalInches = feet * 12 + extra;
    if (!totalInches) {
      setBmi(null);
      return;
    }

    const raw = (w / (totalInches ** 2)) * 703;
    const rounded = Math.round(raw * 10) / 10;
    setBmi(rounded);
  }, [weightLbs, heightFeet, heightInchesExtra]);

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const data = {
        weightLbs: Number(weightLbs) || null,
        heightFeet: Number(heightFeet) || null,
        heightExtraInches: Number(heightInchesExtra) || null,
        activity,
        goal,
      };

      localStorage.setItem("sweat_profile", JSON.stringify(data));
      setMessage("Profile saved! Redirecting to dashboard...");

      // Hard redirect to dashboard so you always land on the main view
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);
    } catch (err) {
      console.error(err);
      setMessage("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050510] text-pink-50 px-4 py-8">
      <div className="max-w-xl mx-auto rounded-3xl bg-gradient-to-br from-[#171727] to-[#0d0d18] border border-pink-500/40 p-6 shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-extrabold text-pink-200 mb-2">
          Your SWEat Profile
        </h1>
        <p className="text-sm text-pink-100/80 mb-6">
          Update your basic info so we can estimate your BMI and show more
          meaningful stats on the dashboard.
        </p>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Weight */}
          <div>
            <label className="block text-xs font-semibold tracking-wide text-pink-300/80 mb-1">
              WEIGHT (LBS)
            </label>
            <input
              type="number"
              min="1"
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value)}
              className="w-full rounded-xl border border-pink-400/60 bg-[#050510] px-3 py-2 text-sm text-pink-50 outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-400"
              placeholder="e.g. 170"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-xs font-semibold tracking-wide text-pink-300/80 mb-1">
              HEIGHT
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="block text-[10px] uppercase tracking-wide text-pink-300/70 mb-1">
                  Feet
                </span>
                <input
                  type="number"
                  min="0"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(e.target.value)}
                  className="w-full rounded-xl border border-pink-400/60 bg-[#050510] px-3 py-2 text-sm text-pink-50 outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-400"
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wide text-pink-300/70 mb-1">
                  Inches
                </span>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={heightInchesExtra}
                  onChange={(e) => setHeightInchesExtra(e.target.value)}
                  className="w-full rounded-xl border border-pink-400/60 bg-[#050510] px-3 py-2 text-sm text-pink-50 outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-400"
                  placeholder="e.g. 10"
                />
              </div>
            </div>
          </div>

          {/* Activity level */}
          <div>
            <label className="block text-xs font-semibold tracking-wide text-pink-300/80 mb-1">
              ACTIVITY LEVEL
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full rounded-xl border border-pink-400/60 bg-[#050510] px-3 py-2 text-sm text-pink-50 outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-400"
            >
              <option value="1-3">1–3 days / week</option>
              <option value="3-5">3–5 days / week</option>
              <option value="5-7">5–7 days / week</option>
            </select>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs font-semibold tracking-wide text-pink-300/80 mb-1">
              MAIN GOAL
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-xl border border-pink-400/60 bg-[#050510] px-3 py-2 text-sm text-pink-50 outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-400"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="build_muscle">Build Muscle</option>
              <option value="be_healthier">Be Healthier</option>
            </select>
          </div>

          {/* BMI display */}
          <div className="mt-2 rounded-2xl bg-[#050510] border border-pink-500/40 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-pink-300/80">
                BMI (estimate)
              </p>
              <p className="text-xl font-bold text-pink-100">
                {bmi != null ? bmi : "–"}
              </p>
            </div>
            <p className="text-[11px] text-pink-100/70 max-w-[180px] text-right">
              BMI is just one rough metric. Use it as a guideline, not a final
              judgement of progress.
            </p>
          </div>

          {/* Buttons + message */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => (window.location.href = "/dashboard")}
              className="text-xs text-pink-200 hover:underline"
            >
              ← Back to Dashboard
            </button>

            <button
              type="submit"
              disabled={saving}
              className="ml-auto rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-pink-600 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>

          {message && (
            <p className="mt-2 text-xs text-pink-200/90">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}
