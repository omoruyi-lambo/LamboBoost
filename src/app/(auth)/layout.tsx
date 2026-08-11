import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Minimal header */}
      <header className="px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display font-bold text-lg text-navy-900"
          aria-label="LamboBoost home"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <span className="text-[11px] font-bold text-white" aria-hidden>L</span>
          </div>
          LamboBoost
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LamboBoost. All rights reserved.
      </footer>
    </div>
  );
}
