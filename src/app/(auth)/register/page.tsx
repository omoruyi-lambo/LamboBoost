import type { Metadata } from "next";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your LamboBoost account",
};

export default function RegisterPage() {
  return (
    <AuthPageShell
      title="Create your LamboBoost account"
      description="Register quickly and start managing marketing services, wallet funds, and order tracking from one dashboard."
      helpText="Already have an account? Use the sign in flow to access your dashboard right away."
      helpLink="/login"
      helpLabel="Sign in instead"
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
