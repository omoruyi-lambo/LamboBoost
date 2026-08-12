import type { Metadata } from "next";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <AuthPageShell
      title="Create a new password"
      description="Choose a strong password for your account and return to the dashboard safely."
      helpText="If your reset link has expired, request a new reset email from the previous page."
      helpLink="/forgot-password"
      helpLabel="Request new link"
    >
      <ResetPasswordForm />
    </AuthPageShell>
  );
}
