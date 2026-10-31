import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./oiai.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "OiAI — Oops! I Ate It. | Homemade Chocolates",
    template: "%s | OiAI — Oops! I Ate It.",
  },
  description:
    "OiAI, Oops! I Ate It. Homemade chocolates made slowly, wrapped by hand, and impossible to leave alone.",
  applicationName: "OiAI — Oops! I Ate It.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4e7cc",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body><Script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js" strategy="beforeInteractive" />
        {children}</body>
    </html>
  );
}
