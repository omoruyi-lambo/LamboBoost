"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faChartLine, faLock } from "@fortawesome/free-solid-svg-icons";

type AuthPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  helpText?: string;
  helpLink?: string;
  helpLabel?: string;
};

const highlights = [
  {
    icon: faLock,
    title: "Secure authentication",
    text: "Your account stays protected with strong password rules and optional Google sign-in.",
  },
  {
    icon: faBolt,
    title: "Fast onboarding",
    text: "Create your account in seconds and start placing orders with a funded wallet right away.",
  },
  {
    icon: faChartLine,
    title: "Order visibility",
    text: "Track progress, review payments, and manage support requests from one clean dashboard.",
  },
];

export function AuthPageShell({
  title,
  description,
  children,
  helpText,
  helpLink,
  helpLabel,
}: AuthPageShellProps) {
  return (
    <section className="w-full py-6 md:py-10">
      <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* Brand panel — desktop only */}
        <div className="hidden lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-400">
            Secure access
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">{description}</p>

          <div className="mt-8 space-y-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/20 text-sky-400">
                  <FontAwesomeIcon icon={item.icon} className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
              <div>
                <p className="font-semibold text-white">Need help?</p>
                <p className="mt-1">You can always reach support if you get stuck.</p>
              </div>
              <Link
                href={helpLink ?? "/contact"}
                className="shrink-0 font-semibold text-sky-400 transition-colors hover:text-sky-300"
              >
                {helpLabel ?? "Contact support"}
              </Link>
            </div>
            {helpText ? <p className="mt-4 text-sm leading-6 text-slate-300">{helpText}</p> : null}
          </div>
        </div>

        {/* Form — each form brings its own card, centered */}
        <div className="flex w-full justify-center">{children}</div>
      </div>
    </section>
  );
}
