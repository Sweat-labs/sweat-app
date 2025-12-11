"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function AppHeader() {
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = getToken();
    setHasToken(!!token);
  }, [pathname]);

  // Helper for highlighting the active link
  function isActive(path) {
    return pathname === path;
  }

  const baseLink =
    "text-sm px-3 py-1.5 rounded-full transition-all duration-150";

  const inactive =
    "text-pink-200/80 hover:text-pink-100 hover:bg-pink-500/20";
  const active =
    "text-pink-100 bg-pink-600/40 border border-pink-500/60 shadow-md";

  return (
    <header className="w-full bg-[#0a0a11] border-b border-pink-500/30 shadow-lg shadow-pink-500/10">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo / Home link */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold shadow-lg shadow-pink-500/30">
            S
          </div>
          <span className="text-xl font-extrabold text-pink-200 tracking-wide drop-shadow">
            SWEat Web
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={`${baseLink} ${
              isActive("/dashboard") ? active : inactive
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/bmi"
            className={`${baseLink} ${
              isActive("/bmi") ? active : inactive
            }`}
          >
            BMI
          </Link>

          <Link
            href="/calories"
            className={`${baseLink} ${
              isActive("/calories") ? active : inactive
            }`}
          >
            Calories
          </Link>

          {!hasToken && (
            <>
              <Link
                href="/login"
                className={`${baseLink} ${
                  isActive("/login") ? active : inactive
                }`}
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className={`${baseLink} border border-pink-500/60 text-pink-200 hover:bg-pink-600/30`}
              >
                Sign Up
              </Link>
            </>
          )}

          {hasToken && (
            <Link
              href="/logout"
              className={`${baseLink} border border-red-500/60 text-red-300 hover:bg-red-800/40`}
            >
              Logout
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
