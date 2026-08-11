import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { render } from "@react-email/components";
import { BaseEmail, emailStyles } from "./base";
import resend, { FROM } from "@/lib/email/resend";
import { APP_URL } from "@/lib/constants";

interface OrderPlacedProps {
  orderId: string;
}

export function OrderPlacedTemplate({ orderId }: OrderPlacedProps) {
  const orderUrl = `${APP_URL}/dashboard/orders/${orderId}`;

  return (
    <BaseEmail preview="Your LamboBoost order has been placed">
      <Text style={emailStyles.h1}>Order placed successfully</Text>
      <Text style={emailStyles.p}>
        Your order has been placed and is now being processed. You can track
        its progress in real-time from your dashboard.
      </Text>
      <Text style={emailStyles.code}>#{orderId.slice(-8).toUpperCase()}</Text>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={orderUrl} style={emailStyles.button}>
          Track Order
        </Button>
      </Section>
      <Text style={emailStyles.muted}>
        Most orders start processing within 15 minutes. If you have any
        questions, contact our support team.
      </Text>
    </BaseEmail>
  );
}

export async function sendOrderPlacedEmail({
  email,
  orderId,
}: {
  email: string;
  orderId: string;
}) {
  const html = await render(<OrderPlacedTemplate orderId={orderId} />);
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your LamboBoost order has been placed",
    html,
  });
}
