"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!experience.trim() || !jobDescription.trim()) {
      alert("Please fill in your experience and the job description.");
      return;
    }
    setLoading(true);
    setLetter("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, experience, jobDescription }),
      });
      const data = await res.json();
      if (data.letter) setLetter(data.letter);
      else alert("Something went wrong. Try again.");
    } catch {
      alert("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">
        <header className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-indigo-300 backdrop-blur">
            ⚡ Powered by AI · 100% Free
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent leading-tight">
            InstantCoverLetter.ai
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Land more interviews with cover letters tailored to every job — generated in seconds.
          </p>
        </header>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Your Name <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 text-slate-100 placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Your Experience / Background
            </label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Paste your resume or describe your skills, past roles, achievements..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 text-slate-100 placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting here..."
              rows={6}
              className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 text-slate-100 placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating your letter...
              </span>
            ) : (
              "✨ Generate Cover Letter"
            )}
          </button>
        </div>

        {letter && (
          <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-white">Your Cover Letter</h2>
              <button
                onClick={handleCopy}
                className="bg-white text-slate-900 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed text-[15px]">
              {letter}
            </pre>
          </div>
        )}

        <div className="mt-12 text-center text-slate-400 text-sm">
          <p className="mb-3">💼 Boost your job search</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="https://www.ziprecruiter.com/"
              target="_blank"
              rel="noopener"
              className="text-indigo-300 hover:text-indigo-200 hover:underline transition"
            >
              ZipRecruiter →
            </a>
            <a
              href="https://resume.io/"
              target="_blank"
              rel="noopener"
              className="text-indigo-300 hover:text-indigo-200 hover:underline transition"
            >
              Build a Resume →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}