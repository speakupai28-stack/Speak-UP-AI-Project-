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
