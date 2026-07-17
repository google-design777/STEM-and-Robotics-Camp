import { SiteHeader } from "@/components/portal/SiteHeader";
import { Hero } from "@/components/portal/Hero";
import { RegistrationForm } from "@/components/portal/RegistrationForm";
import { HowItWorks } from "@/components/portal/HowItWorks";
import { SessionsTable } from "@/components/portal/SessionsTable";
import { VenueOrganizer } from "@/components/portal/VenueOrganizer";
import { Footer } from "@/components/portal/Footer";

export default function Home() {
  return (
    <div
      id="top"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <SiteHeader />

      <main className="flex-1">
        {/* 1. Hero — sets the context */}
        <Hero />

        {/* 2. Registration — FIRST actionable section per user requirement */}
        <section
          id="register"
          className="scroll-mt-24 bg-gradient-to-b from-background to-muted/40 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <RegistrationForm />
          </div>
        </section>

        {/* 3. How the course works — 5 principles */}
        <HowItWorks />

        {/* 4. Session-by-session breakdown */}
        <div id="sessions" className="scroll-mt-24">
          <SessionsTable />
        </div>

        {/* 5. Venue & Organizer */}
        <VenueOrganizer />

        {/* 6. Final CTA band */}
        <section className="brand-gradient relative overflow-hidden py-16 text-white">
          <div className="brand-grid absolute inset-0 opacity-50" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to give your child a head start with AI?
            </h2>
            <p className="mt-3 text-white">
              Spots are limited and registrations are reviewed in the order
              they arrive. Reserve your seat now — it&apos;s free.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#register"
                className="inline-flex w-fit items-center justify-center rounded-md bg-amber-400 px-6 py-3 text-base font-semibold text-amber-950 transition hover:bg-amber-300"
              >
                Register Now
              </a>
              <a
                href="#course"
                className="inline-flex w-fit items-center justify-center rounded-md border border-white/40 bg-white/10 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/20"
              >
                Review the curriculum
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
