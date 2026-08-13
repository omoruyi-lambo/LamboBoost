import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "@/components/providers";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "digital marketing",
    "social media growth",
    "Instagram followers",
    "TikTok views",
    "YouTube subscribers",
    "SMM panel",
    "LamboBoost",
  ],
  authors: [{ name: "LamboBoost" }],
  creator: "LamboBoost",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast:
                "bg-card border border-border shadow-elevated text-foreground font-sans",
              title: "text-sm font-semibold",
              description: "text-xs text-muted-foreground",
              actionButton:
                "bg-primary text-primary-foreground hover:bg-primary/90",
              cancelButton: "bg-muted text-muted-foreground",
              closeButton:
                "bg-card border-border text-muted-foreground hover:text-foreground",
              success: "text-emerald-600",
              error: "text-destructive",
            },
          }}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
