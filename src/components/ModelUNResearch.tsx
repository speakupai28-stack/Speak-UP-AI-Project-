"use client";

import { useEffect, useState } from "react";
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
import type { ResearchAnalysis, ResearchInput } from "@/lib/types";

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
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-5"
      >
        <div className="flex items-center gap-3">
          <div className={clsx("flex h-8 w-8 items-center justify-center rounded-lg", color)}>
            <Icon size={16} className="text-white" />
          </div>
          <span className="font-semibold text-[#F1F5F9]">{title}</span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-[#94A3B8]" />
        ) : (
          <ChevronDown size={16} className="text-[#94A3B8]" />
        )}
      </button>
      {open && <div className="border-t border-[#1E293B] px-5 pb-5 pt-4">{children}</div>}
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
  const [experience, setExperience] = useState<string>("beginner");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResearchAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("speakup_user");
    if (raw) {
      try {
        const user = JSON.parse(raw);
        setExperience(user.experience ?? "beginner");
      } catch {}
    }
  }, []);

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
          <span className="rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-3 py-0.5 text-xs font-semibold text-[#6366F1]">
            Section 3 — Research
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">Position Paper Research</h1>
        <p className="text-[#94A3B8]">
          Enter your committee details and everything you already know. Your coach will build you a
          personalized research roadmap and teach you how to dig deeper.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Country */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
              <MapPin size={14} /> Country You&apos;re Representing
            </label>
            <input
              type="text"
              placeholder="e.g. Brazil, India, Germany…"
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-[#F1F5F9] placeholder-[#94A3B8]/60 outline-none transition-colors focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
            />
          </div>

          {/* Committee */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
              <Landmark size={14} /> Committee
            </label>
            <input
              type="text"
              placeholder="e.g. UNSC, UNGA, WHO, UNHRC…"
              value={form.committee}
              onChange={(e) => set("committee", e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-[#F1F5F9] placeholder-[#94A3B8]/60 outline-none transition-colors focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
            />
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
            <Globe2 size={14} /> Topic / Agenda Item
          </label>
          <input
            type="text"
            placeholder="e.g. The humanitarian crisis in Sudan, Nuclear non-proliferation…"
            value={form.topic}
            onChange={(e) => set("topic", e.target.value)}
            className="w-full rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-[#F1F5F9] placeholder-[#94A3B8]/60 outline-none transition-colors focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Bloc */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
              <Users size={14} /> Bloc / Alliance{" "}
              <span className="text-xs text-[#94A3B8]/60">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. G77, EU, African Union, NATO…"
              value={form.bloc}
              onChange={(e) => set("bloc", e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-[#F1F5F9] placeholder-[#94A3B8]/60 outline-none transition-colors focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
            />
          </div>

          {/* Speaker Position */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
              <FileText size={14} /> Speaker Position{" "}
              <span className="text-xs text-[#94A3B8]/60">(optional)</span>
            </label>
            <select
              value={form.speakerPosition}
              onChange={(e) => set("speakerPosition", e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-[#F1F5F9] outline-none transition-colors focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
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
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
            <AlignLeft size={14} /> Your Country&apos;s Historical Stance on This Topic
          </label>
          <p className="mb-2 text-xs text-[#94A3B8]/70">
            Write down everything you already know — past votes, treaties, policies, key events,
            relationships with other countries, anything. The more you put here, the more
            personalized your research guide will be.
          </p>
          <textarea
            rows={8}
            placeholder={`Example:\n"Brazil has historically supported multilateral climate agreements and signed the Paris Agreement. They've pushed for technology transfer to developing nations and opposed binding emissions caps that would limit economic growth. Brazil's Amazon deforestation policies have been a point of tension with the EU. In COP27, Brazil shifted its stance under the new government..."`}
            value={form.historicalStance}
            onChange={(e) => set("historicalStance", e.target.value)}
            className="w-full resize-y rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3 text-[#F1F5F9] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
          />
          <p className="mt-1.5 text-right text-xs text-[#94A3B8]/50">
            {form.historicalStance.length} characters
          </p>
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className={clsx(
            "flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-colors",
            canSubmit && !loading
              ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]"
              : "cursor-not-allowed bg-[#1E293B] text-[#94A3B8]"
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
      </form>

      {/* Analysis Results */}
      {analysis && (
        <div className="flex flex-col gap-4">
          {/* Summary Banner */}
          <div className="rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/10 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Zap size={14} className="text-[#6366F1]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#6366F1]">
                Research Overview
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#F1F5F9]">{analysis.summary}</p>
          </div>

          {/* Historical Context */}
          <SectionCard icon={BookOpen} title="Historical Context & Country Stance" color="bg-indigo-500">
            <p className="text-sm leading-relaxed text-[#94A3B8]">{analysis.historicalContext}</p>
          </SectionCard>

          {/* Research Roadmap */}
          <SectionCard icon={Search} title="Step-by-Step Research Roadmap" color="bg-purple-500">
            <div className="flex flex-col gap-4">
              {analysis.researchRoadmap.map(({ step, title, description }) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/20 text-sm font-bold text-[#6366F1]">
                    {step}
                  </div>
                  <div>
                    <p className="font-semibold text-[#F1F5F9]">{title}</p>
                    <p className="mt-0.5 text-sm text-[#94A3B8]">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Key Sources */}
          <SectionCard icon={Globe2} title="Key Sources to Use" color="bg-blue-500">
            <div className="flex flex-col gap-3">
              {analysis.keySources.map((src, i) => (
                <div key={i} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                  <div className="mb-0.5 flex items-center justify-between gap-2">
                    <p className="font-semibold text-[#F1F5F9]">{src.name}</p>
                    <span className="rounded-full bg-[#1a2236] px-2 py-0.5 text-xs text-[#94A3B8]">
                      {src.urlHint}
                    </span>
                  </div>
                  <p className="text-sm text-[#94A3B8]">{src.why}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Allies & Adversaries */}
          <SectionCard icon={Users} title="Allies & Adversaries" color="bg-emerald-600">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                  Likely Allies
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.allies.map((c) => (
                    <span key={c} className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-400">
                  Likely Adversaries
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.adversaries.map((c) => (
                    <span key={c} className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-sm text-rose-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Talking Points */}
          <SectionCard icon={Swords} title="Key Talking Points" color="bg-amber-500">
            <div className="flex flex-col gap-2">
              {analysis.keyTalkingPoints.map((pt, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#F1F5F9]">{pt}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Position Paper Tips */}
          <SectionCard icon={FileText} title="Position Paper Tips" color="bg-cyan-600">
            <div className="flex flex-col gap-2">
              {analysis.positionPaperTips.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-cyan-400" />
                  <p className="text-sm text-[#94A3B8]">{tip}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Smart Research Tips */}
          <SectionCard icon={Lightbulb} title="How to Research Smarter" color="bg-violet-500" defaultOpen={false}>
            <div className="flex flex-col gap-2">
              {analysis.smartResearchTips.map((tip, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                  <Lightbulb size={14} className="mt-0.5 shrink-0 text-violet-400" />
                  <p className="text-sm text-[#94A3B8]">{tip}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Re-analyze */}
          <button
            onClick={() => { setAnalysis(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="rounded-xl border border-[#1E293B] py-3 text-sm font-medium text-[#94A3B8] transition-colors hover:border-[#6366F1]/50 hover:text-[#F1F5F9]"
          >
            Start a New Research Session
          </button>
        </div>
      )}
    </div>
  );
}
