import type { Metadata, Viewport } from "next";
import { Manrope, Fraunces } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TermsAgreement from "@/components/TermsAgreement";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
});

export const viewport: Viewport = {
  themeColor: "#F5C6D0",
};

export const metadata: Metadata = {
  title: "Selah Study — Pause. Reflect. Learn.",
  description:
    "Record lectures, study the Bible, create flashcards, and grow in faith. Free study tools for Christian students.",
  keywords: ["Bible study", "lecture recording", "flashcards", "Christian study", "Selah"],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${fraunces.variable} flex min-h-screen flex-col antialiased`}
      >
        <TermsAgreement />
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
