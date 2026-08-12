"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Separator } from "@/components/ui/separator";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const password = watch("password", "");

  async function onSubmit(data: SignUpInput) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        agreeToTerms: data.agreeToTerms,
      }),
    });

    const body = await res.json();

    if (!res.ok) {
      toast.error(body.error ?? "Registration failed. Please try again.");
      return;
    }

    // Auto sign in after registration
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    toast.success("Account created! Welcome to LamboBoost.");
    router.push("/dashboard");
  }

  async function handleGoogle() {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-[#0F172A]">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Start growing your audience today
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full mb-4"
          onClick={handleGoogle}
          loading={isGoogleLoading}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </Button>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-muted-foreground">
            or
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <FormField label="Full name" htmlFor="name" error={errors.name?.message} required>
            <Input id="name" placeholder="John Doe" autoComplete="name" error={!!errors.name} {...register("name")} />
          </FormField>

          <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
            <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" error={!!errors.email} {...register("email")} />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password?.message} required>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                error={!!errors.password}
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEyeSlash} className="h-4 w-4" />
                ) : (
                  <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                )}
              </button>
            </div>
            {password && (
              <ul className="mt-2 space-y-1">
                {passwordRules.map((rule) => (
                  <li key={rule.label} className={cn("flex items-center gap-2 text-xs", rule.test(password) ? "text-[#2563EB]" : "text-muted-foreground")}>
                    <FontAwesomeIcon icon={faCheck} className={cn("h-3 w-3", rule.test(password) ? "opacity-100" : "opacity-0")} />
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
          </FormField>

          <FormField label="Confirm password" htmlFor="confirm" error={errors.confirmPassword?.message} required>
            <Input id="confirm" type="password" placeholder="••••••••" autoComplete="new-password" error={!!errors.confirmPassword} {...register("confirmPassword")} />
          </FormField>

          <div className="flex items-start gap-3 pt-1">
            <input
              id="terms"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              {...register("agreeToTerms")}
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-xs text-destructive">{errors.agreeToTerms.message}</p>
          )}

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
