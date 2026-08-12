"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // Always show success (security: don't reveal if email exists)
    setSent(true);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error(body.error);
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-card text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF]">
            <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[#0F172A] mb-2">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            If an account exists for <strong>{getValues("email")}</strong>, we
            sent a password reset link. Check your inbox and spam folder.
          </p>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
              Back to sign in
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Back to sign in
          </Link>
          <h1 className="font-display text-2xl font-bold text-[#0F172A]">
            Forgot your password?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={!!errors.email}
              {...register("email")}
            />
          </FormField>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Send reset link
          </Button>
        </form>
      </div>
    </div>
  );
}
