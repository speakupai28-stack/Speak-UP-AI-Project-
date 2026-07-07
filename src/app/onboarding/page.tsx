"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { clsx } from "clsx";
import {
  ChevronRight,
  ChevronLeft,
  Mic2,
  Globe2,
  MessageSquare,
  Trophy,
  BookOpen,
  Sparkles,
  Target,
  CheckCircle2,
  Loader2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressMeter } from "@/components/ui/ProgressMeter";
import { LoadingSequence } from "@/components/ui/LoadingSequence";
import { Reveal } from "@/components/motion/Reveal";
import type { OnboardingProfile } from "@/lib/types";

type Step = 1 | 2 | 3 | 4 | 5;

interface OnboardingData {
  name: string;
  experience: string;
  focus: string[];
  goal: string;
}

const ANALYZING_MESSAGES = [
  "Reading your goals…",
  "Matching your coaching style…",
  "Building your first challenge…",
  "Personalizing your learning plan…",
];

const EXPERIENCE_OPTIONS = [
  {
    id: "beginner",
    label: "Beginner",
    description: "Just getting started with debate or public speaking",
    icon: BookOpen,
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Some experience, looking to sharpen my skills",
    icon: Target,
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Competitive level, preparing for high-stakes events",
    icon: Trophy,
  },
];

const FOCUS_OPTIONS = [
  {
    id: "debate",
    label: "Debate",
    description: "Policy, LD, PF, or parliamentary debate",
    icon: MessageSquare,
  },
  {
    id: "model-un",
    label: "Model UN",
    description: "Committee simulations, position papers, speeches",
    icon: Globe2,
  },
  {
    id: "public-speaking",
    label: "Public Speaking",
    description: "Presentations, speeches, and communication",
    icon: Mic2,
  },
];

const GOAL_OPTIONS = [
  {
    id: "competition",
    label: "Competition Prep",
    description: "Training for tournaments and competitive events",
    icon: Trophy,
  },
  {
    id: "class",
    label: "School / Class",
    description: "Fulfilling a course requirement or class activity",
    icon: BookOpen,
  },
  {
    id: "improvement",
    label: "Personal Growth",
    description: "Building confidence and communication skills",
    icon: Sparkles,
  },
  {
    id: "explore",
    label: "Just Exploring",
    description: "Curious to see what SpeakUP coaching can do",
    icon: Target,
  },
];

