"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [apiStatus, setApiStatus] = useState("Checking...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setApiStatus("✅ Online");
        } else {
          setApiStatus("⚠️ Unexpected response");
        }
      })
      .catch(() => {
        setApiStatus("❌ Offline");
      });
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-5xl font-bold text-blue-600 mb-6">SWEat Web</h1>
      <p className="text-lg text-gray-700">
        Backend API Status:{" "}
        <span className="font-semibold">{apiStatus}</span>
      </p>
    </main>
  );
}
