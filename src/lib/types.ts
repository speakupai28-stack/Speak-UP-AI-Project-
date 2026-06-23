// ── Public Speaking ─────────────────────────────────────────────────────────

export type SpeakingSessionType = "upload" | "event" | "articulation";

export interface SpeakingSession {
  id: string;
  type: SpeakingSessionType;
  level: DebateLevel;
  topic: string;
  score: number;
  weaknesses: string[];
  date: string;
}

export interface SpeakingProgress {
  level: DebateLevel;
  xp: number;
  sessions: SpeakingSession[];
  weaknesses: Record<string, number>;
}

export interface SpeechArea {
  score: number;
  feedback: string;
  tip: string;
}

export interface SpeechUploadFeedback {
  overallScore: number;
  summary: string;
  articulation: SpeechArea;
  structure: SpeechArea;
  style: SpeechArea;
  delivery: SpeechArea;
  persuasion: SpeechArea;
  confidence: SpeechArea;
  weakness: string;
  improvedOpening: string;
}

export interface EventFeedback {
  event: string;
  overallScore: number;
  judgeVerdict: string;
  eventSpecificFeedback: string;
  strengths: string[];
  improvements: string[];
  openingRewrite: string;
  closingRewrite: string;
  weakness: string;
}

export interface SpeakingProgressionDecision {
  verdict: ProgressionVerdict;
  reasoning: string;
  strengths: string[];
  gaps: string[];
  nextFocus: string;
}

// ── Debate Progression ──────────────────────────────────────────────────────

export type DebateLevel = 1 | 2 | 3;
export type ProgressionVerdict = "advance" | "stay" | "drop";
export type SessionType = "speech" | "sparring" | "rebuttal" | "case_builder";

export interface DebateSession {
  id: string;
  type: SessionType;
  level: DebateLevel;
  topic: string;
  score: number;
  weaknesses: string[];
  date: string;
}

export interface DebateProgress {
  level: DebateLevel;
  xp: number;
  sessions: DebateSession[];
  weaknesses: Record<string, number>; // weakness label → frequency count
}

export interface ProgressionDecision {
  verdict: ProgressionVerdict;
  reasoning: string;
  strengths: string[];
  gaps: string[];
  nextFocus: string;
}

export interface WeaknessReport {
  topWeaknesses: { label: string; count: number; drill: string }[];
  strongAreas: string[];
  overallTrend: string;
}

// ── Debate Features ─────────────────────────────────────────────────────────

export interface RebuttalResult {
  overallScore: number;
  rebuttals: {
    text: string;
    score: number;
    feedback: string;
    improvedVersion: string;
  }[];
  bestRebuttal: string;
  weakness: string;
  nextDrill: string;
}

export interface BuiltCase {
  motion: string;
  side: string;
  framing: string;
  mechanism: string;
  arguments: { title: string; explanation: string; example: string; impact: string }[];
  weighing: string;
  openingSpeech: string;
}

export interface SparringMessage {
  role: "student" | "opponent" | "system";
  content: string;
  poi?: string;
}

export interface JudgeBallot {
  winner: "Proposition" | "Opposition";
  score: number;
  reasoning: string;
  mvp: string;
  mainImprovement: string;
  clashAnalysis: string;
  impactWeighing: string;
}

export interface SpeechFeedback {
  overallScore: number;
  summary: string;
  structure: { score: number; feedback: string; tip: string };
  argument: { score: number; feedback: string; tip: string };
  evidence: { score: number; feedback: string; tip: string };
  rebuttal: { score: number; feedback: string; tip: string };
  impact: { score: number; feedback: string; tip: string };
  delivery: { score: number; feedback: string; tip: string };
  weakness: string;
  improvedParagraph: string;
}

export interface CWIAnalysis {
  found: boolean;
  quote: string;
  feedback: string;
}

export interface DebateLevel1Feedback {
  overallScore: number;
  encouragement: string;
  claimAnalysis: CWIAnalysis;
  warrantAnalysis: CWIAnalysis;
  impactAnalysis: CWIAnalysis;
  strengths: string[];
  improvements: string[];
  rewriteExample: string;
  nextStep: string;
}

export interface ResearchInput {
  country: string;
  committee: string;
  topic: string;
  historicalStance: string;
  bloc?: string;
  speakerPosition?: string;
}

export interface ResearchRoadmapStep {
  step: number;
  title: string;
  description: string;
}

export interface KeySource {
  name: string;
  urlHint: string;
  why: string;
}

export interface ResearchAnalysis {
  summary: string;
  historicalContext: string;
  researchRoadmap: ResearchRoadmapStep[];
  keySources: KeySource[];
  allies: string[];
  adversaries: string[];
  keyTalkingPoints: string[];
  positionPaperTips: string[];
  smartResearchTips: string[];
}

export interface OnboardingProfile {
  greeting: string;
  tagline: string;
  recommendedStart: string;
  topFocusSkills: string[];
  weeklyGoal: string;
  coachingStyle: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  personalizedInsights: string[];
  firstChallengeTitle: string;
  firstChallengeDescription: string;
}

export interface UserData {
  name: string;
  experience: string;
  focus: string[];
  goal: string;
  profile: OnboardingProfile;
}
