"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, CalendarDays, Users, Cpu, Building2 } from "lucide-react";

const DETAILS = [
  {
    icon: Building2,
    label: "Venue",
    value: "Madina Tul Karim Nomal JK",
    sub: "In-person sessions · easily accessible from Nomal and surrounding areas",
  },
  {
    icon: Users,
    label: "Organized by",
    value: "AKLEB STEM & Robotics",
    sub: "Bringing hands-on STEM and robotics education to young learners",
  },
  {
    icon: CalendarDays,
    label: "Format",
    value: "5 sessions · 2 hours each",
    sub: "10 hours of structured, hands-on learning over the camp",
  },
  {
    icon: Cpu,
    label: "Eligibility",
    value: "Classes 6 – 12 · Ages 11 – 18",
    sub: "No prior AI or coding experience required — just curiosity",
  },
];

export function VenueOrganizer() {
  return (
    <section id="about" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Venue &amp; Organizer
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Where curiosity meets community
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hosted at{" "}
              <strong className="text-foreground">
                Madina Tul Karim Nomal JK
              </strong>{" "}
              and organized by{" "}
              <strong className="text-foreground">
                AKLEB STEM &amp; Robotics
              </strong>
              . Every session is hands-on: students open real AI tools, complete
              real tasks, and leave with skills they can actually use.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-900">
                <MapPin className="h-4 w-4" />
                Madina Tul Karim Nomal JK
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-900">
                <Users className="h-4 w-4" />
                AKLEB STEM &amp; Robotics
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {DETAILS.map((d) => {
              const Icon = d.icon;
              return (
                <Card
                  key={d.label}
                  className="border-border/60 transition hover:border-primary/40 hover:shadow-md"
                >
                  <CardContent className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
                      {d.label}
                    </p>
                    <p className="mt-1 font-semibold leading-snug">
                      {d.value}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {d.sub}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
