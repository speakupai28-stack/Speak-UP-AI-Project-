"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { BookOpen, ChevronDown, ChevronUp, ArrowRight, Lightbulb, Globe2 } from "lucide-react";

const LESSONS = [
  {
    id: 1, title: "What Is Model UN?",
    concept: "Model UN is a simulation of the United Nations where students represent countries and debate global issues. You act as a delegate — an official representative of your assigned nation.",
    points: [
      "Each student is assigned a country to represent",
      "Delegates debate resolutions — formal proposals for action",
      "The goal is to pass resolutions that address global problems",
      "Success means building coalitions, not just winning arguments",
    ],
    takeaway: "Model UN teaches you to think beyond your own views and represent a country's actual interests.",
  },
  {
    id: 2, title: "How Committees Work",
    concept: "All debate happens inside a committee — a group of delegates focused on a specific topic area. Each committee has a chair (like a judge) who manages debate.",
    committees: [
      { name: "UNSC", full: "Security Council", desc: "15 members, handles peace and security crises. Most powerful committee." },
      { name: "UNGA", full: "General Assembly", desc: "All 193 UN member states. Votes on major global resolutions." },
      { name: "WHO", full: "World Health Organization", desc: "Global health policy — pandemics, vaccines, healthcare access." },
      { name: "UNHRC", full: "Human Rights Council", desc: "47 members focused on protecting human rights globally." },
    ],
    takeaway: "Know your committee's powers and limitations — a UNGA resolution can't force military action like the UNSC can.",
  },
  {
    id: 3, title: "Rules of Procedure",
    concept: "MUN has formal rules that govern how debate flows. These seem intimidating at first but become second nature quickly.",
    motions: [
      { motion: "Motion to Open Debate", desc: "Officially begins the debate session" },
      { motion: "Motion for a Speakers List", desc: "Creates a formal queue for delegates to give speeches" },
      { motion: "Motion to Caucus", desc: "Pauses formal debate for informal discussion or lobbying" },
      { motion: "Motion to Table", desc: "Temporarily sets aside a topic" },
      { motion: "Point of Order", desc: "Challenges an incorrect procedure — not about content" },
      { motion: "Point of Information", desc: "Asks a question after another delegate's speech" },
    ],
    takeaway: "You don't need to memorize every rule on day one — learn the motions you'll use most and build from there.",
  },
  {
    id: 4, title: "Anatomy of a Resolution",
    concept: "Resolutions are the formal output of MUN committees — they're structured documents that call for specific action.",
    structure: [
      { part: "Header", desc: "Committee name, topic, sponsors (authors), and signatories (supporters)" },
      { part: "Preambulatory Clauses", desc: "Begin with words like 'Noting,' 'Recognizing,' 'Deeply concerned.' Sets context and justification." },
      { part: "Operative Clauses", desc: "Begin with words like 'Urges,' 'Calls upon,' 'Encourages.' These are the actual actions being proposed." },
    ],
    example: "NOTING the ongoing humanitarian crisis in Sudan,\nRECOGNIZING the efforts of the African Union,\nCALLS UPON member states to increase humanitarian aid...",
    takeaway: "Preambulatory clauses explain WHY. Operative clauses state WHAT to do. Learn to write both.",
  },
  {
    id: 5, title: "Your Role as a Delegate",
    concept: "As a delegate, you have three responsibilities: represent your country faithfully, contribute to productive debate, and work toward passing strong resolutions.",
    responsibilities: [
      "Research your country's actual position before the conference",
      "Speak in formal language — refer to yourself as 'the delegate of [country]'",
      "Lobby other delegates during unmoderated caucuses",
      "Be willing to compromise — pure wins rarely happen in MUN",
    ],
    takeaway: "The best delegates make the whole committee better — not just their own resolution.",
  },
];

export default function ModelUNIntro() {
  const [openLesson, setOpenLesson] = useState(0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-0.5 text-xs font-semibold text-teal-400">Section 1</span>
          <span className="rounded-full border border-[#1E293B] px-3 py-0.5 text-xs text-[#94A3B8]">Introduction</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-[#F1F5F9]">Introduction to Model UN</h1>
        <p className="text-[#94A3B8]">Understand how committees work, your role as a delegate, and how to navigate the rules of procedure.</p>
      </div>

      <div className="flex flex-col gap-3">
        {LESSONS.map((lesson, i) => {
          const open = openLesson === i;
          return (
            <div key={lesson.id} className="glass-card overflow-hidden rounded-2xl">
              <button onClick={() => setOpenLesson(open ? -1 : i)} className="flex w-full items-center gap-4 p-5 text-left">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500">
                  <BookOpen size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-[#94A3B8]">Lesson {lesson.id}</span>
                  <p className="font-semibold text-[#F1F5F9]">{lesson.title}</p>
                </div>
                {open ? <ChevronUp size={16} className="shrink-0 text-[#94A3B8]" /> : <ChevronDown size={16} className="shrink-0 text-[#94A3B8]" />}
              </button>
              {open && (
                <div className="border-t border-[#1E293B] px-5 pb-5 pt-4 space-y-4">
                  <p className="text-sm leading-relaxed text-[#94A3B8]">{lesson.concept}</p>
                  {"points" in lesson && (lesson as {points:string[]}).points.map((p, idx) => (
                    <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-teal-400" /><p className="text-sm text-[#94A3B8]">{p}</p></div>
                  ))}
                  {"committees" in lesson && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(lesson as {committees:{name:string;full:string;desc:string}[]}).committees.map((c) => (
                        <div key={c.name} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                          <p className="mb-0.5 text-sm font-bold text-teal-400">{c.name} <span className="font-normal text-[#F1F5F9]">— {c.full}</span></p>
                          <p className="text-xs text-[#94A3B8]">{c.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {"motions" in lesson && (
                    <div className="flex flex-col gap-2">
                      {(lesson as {motions:{motion:string;desc:string}[]}).motions.map((m) => (
                        <div key={m.motion} className="flex gap-3 rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                          <p className="text-sm font-semibold text-[#F1F5F9] w-48 shrink-0">{m.motion}</p>
                          <p className="text-sm text-[#94A3B8]">{m.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {"structure" in lesson && (
                    <div className="flex flex-col gap-2">
                      {(lesson as {structure:{part:string;desc:string}[]}).structure.map((s) => (
                        <div key={s.part} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3">
                          <p className="mb-0.5 text-sm font-semibold text-[#F1F5F9]">{s.part}</p>
                          <p className="text-xs text-[#94A3B8]">{s.desc}</p>
                        </div>
                      ))}
                      {"example" in lesson && (
                        <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-4">
                          <p className="mb-1 text-xs font-semibold text-teal-400">Example</p>
                          <pre className="text-xs leading-relaxed text-[#94A3B8] whitespace-pre-wrap">{(lesson as {example:string}).example}</pre>
                        </div>
                      )}
                    </div>
                  )}
                  {"responsibilities" in lesson && (lesson as {responsibilities:string[]}).responsibilities.map((r, idx) => (
                    <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-teal-400" /><p className="text-sm text-[#94A3B8]">{r}</p></div>
                  ))}
                  <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-3">
                    <div className="flex gap-2"><Lightbulb size={14} className="mt-0.5 shrink-0 text-teal-400" /><p className="text-sm font-medium text-[#F1F5F9]">{lesson.takeaway}</p></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <a href="/model-un/committee" className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366F1] py-3.5 font-semibold text-white hover:bg-[#4F46E5]">
          Continue to Section 2 — Committee Work <Globe2 size={16} />
        </a>
      </div>
    </div>
  );
}
