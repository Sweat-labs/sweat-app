"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      clearToken();
      // Optional: also clear local profile if you want a "fresh" login
      // localStorage.removeItem("sweat_profile");
    } catch (e) {
      console.error("Error clearing auth data", e);
    }

    const timeoutId = setTimeout(() => {
      router.push("/");
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#050509] text-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-gradient-to-br from-[#181828] to-[#11111e] border border-pink-500/40 p-6 md:p-8 shadow-2xl text-center">
          <h1 className="text-2xl font-extrabold text-pink-200 mb-2">
            You&apos;re logged out
          </h1>
          <p className="text-sm text-pink-100/85 mb-4">
            We&apos;ve cleared your session. You can safely close this tab or
            sign back in to start tracking SWEat again.
          </p>

          {/* Little "spinner" / activity indicator */}
          <div className="flex justify-center mb-4">
            <div className="h-10 w-10 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
          </div>

          <p className="text-xs text-pink-200/75 mb-4">
            Redirecting you to the home page...
          </p>

          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center bg-pink-500 hover:bg-pink-400 text-white text-sm font-semibold px-5 py-2 rounded-full"
          >
            Go to Home Now
          </button>
        </div>
      </div>
    </main>
  );
}
