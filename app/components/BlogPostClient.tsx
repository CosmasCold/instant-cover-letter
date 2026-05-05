"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  title: string;
  description: string;
  date: string;
  contentHtml: string;
}

export default function BlogPostClient({ post }: { post: Post }) {
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
          href="/blog"
          className={`text-sm mb-8 inline-block transition ${
            dm ? "text-indigo-300 hover:text-indigo-200" : "text-indigo-500 hover:text-indigo-700"
          }`}
        >
          ← All articles
        </Link>

        <article>
          <p className={`text-xs mb-3 ${mutedText}`}>{post.date}</p>
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${headingText}`}>
            {post.title}
          </h1>
          <div
            className={`article-content ${dm ? "article-dark" : "article-light"}`}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        <div className="mt-16 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-3xl p-8 text-center">
          <h3 className={`text-2xl font-bold mb-2 ${headingText}`}>
            Need a cover letter right now?
          </h3>
          <p className={`mb-5 ${mutedText}`}>
            Generate a tailored one in seconds. Free, no signup.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transition"
          >
            Try InstantCoverLetter.ai →
          </Link>
        </div>

      </div>
    </main>
  );
}