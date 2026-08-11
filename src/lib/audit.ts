import { connectDB } from "@/lib/db/mongoose";
import { AuditLog } from "@/lib/db/models";

interface AuditOptions {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

export async function audit(opts: AuditOptions): Promise<void> {
  try {
    await connectDB();
    await AuditLog.create(opts);
  } catch (err) {
    // Audit failures must never crash the main flow
    console.error("[audit] Failed to write audit log:", err);
  }
}
