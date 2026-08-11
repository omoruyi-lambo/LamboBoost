import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface BaseEmailProps {
  preview: string;
  children: React.ReactNode;
}

export function BaseEmail({ preview, children }: BaseEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: "#F8FAFC",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Section
            style={{
              backgroundColor: "#0F172A",
              padding: "24px 40px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                color: "#93C5FD",
                fontSize: "22px",
                fontWeight: "700",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              LamboBoost
            </Text>
          </Section>

          {/* Content */}
          <Section style={{ padding: "40px" }}>{children}</Section>

          {/* Footer */}
          <Hr style={{ borderColor: "#E5E7EB", margin: 0 }} />
          <Section
            style={{
              padding: "24px 40px",
              backgroundColor: "#F8FAFC",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: "12px",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              © {new Date().getFullYear()} LamboBoost. All rights reserved.
              <br />
              You are receiving this email because you signed up at LamboBoost.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const emailStyles = {
  h1: {
    color: "#0F172A",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 8px",
    lineHeight: "1.3",
  } as React.CSSProperties,
  p: {
    color: "#374151",
    fontSize: "15px",
    lineHeight: "1.7",
    margin: "0 0 16px",
  } as React.CSSProperties,
  button: {
    backgroundColor: "#2563EB",
    color: "#ffffff",
    padding: "14px 28px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    textDecoration: "none",
    display: "inline-block",
  } as React.CSSProperties,
  code: {
    backgroundColor: "#F8FAFC",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "16px 24px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: "4px",
    display: "block",
    textAlign: "center" as const,
    margin: "24px 0",
  } as React.CSSProperties,
  muted: {
    color: "#9CA3AF",
    fontSize: "13px",
    lineHeight: "1.6",
    margin: "0",
  } as React.CSSProperties,
};
