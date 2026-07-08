import type { NextAuthConfig, DefaultSession } from "next-auth";
import type { Plan } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: Plan;
    } & DefaultSession["user"];
  }

  interface User {
    plan?: Plan;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    plan: Plan;
  }
}

// Edge-safe base config (no Prisma adapter, no providers with Node-only
// dependencies) — this is what middleware.ts runs on the Edge runtime.
// The full config in src/auth.ts extends this with the Credentials
// provider + PrismaAdapter, and runs in the Node runtime (route handlers,
// server components).
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.plan = user.plan ?? ("FREE" as Plan);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.plan = token.plan;
      return session;
    },
  },
} satisfies NextAuthConfig;
