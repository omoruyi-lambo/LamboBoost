import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import { User, Wallet } from "@/lib/db/models";
import { signUpSchema } from "@/lib/validations/auth";
import { safeAdd } from "@/lib/queue/queues";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    await connectDB();
    const { name, password } = parsed.data;
    // Normalize: strip surrounding quotes/whitespace so pasted or quoted
    // emails are stored and matched consistently.
    const email = parsed.data.email.trim().replace(/^"|"$/g, "");

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    const userId = String(user._id);
    const wallet = await Wallet.create({ userId: userId });

    // Queue welcome email
    await safeAdd("email", "welcome", {
      type: "welcome",
      userId,
      name: user.name,
      email: user.email,
    });

    // Queue welcome notification
    await safeAdd("notification", "welcome-notif", {
      userId,
      type: "system",
      title: "Welcome to LamboBoost!",
      message: "Your account is ready. Fund your wallet to start placing orders.",
      actionUrl: "/dashboard/wallet",
    });

    return NextResponse.json({
      success: true,
      data: { id: userId, name: user.name, email: user.email },
    }, { status: 201 });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
