"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/debate", label: "Debate" },
  { href: "/model-un", label: "Model UN" },
  { href: "/public-speaking", label: "Public Speaking" },
  { href: "/coach", label: "Coach" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1E293B] bg-[#0A0F1E]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gradient">SpeakUP AI</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "text-sm font-medium transition-colors",
                pathname === href || (href !== "/" && pathname.startsWith(href))
                  ? "text-[#6366F1]"
                  : "text-[#94A3B8] hover:text-[#F1F5F9]"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/onboarding"
          className="rounded-full bg-[#6366F1] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4F46E5]"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
