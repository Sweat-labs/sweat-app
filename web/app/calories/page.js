"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function calculateTDEE({ sex, age, weightLbs, heightFeet, heightInches, activity }) {
  const ageNum = Number(age);
  const weight = Number(weightLbs);
  const feet = Number(heightFeet || 0);
  const extraInches = Number(heightInches || 0);

  if (!ageNum || !weight || (!feet && !extraInches)) {
    return null;
  }

  const totalInches = feet * 12 + extraInches;
  const weightKg = weight * 0.453592;
  const heightCm = totalInches * 2.54;

  // Mifflin-St Jeor BMR
  let bmr;
  if (sex === "female") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
  }

  // Activity multiplier
  let multiplier = 1.2;
  if (activity === "1-3") multiplier = 1.375;
  if (activity === "3-5") multiplier = 1.55;
  if (activity === "5-7") multiplier = 1.725;

  const tdee = Math.round(bmr * multiplier);
  return tdee;
}

export default function CaloriesPage() {
  const router = useRouter();

  // Profile / calculation inputs
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightExtraInches, setHeightExtraInches] = useState("");
  const [activity, setActivity] = useState("");
  const [goal, setGoal] = useState("lose-1"); // default: lose 1 lb/week

  // Results
  const [tdee, setTdee] = useState(null);
  const [targetCalories, setTargetCalories] = useState(null);
  const [savedMessage, setSavedMessage] = useState("");

  // Daily calorie counter state
  const [entryName, setEntryName] = useState("");
  const [entryCalories, setEntryCalories] = useState("");
  const [entries, setEntries] = useState([]);

  const todayKey = useMemo(
    () => new Date().toISOString().slice(0, 10),
    []
  );

  // Derived values
  const totalIntake = entries.reduce((sum, e) => sum + (e.calories || 0), 0);
  const deficit = targetCalories != null ? targetCalories - totalIntake : null;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Pre-fill from SWEat profile if present
      const rawProfile = localStorage.getItem("sweat_profile");
      if (rawProfile) {
        const profile = JSON.parse(rawProfile);
        if (profile.weightLbs != null) setWeightLbs(String(profile.weightLbs));
        if (profile.heightFeet != null) setHeightFeet(String(profile.heightFeet));
        if (profile.heightExtraInches != null)
          setHeightExtraInches(String(profile.heightExtraInches));
        if (profile.activity) setActivity(profile.activity);
      }

      // Load previously saved calorie goal
      const rawCalories = localStorage.getItem("sweat_calories");
      if (rawCalories) {
        const saved = JSON.parse(rawCalories);
        if (saved.tdee != null) setTdee(saved.tdee);
        if (saved.targetCalories != null) setTargetCalories(saved.targetCalories);
        if (saved.goal) setGoal(saved.goal);
      }

      // Load today's log
      const rawLog = localStorage.getItem("sweat_calorie_log");
      if (rawLog) {
        const log = JSON.parse(rawLog);
        if (log[todayKey] && Array.isArray(log[todayKey].entries)) {
          setEntries(log[todayKey].entries);
        }
      }
    } catch (e) {
      console.error("Failed to load calorie data", e);
    }
  }, [todayKey]);

  function handleCalculate(e) {
    e.preventDefault();
    setSavedMessage("");

    const maintenance = calculateTDEE({
      sex,
      age,
      weightLbs,
      heightFeet,
      heightInches: heightExtraInches,
      activity,
    });

    if (!maintenance) {
      setTdee(null);
      setTargetCalories(null);
      setSavedMessage("Please fill in age, weight, and height correctly.");
      return;
    }

    let target = maintenance;
    if (goal === "lose-0.5") {
      target = maintenance - 250;
    } else if (goal === "lose-1") {
      target = maintenance - 500;
    } else if (goal === "lose-2") {
      target = maintenance - 1000;
    } else if (goal === "gain-0.5") {
      target = maintenance + 250;
    } else if (goal === "gain-1") {
      target = maintenance + 500;
    }

    // Safety clamp
    if (target < 1200) target = 1200;

    setTdee(maintenance);
    setTargetCalories(Math.round(target));
    setSavedMessage("");
  }

  function handleSaveGoal() {
    if (!tdee || !targetCalories) {
      setSavedMessage("Please calculate your goal first.");
      return;
    }
    try {
      const payload = {
        tdee,
        targetCalories,
        goal,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("sweat_calories", JSON.stringify(payload));
      setSavedMessage("Calorie goal saved! This will stay on this device.");
    } catch (e) {
      console.error("Failed to save calorie goal", e);
      setSavedMessage("Failed to save goal. Please try again.");
    }
  }

  function persistEntries(updated) {
    try {
      const rawLog = localStorage.getItem("sweat_calorie_log");
      const log = rawLog ? JSON.parse(rawLog) : {};
      log[todayKey] = { entries: updated };
      localStorage.setItem("sweat_calorie_log", JSON.stringify(log));
    } catch (e) {
      console.error("Failed to save calorie log", e);
    }
  }

  function handleAddEntry(e) {
    e.preventDefault();
    const cals = Number(entryCalories);
    if (!cals || cals <= 0) return;

    const newEntry = {
      id: Date.now(),
      name: entryName.trim() || "Food",
      calories: cals,
    };

    const updated = [...entries, newEntry];
    setEntries(updated);
    persistEntries(updated);
    setEntryName("");
    setEntryCalories("");
  }

  function handleDeleteEntry(id) {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    persistEntries(updated);
  }

  return (
    <main className="min-h-screen bg-[#050509] text-pink-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-pink-300 drop-shadow-sm">
              Calorie Planner
            </h1>
            <p className="text-xs text-pink-200/70">
              Estimate your daily calorie goal and track today&apos;s intake.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="text-xs md:text-sm text-pink-200 hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Goal / calculator */}
          <section className="rounded-3xl bg-gradient-to-br from-[#181828] to-[#11111e] border border-pink-500/40 p-6 shadow-xl">
            <h2 className="text-lg font-bold text-pink-200 mb-2">
              Calorie Goal & Deficit
            </h2>
            <p className="text-sm text-pink-100/80 mb-4">
              We&apos;ll estimate your maintenance calories (TDEE) and suggest a
              daily target based on your goal.
            </p>

            <form onSubmit={handleCalculate} className="space-y-4 text-sm">
              {/* Sex + Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wide text-pink-300/80 mb-1">
                    Sex
                  </label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wide text-pink-300/80 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                    placeholder="e.g. 21"
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-[11px] uppercase tracking-wide text-pink-300/80 mb-1">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                  placeholder="e.g. 165"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-[11px] uppercase tracking-wide text-pink-300/80 mb-1">
                  Height
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <span className="block text-[11px] text-pink-200/80 mb-1">
                      Feet
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="block text-[11px] text-pink-200/80 mb-1">
                      Inches
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={heightExtraInches}
                      onChange={(e) => setHeightExtraInches(e.target.value)}
                      className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div>
                <label className="block text-[11px] uppercase tracking-wide text-pink-300/80 mb-1">
                  Activity Level
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                >
                  <option value="">Select activity</option>
                  <option value="1-3">1–3 days / week</option>
                  <option value="3-5">3–5 days / week</option>
                  <option value="5-7">5–7 days / week</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-[11px] uppercase tracking-wide text-pink-300/80 mb-1">
                  Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full rounded-xl border border-pink-500/50 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                >
                  <option value="maintain">Maintain weight</option>
                  <option value="lose-0.5">Lose 0.5 lb / week</option>
                  <option value="lose-1">Lose 1 lb / week</option>
                  <option value="lose-2">Lose 2 lb / week</option>
                  <option value="gain-0.5">Gain 0.5 lb / week</option>
                  <option value="gain-1">Gain 1 lb / week</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2 gap-3">
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-400 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md"
                >
                  Calculate
                </button>
                <button
                  type="button"
                  onClick={handleSaveGoal}
                  className="text-xs text-pink-200 hover:underline"
                >
                  Save goal to this device
                </button>
              </div>

              {/* Display results */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-[#101018] border border-pink-500/50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-pink-300/80">
                    Maintenance (TDEE)
                  </p>
                  <p className="text-lg font-bold">
                    {tdee != null ? `${tdee} kcal` : "–"}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#101018] border border-pink-500/50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-pink-300/80">
                    Daily Target
                  </p>
                  <p className="text-lg font-bold">
                    {targetCalories != null ? `${targetCalories} kcal` : "–"}
                  </p>
                </div>
              </div>

              {savedMessage && (
                <p className="text-xs text-pink-200/80 mt-2">{savedMessage}</p>
              )}
            </form>
          </section>

          {/* Right: Today log */}
          <section className="rounded-3xl bg-[#11111e] border border-pink-500/30 p-6 shadow-xl flex flex-col">
            <h2 className="text-lg font-bold text-pink-200 mb-2">
              Today&apos;s Calorie Log
            </h2>
            <p className="text-sm text-pink-100/80 mb-3">
              Track what you eat today and see how close you are to your
              calorie goal.
            </p>

            <form onSubmit={handleAddEntry} className="flex gap-3 mb-4 text-sm">
              <input
                type="text"
                value={entryName}
                onChange={(e) => setEntryName(e.target.value)}
                className="flex-1 rounded-xl border border-pink-500/40 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                placeholder="Food / meal"
              />
              <input
                type="number"
                min="0"
                value={entryCalories}
                onChange={(e) => setEntryCalories(e.target.value)}
                className="w-28 rounded-xl border border-pink-500/40 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500/70"
                placeholder="kcal"
              />
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-400 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md"
              >
                Add
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4 text-sm">
              {entries.length === 0 && (
                <p className="text-pink-100/70 text-xs">
                  No entries yet for today. Start by adding your first meal.
                </p>
              )}
              {entries.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-xl bg-[#181828] border border-pink-500/30 px-3 py-2"
                >
                  <div>
                    <p className="font-semibold">{e.name}</p>
                    <p className="text-xs text-pink-100/70">
                      {e.calories} kcal
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteEntry(e.id)}
                    className="text-xs text-red-300 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-[#101018] border border-pink-500/50 px-4 py-3 text-sm">
              <p className="text-[11px] uppercase tracking-wide text-pink-300/80">
                Today&apos;s Total
              </p>
              <p className="text-lg font-bold mb-1">
                {totalIntake} kcal eaten
              </p>
              {targetCalories != null && (
                <p className="text-xs text-pink-100/80">
                  Goal: {targetCalories} kcal →{" "}
                  {deficit > 0
                    ? `${deficit} kcal remaining`
                    : deficit < 0
                    ? `${Math.abs(deficit)} kcal over`
                    : "exactly on target"}
                </p>
              )}
              {targetCalories == null && (
                <p className="text-xs text-pink-100/70">
                  Set a calorie goal on the left to compare your intake.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
