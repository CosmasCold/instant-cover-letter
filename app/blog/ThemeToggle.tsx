"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const isDark = saved !== null ? saved === "true" : true;
    setDark(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("darkMode", next.toString());
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${
  dark
    ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm"
}`}
    >
      {dark ? "☀️ Light mode" : "🌙 Dark mode"}
    </button>
  );
}