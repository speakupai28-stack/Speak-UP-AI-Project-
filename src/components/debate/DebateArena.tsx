"use client";

import { useState } from "react";
import { BookOpen, Swords, Timer, FileText, Target, Mic } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabPanel, type TabItem } from "@/components/ui/Tabs";
import ProgressBar from "./ProgressBar";
import RebuttalTrainer from "./RebuttalTrainer";
import CaseBuilder from "./CaseBuilder";
import SparringPartner from "./SparringPartner";
import WeaknessDetector from "./WeaknessDetector";
import { useDebateProgress } from "@/components/providers/ProgressProvider";

const TABS: TabItem[] = [
  { id: "lessons", label: "Lessons", icon: BookOpen },
  { id: "sparring", label: "Sparring", icon: Swords },
  { id: "rebuttal", label: "Rebuttal", icon: Timer },
  { id: "case", label: "Case Builder", icon: FileText },
  { id: "speech", label: "Speech", icon: Mic },
  { id: "weakness", label: "Weaknesses", icon: Target },
];

type Tab = (typeof TABS)[number]["id"];

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations",
  2: "Strategy",
  3: "Competition",
};

interface DebateArenaProps {
  defaultTab?: Tab;
  LessonsComponent: React.ComponentType;
  SpeechComponent: React.ComponentType<{ level?: number }>;
}

export default function DebateArena({
  defaultTab = "lessons",
  LessonsComponent,
  SpeechComponent,
}: DebateArenaProps) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const { progress } = useDebateProgress();
  const level = progress?.level ?? 1;

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <div className="mb-4">
        <Badge variant="maroon">
          Level {level} — {LEVEL_LABELS[level]}
        </Badge>
      </div>

      <ProgressBar />

      <Tabs tabs={TABS} active={tab} onChange={(id) => setTab(id as Tab)} className="mb-6" />

      <TabPanel id="lessons" active={tab}>
        <LessonsComponent />
      </TabPanel>
      <TabPanel id="sparring" active={tab}>
        <SparringPartner level={level} />
      </TabPanel>
      <TabPanel id="rebuttal" active={tab}>
        <RebuttalTrainer level={level} />
      </TabPanel>
      <TabPanel id="case" active={tab}>
        <CaseBuilder level={level} />
      </TabPanel>
      <TabPanel id="speech" active={tab}>
        <SpeechComponent level={level} />
      </TabPanel>
      <TabPanel id="weakness" active={tab}>
        <WeaknessDetector />
      </TabPanel>
    </div>
  );
}
