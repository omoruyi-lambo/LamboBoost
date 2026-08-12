import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B1220] text-slate-50">
      {/* Abstract technology background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/hero-bg.svg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#0B1220]/55" aria-hidden="true" />

      {/* Single aligned column for header, content, and footer */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-0">
        <header className="flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-lg font-semibold text-white"
            aria-label="LamboBoost home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="LamboBoost logo" className="h-9 w-auto" />
            LamboBoost
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center py-10">
          {children}
        </main>

        <footer className="py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} LamboBoost. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
