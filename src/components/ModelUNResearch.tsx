"use client";

import { useState } from "react";
import { clsx } from "clsx";
import {
  Globe2,
  Search,
  BookOpen,
  Users,
  Swords,
  Lightbulb,
  FileText,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowRight,
  MapPin,
  Landmark,
  AlignLeft,
  Zap,
} from "lucide-react";
import { FeedbackSkeleton } from "@/components/ui/FeedbackSkeleton";
import { ScoreReveal } from "@/components/motion/ScoreReveal";
import { useClientValue } from "@/lib/useClientValue";
import type { ResearchAnalysis, ResearchInput } from "@/lib/types";

const BUILDING_MESSAGES = [
  "Reading your country's position…",
  "Mapping allies and adversaries…",
  "Finding credible sources…",
  "Building your research roadmap…",
];

const SPEAKER_POSITIONS = [
  "Opening Speech",
  "Working Paper",
  "Draft Resolution",
  "Amendment",
  "General Debate",
];

function SectionCard({
  icon: Icon,
  title,
  color,
  children,
  defaultOpen = true,
}: {
  icon: typeof Globe2;
  title: string;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-5"
      >
        <div className="flex items-center gap-3">
          <div className={clsx("flex h-8 w-8 items-center justify-center rounded-lg", color)}>
            <Icon size={16} className="text-maroon" />
          </div>
          <span className="font-semibold text-ink">{title}</span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-ink-soft" />
        ) : (
          <ChevronDown size={16} className="text-ink-soft" />
        )}
      </button>
      {open && <div className="border-t border-ink/10 px-5 pb-5 pt-4">{children}</div>}
    </div>
  );
}

