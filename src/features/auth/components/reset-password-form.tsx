"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordInput) {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: data.password }),
    });

    const body = await res.json();

    if (!res.ok) {
      toast.error(body.error ?? "Failed to reset password. The link may have expired.");
      return;
    }

    toast.success("Password reset successfully. Please sign in.");
    router.push("/login");
  }

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-card text-center">
          <p className="text-muted-foreground mb-4">
            Invalid or missing reset token.
          </p>
          <Button variant="outline" asChild>
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-navy-900">
            Set new password
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <FormField label="New password" htmlFor="password" error={errors.password?.message} required>
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
          </FormField>

          <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message} required>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </FormField>

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Reset password
          </Button>
        </form>
      </div>
    </div>
  );
}
