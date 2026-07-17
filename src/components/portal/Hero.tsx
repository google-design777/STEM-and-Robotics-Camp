"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, CalendarDays, ArrowDown, Cpu } from "lucide-react";

export function Hero() {
  return (
    <section className="brand-gradient relative overflow-hidden text-white">
      <div className="brand-grid absolute inset-0 opacity-50" aria-hidden />
      <div
        className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <Badge
              variant="outline"
              className="mb-5 border-white/30 bg-white/15 text-white backdrop-blur"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Upcoming · STEM &amp; Robotics Camp
            </Badge>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              AI Literacy Camp
              <span className="mt-2 block text-gradient text-4xl sm:text-5xl lg:text-6xl">
                for Young Innovators
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base text-white sm:text-lg">
              A 10-hour, 5-session course for students aged{" "}
              <strong className="text-amber-300">11–18</strong> (classes 6–12).
              Learn how AI works, use real AI tools, and think about the risks
              and responsibilities of an AI-driven world.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                asChild
                className="bg-amber-400 text-amber-950 hover:bg-amber-300"
              >
                <a href="#register">Register Now — Free</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                <a href="#course">
                  See the course <ArrowDown className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-300" />
                Madina Tul Karim Nomal JK
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-amber-300" />
                5 sessions · 2 hours each
              </span>
              <span className="inline-flex items-center gap-2">
                <Cpu className="h-4 w-4 text-amber-300" />
                Classes 6 – 12
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <HeroStatCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroStatCard() {
  const stats = [
    { value: "10", label: "Hours of learning" },
    { value: "5", label: "Sessions · 2 hrs each" },
    { value: "12", label: "Free AI tools covered" },
    { value: "14+", label: "Hands-on AI tasks" },
  ];
  return (
    <div className="relative rounded-2xl border border-white/20 bg-white/15 p-6 backdrop-blur-md shadow-2xl">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/20 bg-white/10 p-4"
          >
            <div className="text-3xl font-extrabold text-amber-300">
              {s.value}
            </div>
            <div className="mt-1 text-sm font-medium text-white">
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg bg-amber-400 p-3 text-center text-sm font-semibold text-amber-950">
        Organized by AKLEB STEM &amp; Robotics
      </div>
    </div>
  );
}
