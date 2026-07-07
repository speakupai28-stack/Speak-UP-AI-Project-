"use client";

import { useState } from "react";
import { BookOpen, Mic2, Star, Target } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabPanel, type TabItem } from "@/components/ui/Tabs";
import SpeakingProgressBar from "./ProgressBar";
import SpeechUpload from "./SpeechUpload";
import EventPractice from "./EventPractice";
import SpeakingWeaknessDetector from "./WeaknessDetector";
import { useSpeakingProgress } from "@/components/providers/ProgressProvider";

const TABS: TabItem[] = [
  { id: "lessons", label: "Lessons", icon: BookOpen },
  { id: "speech", label: "Speech Feedback", icon: Mic2 },
  { id: "event", label: "Events", icon: Star },
  { id: "weakness", label: "Weaknesses", icon: Target },
];

type Tab = (typeof TABS)[number]["id"];

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations",
  2: "Style & Delivery",
  3: "Performance",
};

interface SpeakingArenaProps {
  LessonsComponent: React.ComponentType;
}

export default function SpeakingArena({ LessonsComponent }: SpeakingArenaProps) {
  const [tab, setTab] = useState<Tab>("lessons");
  const { progress } = useSpeakingProgress();
  const level = progress?.level ?? 1;

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <div className="mb-4">
        <Badge variant="maroon">
          Level {level} — {LEVEL_LABELS[level]}
        </Badge>
      </div>

      <SpeakingProgressBar />

      <Tabs tabs={TABS} active={tab} onChange={(id) => setTab(id as Tab)} className="mb-6" />

      <TabPanel id="lessons" active={tab}>
        <LessonsComponent />
      </TabPanel>
      <TabPanel id="speech" active={tab}>
        <SpeechUpload level={level} />
      </TabPanel>
      <TabPanel id="event" active={tab}>
        <EventPractice level={level} />
      </TabPanel>
      <TabPanel id="weakness" active={tab}>
        <SpeakingWeaknessDetector />
      </TabPanel>
    </div>
  );
}
