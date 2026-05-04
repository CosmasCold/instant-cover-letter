import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function signCookie(value: string): string {
  const hmac = crypto.createHmac("sha256", process.env.COOKIE_SECRET!);
  hmac.update(value);
  return `${value}.${hmac.digest("hex")}`;
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid" && session.subscription && session.customer) {
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      const proToken = signCookie(subscriptionId);
      const customerToken = signCookie(customerId);

      const res = NextResponse.json({ pro: true });

      res.cookies.set("pro_token", proToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });

      res.cookies.set("customer_token", customerToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });

      return res;
    }

    return NextResponse.json({ pro: false });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}