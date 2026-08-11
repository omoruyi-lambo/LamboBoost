import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { render } from "@react-email/components";
import { BaseEmail, emailStyles } from "./base";
import resend, { FROM } from "@/lib/email/resend";
import { APP_URL } from "@/lib/constants";

interface ResetPasswordProps {
  name: string;
  token: string;
}

export function ResetPasswordTemplate({ name, token }: ResetPasswordProps) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  return (
    <BaseEmail preview="Reset your LamboBoost password">
      <Text style={emailStyles.h1}>Reset your password</Text>
      <Text style={emailStyles.p}>
        Hi {name}, we received a request to reset your LamboBoost password.
        Click the button below to create a new password.
      </Text>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={resetUrl} style={emailStyles.button}>
          Reset Password
        </Button>
      </Section>
      <Text style={emailStyles.p}>
        This link expires in 1 hour. If you did not request a password reset,
        you can safely ignore this email — your password will not change.
      </Text>
      <Text style={emailStyles.muted}>
        For security, this request came from{" "}
        {new Date().toLocaleDateString("en-NG", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        .
      </Text>
    </BaseEmail>
  );
}

export async function sendResetPasswordEmail({
  name,
  email,
  token,
}: {
  name: string;
  email: string;
  token: string;
}) {
  const html = await render(
    <ResetPasswordTemplate name={name} token={token} />
  );
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your LamboBoost password",
    html,
  });
}
