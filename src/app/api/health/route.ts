import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { getProviderManager } from "@/lib/providers";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, boolean> = {};

  try {
    await connectDB();
    checks.database = true;
  } catch {
    checks.database = false;
  }

  try {
    const manager = getProviderManager();
    checks.provider = await manager.ping();
  } catch {
    checks.provider = false;
  }

  const allHealthy = Object.values(checks).every(Boolean);

  return NextResponse.json(
    { status: allHealthy ? "ok" : "degraded", checks, timestamp: new Date().toISOString() },
    { status: allHealthy ? 200 : 503 }
  );
}
