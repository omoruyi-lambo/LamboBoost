import type { Metadata } from "next";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      title="Reset your password"
      description="Enter your email address and we’ll send a secure link to reset your password."
      helpText="If you don’t receive the email within a few minutes, check your spam folder or contact support."
      helpLink="/login"
      helpLabel="Sign in instead"
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
