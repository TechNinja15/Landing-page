import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thriveskilltech.com"),
  title: {
    default: "Thrive Skill Tech — Content to Career",
    template: "%s | Thrive Skill Tech",
  },
  description:
    "Learn AI Agents, Automation, Digital Marketing and Content Creation from industry practitioners — live instructor-led training with real projects and career support.",
  openGraph: {
    title: "Thrive Skill Tech — Content to Career",
    description:
      "AI-first career accelerator: AI Agents & Automation, Digital Marketing, and Content Creation & Personal Branding.",
    url: "https://thriveskilltech.com",
    siteName: "Thrive Skill Tech",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thrive Skill Tech — Content to Career",
    description: "Learn AI Agents, Automation, Digital Marketing and Content Creation from industry practitioners.",
  },
  // TODO: add icons.icon / icons.apple once favicon assets are exported
  // from the master logo artwork per Brand Identity System §03.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
