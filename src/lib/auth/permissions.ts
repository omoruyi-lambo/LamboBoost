import { auth } from "./auth";
import type { UserRole } from "@/types";

export function isAdminRole(role?: string): boolean {
  return role === "admin" || role === "superadmin";
}

export async function requireAuthUser() {
  const session = await auth();
  if (!session?.user) {
    const error = new Error("Unauthorized");
    (error as any).status = 401;
    throw error;
  }
  return session.user;
}

export async function requireAdminUser() {
  const user = await requireAuthUser();
  if (!isAdminRole(user.role)) {
    const error = new Error("Forbidden");
    (error as any).status = 403;
    throw error;
  }
  return user;
}

export function requireRole(role: UserRole) {
  return async () => {
    const user = await requireAuthUser();
    if (user.role !== role) {
      const error = new Error("Forbidden");
      (error as any).status = 403;
      throw error;
    }
    return user;
  };
}
