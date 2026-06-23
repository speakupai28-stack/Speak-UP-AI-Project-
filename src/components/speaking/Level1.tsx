"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Mic2, ChevronDown, ChevronUp, ArrowRight, Lightbulb } from "lucide-react";

const LESSONS = [
  { id: 1, title: "Why Public Speaking Matters", concept: "Public speaking is the single skill that amplifies every other skill you have. The person who can communicate clearly and confidently will always have an edge — in school, in interviews, in life.", points: ["It's not about being loud — it's about being clear", "Nervousness is normal and can be channelled into energy", "Public speaking is a skill, not a talent. It is learned."], takeaway: "Every great speaker was once terrified. The only difference is they kept going." },
  { id: 2, title: "Articulation Basics", concept: "Articulation is how clearly you form and deliver words. Poor articulation makes people strain to understand you — which means they stop listening.", points: ["Speak from your diaphragm, not your throat", "Open your mouth wider than feels normal — it creates clarity", "Eliminate filler words: 'um', 'uh', 'like', 'you know'", "Slow down — most nervous speakers rush without realising"], exercise: "Say this three times, each time faster: 'Unique New York, unique New York, you know you need unique New York.'", takeaway: "Clarity beats volume. A quiet speaker who enunciates clearly is always easier to follow than a loud mumbly one." },
  { id: 3, title: "Vocal Variety", concept: "A monotone voice loses audiences in under 60 seconds. Vocal variety is the tool that keeps them engaged.", elements: [{ name: "Pace", desc: "Speed up when excited. Slow down for emphasis. Vary it." }, { name: "Pitch", desc: "Go higher for energy, lower for authority and weight." }, { name: "Pause", desc: "The most powerful tool. Silence commands attention." }, { name: "Volume", desc: "Get louder for impact. Go quiet to draw people in." }], takeaway: "A dramatic pause does more than a dramatic word. Let the silence work for you." },
  { id: 4, title: "Basic Speech Structure", concept: "Every great speech follows the same three-part structure — regardless of topic or length.", structure: [{ part: "Hook (10%)", desc: "Grab attention immediately. A question, a bold claim, a surprising fact, or a story opening." }, { part: "Body (80%)", desc: "Your 2-3 main points. Each one needs a clear claim, a reason, and an example." }, { part: "Close (10%)", desc: "Return to your opening, restate your message, and end with a call to action or memorable line." }], takeaway: "Tell them what you're going to say. Say it. Tell them what you said. Then stop." },
  { id: 5, title: "Body Language Fundamentals", concept: "55% of communication is body language. Your audience reads your body before your words.", tips: ["Stand with feet shoulder-width apart — no swaying", "Make eye contact with different people, 3 seconds each", "Gesture naturally — keep hands above your waist", "Don't cross your arms or hold yourself — it signals anxiety", "Smile before you start speaking — it relaxes you and the audience"], takeaway: "Your posture communicates confidence before you say a single word. Stand like you belong there." },
  { id: 6, title: "Overcoming Nervousness", concept: "Nervousness is your body preparing you to perform. The physiological response to excitement and anxiety is identical — the difference is the story you tell yourself.", strategies: ["Box breathing: inhale 4 counts, hold 4, exhale 4, hold 4", "Reframe: 'I'm excited' instead of 'I'm nervous'", "Prepare so thoroughly that confidence comes from knowledge", "Focus on your audience's experience, not your own fear", "Arrive early and own the physical space before you speak"], takeaway: "Nervousness means you care. Channelled into energy, it makes you better. Suppressed, it makes you worse." },
  { id: 7, title: "The 1-Minute Rule", concept: "If you can't say something meaningful in 60 seconds, you don't know it well enough yet. The 1-minute rule forces clarity.", formula: ["Hook: 10 seconds — grab their attention", "Point: 30 seconds — say the one thing you want them to remember", "Example: 10 seconds — make it concrete", "Close: 10 seconds — end with impact"], takeaway: "If you can say it in 60 seconds, you can say it in 5 minutes. Practice short first." },
  { id: 8, title: "Practice: 60-Second Introduction", concept: "Write a 60-second self-introduction. This is the most common speaking moment in life — nail this and you can nail anything.", tips: ["Don't start with your name — start with a hook", "Include one specific thing that makes you memorable", "End with what you want the audience to do or feel"], takeaway: "The best introductions don't list facts. They tell a tiny story that makes people want to know more." },
];

export default function SpeakingLevel1() {
  const [openLesson, setOpenLesson] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      {LESSONS.map((lesson, i) => {
        const open = openLesson === i;
        return (
          <div key={lesson.id} className="glass-card overflow-hidden rounded-2xl">
            <button onClick={() => setOpenLesson(open ? -1 : i)} className="flex w-full items-center gap-4 p-5 text-left">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500"><Mic2 size={16} className="text-white" /></div>
              <div className="flex-1"><span className="text-xs font-semibold text-[#94A3B8]">Lesson {lesson.id}</span><p className="font-semibold text-[#F1F5F9]">{lesson.title}</p></div>
              {open ? <ChevronUp size={16} className="shrink-0 text-[#94A3B8]" /> : <ChevronDown size={16} className="shrink-0 text-[#94A3B8]" />}
            </button>
            {open && (
              <div className="border-t border-[#1E293B] px-5 pb-5 pt-4 space-y-4">
                <p className="text-sm leading-relaxed text-[#94A3B8]">{lesson.concept}</p>
                {"points" in lesson && (lesson as {points:string[]}).points.map((p, idx) => <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-teal-400" /><p className="text-sm text-[#94A3B8]">{p}</p></div>)}
                {"exercise" in lesson && <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-4"><p className="mb-1 text-xs font-semibold text-teal-400">Drill</p><p className="text-sm italic text-[#94A3B8]">{(lesson as {exercise:string}).exercise}</p></div>}
                {"elements" in lesson && <div className="grid gap-2 sm:grid-cols-2">{(lesson as {elements:{name:string;desc:string}[]}).elements.map((el) => <div key={el.name} className="rounded-xl border border-[#1E293B] bg-[#0A0F1E] p-3"><p className="mb-0.5 text-sm font-semibold text-teal-400">{el.name}</p><p className="text-xs text-[#94A3B8]">{el.desc}</p></div>)}</div>}
                {"structure" in lesson && (lesson as {structure:{part:string;desc:string}[]}).structure.map((s, idx) => <div key={idx} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-xs font-bold text-teal-400">{idx+1}</span><div><p className="text-sm font-semibold text-[#F1F5F9]">{s.part}</p><p className="text-xs text-[#94A3B8]">{s.desc}</p></div></div>)}
                {"tips" in lesson && (lesson as {tips:string[]}).tips.map((t, idx) => <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-teal-400" /><p className="text-sm text-[#94A3B8]">{t}</p></div>)}
                {"strategies" in lesson && (lesson as {strategies:string[]}).strategies.map((s, idx) => <div key={idx} className="flex gap-2"><ArrowRight size={14} className="mt-0.5 shrink-0 text-teal-400" /><p className="text-sm text-[#94A3B8]">{s}</p></div>)}
                {"formula" in lesson && (lesson as {formula:string[]}).formula.map((f, idx) => <div key={idx} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-xs font-bold text-teal-400">{idx+1}</span><p className="text-sm text-[#94A3B8]">{f}</p></div>)}
                <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-3"><div className="flex gap-2"><Lightbulb size={14} className="mt-0.5 shrink-0 text-teal-400" /><p className="text-sm font-medium text-[#F1F5F9]">{lesson.takeaway}</p></div></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
