import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpeakUp AI — Debate & Model UN Learning Platform",
  description:
    "AI-powered coaching for debate, Model UN, and public speaking. Learn from expert-level AI coaches and compete at the highest level.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0A0F1E] text-[#F1F5F9]">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
