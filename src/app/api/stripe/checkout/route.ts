import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type { Plan } from "@/generated/prisma/client";

const TIER_TO_PLAN: Record<string, Plan> = {
  STUDENT_PRO: "STUDENT_PRO",
  SCHOOL: "SCHOOL",
  COMPETITION_PREP: "COMPETITION_PREP",
};

const TIER_TO_PRICE_ENV: Record<string, string | undefined> = {
  STUDENT_PRO: process.env.STRIPE_PRICE_STUDENT_PRO,
  SCHOOL: process.env.STRIPE_PRICE_SCHOOL,
  COMPETITION_PREP: process.env.STRIPE_PRICE_COMPETITION,
};

const checkoutSchema = z.object({
  tier: z.enum(["STUDENT_PRO", "SCHOOL", "COMPETITION_PREP"]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = checkoutSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { tier } = parsed.data;

  const priceId = TIER_TO_PRICE_ENV[tier];
  if (!priceId) {
    return NextResponse.json({ error: "This plan isn't configured yet" }, { status: 500 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId: user.id, tier, plan: TIER_TO_PLAN[tier] },
    subscription_data: { metadata: { userId: user.id, plan: TIER_TO_PLAN[tier] } },
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/#pricing`,
  });

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }

  return NextResponse.json({ url: checkoutSession.url });
}
