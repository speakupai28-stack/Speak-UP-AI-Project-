SpeakUp AI is a Next.js 16 (App Router) coaching platform for debate, Model UN, and public speaking — real accounts, server-side progress tracking, and Stripe subscriptions, with Claude powering every feedback surface.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** for styling, **Framer Motion** for the animation layer
- **Prisma 7** + **Postgres** (driver adapter: `@prisma/adapter-pg`) for persistence
- **Auth.js v5** (Credentials provider + `@auth/prisma-adapter`, JWT sessions)
- **Stripe** for subscription billing
- **Anthropic Claude** (`@anthropic-ai/sdk`) for every AI coaching feature

## Local development

1. Copy the env template and fill in real values:

   ```bash
   cp .env.example .env.local
   ```

2. Install dependencies (this also runs `prisma generate` via `postinstall`):

   ```bash
   npm install
   ```

3. Get a local Postgres running. The simplest option is Prisma's built-in dev server (no Docker required):

   ```bash
   npx prisma dev
   ```

   Point `DATABASE_URL` in `.env.local` at the connection string it prints, then push the schema:

   ```bash
   npm run db:push
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Create an account through the onboarding flow — that's what seeds your `User`, `OnboardingProfile`, `DebateProgress`, and `SpeakingProgress` rows.

Without `ANTHROPIC_API_KEY` set, every AI coaching call (onboarding profile generation, practice feedback, the Coach chat, sparring) will fail — everything else (auth, progress persistence, billing routes) works independently of it.

## Environment variables

See `.env.example` for the full list with inline comments. In short:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | Auth.js session encryption secret (`openssl rand -base64 32`) |
| `ANTHROPIC_API_KEY` | Powers every coaching/feedback feature |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe API + webhook signature verification |
| `STRIPE_PRICE_STUDENT_PRO`, `STRIPE_PRICE_SCHOOL`, `STRIPE_PRICE_COMPETITION` | Price IDs for the three paid tiers |
| `NEXT_PUBLIC_APP_URL` | Base URL used to build Stripe checkout/portal redirect links |

## Connecting to Vercel

1. **Database** — In the Vercel project, add the **Neon Postgres** integration (Storage tab → Create Database → Neon). This sets `DATABASE_URL` for you; copy that same value into `.env.local` for local development against the same database, or keep using a separate local Postgres and only point production at Neon.

2. **Run migrations against the real database** — once `DATABASE_URL` points at Neon:

   ```bash
   npx prisma migrate deploy
   ```

   (Use `migrate dev` locally to create new migrations as the schema evolves; `migrate deploy` is the non-interactive command for applying existing migrations to a shared/production database.)

3. **Auth** — generate a secret and set it as an environment variable on the Vercel project (Project Settings → Environment Variables):

   ```bash
   openssl rand -base64 32
   ```

   Set it as `AUTH_SECRET` for the Production (and Preview, if used) environment.

4. **Anthropic** — set `ANTHROPIC_API_KEY` in the same Environment Variables panel.

5. **Stripe** — in the Stripe Dashboard (test mode while developing, live mode for production):
   - Create three recurring Prices (Student Pro, School License, Competition Prep) and set their IDs as `STRIPE_PRICE_STUDENT_PRO` / `STRIPE_PRICE_SCHOOL` / `STRIPE_PRICE_COMPETITION`.
   - Copy the API secret key into `STRIPE_SECRET_KEY`.
   - Add a webhook endpoint pointing at `https://<your-domain>/api/stripe/webhook`, subscribed to `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
   - Once keys are live, manually verify: run a test Checkout for each tier, confirm a `Subscription` row is created and `User.plan` updates, then confirm the Billing Portal link (from `/api/stripe/portal`) opens and lets you cancel/manage the subscription.

6. **App URL** — set `NEXT_PUBLIC_APP_URL` to your production domain (e.g. `https://speakup.ai`) so Stripe checkout/portal redirects land in the right place.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Auth.js Documentation](https://authjs.dev)
- [Stripe Checkout Documentation](https://docs.stripe.com/payments/checkout)
