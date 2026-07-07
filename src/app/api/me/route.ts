import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { onboarding: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    plan: user.plan,
    name: user.name,
    experience: user.onboarding?.experience ?? "beginner",
    focus: user.onboarding?.focus ?? [],
    goal: user.onboarding?.goal ?? "",
    profile: user.onboarding
      ? {
          greeting: user.onboarding.greeting,
          tagline: user.onboarding.tagline,
          recommendedStart: user.onboarding.recommendedStart,
          topFocusSkills: user.onboarding.topFocusSkills,
          weeklyGoal: user.onboarding.weeklyGoal,
          coachingStyle: user.onboarding.coachingStyle,
          difficultyLevel: user.onboarding.difficultyLevel,
          personalizedInsights: user.onboarding.personalizedInsights,
          firstChallengeTitle: user.onboarding.firstChallengeTitle,
          firstChallengeDescription: user.onboarding.firstChallengeDescription,
        }
      : null,
  });
}
