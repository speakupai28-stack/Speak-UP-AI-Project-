"use client";

import { Mic2, ChevronRight, CheckCircle2, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { useSpeakingProgress } from "@/components/providers/ProgressProvider";

const LEVELS = [
  {
    id: "level-1", number: 1, title: "Foundations", subtitle: "Build the core skills every speaker needs",
    href: "/public-speaking/level-1",
    forWho: "Students new to public speaking", goal: "Speak clearly and confidently in 60 seconds",
    topics: ["Why speaking matters & beating nerves", "Articulation basics & filler word elimination", "Vocal variety — pace, pitch, pause, volume", "Basic speech structure: Hook, Body, Close", "Body language fundamentals", "Overcoming nervousness", "The 1-minute rule", "Practice: 60-second self-introduction"],
    coachStyle: "Warm, encouraging — focuses on one improvement at a time",
  },
  {
    id: "level-2", number: 2, title: "Style & Delivery", subtitle: "Find your voice and hold the room",
    href: "/public-speaking/level-2",
    forWho: "Students who can speak but want to be compelling", goal: "Deliver a 3-minute speech with personality and persuasion",
    topics: ["Finding your authentic speaking voice", "Advanced articulation techniques", "Storytelling: problem/journey/resolution arc", "Ethos, Pathos, Logos — the persuasion triangle", "Audience management & reading the room", "Advanced body language & movement", "The power of the strategic pause", "Practice: 3-minute persuasive speech"],
    coachStyle: "Challenging — pushes for personality, risk-taking, and specificity",
  },
  {
    id: "level-3", number: 3, title: "Performance & Events", subtitle: "Prepare for real events and real audiences",
    href: "/public-speaking/level-3",
    forWho: "Students preparing for competitions, interviews, or high-stakes events", goal: "Deliver a polished, event-specific speech under pressure",
    topics: ["Adapting to different speaking contexts", "Event-specific mastery (TEDx, Valedictorian, Competition)", "Advanced persuasion & narrative tension", "Handling Q&A and live audience pressure", "Performing under high-stakes conditions", "Vocal stamina for longer speeches", "Mastering the first 10 seconds", "Practice: Full event simulation"],
    coachStyle: "Performance-level — judged at a real audience standard",
  },
];

export default function SpeakingHub() {
  const { progress } = useSpeakingProgress();
  const currentLevel = progress?.level ?? 1;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-maroon/10 text-maroon">
            <Mic2 size={18} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-stone">Public Speaking</span>
        </div>
        <h1 className="mb-2 font-display text-3xl font-semibold text-ink">Choose Your Level</h1>
        <p className="text-ink-soft">A progressive speaking program — from clearing your first fear to commanding any room. Your coach evaluates your progress and guides your advancement.</p>
      </div>

      <div className="flex flex-col gap-5">
        {LEVELS.map(({ id, number, title, subtitle, href, forWho, goal, topics, coachStyle }) => {
          const isRecommended = id === `level-${currentLevel}`;
          return (
            <Card key={id} padding="none" className={isRecommended ? "border-maroon/40" : undefined}>
              {isRecommended && (
                <div className="flex items-center gap-2 border-b border-maroon/20 bg-maroon/5 px-5 py-2">
                  <CheckCircle2 size={13} className="text-maroon" />
                  <span className="text-xs font-semibold text-maroon">Your current level</span>
                </div>
              )}
              <div className="p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-maroon/10 text-maroon">
                      <Mic2 size={22} />
                    </div>
                    <div>
                      <div className="mb-1">
                        <Badge variant="maroon">Level {number}</Badge>
                      </div>
                      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
                      <p className="text-sm text-ink-soft">{subtitle}</p>
                    </div>
                  </div>
                  <ButtonLink href={href} size="sm" className="shrink-0">
                    Start <ChevronRight size={14} />
                  </ButtonLink>
                </div>

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

                <div className="mb-4">
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-stone">What you&apos;ll learn</p>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {topics.map((topic, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-[10px] font-bold text-maroon">{i + 1}</span>
                        <p className="text-xs text-ink-soft">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-md border border-ink/10 px-4 py-2.5">
                  <span className="text-xs text-ink-soft">Coach style: <span className="font-medium text-ink">{coachStyle}</span></span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-stone">
        <Lock size={12} /> All levels available. Your coach evaluates when you&apos;re ready to advance.
      </div>
    </div>
  );
}
