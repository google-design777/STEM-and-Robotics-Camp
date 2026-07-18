"use client";

<<<<<<< HEAD
import { Cpu, MapPin, CalendarDays, Users, Sparkles } from "lucide-react";
=======
import { Cpu, MapPin, CalendarDays, Users, Code } from "lucide-react";
>>>>>>> a5a7e01694ee185bfa01efef2f0230eb233ff9cd

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold leading-tight text-foreground">
                  AKLEB STEM &amp; Robotics
                </p>
                <p className="text-xs text-muted-foreground">
                  AI Literacy Camp · 2026
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Hands-on STEM and robotics education for young people — building
              skills that matter in an AI-shaped world.
            </p>
          </div>

          {/* Quick info */}
          <div>
            <p className="text-sm font-semibold text-foreground">Camp details</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>Madina Tul Karim Nomal JK</span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>For classes 6 – 12 · ages 11 – 18</span>
              </li>
              <li className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
<<<<<<< HEAD
                <span>
                  Session 1: 25 July · Session 2: 26 July · 12:00 PM
                </span>
=======
                <span>5 sessions · 2 hours each · 10 hours total</span>
>>>>>>> a5a7e01694ee185bfa01efef2f0230eb233ff9cd
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-emerald-600/30 bg-emerald-50 p-3 text-center text-sm text-emerald-900">
          This registration portal is only for participants of{" "}
          <strong>Madina Tul Karim Nomal JK</strong>.
        </div>

        <div className="mt-6 border-t border-border/60 pt-6 text-center text-sm">
          <p className="inline-flex items-center justify-center gap-2 text-muted-foreground">
<<<<<<< HEAD
            <Sparkles className="h-4 w-4 text-primary" />
            Developed by{" "}
            <strong className="text-foreground">
              Madina Tul Karim Nomal Scouts
            </strong>{" "}
            with AI
=======
            <Code className="h-4 w-4 text-primary" />
            Web developed by{" "}
            <strong className="text-foreground">
              Madina Tul Karim Nomal JK
            </strong>
>>>>>>> a5a7e01694ee185bfa01efef2f0230eb233ff9cd
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AKLEB STEM &amp; Robotics · AI
            Literacy Camp
          </p>
        </div>
      </div>
    </footer>
  );
}
