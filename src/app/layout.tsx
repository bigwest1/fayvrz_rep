import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Atkinson_Hyperlegible, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  variable: "--font-atkinson",
  weight: ["400", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fayvrz | Know your next step.",
  description:
    "Calm guidance for life events with actionable plans, local resources, and autopilot support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "var(--color-text)",
          colorBackground: "var(--color-surface)",
          colorText: "var(--color-text)",
          borderRadius: "16px",
          fontFamily: "var(--font-body, 'Atkinson Hyperlegible', system-ui, -apple-system, sans-serif)",
        },
        elements: {
          card: "border border-[color:var(--color-border)] shadow-[var(--shadow-subtle)] bg-[color:var(--color-surface)]",
          headerTitle: "text-[color:var(--color-text)]",
          headerSubtitle: "text-[color:var(--color-text-muted)]",
          formButtonPrimary:
            "rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] text-[color:var(--color-surface)] hover:bg-[color:var(--color-text)] hover:opacity-90 transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-standard)]",
          formFieldInput:
            "rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] focus:border-[color:var(--color-border-strong)] focus:ring-0 text-[color:var(--color-text)]",
          footerActionLink:
            "text-[color:var(--color-text)] font-semibold hover:text-[color:var(--color-text-muted)]",
        },
      }}
    >
      <html
        lang="en"
        className={`${atkinson.variable} ${plexMono.variable}`}
        suppressHydrationWarning
      >
        <body className="min-h-screen bg-[color:var(--color-canvas)] text-[color:var(--color-text)] antialiased">
          <div className="flex min-h-screen flex-col">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
