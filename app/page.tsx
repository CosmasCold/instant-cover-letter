"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      const sessionId = params.get("session_id");
      if (sessionId) {
        fetch("/api/verify-pro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.pro) {
              setIsPro(true);
              alert("🎉 Welcome to Pro! Enjoy unlimited cover letters.");
              window.history.replaceState({}, "", "/");
            }
          });
      }
    }
  }, []);

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
        body: JSON.stringify({ name, experience, jobDescription, tone }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setShowUpgrade(true);
        return;
      }
      if (data.letter) {
        setLetter(data.letter);
        if (data.isPro) setIsPro(true);
      } else {
        alert("Something went wrong. Try again.");
      }
    } catch {
      alert("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Could not start checkout. Try again.");
    } catch {
      alert("Network error.");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Could not open subscription portal. Try again.");
    } catch {
      alert("Network error.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">

        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-indigo-300 backdrop-blur">
              {isPro ? "💎 PRO MEMBER · Unlimited" : "⚡ Powered by AI · 100% Free"}
            </div>
            {isPro && (
              <button
                onClick={handleManageSubscription}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium text-slate-300 hover:text-white backdrop-blur transition"
              >
                Manage subscription
              </button>
            )}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent leading-tight">
            InstantCoverLetter.ai
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Land more interviews with cover letters tailored to every job — generated in seconds.
          </p>
        </header>

        {/* Form */}
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

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-2">
              Tone
              {!isPro && (
                <span className="text-xs px-2 py-0.5 bg-yellow-400/20 text-yellow-300 rounded-full">
                  PRO
                </span>
              )}
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              disabled={!isPro}
              className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option>Professional</option>
              <option>Casual</option>
              <option>Bold</option>
              <option>Creative</option>
            </select>
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

        {/* Upgrade Modal */}
        {showUpgrade && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md text-center">
              <div className="text-5xl mb-3">💎</div>
              <h2 className="text-2xl font-bold mb-2">Daily limit reached</h2>
              <p className="text-slate-400 mb-6">
                Free users get 2 letters per day. Upgrade to Pro for unlimited generations + tone selection.
              </p>
              <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-2xl p-5 mb-6">
                <div className="text-3xl font-bold text-white">
                  \$7<span className="text-lg text-slate-400">/month</span>
                </div>
                <ul className="text-sm text-slate-300 mt-3 space-y-1 text-left">
                  <li>✓ Unlimited cover letters</li>
                  <li>✓ 4 tone styles (Professional/Casual/Bold/Creative)</li>
                  <li>✓ Cancel anytime</li>
                </ul>
              </div>
              <button
                onClick={handleUpgrade}
                className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold py-3 rounded-xl mb-2"
              >
                Upgrade to Pro →
              </button>
              <button
                onClick={() => setShowUpgrade(false)}
                className="w-full text-slate-400 text-sm hover:text-slate-200 py-2"
              >
                Maybe later
              </button>
            </div>
          </div>
        )}

        {/* Letter Output */}
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

        {/* Pro Upsell (free users after generating) */}
        {letter && !isPro && (
          <div className="mt-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-3xl p-6 text-center">
            <p className="text-white font-semibold mb-2">
              💎 Unlock unlimited generations + tone styles
            </p>
            <button
              onClick={handleUpgrade}
              className="inline-block bg-white text-slate-900 hover:bg-slate-200 font-bold px-6 py-2.5 rounded-xl transition"
            >
              Upgrade to Pro · \$7/mo
            </button>
          </div>
        )}

        {/* Resume.io Affiliate CTA (after letter) */}
        {letter && (
          <div className="mt-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-3xl p-6 md:p-8 text-center">
            <div className="inline-block mb-3 px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full text-xs font-semibold text-yellow-300">
              💡 RECOMMENDED NEXT STEP
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Now make your resume match</h3>
            <p className="text-slate-300 mb-5 text-sm md:text-base max-w-md mx-auto">
              A great cover letter needs an ATS-friendly resume to back it up. Build one in minutes.
            </p>
            <a
              href="https://resumeio.sjv.io/2RW0ZO"
              target="_blank"
              rel="noopener sponsored"
              className="inline-block bg-white text-slate-900 hover:bg-slate-200 font-bold px-8 py-3 rounded-xl transition shadow-lg"
            >
              Build my resume on Resume.io →
            </a>
          </div>
        )}

        {/* Affiliate Tools Section */}
        <div className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
          <h3 className="text-center text-white font-bold text-lg mb-1">
            🚀 Land the job — recommended next steps
          </h3>
          <p className="text-center text-slate-400 text-sm mb-6">
            Tools we trust to give you an edge in your job search
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://resumeio.sjv.io/2RW0ZO"
              target="_blank"
              rel="noopener sponsored"
              className="block p-5 bg-slate-900/60 hover:bg-slate-800/60 border border-white/10 hover:border-indigo-400/40 rounded-2xl transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📄</span>
                <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full">
                  DIY BUILDER
                </span>
              </div>
              <h4 className="font-bold text-white group-hover:text-indigo-300 mb-1">Resume.io</h4>
              <p className="text-sm text-slate-400 mb-3">
                Build a polished, ATS-friendly resume in minutes with 30+ templates.
              </p>
              <span className="text-xs text-indigo-300 font-semibold">Build my resume →</span>
            </a>
            <a
              href="https://topresume.sjv.io/YVy36J"
              target="_blank"
              rel="noopener sponsored"
              className="block p-5 bg-slate-900/60 hover:bg-slate-800/60 border border-white/10 hover:border-purple-400/40 rounded-2xl transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👔</span>
                <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                  EXPERT REVIEW
                </span>
              </div>
              <h4 className="font-bold text-white group-hover:text-purple-300 mb-1">TopResume</h4>
              <p className="text-sm text-slate-400 mb-3">
                Get a free expert review from a certified resume writer. Used by millions.
              </p>
              <span className="text-xs text-purple-300 font-semibold">Get my free review →</span>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer">
              <summary className="font-semibold text-white">
                Is InstantCoverLetter.ai really free?
              </summary>
              <p className="mt-3 text-slate-300 text-sm">
                Yes. The free tier gives you 2 cover letters per day, no signup or credit card required.
                Pro (\$7/month) unlocks unlimited generations and tone selection.
              </p>
            </details>
            <details className="bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer">
              <summary className="font-semibold text-white">
                Will my cover letter pass ATS systems?
              </summary>
              <p className="mt-3 text-slate-300 text-sm">
                Yes. Our AI generates plain text letters with industry-standard formatting that ATS
                systems can parse easily. For best results, pair with an ATS-optimized resume.
              </p>
            </details>
            <details className="bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer">
              <summary className="font-semibold text-white">
                Do you store my resume or job description data?
              </summary>
              <p className="mt-3 text-slate-300 text-sm">
                No. Your input is sent to our AI provider only to generate your letter. We don&apos;t
                save it on our servers afterward. See our Privacy Policy for full details.
              </p>
            </details>
            <details className="bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer">
              <summary className="font-semibold text-white">
                How is this different from ChatGPT?
              </summary>
              <p className="mt-3 text-slate-300 text-sm">
                We use a specialized prompt optimized specifically for cover letters. No setup, no
                prompt engineering — just paste your background and job description and get a
                polished result in 3 seconds.
              </p>
            </details>
            <details className="bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer">
              <summary className="font-semibold text-white">
                Can I cancel my Pro subscription anytime?
              </summary>
              <p className="mt-3 text-slate-300 text-sm">
                Yes, anytime. Click &quot;Manage subscription&quot; while logged in as Pro and
                you&apos;ll be redirected to Stripe&apos;s portal where you can cancel in one click.
              </p>
            </details>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center space-y-4">

          {/* Product Hunt Badge */}
          <div className="flex justify-center">
            <a
              href="https://www.producthunt.com/products/instantcoverletter-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-instantcoverletter-ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="InstantCoverLetter.ai - Free AI cover letters in seconds. No signup. | Product Hunt"
                width={250}
                height={54}
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1138932&theme=dark&t=1777999943128"
                style={{ width: "250px", height: "54px" }}
              />
            </a>
          </div>

          {/* Footer Links */}
          <div className="text-slate-500 text-xs">
            <Link href="/blog" className="hover:text-slate-300 transition">
              Blog
            </Link>
            <span className="mx-2">·</span>
            <Link href="/privacy" className="hover:text-slate-300 transition">
              Privacy Policy
            </Link>
            <span className="mx-2">·</span>
            <a
              href="mailto:coldcosmas@gmail.com"
              className="hover:text-slate-300 transition"
            >
              Contact
            </a>
          </div>

        </div>

      </div>
    </main>
  );
}