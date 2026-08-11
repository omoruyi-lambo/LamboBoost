import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getProviderManager, listRegisteredProviders } from "@/lib/providers";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["admin", "superadmin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const manager = getProviderManager();
  const registered = listRegisteredProviders().map((p) => ({ slug: p.slug, name: p.name }));
  const isOnline = await manager.ping();
  const balance = isOnline ? await manager.getBalance().catch(() => null) : null;
  return NextResponse.json({
    success: true,
    data: {
      active: { slug: manager.activeProviderSlug, name: manager.activeProviderName },
      registered,
      isOnline,
      balance,
    },
  });
}