export default function ModelUNResearch() {
  const [form, setForm] = useState<ResearchInput>({
    country: "",
    committee: "",
    topic: "",
    historicalStance: "",
    bloc: "",
    speakerPosition: "",
  });
  const experience = useClientValue(() => {
    try {
      const raw = localStorage.getItem("speakup_user");
      return raw ? (JSON.parse(raw).experience ?? "beginner") : "beginner";
    } catch {
      return "beginner";
    }
  }, "beginner");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResearchAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof ResearchInput, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const canSubmit = form.country.trim() && form.committee.trim() && form.topic.trim() && form.historicalStance.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await fetch("/api/model-un/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, experience }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      setAnalysis(await res.json());
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full border border-maroon/30 bg-maroon/10 px-3 py-0.5 text-xs font-semibold text-maroon">
            Section 3 — Research
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-ink">Position Paper Research</h1>
        <p className="text-ink-soft">
          Enter your committee details and everything you already know. Your coach will build you a
          personalized research roadmap and teach you how to dig deeper.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Country */}
          <div>
            <label htmlFor="mun-research-country" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink-soft">
              <MapPin size={14} /> Country You&apos;re Representing
            </label>
            <input
              id="mun-research-country"
              type="text"
              placeholder="e.g. Brazil, India, Germany…"
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              className="w-full rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-ink placeholder-stone/60 outline-none transition-colors focus:border-maroon focus:ring-1 focus:ring-maroon"
            />
          </div>

          {/* Committee */}
          <div>
            <label htmlFor="mun-research-committee" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink-soft">
              <Landmark size={14} /> Committee
            </label>
            <input
              id="mun-research-committee"
              type="text"
              placeholder="e.g. UNSC, UNGA, WHO, UNHRC…"
              value={form.committee}
              onChange={(e) => set("committee", e.target.value)}
              className="w-full rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-ink placeholder-stone/60 outline-none transition-colors focus:border-maroon focus:ring-1 focus:ring-maroon"
            />
          </div>
        </div>

        {/* Topic */}
        <div>
          <label htmlFor="mun-research-topic" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink-soft">
            <Globe2 size={14} /> Topic / Agenda Item
          </label>
          <input
            id="mun-research-topic"
            type="text"
            placeholder="e.g. The humanitarian crisis in Sudan, Nuclear non-proliferation…"
            value={form.topic}
            onChange={(e) => set("topic", e.target.value)}
            className="w-full rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-ink placeholder-stone/60 outline-none transition-colors focus:border-maroon focus:ring-1 focus:ring-maroon"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Bloc */}
          <div>
            <label htmlFor="mun-research-bloc" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink-soft">
              <Users size={14} /> Bloc / Alliance{" "}
              <span className="text-xs text-stone/60">(optional)</span>
            </label>
            <input
              id="mun-research-bloc"
              type="text"
              placeholder="e.g. G77, EU, African Union, NATO…"
              value={form.bloc}
              onChange={(e) => set("bloc", e.target.value)}
              className="w-full rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-ink placeholder-stone/60 outline-none transition-colors focus:border-maroon focus:ring-1 focus:ring-maroon"
            />
          </div>

          {/* Speaker Position */}
          <div>
            <label htmlFor="mun-research-position" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink-soft">
              <FileText size={14} /> Speaker Position{" "}
              <span className="text-xs text-stone/60">(optional)</span>
            </label>
            <select
              id="mun-research-position"
              value={form.speakerPosition}
              onChange={(e) => set("speakerPosition", e.target.value)}
              className="w-full rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-ink outline-none transition-colors focus:border-maroon focus:ring-1 focus:ring-maroon"
            >
              <option value="">Select position…</option>
              {SPEAKER_POSITIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Historical Stance — big textarea */}
        <div>
          <label htmlFor="mun-research-stance" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink-soft">
            <AlignLeft size={14} /> Your Country&apos;s Historical Stance on This Topic
          </label>
          <p className="mb-2 text-xs text-stone/70">
            Write down everything you already know — past votes, treaties, policies, key events,
            relationships with other countries, anything. The more you put here, the more
            personalized your research guide will be.
          </p>
          <textarea
            id="mun-research-stance"
            rows={8}
            placeholder={`Example:\n"Brazil has historically supported multilateral climate agreements and signed the Paris Agreement. They've pushed for technology transfer to developing nations and opposed binding emissions caps that would limit economic growth. Brazil's Amazon deforestation policies have been a point of tension with the EU. In COP27, Brazil shifted its stance under the new government..."`}
            value={form.historicalStance}
            onChange={(e) => set("historicalStance", e.target.value)}
            className="w-full resize-y rounded-md border border-ink/10 bg-paper-dim px-4 py-3 text-ink placeholder-stone/50 outline-none transition-colors focus:border-maroon focus:ring-1 focus:ring-maroon"
          />
          <p className="mt-1.5 text-right text-xs text-stone/50">
            {form.historicalStance.length} characters
          </p>
        </div>

        {error && <p className="text-sm text-maroon">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className={clsx(
            "flex items-center justify-center gap-2 rounded-md py-3.5 font-semibold transition-colors",
            canSubmit && !loading
              ? "bg-maroon text-paper hover:bg-maroon-dark"
              : "cursor-not-allowed bg-ink/10 text-ink-soft"
          )}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Building your research guide…
            </>
          ) : (
            <>
              <Search size={18} />
              Analyze & Build Research Guide
              <ArrowRight size={16} />
            </>
          )}
        </button>

        {loading && <FeedbackSkeleton messages={BUILDING_MESSAGES} rows={5} />}
      </form>

      {/* Analysis Results */}
      {analysis && !loading && (
        <ScoreReveal revealKey={analysis.summary} className="flex flex-col gap-4">
          {/* Summary Banner */}
          <div className="rounded-lg border border-maroon/30 bg-maroon/10 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Zap size={14} className="text-maroon" />
              <span className="text-xs font-semibold uppercase tracking-wide text-maroon">
                Research Overview
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink">{analysis.summary}</p>
          </div>

          {/* Historical Context */}
          <SectionCard icon={BookOpen} title="Historical Context & Country Stance" color="bg-maroon/10">
            <p className="text-sm leading-relaxed text-ink-soft">{analysis.historicalContext}</p>
          </SectionCard>

          {/* Research Roadmap */}
          <SectionCard icon={Search} title="Step-by-Step Research Roadmap" color="bg-maroon/10">
            <div className="flex flex-col gap-4">
              {analysis.researchRoadmap.map(({ step, title, description }) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-maroon/15 text-sm font-bold text-maroon">
                    {step}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{title}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Key Sources */}
          <SectionCard icon={Globe2} title="Key Sources to Use" color="bg-maroon/10">
            <div className="flex flex-col gap-3">
              {analysis.keySources.map((src, i) => (
                <div key={i} className="rounded-md border border-ink/10 bg-paper-dim p-3">
                  <div className="mb-0.5 flex items-center justify-between gap-2">
                    <p className="font-semibold text-ink">{src.name}</p>
                    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs text-ink-soft">
                      {src.urlHint}
                    </span>
                  </div>
                  <p className="text-sm text-ink-soft">{src.why}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Allies & Adversaries */}
          <SectionCard icon={Users} title="Allies & Adversaries" color="bg-forest/10">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-forest">
                  Likely Allies
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.allies.map((c) => (
                    <span key={c} className="rounded-full border border-forest/30 bg-forest/10 px-3 py-1 text-sm text-forest">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-maroon">
                  Likely Adversaries
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.adversaries.map((c) => (
                    <span key={c} className="rounded-full border border-maroon/30 bg-maroon/10 px-3 py-1 text-sm text-maroon">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Talking Points */}
          <SectionCard icon={Swords} title="Key Talking Points" color="bg-maroon/10">
            <div className="flex flex-col gap-2">
              {analysis.keyTalkingPoints.map((pt, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-[#8a6b28]">
                    {i + 1}
                  </span>
                  <p className="text-sm text-ink">{pt}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Position Paper Tips */}
          <SectionCard icon={FileText} title="Position Paper Tips" color="bg-maroon/10">
            <div className="flex flex-col gap-2">
              {analysis.positionPaperTips.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-maroon" />
                  <p className="text-sm text-ink-soft">{tip}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Smart Research Tips */}
          <SectionCard icon={Lightbulb} title="How to Research Smarter" color="bg-maroon/10" defaultOpen={false}>
            <div className="flex flex-col gap-2">
              {analysis.smartResearchTips.map((tip, i) => (
                <div key={i} className="flex gap-3 rounded-md border border-ink/10 bg-paper-dim p-3">
                  <Lightbulb size={14} className="mt-0.5 shrink-0 text-maroon" />
                  <p className="text-sm text-ink-soft">{tip}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Re-analyze */}
          <button
            onClick={() => { setAnalysis(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="rounded-md border border-ink/10 py-3 text-sm font-medium text-ink-soft transition-colors hover:border-maroon/50 hover:text-ink"
          >
            Start a New Research Session
          </button>
        </ScoreReveal>
      )}
    </div>
  );
}
