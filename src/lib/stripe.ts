import Stripe from "stripe";

// Falls back to a placeholder so the module can load (e.g. during build page-data
// collection) before real Stripe keys are configured — routes that call the API
// will still fail with a real Stripe auth error at request time until then.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_not_configured");
