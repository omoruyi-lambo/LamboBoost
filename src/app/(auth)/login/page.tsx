import type { Metadata } from "next";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your LamboBoost account",
};

export default function LoginPage() {
  return (
    <AuthPageShell
      title="Sign in to your account"
      description="Securely access your LamboBoost dashboard and manage orders, wallet top-ups, and support requests."
      helpText="Use your registered email address or Google account to sign in quickly."
      helpLink="/forgot-password"
      helpLabel="Forgot password?"
    >
      <LoginForm />
    </AuthPageShell>
  );
}
