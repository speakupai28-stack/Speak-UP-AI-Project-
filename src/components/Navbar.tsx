"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui";

const navLinks = [
  { href: "/debate", label: "Debate" },
  { href: "/model-un", label: "Model UN" },
  { href: "/public-speaking", label: "Public Speaking" },
  { href: "/coach", label: "Coach" },
  { href: "/#pricing", label: "Pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <nav className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
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
                href !== "/#pricing" && (pathname === href || pathname.startsWith(href))
                  ? "text-maroon"
                  : "text-ink-soft hover:text-ink"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ButtonLink href="/onboarding" size="sm">
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Start</span>
          </ButtonLink>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-ink/10 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    "rounded-md px-3 py-3 text-base font-medium transition-colors",
                    href !== "/#pricing" && (pathname === href || pathname.startsWith(href))
                      ? "bg-maroon/10 text-maroon"
                      : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
