import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { render } from "@react-email/components";
import { BaseEmail, emailStyles } from "./base";
import resend, { FROM } from "@/lib/email/resend";
import { APP_URL } from "@/lib/constants";

interface VerifyEmailProps {
  name: string;
  token: string;
}

export function VerifyEmailTemplate({ name, token }: VerifyEmailProps) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  return (
    <BaseEmail preview="Verify your LamboBoost email address">
      <Text style={emailStyles.h1}>Verify your email address</Text>
      <Text style={emailStyles.p}>
        Hi {name}, please verify your email address to activate your account
        and start using LamboBoost.
      </Text>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={verifyUrl} style={emailStyles.button}>
          Verify Email Address
        </Button>
      </Section>
      <Text style={emailStyles.p}>
        This link expires in 24 hours. If you did not create a LamboBoost
        account, you can safely ignore this email.
      </Text>
      <Text style={emailStyles.muted}>
        Or copy this link into your browser:{" "}
        <span style={{ color: "#2563EB" }}>{verifyUrl}</span>
      </Text>
    </BaseEmail>
  );
}

export async function sendVerifyEmail({
  name,
  email,
  token,
}: {
  name: string;
  email: string;
  token: string;
}) {
  const html = await render(<VerifyEmailTemplate name={name} token={token} />);
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your LamboBoost email",
    html,
  });
}
