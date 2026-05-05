"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";

interface ToastItem {
  id: number;
  msg: string;
  type: string;
}

interface FaqItemProps {
  q: string;
  a: string;
  dm: boolean;
}

function Toast({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-in pointer-events-auto ${
            t.type === "success"
              ? "bg-emerald-500 text-white"
              : t.type === "info"
              ? "bg-indigo-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function FAQItem({ q, a, dm }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all ${
        dm ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={`w-full text-left p-5 font-semibold flex justify-between items-center transition ${
          dm ? "text-white hover:bg-white/5" : "text-slate-900 hover:bg-slate-50"
        }`}
      >
        <span>{q}</span>
        <span className={`ml-4 text-xl transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className={`px-5 pb-5 text-sm leading-relaxed ${dm ? "text-slate-300" : "text-slate-600"}`}>
          {a}
        </p>
      </div>
    </div>
  );
}

const faqData = [
  {
    q: "Is InstantCoverLetter.ai really free?",
    a: "Yes. The free tier gives you 2 cover letters per day, no signup or credit card required. Pro (\$7/month) unlocks unlimited generations and tone selection.",
  },
  {
    q: "Will my cover letter pass ATS systems?",
    a: "Yes. Our AI generates plain text letters with industry-standard formatting that ATS systems can parse easily. For best results, pair with an ATS-optimized resume.",
  },
  {
    q: "Do you store my resume or job description data?",
    a: "No. Your input is sent to our AI provider only to generate your letter. We don't save it on our servers afterward. See our Privacy Policy for full details.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "We use a specialized prompt optimized specifically for cover letters. No setup, no prompt engineering — just paste your background and job description and get a polished result in 3 seconds.",
  },
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: 'Yes, anytime. Click "Manage subscription" while logged in as Pro and you\'ll be redirected to Stripe\'s portal where you can cancel in one click.',
  },
];

export default function Home() {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [linkedInAbout, setLinkedInAbout] = useState("");
  const [tone, setTone] = useState("Professional");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPro, setIsPro] = useState<boolean>(() => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isPro") === "true";
});
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [lettersRemaining, setLettersRemaining] = useState(2);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("darkMode");
  return saved !== null ? saved === "true" : true;
});
  const [isSample, setIsSample] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);
    const addToast = (msg: string, type: string = "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

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
              localStorage.setItem("isPro", "true");
              addToast("🎉 Welcome to Pro! Enjoy unlimited cover letters.", "success");
              window.history.replaceState({}, "", "/");
            }
          });
      }
    }
  }, []);

  useEffect(() => {
  if (letter) {
    setTimeout(
      () => letterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      100
    );
  }
}, [letter]);

const wordCount = letter.trim().split(/\s+/).filter(Boolean).length;

  const handleGenerate = async () => {
    if (!experience.trim() || !jobDescription.trim()) {
      addToast("Please fill in your experience and the job description.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // NOTE: Add linkedInAbout to your /api/generate prompt handler
        body: JSON.stringify({ name, experience, jobDescription, linkedInAbout, tone }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setLettersRemaining(0);
        setShowUpgrade(true);
        return;
      }
      if (data.letter) {
        setLetter(data.letter);
        if (data.isPro) {
          setIsPro(true);
          localStorage.setItem("isPro", "true");
        }
        // NOTE: Return `remaining` from /api/generate to keep this counter accurate
        if (data.remaining !== undefined) setLettersRemaining(data.remaining);
        addToast("✨ Cover letter generated!", "success");
      } else {
        addToast("Something went wrong. Try again.");
      }
    } catch {
      addToast("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else addToast("Could not start checkout. Try again.");
    } catch {
      addToast("Network error.");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else addToast("Could not open subscription portal. Try again.");
    } catch {
      addToast("Network error.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    addToast("📋 Copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

 const handleDownload = () => {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setLineHeightFactor(1.6);
  const lines = doc.splitTextToSize(letter, maxWidth);
  doc.text(lines, margin, margin + 10);
  doc.save(`cover-letter${name ? `-${name.replace(/\s+/g, "-").toLowerCase()}` : ""}.pdf`);
  addToast("📄 PDF downloaded!", "success");
};

  const handleClear = () => {
  setName("");
  setExperience("");
  setJobDescription("");
  setLinkedInAbout("");
  setTone("Professional");
  setLetter("");
  setIsSample(false); // ← ADD THIS
  addToast("Form cleared.", "info");
};

  const handleShare = (platform: string) => {
    const text =
      "Just generated my cover letter with InstantCoverLetter.ai — free AI cover letters in seconds! 🚀";
    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://instant-cover-letter-steel.vercel.app`,
        "_blank"
      );
    } else if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=https://instant-cover-letter-steel.vercel.app`,
        "_blank"
      );
    }
  };

  const fillExample = () => {
  setName("Alex Johnson");
  setExperience(
    "5 years of experience as a software engineer. Proficient in React, Node.js, and TypeScript. Previously at Acme Corp where I led a team of 4 engineers to ship a customer dashboard that reduced support tickets by 30%. Strong communicator and agile practitioner."
  );
  setJobDescription(
    "We are looking for a Senior Frontend Engineer to join our product team. You will build scalable React applications, collaborate with designers, and mentor junior engineers. Requirements: 4+ years of React experience, TypeScript proficiency, strong communication skills."
  );
  setLinkedInAbout(
    "Passionate software engineer with 5+ years building products users love. I thrive at the intersection of design and engineering."
  );
  setIsSample(true);
  setLetter(`Dear Hiring Manager,

As a software engineer with five years of experience building high-impact products, I was excited to come across your Senior Frontend Engineer role. My background in React, TypeScript, and Node.js aligns closely with what your team is looking for, and I'd love to bring that expertise to your product.

At Acme Corp, I led a team of four engineers to deliver a customer dashboard that reduced support tickets by 30% — a project that required both technical depth and clear communication across design, product, and engineering teams. I'm comfortable owning complex frontend architecture while also mentoring the engineers around me.

What draws me to this role specifically is the opportunity to build scalable React applications in a collaborative environment. I thrive when design and engineering work closely together, and I'm at my best when I can balance shipping quality work with helping teammates grow.

I'd love to talk more about how I can contribute to your team.

Best regards,
Alex Johnson`);
  addToast("Sample loaded — no letters used! Click Generate to create your own.", "info");
};

  const dm = darkMode;
  const card = dm ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl";
  const inputCls = dm
    ? "bg-slate-900/60 border-white/10 text-slate-100 placeholder-slate-500"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400";
  const labelCls = `block text-sm font-semibold mb-2 ${dm ? "text-slate-200" : "text-slate-700"}`;
  const mutedText = dm ? "text-slate-400" : "text-slate-500";
  const headingText = dm ? "text-white" : "text-slate-900";
    return (
    <main
      className={`min-h-screen ${
        dm ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } py-16 px-4 relative overflow-hidden transition-colors duration-300`}
    >
      {/* FAQ JSON-LD for SEO rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      {/* Toasts */}
      <Toast toasts={toasts} />

      {/* Background blobs */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] ${
          dm ? "bg-indigo-600/20" : "bg-indigo-400/10"
        } rounded-full blur-3xl pointer-events-none`}
      />
      <div
        className={`absolute bottom-0 right-0 w-[500px] h-[500px] ${
          dm ? "bg-purple-600/20" : "bg-purple-400/10"
        } rounded-full blur-3xl pointer-events-none`}
      />

      <div className="max-w-3xl mx-auto relative">

        {/* Dark / Light toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
  const next = !dm;
  setDarkMode(next);
  localStorage.setItem("darkMode", next.toString());
}}
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

        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 flex-wrap justify-center">
            <div
              className={`px-4 py-1.5 border rounded-full text-xs font-medium backdrop-blur ${
                dm
                  ? "bg-white/5 border-white/10 text-indigo-300"
                  : "bg-indigo-50 border-indigo-200 text-indigo-600"
              }`}
            >
              {isPro ? "💎 PRO MEMBER · Unlimited" : "⚡ Powered by AI · 100% Free"}
            </div>
            {isPro && (
              <button
                onClick={handleManageSubscription}
                className={`px-3 py-1.5 border rounded-full text-xs font-medium backdrop-blur transition ${
                  dm
                    ? "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white"
                    : "bg-white hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                Manage subscription
              </button>
            )}
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r ${
  dm
    ? "from-white via-indigo-200 to-purple-300"
    : "from-indigo-600 via-purple-600 to-indigo-800"
}`}>
  InstantCoverLetter.ai
</h1>
          <p className={`text-lg max-w-xl mx-auto ${mutedText}`}>
            Land more interviews with cover letters tailored to every job — generated in seconds.
          </p>
        </header>

        {/* Form Card */}
        <div className={`backdrop-blur-xl border rounded-3xl shadow-2xl p-8 space-y-6 ${card}`}>

          {/* Letters remaining banner */}
          {!isPro && (
            <div
              className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg ${
                dm ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"
              }`}
            >
              <span>Free tier</span>
              <span
                className={
                  lettersRemaining === 0
                    ? "text-red-400 font-semibold"
                    : lettersRemaining === 1
                    ? "text-yellow-400 font-semibold"
                    : "text-emerald-400 font-semibold"
                }
              >
                {lettersRemaining} letter{lettersRemaining !== 1 ? "s" : ""} remaining today
              </span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className={labelCls}>
              Your Name <span className={`font-normal ${mutedText}`}>(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition ${inputCls}`}
            />
          </div>

          {/* Experience */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-sm font-semibold ${dm ? "text-slate-200" : "text-slate-700"}`}>
                Your Experience / Background
              </label>
              <button
                onClick={fillExample}
                className={`text-xs underline underline-offset-2 transition ${
                  dm ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-500 hover:text-indigo-700"
                }`}
              >
                Try an example
              </button>
            </div>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Paste your resume or describe your skills, past roles, achievements..."
              rows={5}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition resize-none ${inputCls}`}
            />
          </div>

          {/* Job Description */}
          <div>
            <label className={labelCls}>Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting here..."
              rows={6}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition resize-none ${inputCls}`}
            />
          </div>

          {/* LinkedIn About */}
          <div>
            <label className={`flex items-center gap-2 ${labelCls}`}>
              LinkedIn &quot;About&quot; Section
              <span className={`text-xs font-normal ${mutedText}`}>(optional)</span>
            </label>
            <textarea
              value={linkedInAbout}
              onChange={(e) => setLinkedInAbout(e.target.value)}
              placeholder="Paste your LinkedIn About section for a more personalized letter..."
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition resize-none ${inputCls}`}
            />
          </div>

          {/* Tone */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-semibold mb-2 ${dm ? "text-slate-200" : "text-slate-700"}`}>
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
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed ${inputCls}`}
            >
              <option>Professional</option>
              <option>Casual</option>
              <option>Bold</option>
              <option>Creative</option>
            </select>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2 justify-center">
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  role="status"
                  aria-label="Generating cover letter"
                />
                Generating your letter...
              </span>
            ) : (
              "✨ Generate Cover Letter"
            )}
          </button>
          <button
  onClick={handleClear}
  className={`w-full py-2.5 rounded-xl text-sm font-medium transition border ${
    dm
      ? "border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5"
      : "border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
  }`}
>
  🗑️ Clear form
</button>
        </div>

        {/* Upgrade Modal */}
        {showUpgrade && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-title"
          >
            <div
              className={`border rounded-3xl p-8 max-w-md w-full text-center ${
                dm ? "bg-slate-900 border-white/10" : "bg-white border-slate-200 shadow-2xl"
              }`}
            >
              <div className="text-5xl mb-3">💎</div>
              <h2 id="upgrade-title" className={`text-2xl font-bold mb-2 ${headingText}`}>
                Daily limit reached
              </h2>
              <p className={`mb-6 ${mutedText}`}>
                Free users get 2 letters per day. Upgrade to Pro for unlimited generations + tone selection.
              </p>
              <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-2xl p-5 mb-6">
                <div className={`text-3xl font-bold ${headingText}`}>
                  $7<span className={`text-lg ${mutedText}`}>/month</span>
                </div>
                <ul className={`text-sm mt-3 space-y-1 text-left ${dm ? "text-slate-300" : "text-slate-600"}`}>
                  <li>✓ Unlimited cover letters</li>
                  <li>✓ 4 tone styles (Professional / Casual / Bold / Creative)</li>
                  <li>✓ Cancel anytime</li>
                </ul>
              </div>
              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl mb-2 transition"
              >
                Upgrade to Pro →
              </button>
              <button
                onClick={() => setShowUpgrade(false)}
                className={`w-full text-sm py-2 transition ${
                  dm ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Maybe later
              </button>
            </div>
          </div>
        )}

       {letter && (
  <div
    ref={letterRef}
    className={`mt-8 backdrop-blur-xl border rounded-3xl shadow-2xl p-8 animate-fade-in ${card}`}
  >
    {/* Sample banner */}
    {isSample && (
      <div className={`flex items-center gap-3 mb-5 px-4 py-3 rounded-xl border text-sm ${
        dm
          ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-300"
          : "bg-yellow-50 border-yellow-300 text-yellow-700"
      }`}>
        <span className="text-lg">👀</span>
        <div>
          <span className="font-semibold">This is a sample letter.</span>
          <span className={`ml-1 ${dm ? "text-yellow-400/70" : "text-yellow-600"}`}>
            Fill in your own details and click Generate to create yours — free, no signup needed.
          </span>
        </div>
      </div>
    )}

    {/* Toolbar */}
    <div className="flex flex-wrap justify-between items-start mb-5 gap-3">
      <div>
        <h2 className={`text-2xl font-bold ${headingText}`}>Your Cover Letter</h2>
        <p className={`text-xs mt-1 ${mutedText}`}>{wordCount} words</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleGenerate}
          disabled={loading}
          aria-label="Regenerate cover letter"
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${
            dm
              ? "bg-white/10 hover:bg-white/20 text-slate-200"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          🔄 Regenerate
        </button>
        <button
          onClick={handleDownload}
          aria-label="Download cover letter as text file"
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
            dm
              ? "bg-white/10 hover:bg-white/20 text-slate-200"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          ⬇️ Download PDF
        </button>
        <button
          onClick={handleCopy}
          aria-label={copied ? "Copied to clipboard" : "Copy cover letter to clipboard"}
          aria-live="polite"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          {copied ? "✓ Copied!" : "📋 Copy"}
        </button>
      </div>
    </div>

    {/* Letter text */}
    <pre
      className={`whitespace-pre-wrap font-sans leading-relaxed text-[15px] ${
        dm ? "text-slate-200" : "text-slate-700"
      }`}
    >
      {letter}
    </pre>

    {/* Share buttons */}
    <div
      className={`mt-6 pt-5 border-t flex items-center gap-3 flex-wrap ${
        dm ? "border-white/10" : "border-slate-100"
      }`}
    >
      <span className={`text-xs font-semibold ${mutedText}`}>Share the tool:</span>
      <button
        onClick={() => handleShare("twitter")}
        aria-label="Share on X (Twitter)"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] border border-[#1DA1F2]/30 rounded-lg text-xs font-semibold transition"
      >
        𝕏 Share on X
      </button>
      <button
        onClick={() => handleShare("linkedin")}
        aria-label="Share on LinkedIn"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-[#0A66C2] border border-[#0A66C2]/30 rounded-lg text-xs font-semibold transition"
      >
        in Share on LinkedIn
      </button>
    </div>
  </div>
)}

        {/* Pro upsell strip */}
        {letter && !isPro && (
          <div className="mt-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-3xl p-6 text-center">
            <p className={`font-semibold mb-2 ${headingText}`}>
              💎 Unlock unlimited generations + tone styles
            </p>
            <button
              onClick={handleUpgrade}
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-6 py-2.5 rounded-xl transition"
            >
              Upgrade to Pro · \$7/mo
            </button>
          </div>
        )}
                {/* Affiliate Tools Section */}
        <div className={`mt-12 backdrop-blur-xl border rounded-3xl p-6 md:p-8 ${card}`}>
          <h3 className={`text-center font-bold text-lg mb-1 ${headingText}`}>
            🚀 Land the job — recommended next steps
          </h3>
          <p className={`text-center text-sm mb-6 ${mutedText}`}>
            Tools we trust to give you an edge in your job search
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://resumeio.sjv.io/2RW0ZO"
              target="_blank"
              rel="noopener sponsored"
              className={`block p-5 border rounded-2xl transition group ${
                dm
                  ? "bg-slate-900/60 hover:bg-slate-800/60 border-white/10 hover:border-indigo-400/40"
                  : "bg-slate-50 hover:bg-white border-slate-200 hover:border-indigo-300 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📄</span>
                <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full">
                  DIY BUILDER
                </span>
              </div>
              <h4 className={`font-bold mb-1 group-hover:text-indigo-400 transition ${headingText}`}>
                Resume.io
              </h4>
              <p className={`text-sm mb-3 ${mutedText}`}>
                Build a polished, ATS-friendly resume in minutes with 30+ templates.
              </p>
              <span className="text-xs text-indigo-400 font-semibold">Build my resume →</span>
            </a>
            <a
              href="https://topresume.sjv.io/YVy36J"
              target="_blank"
              rel="noopener sponsored"
              className={`block p-5 border rounded-2xl transition group ${
                dm
                  ? "bg-slate-900/60 hover:bg-slate-800/60 border-white/10 hover:border-purple-400/40"
                  : "bg-slate-50 hover:bg-white border-slate-200 hover:border-purple-300 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👔</span>
                <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                  EXPERT REVIEW
                </span>
              </div>
              <h4 className={`font-bold mb-1 group-hover:text-purple-400 transition ${headingText}`}>
                TopResume
              </h4>
              <p className={`text-sm mb-3 ${mutedText}`}>
                Get a free expert review from a certified resume writer. Used by millions.
              </p>
              <span className="text-xs text-purple-400 font-semibold">Get my free review →</span>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className={`text-3xl font-bold text-center mb-8 ${headingText}`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqData.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} dm={dm} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`mt-12 pt-6 border-t text-center space-y-4 ${
            dm ? "border-white/10" : "border-slate-200"
          }`}
        >
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

          {/* Footer links */}
          <div className={`text-xs ${mutedText}`}>
            <Link href="/blog" className="hover:text-indigo-400 transition">
              Blog
            </Link>
            <span className="mx-2">·</span>
            <Link href="/privacy" className="hover:text-indigo-400 transition">
              Privacy Policy
            </Link>
            <span className="mx-2">·</span>
            <a
              href="mailto:coldcosmas@gmail.com"
              className="hover:text-indigo-400 transition"
            >
              Contact
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}