"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ButtonLink } from "@/components/ui";

const navLinks = [
  { href: "/debate", label: "Debate" },
  { href: "/model-un", label: "Model UN" },
  { href: "/public-speaking", label: "Public Speaking" },
  { href: "/coach", label: "Coach" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            SpeakUP<span className="text-maroon">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-maroon",
                pathname === href || pathname.startsWith(href)
                  ? "text-maroon"
                  : "text-ink-soft hover:text-ink"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/#pricing"
            className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Pricing
          </Link>
          <ButtonLink href="/onboarding" size="sm">
            Get Started
          </ButtonLink>
        </div>
      </div>
    </nav>
  );
}
