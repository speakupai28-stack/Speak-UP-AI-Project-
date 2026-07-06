"use client";

import { useState } from "react";
import {
  Globe2,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Users,
  Search,
  Star,
  Lock,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

const SECTIONS = [
  {
    id: "section-1",
    number: 1,
    title: "Introduction to Model UN",
    subtitle: "Understand how committees work and your role as a delegate",
    href: "/model-un/intro",
    icon: BookOpen,
    forWho: "Brand new delegates",
    goal: "Understand the structure and speak with confidence",
    topics: [
      "What is Model UN and how committees work",
      "Understanding the delegate role",
      "Rules of procedure — motions, points, yields",
      "How resolutions are structured",
      "Reading and understanding the study guide",
    ],
    coachStyle: "Beginner-friendly, builds confidence step by step",
  },
  {
    id: "section-2",
    number: 2,
    title: "Committee Work & Speeches",
    subtitle: "Learn to lobby, debate, and draft winning resolutions",
    href: "/model-un/committee",
    icon: Users,
    forWho: "Delegates who know the basics",
    goal: "Lead debate and get your resolution passed",
    topics: [
      "Delivering an opening speech (structure, tone, time limits)",
      "Lobbying and forming blocs",
      "Writing and sponsoring working papers",
      "Merging papers and negotiating language",
      "Making and responding to points of information",
      "Voting procedure and amendments",
    ],
    coachStyle: "Tactical, pushes for persuasive and confident delivery",
  },
  {
    id: "section-3",
    number: 3,
    title: "Research & Position Papers",
    subtitle: "Know your country inside out and research like a pro",
    href: "/model-un/research",
    icon: Search,
    forWho: "Any delegate preparing for a conference",
    goal: "Build a strong position paper and research roadmap",
    topics: [
      "Understanding your country's foreign policy",
      "How to research a topic efficiently",
      "Identifying allies, adversaries, and swing votes",
      "Citing credible UN and government sources",
      "Structuring a position paper",
      "Writing policy language that passes",
    ],
    coachStyle: "Analytical, teaches smart research habits",
  },
  {
    id: "section-4",
    number: 4,
    title: "Advanced Delegate Skills",
    subtitle: "Master crisis committees, directives, and chairing",
    href: "/model-un/advanced",
    icon: Star,
    forWho: "Experienced delegates aiming for awards",
    goal: "Stand out in crisis committees and lead as chair",
    topics: [
      "Crisis committee mechanics",
      "Writing directives and press releases",
      "Chairing a committee",
      "Advanced negotiation tactics",
      "Best delegate strategies",
    ],
    coachStyle: "High-level, elite-focused coaching",
  },
];

function readExperience(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("speakup_user");
    return raw ? (JSON.parse(raw).experience ?? null) : null;
  } catch {
    return null;
  }
}

export default function ModelUNHub() {
  const [experience] = useState<string | null>(() => readExperience());

  const recommendedId =
    experience === "advanced" ? "section-3"
    : experience === "intermediate" ? "section-2"
    : "section-1";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-maroon/10 text-maroon">
            <Globe2 size={18} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-stone">
            Model UN Training
          </span>
        </div>
        <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Choose Your Section</h1>
        <p className="text-ink-soft">
          Work through each section in order or jump to what you need most.
        </p>
      </div>

      {/* Section Cards */}
      <div className="flex flex-col gap-5">
        {SECTIONS.map(({ id, number, title, subtitle, href, icon: Icon, forWho, goal, topics, coachStyle }) => {
          const isRecommended = id === recommendedId;

          return (
            <Card key={id} padding="none" className={isRecommended ? "border-maroon/40" : undefined}>
              {isRecommended && (
                <div className="flex items-center gap-2 border-b border-maroon/20 bg-maroon/5 px-5 py-2">
                  <CheckCircle2 size={13} className="text-maroon" />
                  <span className="text-xs font-semibold text-maroon">
                    Recommended based on your profile
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Section Header */}
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-maroon/10 text-maroon">
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="mb-1">
                        <Badge variant="maroon">Section {number}</Badge>
                      </div>
                      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
                      <p className="text-sm text-ink-soft">{subtitle}</p>
                    </div>
                  </div>
                  <ButtonLink href={href} size="sm" className="shrink-0">
                    Start <ChevronRight size={14} />
                  </ButtonLink>
                </div>

                {/* Meta */}
                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-ink/10 bg-paper-dim p-3">
                    <p className="mb-0.5 text-xs text-stone">Who it&apos;s for</p>
                    <p className="text-sm font-medium text-ink">{forWho}</p>
                  </div>
                  <div className="rounded-md border border-ink/10 bg-paper-dim p-3">
                    <p className="mb-0.5 text-xs text-stone">Your goal</p>
                    <p className="text-sm font-medium text-ink">{goal}</p>
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-stone">
                    What you&apos;ll learn
                  </p>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {topics.map((topic, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-[10px] font-bold text-maroon">
                          {i + 1}
                        </span>
                        <p className="text-xs text-ink-soft">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coach Style */}
                <div className="rounded-md border border-ink/10 px-4 py-2.5">
                  <span className="text-xs text-ink-soft">
                    Coach style: <span className="font-medium text-ink">{coachStyle}</span>
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-stone">
        <Lock size={12} />
        All sections are available. Complete each one to track your progress.
      </div>
    </div>
  );
}
