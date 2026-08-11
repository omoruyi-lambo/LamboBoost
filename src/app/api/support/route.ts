import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { SupportTicket } from "@/lib/db/models";
import { createTicketSchema } from "@/lib/validations/support";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = createTicketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    await connectDB();
    const ticket = await SupportTicket.create({
      userId: session.user.id,
      subject: parsed.data.subject,
      priority: parsed.data.priority,
      messages: [{
        senderId: session.user.id,
        senderRole: "user",
        message: parsed.data.message,
      }],
    });

    return NextResponse.json({ success: true, data: { ticketId: ticket._id } }, { status: 201 });
  } catch (err) {
    console.error("[support POST]", err);
    return NextResponse.json({ error: "Failed to create ticket." }, { status: 500 });
  }
}
