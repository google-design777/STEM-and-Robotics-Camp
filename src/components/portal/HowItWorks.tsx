"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Hand,
  Globe2,
  Heart,
  Scale,
  Rocket,
  type LucideIcon,
} from "lucide-react";

type Principle = {
  num: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

const PRINCIPLES: Principle[] = [
  {
    num: "1",
    title: "Students use AI tools, not just read about them",
    body: "In every session, students open real AI tools and use them. They type, get responses, try different approaches, and see what happens. Each session has more doing and less listening than the one before.",
    icon: Hand,
  },
  {
    num: "2",
    title: "Students learn by using the same tools the world uses",
    body: "Students use Claude, ChatGPT, Perplexity, Canva, Udio, and Teachable Machine during class. These are real tools used by people every day. Students learn by using them, not by hearing about them.",
    icon: Globe2,
  },
  {
    num: "3",
    title: "The course shows why human skills still matter",
    body: "Each task is set up so students can see where AI falls short. They notice that AI cannot make a judgment call, cannot take responsibility, and cannot understand feelings. These are skills students can build that AI does not have.",
    icon: Heart,
  },
  {
    num: "4",
    title: "Students think about right and wrong through real situations",
    body: "Students do not sit through a lecture about AI ethics. Instead, they run experiments that show unfairness in AI responses, they think about what personal information they share with AI tools, and they write a personal commitment based on what they have learned.",
    icon: Scale,
  },
  {
    num: "5",
    title: "The course prepares students for a world where AI is common",
    body: "Throughout the course, students think about what kinds of work AI will take over and what kinds of skills people will still need. By the end, they have started building those skills.",
    icon: Rocket,
  },
];

export function HowItWorks() {
  return (
    <section id="course" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How this course works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Five principles that shape every session
          </h2>
          <p className="mt-3 text-muted-foreground">
            Hands-on, real-tools, real-thinking — designed to prepare young
            people for a world where AI is everywhere.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Card className="h-full border-border/60 transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-3xl font-extrabold text-muted/70">
                        {p.num}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Filler / CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex h-full flex-col justify-between rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-white shadow-lg"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                Ready to join?
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">
                Spots are limited. Register early to secure your seat.
              </h3>
            </div>
            <a
              href="#register"
              className="mt-5 inline-flex w-fit items-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-300"
            >
              Register Now
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
