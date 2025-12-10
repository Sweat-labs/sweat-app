"use client";

import { useEffect, useState } from "react";

export default function BMICalculatorPage() {
  const [weight, setWeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [bmi, setBmi] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  // Prefill from existing profile (if any)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sweat_profile");
      if (!raw) return;
      const data = JSON.parse(raw);

      if (data.weightLbs != null) {
        setWeight(String(data.weightLbs));
      }
      if (data.heightFeet != null) {
        setFeet(String(data.heightFeet));
      }
      if (data.heightExtraInches != null) {
        setInches(String(data.heightExtraInches));
      }

      // If we have enough data, compute BMI on load
      if (
        data.weightLbs != null &&
        data.heightInches != null &&
        data.heightInches > 0
      ) {
        const rawBmi =
          (Number(data.weightLbs) / (Number(data.heightInches) ** 2)) * 703;
        const rounded = Math.round(rawBmi * 10) / 10;
        setBmi(rounded);
      }
    } catch (e) {
      console.error("Failed to load existing profile", e);
    }
  }, []);

  function calculate() {
    setSaveMessage("");

    const w = Number(weight);
    const f = Number(feet || 0);
    const i = Number(inches || 0);

    if (!w || (!f && !i)) {
      setBmi("Invalid input");
      return;
    }

    const totalInches = f * 12 + i;
    if (!totalInches || totalInches <= 0) {
      setBmi("Invalid height");
      return;
    }

    const raw = (w / (totalInches ** 2)) * 703;
    const result = Math.round(raw * 10) / 10;

    setBmi(result);
  }

  function handleSaveToProfile() {
    setSaveMessage("");

    const w = Number(weight);
    const f = feet === "" ? null : Number(feet);
    const i = inches === "" ? null : Number(inches);

    if (!w || f === null || i === null) {
      setSaveMessage("Please enter a valid weight, feet, and inches.");
      return;
    }

    const totalInches = f * 12 + i;
    if (!totalInches || totalInches <= 0) {
      setSaveMessage("Height must be greater than zero.");
      return;
    }

    let existing = {};
    try {
      const raw = localStorage.getItem("sweat_profile");
      if (raw) {
        existing = JSON.parse(raw);
      }
    } catch (e) {
      console.error("Failed to read existing profile", e);
    }

    const profileData = {
      ...existing,
      weightLbs: w,
      heightFeet: f,
      heightExtraInches: i,
      heightInches: totalInches,
    };

    try {
      localStorage.setItem("sweat_profile", JSON.stringify(profileData));
      setSaveMessage(
        "Saved to your SWEat profile. You’ll see this on your dashboard."
      );
    } catch (e) {
      console.error("Failed to save profile", e);
      setSaveMessage("Failed to save to profile. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#050509] text-pink-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="rounded-3xl bg-gradient-to-br from-[#181828] to-[#11111e] border border-pink-500/40 p-8 shadow-2xl">
          <h1 className="text-3xl font-extrabold text-pink-200 mb-3">
            BMI Calculator
          </h1>
          <p className="text-sm text-pink-100/80 mb-6">
            Enter your height and weight to estimate your Body Mass Index. You
            can also save it to your SWEat profile.
          </p>

          {/* Inputs */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-pink-300/80 mb-1">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-xl border border-pink-500/40 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:ring-2 focus:ring-pink-500/70 outline-none"
                placeholder="e.g. 165"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-pink-300/80 mb-1">
                Height
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="w-full rounded-xl border border-pink-500/40 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:ring-2 focus:ring-pink-500/70 outline-none"
                  placeholder="Feet (e.g. 5)"
                />
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="w-full rounded-xl border border-pink-500/40 bg-[#050509] px-3 py-2 text-sm text-pink-50 focus:ring-2 focus:ring-pink-500/70 outline-none"
                  placeholder="Inches (e.g. 10)"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={calculate}
                className="flex-1 bg-pink-500 hover:bg-pink-400 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md transition"
              >
                Calculate BMI
              </button>

              <button
                onClick={handleSaveToProfile}
                className="flex-1 border border-pink-500/60 text-pink-100 hover:bg-pink-500/10 text-sm font-semibold px-4 py-2 rounded-full transition"
              >
                Save to My Profile
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="mt-6 rounded-2xl bg-[#0d0d17] border border-pink-500/30 p-4">
            <p className="text-xs uppercase tracking-wide text-pink-300/70 mb-1">
              Result
            </p>
            <p className="text-xl font-bold text-pink-100">
              {bmi === null ? "–" : bmi}
            </p>
          </div>

          {saveMessage && (
            <p className="mt-3 text-xs text-pink-200/80">{saveMessage}</p>
          )}

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="mt-6 text-sm text-pink-300 hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
