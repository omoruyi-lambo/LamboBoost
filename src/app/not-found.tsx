import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center px-4">
        <p className="font-display text-8xl font-bold text-navy-900 mb-4">404</p>
        <h1 className="font-display text-2xl font-bold text-navy-900 mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild><Link href="/">Go home</Link></Button>
          <Button variant="outline" asChild><Link href="/dashboard">Dashboard</Link></Button>
        </div>
      </div>
    </div>
  );
}
