"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Session = {
  session: string;
  theme: string;
  question: string;
  tools: string[];
};

const SESSIONS: Session[] = [
  {
    session: "1",
    theme: "What is AI?",
    question: "What is AI and how does it learn?",
    tools: ["Quick Draw", "ChatGPT", "Claude"],
  },
  {
    session: "2",
    theme: "AI's Impact",
    question: "What good and bad effects does AI have in the world?",
    tools: ["Perplexity", "MIT Detect Fakes", "ChatGPT"],
  },
  {
    session: "3",
    theme: "Using AI Effectively",
    question: "How can I use AI well without letting it do my thinking for me?",
    tools: ["Claude", "Canva AI", "Udio", "Gamma"],
  },
  {
    session: "4",
    theme: "Responsible AI",
    question: "How do I use AI fairly, safely, and honestly?",
    tools: ["ChatGPT", "Claude", "AI or Not"],
  },
  {
    session: "5",
    theme: "AI in Your Hands",
    question: "Can I build something with AI myself?",
    tools: ["Teachable Machine", "Gamma", "Student's choice"],
  },
];

export function SessionsTable() {
  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            What each session covers
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Five sessions, one clear journey
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each session builds on the last — from understanding what AI is, to
            building something with it yourself.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          <Card className="overflow-hidden border-border/60 shadow-lg">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-base font-semibold">
                Session-by-session breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Desktop / tablet: table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="w-16">Session</TableHead>
                      <TableHead>Theme</TableHead>
                      <TableHead>Core question</TableHead>
                      <TableHead>Key tools</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SESSIONS.map((s) => (
                      <TableRow key={s.session} className="align-top">
                        <TableCell>
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                            {s.session}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {s.theme}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {s.question}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {s.tools.map((t) => (
                              <Badge
                                key={t}
                                variant="secondary"
                                className="bg-amber-100 text-amber-900 hover:bg-amber-100"
                              >
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: cards */}
              <div className="grid gap-3 p-4 md:hidden">
                {SESSIONS.map((s) => (
                  <div
                    key={s.session}
                    className="rounded-lg border border-border/60 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                        {s.session}
                      </span>
                      <h3 className="font-semibold">{s.theme}</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Core question:
                      </span>{" "}
                      {s.question}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.tools.map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="bg-amber-100 text-amber-900 hover:bg-amber-100"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
