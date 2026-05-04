import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import crypto from "crypto";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const FREE_DAILY_LIMIT = 2;

function verifyCookie(signed: string | undefined): boolean {
  if (!signed) return false;
  const [value, sig] = signed.split(".");
  if (!value || !sig) return false;
  const hmac = crypto.createHmac("sha256", process.env.COOKIE_SECRET!);
  hmac.update(value);
  return hmac.digest("hex") === sig;
}

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, experience, name, tone } = await req.json();

    if (!jobDescription || !experience) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check Pro status
    const proCookie = req.cookies.get("pro_token")?.value;
    const isPro = verifyCookie(proCookie);

    // Free user rate limiting (cookie-based)
    let newUsage: string | null = null;
    if (!isPro) {
      const today = new Date().toISOString().slice(0, 10);
      const usageCookie = req.cookies.get("usage")?.value || "";
      const [storedDate, countStr] = usageCookie.split("|");
      const count = storedDate === today ? parseInt(countStr || "0") : 0;

      if (count >= FREE_DAILY_LIMIT) {
        return NextResponse.json(
          {
            error: "limit",
            message: `Free users get ${FREE_DAILY_LIMIT} letters/day. Upgrade to Pro for unlimited.`,
          },
          { status: 429 }
        );
      }

      newUsage = `${today}|${count + 1}`;
    }

    // Tone (Pro-only feature)
    const toneInstruction =
      isPro && tone ? `Write in a ${tone} tone.` : "Write in a professional tone.";

    const prompt = `You are a professional career coach. Write a compelling, concise cover letter (under 300 words) for the following job. ${toneInstruction} Make it confident, specific, and avoid clichés like "I am writing to apply".

Candidate name: ${name || "the candidate"}

Candidate background and experience:
${experience}

Job description:
${jobDescription}

Write only the cover letter, no preamble.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const letter = completion.choices[0]?.message?.content || "";
    const res = NextResponse.json({ letter, isPro });

    // Set updated usage cookie for free users
    if (!isPro && newUsage) {
      res.cookies.set("usage", newUsage, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return res;
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to generate letter" },
      { status: 500 }
    );
  }
}