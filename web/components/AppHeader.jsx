"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function AppHeader() {
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check if a token exists in localStorage (only runs on client)
    const token = getToken();
    setHasToken(!!token);
  }, [pathname]); // re-check when route changes

  const linkBase = "text-sm px-3 py-1 rounded-lg hover:bg-white/80";

  return (
    <header className="w-full bg-white shadow-sm mb-4">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side: logo / app name */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
            S
          </span>
          <span className="text-lg font-semibold text-gray-900">
            SWEat Web
          </span>
        </Link>

        {/* Right side: navigation */}
        <nav className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className={linkBase}
          >
            Dashboard
          </Link>

          <Link
            href="/bmi"
            className={linkBase}
          >
            BMI Calculator
          </Link>

          {/* NEW: Calorie planner / counter */}
          <Link
            href="/calories"
            className={linkBase}
          >
            Calories
          </Link>

          {!hasToken && (
            <>
              <Link
                href="/login"
                className={linkBase}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className={`${linkBase} border border-blue-600 text-blue-600`}
              >
                Sign up
              </Link>
            </>
          )}

          {hasToken && (
            <Link
              href="/logout"
              className={`${linkBase} border border-red-500 text-red-600`}
            >
              Logout
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
