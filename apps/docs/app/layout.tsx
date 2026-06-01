// fumadocs styles come from the Tailwind preset (createPreset) in
// tailwind.config.ts, which injects fumadocs' base/components into our single
// Tailwind build alongside globals.css. We deliberately do NOT import
// `fumadocs-ui/style.css` — that prebuilt stylesheet is for projects without
// their own Tailwind setup, and importing it here ran a second, parallel
// Tailwind build (duplicate preflight, duplicate `.hidden`/utilities, duplicate
// `--fd-*` defaults) that fought our globals.css for cascade order.
import "./globals.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { CATEGORY_TAGS } from "@/lib/taxonomy";
import { SITE_URL } from "@/lib/site-url";
import { Inter, Roboto_Mono } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AskAIPanel } from "./components/ask-ai-panel";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s — VINR Docs",
    default: "VINR Documentation",
  },
  description:
    "Self-service documentation for merchants integrating with and operating on the VINR payment platform.",
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col antialiased">
        <RootProvider search={{ options: { tags: CATEGORY_TAGS } }}>
          {children}
        </RootProvider>
        <AskAIPanel />
      </body>
    </html>
  );
}
