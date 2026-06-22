"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import type { OnboardingProfile } from "@/app/api/onboarding/route";

type Step = 1 | 2 | 3 | 4 | 5;

interface OnboardingData {
  name: string;
  experience: string;
  focus: string[];
  goal: string;
}

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
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: "model-un",
    label: "Model UN",
    description: "Committee simulations, position papers, speeches",
    icon: Globe2,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "public-speaking",
    label: "Public Speaking",
    description: "Presentations, speeches, and communication",
    icon: Mic2,
    color: "from-amber-500 to-orange-600",
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
      localStorage.setItem(
        "speakup_user",
        JSON.stringify({ ...data, profile: aiProfile })
      );
      setStep(5);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  const canNext =
    (step === 1 && data.name.trim().length > 0) ||
    (step === 2 && data.experience !== "") ||
    (step === 3 && data.focus.length > 0) ||
    (step === 4 && data.goal !== "");

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 py-16">
      {step < 5 && (
        <div className="mb-10 w-full max-w-lg">
          <div className="mb-2 flex justify-between text-xs text-[#94A3B8]">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1E293B]">
            <div
              className="h-full rounded-full bg-[#6366F1] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="w-full max-w-lg">
        {/* Step 1 — Name */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">
              Welcome to SpeakUP AI
            </h1>
            <p className="mb-8 text-[#94A3B8]">
              Your personal coach for debate, Model UN, and public speaking.
              Let&apos;s get you set up.
            </p>
            <label className="mb-2 block text-sm font-medium text-[#94A3B8]">
              What should we call you?
            </label>
            <input
              type="text"
              placeholder="Your name or username"
              value={data.name}
              onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && canNext && setStep(2)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-[#F1F5F9] placeholder-[#94A3B8] outline-none transition-colors focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
              autoFocus
            />
          </div>
        )}

        {/* Step 2 — Experience */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">
              What&apos;s your experience level?
            </h1>
            <p className="mb-8 text-[#94A3B8]">
              We&apos;ll tailor your coaching and exercises to match where you are.
            </p>
            <div className="flex flex-col gap-3">
              {EXPERIENCE_OPTIONS.map(({ id, label, description, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setData((d) => ({ ...d, experience: id }))}
                  className={clsx(
                    "flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                    data.experience === id
                      ? "border-[#6366F1] bg-[#6366F1]/10 ring-1 ring-[#6366F1]"
                      : "border-[#1E293B] bg-[#111827] hover:border-[#6366F1]/50"
                  )}
                >
                  <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", data.experience === id ? "bg-[#6366F1]" : "bg-[#1a2236]")}>
                    <Icon size={18} className="text-[#F1F5F9]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#F1F5F9]">{label}</p>
                    <p className="text-sm text-[#94A3B8]">{description}</p>
                  </div>
                  {data.experience === id && <CheckCircle2 size={18} className="ml-auto shrink-0 text-[#6366F1]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Focus Area */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">
              What do you want to practice?
            </h1>
            <p className="mb-8 text-[#94A3B8]">
              Select all that apply — you can always switch later.
            </p>
            <div className="flex flex-col gap-3">
              {FOCUS_OPTIONS.map(({ id, label, description, icon: Icon, color }) => {
                const selected = data.focus.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleFocus(id)}
                    className={clsx(
                      "flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                      selected
                        ? "border-[#6366F1] bg-[#6366F1]/10 ring-1 ring-[#6366F1]"
                        : "border-[#1E293B] bg-[#111827] hover:border-[#6366F1]/50"
                    )}
                  >
                    <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br", color)}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F1F5F9]">{label}</p>
                      <p className="text-sm text-[#94A3B8]">{description}</p>
                    </div>
                    {selected && <CheckCircle2 size={18} className="ml-auto shrink-0 text-[#6366F1]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4 — Goal */}
        {step === 4 && (
          <div className="animate-fade-in-up">
            <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">
              What&apos;s your main goal?
            </h1>
            <p className="mb-8 text-[#94A3B8]">
              This helps us recommend the right exercises and pacing.
            </p>
            <div className="flex flex-col gap-3">
              {GOAL_OPTIONS.map(({ id, label, description, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setData((d) => ({ ...d, goal: id }))}
                  className={clsx(
                    "flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                    data.goal === id
                      ? "border-[#6366F1] bg-[#6366F1]/10 ring-1 ring-[#6366F1]"
                      : "border-[#1E293B] bg-[#111827] hover:border-[#6366F1]/50"
                  )}
                >
                  <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", data.goal === id ? "bg-[#6366F1]" : "bg-[#1a2236]")}>
                    <Icon size={18} className="text-[#F1F5F9]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#F1F5F9]">{label}</p>
                    <p className="text-sm text-[#94A3B8]">{description}</p>
                  </div>
                  {data.goal === id && <CheckCircle2 size={18} className="ml-auto shrink-0 text-[#6366F1]" />}
                </button>
              ))}
            </div>
            {error && (
              <p className="mt-4 text-sm text-rose-400">{error}</p>
            )}
          </div>
        )}

        {/* Step 5 — Personalized Completion */}
        {step === 5 && profile && (
          <div className="animate-fade-in-up">
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#6366F1]/20">
                <Sparkles size={32} className="text-[#6366F1]" />
              </div>
              <h1 className="mb-1 text-2xl font-bold text-[#F1F5F9]">
                {profile.greeting}
              </h1>
              <p className="text-sm font-medium text-gradient">{profile.tagline}</p>
            </div>

            {/* Coaching Style */}
            <div className="mb-4 rounded-xl border border-[#1E293B] bg-[#111827] p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Your Coach</p>
              <p className="text-sm text-[#F1F5F9]">{profile.coachingStyle}</p>
            </div>

            {/* Skills to build */}
            <div className="mb-4 rounded-xl border border-[#1E293B] bg-[#111827] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                Top Skills to Build
              </p>
              <div className="flex flex-col gap-2">
                {profile.topFocusSkills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/20 text-xs font-bold text-[#6366F1]">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#F1F5F9]">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* First Challenge */}
            <div className="mb-4 rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 p-4">
              <div className="mb-1 flex items-center gap-2">
                <Zap size={14} className="text-[#6366F1]" />
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">
                  First Challenge
                </p>
              </div>
              <p className="mb-0.5 font-semibold text-[#F1F5F9]">{profile.firstChallengeTitle}</p>
              <p className="text-sm text-[#94A3B8]">{profile.firstChallengeDescription}</p>
            </div>

            {/* Insights */}
            <div className="mb-6 flex flex-col gap-2">
              {profile.personalizedInsights.map((insight, i) => (
                <div key={i} className="flex gap-3 rounded-lg border border-[#1E293B] bg-[#111827] p-3">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                  <p className="text-sm text-[#94A3B8]">{insight}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-xl bg-[#6366F1] py-3 font-semibold text-white transition-colors hover:bg-[#4F46E5]"
            >
              Start My Journey
            </button>
          </div>
        )}

        {/* Navigation */}
        {step < 5 && (
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => (s - 1) as Step)}
                disabled={analyzing}
                className="flex items-center gap-2 rounded-xl border border-[#1E293B] px-5 py-3 text-sm font-medium text-[#94A3B8] transition-colors hover:border-[#6366F1]/50 hover:text-[#F1F5F9] disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Back
              </button>
            )}
            <button
              onClick={step === 4 ? finish : () => setStep((s) => (s + 1) as Step)}
              disabled={!canNext || analyzing}
              className={clsx(
                "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors",
                canNext && !analyzing
                  ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]"
                  : "cursor-not-allowed bg-[#1E293B] text-[#94A3B8]"
              )}
            >
              {analyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing your profile…
                </>
              ) : step === 4 ? (
                <>Finish <ChevronRight size={16} /></>
              ) : (
                <>Continue <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
