"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cpu, Menu, X } from "lucide-react";

const NAV = [
  { href: "#register", label: "Register" },
  { href: "#course", label: "How it works" },
  { href: "#sessions", label: "Sessions" },
  { href: "#about", label: "Venue" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors ${
        scrolled
          ? "border-border/60 bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Cpu className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">AKLEB STEM &amp; Robotics</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              AI Literacy Camp
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
          <Button asChild size="sm" className="ml-2">
            <a href="#register">Register Now</a>
          </Button>
        </nav>

        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/60 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
            <Button asChild size="sm" className="mt-1">
              <a href="#register" onClick={() => setOpen(false)}>
                Register Now
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
