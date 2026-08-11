/**
 * Auth.js (v5) configuration.
 * This file can be imported in both edge and non-edge runtimes.
 */

import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/validations/auth";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // The actual verify logic lives in auth.ts (non-edge)
      async authorize() {
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnAdmin) {
        if (!isLoggedIn) return false;
        return auth?.user?.role === "admin" || auth?.user?.role === "superadmin";
      }

      if (isOnDashboard) {
        return isLoggedIn;
      }

      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
        token.isEmailVerified =
          (user as { isEmailVerified?: boolean }).isEmailVerified ?? false;
      }
      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        token.image = session.image ?? token.image;
        token.role = session.role ?? token.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
};
