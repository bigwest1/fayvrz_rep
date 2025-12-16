import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
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
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
