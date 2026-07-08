import Link from "next/link";
import {
  MessageSquare,
  Globe2,
  Mic2,
  Briefcase,
  ChevronRight,
  CreditCard,
  GraduationCap,
  Check,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { PricingCard } from "@/components/ui/PricingCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { HeroTranscript } from "@/components/marketing/HeroTranscript";
import type { PaidTier } from "@/components/UpgradeButton";

interface PricingTier {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaTier?: PaidTier;
  featured?: boolean;
}

const DISCIPLINES = [
  {
    icon: MessageSquare,
    title: "Debate",
    description:
      "Master argument structure, cross-ex, and competitive strategy across three progressive levels.",
    href: "/debate",
  },
  {
    icon: Globe2,
    title: "Model UN",
    description:
      "Research your country, write position papers, and negotiate blocs with committee-ready confidence.",
    href: "/model-un",
  },
  {
    icon: Mic2,
    title: "Public Speaking",
    description:
      "Build pacing, clarity, and presence with feedback on every speech — from self-intros to TEDx talks.",
    href: "/public-speaking",
  },
  {
    icon: Briefcase,
    title: "Real-World Track",
    description:
      "Job interviews, elevator pitches, and advocacy — the same coaching engine applied beyond the tournament.",
    href: "/public-speaking",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Tell us where you're starting",
    desc: "A two-minute survey on your experience and goals builds your first learning plan.",
  },
  {
    step: "02",
    title: "Work through structured lessons",
    desc: "Levels built for your stage — from first arguments to tournament-grade strategy.",
  },
  {
    step: "03",
    title: "Practice live with your coach",
    desc: "Cross-ex, speeches, committee sessions — your coach responds in real time.",
  },
  {
    step: "04",
    title: "See your skill score",
    desc: "Every session ends with a scored breakdown and exactly what to fix next.",
  },
];

const PRICING: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "/mo",
    description: "Try one discipline with basic feedback.",
    features: [
      "5 sessions per month",
      "One discipline of your choice",
      "Basic AI feedback",
    ],
    ctaLabel: "Start for free",
    ctaHref: "/onboarding",
  },
  {
    name: "Student Pro",
    price: "$9.99",
    cadence: "/mo",
    description: "Full access for one student, every discipline.",
    features: [
      "Unlimited sessions",
      "All disciplines + real-world track",
      "Progress tracking across levels",
    ],
    ctaLabel: "Get Student Pro",
    ctaHref: "/onboarding",
    ctaTier: "STUDENT_PRO",
    featured: true,
  },
  {
    name: "School License",
    price: "$7",
    cadence: "/student/mo",
    description: "Everything in Pro, built for a classroom.",
    features: [
      "Everything in Student Pro",
      "Teacher dashboard",
      "Class assignments",
      "Bulk reporting",
    ],
    ctaLabel: "Bring it to your school",
    ctaHref: "/onboarding",
    ctaTier: "SCHOOL",
  },
  {
    name: "Competition Prep",
    price: "$29",
    cadence: "/mo",
    description: "Pro, tuned for tournament season.",
    features: [
      "Everything in Student Pro",
      "Tournament simulation",
      "Case-building tools",
      "Judge-style feedback",
    ],
    ctaLabel: "Prep for competition",
    ctaHref: "/onboarding",
    ctaTier: "COMPETITION_PREP",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1 — Hero */}
      <Section width="wide" className="pt-20 sm:pt-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge variant="maroon" className="mb-6">
              Personalized coaching for every student
            </Badge>
            <h1 className="font-display text-display-1 font-semibold tracking-tight text-ink">
              Speak up.
              <br />
              Stand out.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Your always-on coach for debate, Model UN, and public speaking —
              live rebuttals, judge-style feedback, and a skill score after
              every session.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/onboarding" size="lg">
                Get Started — It&apos;s Free
                <ChevronRight size={16} />
              </ButtonLink>
              <ButtonLink href="#pricing" variant="secondary" size="lg">
                See pricing
              </ButtonLink>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-stone">
              <CreditCard size={13} /> No credit card required
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroTranscript />
          </div>
        </div>
      </Section>

      {/* Trust strip */}
      <div className="border-y border-ink/10 bg-paper-dim px-6 py-6">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {[
            ["3", "Debate levels"],
            ["4", "Model UN sections"],
            ["100%", "Personalized"],
            ["24/7", "Available"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-2xl font-semibold text-ink">{value}</p>
              <p className="text-xs text-stone">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2 — The cost problem (signature moment) */}
      <section className="bg-ink px-6 py-28 text-paper sm:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              The cost of getting good
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-display text-display-1 font-semibold leading-[0.98] tracking-tight">
              <CountUp value={6380} prefix="$" />
              <span className="text-paper/40"> – </span>
              <CountUp value={10280} prefix="$" />
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
              That&apos;s what private coaching costs one student, one year —
              and even paying students rarely learn to use these skills
              outside the tournament.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-xl font-display text-2xl font-medium text-paper">
              SpeakUp AI coaches on every one of those skills, 24/7, starting
              at <span className="text-gold">$0</span>.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3 — Disciplines + real-world track */}
      <Section width="wide">
        <Reveal>
          <div className="mb-14 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-maroon">
              Four paths
            </p>
            <h2 className="font-display text-display-2 font-semibold tracking-tight text-ink">
              One coaching engine, every room that matters.
            </h2>
          </div>
        </Reveal>

        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DISCIPLINES.map(({ icon: Icon, title, description, href }) => (
            <StaggerItem key={title}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-lg border border-ink/10 bg-paper p-6 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-maroon/10 text-maroon">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {description}
                </p>
                <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-maroon transition-all group-hover:gap-2">
                  Explore <ChevronRight size={14} />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* 4 — How a session works */}
      <Section width="wide" surface="dim">
        <Reveal>
          <div className="mb-14 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-maroon">
              How it works
            </p>
            <h2 className="font-display text-display-2 font-semibold tracking-tight text-ink">
              From first session to skill score.
            </h2>
          </div>
        </Reveal>

        <StaggerGroup className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ step, title, desc }) => (
            <StaggerItem key={step}>
              <span className="font-display text-4xl font-semibold text-maroon/30">
                {step}
              </span>
              <h3 className="mt-3 text-base font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{desc}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* 5 — Pricing */}
      <Section id="pricing" width="wide" className="scroll-mt-24">
        <Reveal>
          <div className="mb-14 max-w-xl text-center sm:mx-auto">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-maroon">
              Pricing
            </p>
            <h2 className="font-display text-display-2 font-semibold tracking-tight text-ink">
              Every tier, one coaching engine.
            </h2>
          </div>
        </Reveal>

        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING.map((tier) => (
            <StaggerItem key={tier.name}>
              <PricingCard {...tier} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-start gap-4 rounded-lg border border-gold/30 bg-gold/5 p-6 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gold/15 text-[#8a6b28]">
              <GraduationCap size={20} />
            </div>
            <div className="flex-1">
              <p className="font-display text-base font-semibold text-ink">
                Running a class or club?
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                School License includes a full teacher dashboard — assign
                practice, track class-wide progress, and export bulk reports.
              </p>
            </div>
            <ButtonLink href="/onboarding" variant="secondary">
              For schools
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      {/* 6 — Final CTA */}
      <Section width="narrow" className="text-center">
        <Reveal>
          <h2 className="font-display text-display-2 font-semibold tracking-tight text-ink">
            Ready to find your voice?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-soft">
            Set up your profile in two minutes and get a personalized learning
            plan built around your goals.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <ButtonLink href="/onboarding" size="lg">
              Start for Free <ChevronRight size={16} />
            </ButtonLink>
            <p className="flex items-center gap-1.5 text-xs text-stone">
              <Check size={13} /> No credit card required
            </p>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
