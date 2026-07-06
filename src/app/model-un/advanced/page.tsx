"use client";

import { ArrowRight, Lightbulb, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

const LESSONS = [
  {
    id: 1, title: "Crisis Committee Mechanics",
    concept: "Crisis committees are fast-paced, dynamic simulations where situations change in real time through 'crisis updates' — you must adapt your strategy constantly.",
    points: [
      "Crisis updates arrive every 30-60 minutes, changing the scenario",
      "Delegates write 'directives' — short documents ordering action",
      "Speed of response matters as much as quality",
      "Individual actions and 'backroom' plays are common in crisis",
      "Your portfolio (your character's power/role) determines what you can do",
    ],
    takeaway: "In crisis committees, creativity and speed beat thoroughness. Act fast, adapt faster.",
  },
  {
    id: 2, title: "Writing Directives and Press Releases",
    concept: "Crisis committees use directives (internal orders) and press releases (public statements) instead of traditional resolutions.",
    types: [
      { name: "Directive", desc: "An order given to a party under your committee's authority. Must be specific and actionable." },
      { name: "Press Release", desc: "A public statement from the committee. Controls the narrative and shapes public opinion in the simulation." },
      { name: "Communiqué", desc: "A formal statement to another country or body. Used for diplomacy within the crisis." },
    ],
    tips: ["Directives should say WHO does WHAT by WHEN", "Press releases control the room's narrative — use them strategically", "Write short, clear sentences — crisis moves fast"],
    takeaway: "The delegate who controls the press releases controls the story. And the story often wins.",
  },
  {
    id: 3, title: "Chairing a Committee",
    concept: "Chairs run the committee session — they're responsible for keeping debate moving, enforcing rules, and making sure every delegate gets a fair chance to speak.",
    responsibilities: [
      "Open and close debate sessions formally",
      "Maintain the speakers list and recognize delegates",
      "Rule on points and motions correctly and quickly",
      "Keep time strictly — use a stopwatch",
      "Stay neutral — chairs don't take sides in debate",
      "Guide the committee toward passing strong resolutions",
    ],
    takeaway: "A great chair is invisible — when the committee runs smoothly, nobody notices the chair. That's the goal.",
  },
  {
    id: 4, title: "Advanced Negotiation Tactics",
    concept: "The most successful MUN delegates are master negotiators — they build consensus, manage conflicts, and find language everyone can live with.",
    tactics: [
      { name: "Bracketing", desc: "Propose two alternative versions of a clause — negotiate toward the middle." },
      { name: "Strategic Yielding", desc: "Give up something small to gain something bigger. Know your priorities." },
      { name: "Coalition Building", desc: "Build your voting bloc before you need it, not during voting." },
      { name: "Vagueness as Tool", desc: "Sometimes deliberately vague language passes where specific language fails — and you can interpret vagueness later." },
    ],
    takeaway: "The best outcome is one everyone can defend to their capital. Focus on face-saving language for your opposition.",
  },
  {
    id: 5, title: "Best Delegate Strategies",
    concept: "Best delegate awards go to delegates who combine substance, diplomacy, leadership, and speaking skill across an entire conference.",
    strategies: [
      "Speak in at least every other moderated caucus — visibility matters",
      "Always have a working paper with your name on it as a sponsor",
      "Help other delegates when you don't need anything from them — chairs notice generosity",
      "Know when to compromise and when to hold your ground",
      "Treat every delegate, from every country, with respect — even adversaries",
      "End every speech with a call to action, not just a statement",
    ],
    takeaway: "Best delegate isn't just about your country winning — it's about elevating the entire committee.",
  },
];

export default function ModelUNAdvanced() {
  const [openLesson, setOpenLesson] = useState(0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full border border-maroon/30 bg-maroon/10 px-3 py-0.5 text-xs font-semibold text-maroon">Section 4</span>
          <span className="rounded-full border border-ink/10 px-3 py-0.5 text-xs text-ink-soft">Advanced Skills</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-ink">Advanced Delegate Skills</h1>
        <p className="text-ink-soft">Master crisis committees, chairing, advanced negotiation, and the strategies that win Best Delegate.</p>
      </div>

      <div className="flex flex-col gap-3">
        {LESSONS.map((lesson, i) => {
          const open = openLesson === i;
          return (
            <div key={lesson.id} className="glass-card overflow-hidden rounded-lg">
              <button onClick={() => setOpenLesson(open ? -1 : i)} className="flex w-full items-center gap-4 p-5 text-left">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-maroon/10">
                  <Star size={16} className="text-maroon" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-ink-soft">Lesson {lesson.id}</span>
                  <p className="font-semibold text-ink">{lesson.title}</p>
                </div>
                {open ? <ChevronUp size={16} className="shrink-0 text-ink-soft" /> : <ChevronDown size={16} className="shrink-0 text-ink-soft" />}
              </button>
              {open && (
                <div className="border-t border-ink/10 px-5 pb-5 pt-4 space-y-4">
                  <p className="text-sm leading-relaxed text-ink-soft">{lesson.concept}</p>
                  {"points" in lesson && (lesson as {points:string[]}).points.map((p, idx) => (
                    <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-maroon" /><p className="text-sm text-ink-soft">{p}</p></div>
                  ))}
                  {"types" in lesson && (
                    <div className="flex flex-col gap-2">
                      {(lesson as {types:{name:string;desc:string}[]}).types.map((t) => (
                        <div key={t.name} className="rounded-md border border-ink/10 bg-paper-dim p-3">
                          <p className="mb-0.5 text-sm font-semibold text-ink">{t.name}</p>
                          <p className="text-xs text-ink-soft">{t.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {"tips" in lesson && (lesson as {tips:string[]}).tips.map((tip, idx) => (
                    <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-maroon" /><p className="text-sm text-ink-soft">{tip}</p></div>
                  ))}
                  {"responsibilities" in lesson && (lesson as {responsibilities:string[]}).responsibilities.map((r, idx) => (
                    <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-maroon" /><p className="text-sm text-ink-soft">{r}</p></div>
                  ))}
                  {"tactics" in lesson && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(lesson as {tactics:{name:string;desc:string}[]}).tactics.map((t) => (
                        <div key={t.name} className="rounded-md border border-ink/10 bg-paper-dim p-3">
                          <p className="mb-0.5 text-sm font-semibold text-maroon">{t.name}</p>
                          <p className="text-xs text-ink-soft">{t.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {"strategies" in lesson && (lesson as {strategies:string[]}).strategies.map((s, idx) => (
                    <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-maroon" /><p className="text-sm text-ink-soft">{s}</p></div>
                  ))}
                  <div className="rounded-md border border-maroon/30 bg-maroon/10 px-4 py-3">
                    <div className="flex gap-2"><Lightbulb size={14} className="mt-0.5 shrink-0 text-maroon" /><p className="text-sm font-medium text-ink">{lesson.takeaway}</p></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <a href="/model-un/research" className={clsx("mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-maroon py-3.5 font-semibold text-paper hover:bg-maroon-dark")}>
          Go to Research & Position Papers <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}
