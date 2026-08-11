/**
 * Full Auth.js configuration with database adapter.
 * This file should only be imported from non-edge runtime code.
 */

import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import { authConfig } from "./auth.config";
import { connectDB } from "@/lib/db/mongoose";
import { User, Wallet } from "@/lib/db/models";
import { signInSchema } from "@/lib/validations/auth";

// Raw MongoDB client for Auth.js adapter (required by @auth/mongodb-adapter)
// Lazy connect so missing URI in dev doesn't crash at import time
const client = new MongoClient(process.env.MONGODB_URI ?? "mongodb://localhost:27017/lamboboost");
const clientPromise = client.connect().catch((err) => {
  console.warn("[auth] MongoDB connection failed:", err.message);
  return client;
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "lamboboost",
  }),
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
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        await connectDB();

        const user = await User.findOne({ email: email.toLowerCase() })
          .select("+password")
          .lean();

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        if (!user.isActive) return null;

        // Update last login time
        await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        };
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      // Create a wallet for every new user
      await connectDB();
      await Wallet.create({ userId: user.id, balance: 0 });
    },
  },
});
