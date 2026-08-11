import { Button, Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { render } from "@react-email/components";
import { BaseEmail, emailStyles } from "./base";
import resend, { FROM } from "@/lib/email/resend";
import { APP_URL } from "@/lib/constants";

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmailTemplate({ name }: WelcomeEmailProps) {
  return (
    <BaseEmail preview={`Welcome to LamboBoost, ${name}!`}>
      <Text style={emailStyles.h1}>Welcome to LamboBoost, {name}!</Text>
      <Text style={emailStyles.p}>
        Your account is ready. You can now fund your wallet and start placing
        orders for digital marketing services across Instagram, TikTok, YouTube,
        and more.
      </Text>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={`${APP_URL}/dashboard`} style={emailStyles.button}>
          Go to Dashboard
        </Button>
      </Section>
      <Text style={emailStyles.p}>
        If you have any questions, our support team is available 24/7.
      </Text>
      <Text style={emailStyles.muted}>
        If you did not create this account, you can safely ignore this email.
      </Text>
    </BaseEmail>
  );
}

export async function sendWelcomeEmail({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const html = await render(<WelcomeEmailTemplate name={name} />);
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to LamboBoost",
    html,
  });
}
