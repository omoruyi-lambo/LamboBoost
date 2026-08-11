import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { render } from "@react-email/components";
import { BaseEmail, emailStyles } from "./base";
import resend, { FROM } from "@/lib/email/resend";
import { APP_URL, CURRENCY_SYMBOL } from "@/lib/constants";

interface DepositConfirmedProps {
  amount: number;
  reference: string;
}

export function DepositConfirmedTemplate({
  amount,
  reference,
}: DepositConfirmedProps) {
  return (
    <BaseEmail preview={`${CURRENCY_SYMBOL}${amount.toLocaleString()} deposited to your LamboBoost wallet`}>
      <Text style={emailStyles.h1}>Deposit confirmed</Text>
      <Text style={emailStyles.p}>
        Your wallet has been funded successfully.
      </Text>
      <Section
        style={{
          backgroundColor: "#F8FAFC",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "20px 24px",
          margin: "24px 0",
        }}
      >
        <Text
          style={{
            color: "#9CA3AF",
            fontSize: "13px",
            margin: "0 0 4px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Amount Added
        </Text>
        <Text
          style={{
            color: "#0F172A",
            fontSize: "32px",
            fontWeight: "700",
            margin: "0 0 12px",
          }}
        >
          {CURRENCY_SYMBOL}{amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </Text>
        <Text style={emailStyles.muted}>Reference: {reference}</Text>
      </Section>
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={`${APP_URL}/dashboard/wallet`} style={emailStyles.button}>
          View Wallet
        </Button>
      </Section>
    </BaseEmail>
  );
}

export async function sendDepositConfirmedEmail({
  email,
  amount,
  reference,
}: {
  email: string;
  amount: number;
  reference: string;
}) {
  const html = await render(
    <DepositConfirmedTemplate amount={amount} reference={reference} />
  );
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `${CURRENCY_SYMBOL}${amount.toLocaleString()} deposited to your wallet`,
    html,
  });
}