function OptionButton({
  selected,
  onClick,
  icon: Icon,
  label,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-4 rounded-md border p-4 text-left transition-all",
        selected
          ? "border-maroon bg-maroon/5 ring-1 ring-maroon"
          : "border-ink/10 bg-paper-dim hover:border-maroon/40"
      )}
    >
      <div
        className={clsx(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
          selected ? "bg-maroon text-paper" : "bg-ink/5 text-ink-soft"
        )}
      >
        <Icon size={18} />
      </div>
      <div>
        <p className="font-semibold text-ink">{label}</p>
        <p className="text-sm text-ink-soft">{description}</p>
      </div>
      {selected && <CheckCircle2 size={18} className="ml-auto shrink-0 text-maroon" />}
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    experience: "",
    focus: [],
    goal: "",
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  const totalSteps = 4;
  const progress = ((step - 1) / totalSteps) * 100;

  function toggleFocus(id: string) {
    setData((d) => ({
      ...d,
      focus: d.focus.includes(id)
        ? d.focus.filter((f) => f !== id)
        : [...d.focus, id],
    }));
  }

  async function finish() {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to generate profile");
      const aiProfile: OnboardingProfile = await res.json();
      setProfile(aiProfile);
      setStep(5);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function createAccount() {
    if (!profile) return;
    setCreatingAccount(true);
    setAccountError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: data.name,
          experience: data.experience,
          focus: data.focus,
          goal: data.goal,
          profile,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setAccountError(body.error ?? "Something went wrong. Please try again.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (signInResult?.error) {
        setAccountError("Account created, but logging you in failed. Try logging in.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setAccountError("Something went wrong. Please try again.");
    } finally {
      setCreatingAccount(false);
    }
  }

  const canNext =
    (step === 1 && data.name.trim().length > 0) ||
    (step === 2 && data.experience !== "") ||
    (step === 3 && data.focus.length > 0) ||
    (step === 4 && data.goal !== "");

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 py-16">
      {step < 5 && !analyzing && (
        <div className="mb-10 w-full max-w-lg">
          <ProgressMeter
            value={progress}
            label={`Step ${step} of ${totalSteps}`}
            valueLabel={`${Math.round(progress)}% complete`}
          />
        </div>
      )}

      <div className="w-full max-w-lg">
        {analyzing ? (
          <Card padding="lg" className="flex flex-col items-center gap-5 text-center">
            <Loader2 size={28} className="animate-spin text-maroon" />
            <div>
              <h1 className="font-display text-xl font-semibold text-ink">
                Building your learning plan
              </h1>
              <LoadingSequence
                messages={ANALYZING_MESSAGES}
                className="mt-2 text-sm text-ink-soft"
              />
            </div>
          </Card>
        ) : (
          <>
            {/* Step 1 — Name */}
            {step === 1 && (
              <Reveal>
                <h1 className="mb-2 font-display text-3xl font-semibold text-ink">
                  Welcome to SpeakUP AI
                </h1>
                <p className="mb-8 text-ink-soft">
                  Your personal coach for debate, Model UN, and public speaking.
                  Let&apos;s get you set up.
                </p>
                <label htmlFor="onboarding-name" className="mb-2 block text-sm font-medium text-ink-soft">
                  What should we call you?
                </label>
                <input
                  id="onboarding-name"
                  type="text"
                  placeholder="Your name or username"
                  value={data.name}
                  onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && canNext && setStep(2)}
                  className="w-full rounded-md border border-stone-light bg-paper px-4 py-3 text-ink placeholder:text-stone outline-none transition-colors focus:border-maroon focus:ring-1 focus:ring-maroon"
                  autoFocus
                />
              </Reveal>
            )}

            {/* Step 2 — Experience */}
            {step === 2 && (
              <Reveal>
                <h1 className="mb-2 font-display text-3xl font-semibold text-ink">
                  What&apos;s your experience level?
                </h1>
                <p className="mb-8 text-ink-soft">
                  We&apos;ll tailor your coaching and exercises to match where you are.
                </p>
                <div className="flex flex-col gap-3">
                  {EXPERIENCE_OPTIONS.map(({ id, label, description, icon }) => (
                    <OptionButton
                      key={id}
                      selected={data.experience === id}
                      onClick={() => setData((d) => ({ ...d, experience: id }))}
                      icon={icon}
                      label={label}
                      description={description}
                    />
                  ))}
                </div>
              </Reveal>
            )}

            {/* Step 3 — Focus Area */}
            {step === 3 && (
              <Reveal>
                <h1 className="mb-2 font-display text-3xl font-semibold text-ink">
                  What do you want to practice?
                </h1>
                <p className="mb-8 text-ink-soft">
                  Select all that apply — you can always switch later.
                </p>
                <div className="flex flex-col gap-3">
                  {FOCUS_OPTIONS.map(({ id, label, description, icon }) => (
                    <OptionButton
                      key={id}
                      selected={data.focus.includes(id)}
                      onClick={() => toggleFocus(id)}
                      icon={icon}
                      label={label}
                      description={description}
                    />
                  ))}
                </div>
              </Reveal>
            )}

            {/* Step 4 — Goal */}
            {step === 4 && (
              <Reveal>
                <h1 className="mb-2 font-display text-3xl font-semibold text-ink">
                  What&apos;s your main goal?
                </h1>
                <p className="mb-8 text-ink-soft">
                  This helps us recommend the right exercises and pacing.
                </p>
                <div className="flex flex-col gap-3">
                  {GOAL_OPTIONS.map(({ id, label, description, icon }) => (
                    <OptionButton
                      key={id}
                      selected={data.goal === id}
                      onClick={() => setData((d) => ({ ...d, goal: id }))}
                      icon={icon}
                      label={label}
                      description={description}
                    />
                  ))}
                </div>
                {error && <p className="mt-4 text-sm text-maroon">{error}</p>}
              </Reveal>
            )}

            {/* Step 5 — Personalized Completion */}
            {step === 5 && profile && (
              <Reveal>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-maroon/10">
                    <Sparkles size={32} className="text-maroon" />
                  </div>
                  <h1 className="mb-1 font-display text-2xl font-semibold text-ink">
                    {profile.greeting}
                  </h1>
                  <p className="text-sm font-medium text-maroon">{profile.tagline}</p>
                </div>

                <Card padding="md" className="mb-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone">
                    Your Coach
                  </p>
                  <p className="text-sm text-ink">{profile.coachingStyle}</p>
                </Card>

                <Card padding="md" className="mb-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone">
                    Top Skills to Build
                  </p>
                  <div className="flex flex-col gap-2">
                    {profile.topFocusSkills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-xs font-bold text-maroon">
                          {i + 1}
                        </span>
                        <span className="text-sm text-ink">{skill}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="mb-4 rounded-md border border-maroon/20 bg-maroon/5 p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Zap size={14} className="text-maroon" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-maroon">
                      First Challenge
                    </p>
                  </div>
                  <p className="mb-0.5 font-semibold text-ink">
                    {profile.firstChallengeTitle}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {profile.firstChallengeDescription}
                  </p>
                </div>

                <div className="mb-6 flex flex-col gap-2">
                  {profile.personalizedInsights.map((insight, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-md border border-ink/10 bg-paper-dim p-3"
                    >
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-forest" />
                      <p className="text-sm text-ink-soft">{insight}</p>
                    </div>
                  ))}
                </div>

                <Card padding="md" className="mb-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone">
                    Save your progress — create your account
                  </p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label htmlFor="onboarding-email" className="mb-1.5 block text-sm font-medium text-ink-soft">
                        Email
                      </label>
                      <input
                        id="onboarding-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-stone-light bg-paper px-4 py-3 text-ink placeholder:text-stone outline-none transition-colors focus:border-maroon focus:ring-1 focus:ring-maroon"
                      />
                    </div>
                    <div>
                      <label htmlFor="onboarding-password" className="mb-1.5 block text-sm font-medium text-ink-soft">
                        Password
                      </label>
                      <input
                        id="onboarding-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-stone-light bg-paper px-4 py-3 text-ink placeholder:text-stone outline-none transition-colors focus:border-maroon focus:ring-1 focus:ring-maroon"
                      />
                    </div>
                  </div>
                  {accountError && <p className="mt-3 text-sm text-maroon">{accountError}</p>}
                </Card>

                <Button
                  onClick={createAccount}
                  loading={creatingAccount}
                  disabled={!email || password.length < 8}
                  size="lg"
                  className="w-full"
                >
                  Start My Journey
                </Button>
              </Reveal>
            )}
          </>
        )}

        {/* Navigation */}
        {step < 5 && !analyzing && (
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <Button
                variant="secondary"
                onClick={() => setStep((s) => (s - 1) as Step)}
              >
                <ChevronLeft size={16} />
                Back
              </Button>
            )}
            <Button
              onClick={step === 4 ? finish : () => setStep((s) => (s + 1) as Step)}
              disabled={!canNext}
              className="flex-1"
            >
              {step === 4 ? (
                <>Finish <ChevronRight size={16} /></>
              ) : (
                <>Continue <ChevronRight size={16} /></>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
