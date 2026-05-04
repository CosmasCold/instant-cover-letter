import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, experience, name } = await req.json();

    if (!jobDescription || !experience) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `You are a professional career coach. Write a compelling, concise cover letter (under 300 words) for the following job. Make it confident, specific, and avoid clichés like "I am writing to apply".

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
    return NextResponse.json({ letter });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to generate letter" },
      { status: 500 }
    );
  }
}