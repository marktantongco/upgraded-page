import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MARK•UPGRADED — Precision Visual Engineering",
  description: "Upgraded front-end showcase. GSAP timelines. AI photography engine. Playwright automation. Built with Next.js 16, TypeScript, and Tailwind CSS.",
  keywords: ["visual engineering", "GSAP animations", "AI photography", "Next.js", "portfolio", "Mark Tantongco"],
  authors: [{ name: "Mark Tantongco" }],
  openGraph: {
    title: "MARK•UPGRADED — Precision Visual Engineering",
    description: "Modern showcase: GSAP timelines, AI photography, Playwright automation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MARK•UPGRADED — Precision Visual Engineering",
    description: "Modern showcase: GSAP timelines, AI photography, Playwright automation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
