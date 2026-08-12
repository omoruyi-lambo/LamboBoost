import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models";

const ROLES = ["user", "admin", "superadmin"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !["admin", "superadmin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const role = body.role as (typeof ROLES)[number] | undefined;
    const isActive = body.isActive as boolean | undefined;

    if (role !== undefined && !ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    await connectDB();
    const target = await User.findById(id);
    if (!target) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isSelf = String(target._id) === session.user.id;

    if (role !== undefined && isSelf) {
      return NextResponse.json(
        { error: "You cannot change your own role." },
        { status: 400 }
      );
    }

    if (isActive === false && isSelf) {
      return NextResponse.json(
        { error: "You cannot suspend your own account." },
        { status: 400 }
      );
    }

    // Only superadmins can assign or touch superadmin accounts
    if (session.user.role !== "superadmin") {
      if (role === "superadmin") {
        return NextResponse.json(
          { error: "Only a superadmin can assign the superadmin role." },
          { status: 403 }
        );
      }
      if (target.role === "superadmin") {
        return NextResponse.json(
          { error: "Only a superadmin can manage a superadmin account." },
          { status: 403 }
        );
      }
    }

    const update: Record<string, unknown> = {};
    if (role !== undefined) update.role = role;
    if (isActive !== undefined) update.isActive = isActive;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: {
        id: String(updated._id),
        name: updated.name,
        email: updated.email,
        role: updated.role,
        isActive: updated.isActive,
      },
    });
  } catch (err) {
    console.error("[admin users PATCH]", err);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}
