import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpeakUp AI — Debate, Model UN & Public Speaking Coaching",
  description:
    "An always-on AI coach for debate, Model UN, and public speaking — live rebuttals, speech feedback, and skill scoring after every session.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
