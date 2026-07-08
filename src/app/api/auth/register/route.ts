import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1),
  experience: z.string().min(1),
  focus: z.array(z.string()).min(1),
  goal: z.string().min(1),
  profile: z.object({
    greeting: z.string(),
    tagline: z.string(),
    recommendedStart: z.string(),
    topFocusSkills: z.array(z.string()),
    weeklyGoal: z.string(),
    coachingStyle: z.string(),
    difficultyLevel: z.string(),
    personalizedInsights: z.array(z.string()),
    firstChallengeTitle: z.string(),
    firstChallengeDescription: z.string(),
  }),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { email, password, name, experience, focus, goal, profile } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      onboarding: {
        create: {
          experience,
          focus,
          goal,
          ...profile,
        },
      },
      debateProgress: { create: {} },
      speakingProgress: { create: {} },
    },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}
