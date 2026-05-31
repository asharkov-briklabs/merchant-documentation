// fumadocs ships a prebuilt Tailwind stylesheet (its own `.hidden`, preflight,
// and `--fd-*` defaults). Import it FIRST so our globals.css wins the cascade —
// otherwise fumadocs' `.hidden{display:none}` overrides our responsive
// `md:flex`/`md:block` utilities (hiding the nav categories + hero code card)
// and its `--fd-*` defaults clobber our theme overrides.
import "fumadocs-ui/style.css";
import "./globals.css";
import { RootProvider } from "fumadocs-ui/provider";
import { CATEGORY_TAGS } from "@/lib/taxonomy";
import { Inter, Roboto_Mono } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
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
      </body>
    </html>
  );
}
