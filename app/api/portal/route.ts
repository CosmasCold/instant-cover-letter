import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function verifyAndExtract(signed: string | undefined): string | null {
  if (!signed) return null;
  const [value, sig] = signed.split(".");
  if (!value || !sig) return null;
  const hmac = crypto.createHmac("sha256", process.env.COOKIE_SECRET!);
  hmac.update(value);
  if (hmac.digest("hex") !== sig) return null;
  return value;
}

export async function POST(req: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Try customer_token first
    let customerId = verifyAndExtract(req.cookies.get("customer_token")?.value);

    // Fallback: derive customer ID from pro_token (subscription ID)
    if (!customerId) {
      const subscriptionId = verifyAndExtract(req.cookies.get("pro_token")?.value);
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        customerId = subscription.customer as string;
      }
    }

    if (!customerId) {
      return NextResponse.json(
        { error: "Not a Pro customer" },
        { status: 401 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: baseUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Portal error:", err);
    return NextResponse.json({ error: "Could not open portal" }, { status: 500 });
  }
}