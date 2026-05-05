"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
}

export default function BlogIndexClient({ posts }: { posts: PostMeta[] }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) setDarkMode(saved === "true");
  }, []);

  const dm = darkMode;

  const toggle = () => {
    const next = !dm;
    setDarkMode(next);
    localStorage.setItem("darkMode", next.toString());
  };

  const mutedText = dm ? "text-slate-400" : "text-slate-500";
  const headingText = dm ? "text-white" : "text-slate-900";
  const card = dm
    ? "bg-white/5 hover:bg-white/10 border-white/10"
    : "bg-white hover:bg-slate-50 border-slate-200 shadow-sm";

  return (
    <main
      className={`min-h-screen ${
        dm ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } py-16 px-4 transition-colors duration-300`}
    >
      <div className="max-w-3xl mx-auto">

        {/* Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggle}
            aria-label={dm ? "Switch to light mode" : "Switch to dark mode"}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${
              dm
                ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm"
            }`}
          >
            {dm ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
        </div>

        <Link
          href="/"
          className={`text-sm mb-8 inline-block transition ${
            dm ? "text-indigo-300 hover:text-indigo-200" : "text-indigo-500 hover:text-indigo-700"
          }`}
        >
          ← Back to home
        </Link>

        <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${headingText}`}>
          Career & Cover Letter Blog
        </h1>
        <p className={`mb-12 ${mutedText}`}>
          Real, no-fluff advice on cover letters, resumes, and job searching.
        </p>

        {posts.length === 0 ? (
          <p className={mutedText}>
            New posts coming soon. In the meantime, try the{" "}
            <Link
              href="/"
              className={`hover:underline ${dm ? "text-indigo-300" : "text-indigo-500"}`}
            >
              free cover letter generator
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`block border rounded-2xl p-6 transition ${card}`}
              >
                <p className={`text-xs mb-2 ${mutedText}`}>{post.date}</p>
                <h2 className={`text-2xl font-bold mb-2 ${headingText}`}>
                  {post.title}
                </h2>
                <p className={`text-sm ${mutedText}`}>{post.description}</p>
                <span
                  className={`inline-block mt-3 text-sm font-semibold ${
                    dm ? "text-indigo-300" : "text-indigo-500"
                  }`}
                >
                  Read article →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}