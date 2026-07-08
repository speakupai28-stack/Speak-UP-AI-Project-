import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type { Plan } from "@/generated/prisma/client";

const STATUS_MAP: Record<Stripe.Subscription.Status, "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "INCOMPLETE"> = {
  active: "ACTIVE",
  trialing: "TRIALING",
  past_due: "PAST_DUE",
  canceled: "CANCELED",
  incomplete: "INCOMPLETE",
  incomplete_expired: "INCOMPLETE",
  unpaid: "PAST_DUE",
  paused: "CANCELED",
};

async function upsertSubscriptionFromStripe(subscription: Stripe.Subscription, userId: string, plan?: Plan) {
  const priceId = subscription.items.data[0]?.price.id;
  const periodEndSeconds = subscription.items.data[0]?.current_period_end;
  const status = STATUS_MAP[subscription.status] ?? "INCOMPLETE";

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      status,
      currentPeriodEnd: periodEndSeconds ? new Date(periodEndSeconds * 1000) : null,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      status,
      currentPeriodEnd: periodEndSeconds ? new Date(periodEndSeconds * 1000) : null,
    },
  });

  if (plan) {
    await prisma.user.update({ where: { id: userId }, data: { plan } });
  } else if (status === "CANCELED") {
    await prisma.user.update({ where: { id: userId }, data: { plan: "FREE" } });
  }
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const userId = checkoutSession.metadata?.userId ?? checkoutSession.client_reference_id;
      const plan = checkoutSession.metadata?.plan as Plan | undefined;
      if (userId && checkoutSession.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          typeof checkoutSession.subscription === "string"
            ? checkoutSession.subscription
            : checkoutSession.subscription.id
        );
        await upsertSubscriptionFromStripe(subscription, userId, plan);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await upsertSubscriptionFromStripe(subscription, userId);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
