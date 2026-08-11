import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your LamboBoost account",
};

export default function LoginPage() {
  return <LoginForm />;
}
