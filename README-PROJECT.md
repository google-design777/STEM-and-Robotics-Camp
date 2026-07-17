# AKLEB AI Literacy Camp — Registration Portal

A Next.js 16 registration portal for the AI Literacy Camp organized by
**AKLEB STEM & Robotics** at **Madina Tul Karim Nomal JK**.

> This registration portal is only for participants of Madina Tul Karim Nomal JK.

## What's inside

- Registration form with: Name, Gender, Age, Class, WhatsApp, JK Name
  (default: Madina Tul Karim Nomal), School Name
- Course overview — 5 sessions, 10 hours, 12+ AI tools
- Session-by-session breakdown table
- Venue & organizer info
- Submitted registrations are saved to:
  1. A local SQLite database (backup)
  2. A connected Google Sheet (your existing sheet)

## Quick start (local)

```bash
bun install
bun run db:push        # creates prisma/dev.db
bun run dev            # starts on http://localhost:3000
```

## Connect your Google Sheet

See `docs/SETUP-GOOGLE-SHEET-AND-VERCEL.md` for step-by-step instructions.

Quick version:
1. Open your existing Google Sheet → Extensions → Apps Script
2. Paste the `doPost` handler from the setup guide
3. Deploy as Web App (Execute as: Me; Who has access: Anyone)
4. Copy the Web App URL → set as `GOOGLE_SCRIPT_URL` env var

## Deploy to Vercel (free)

1. Push this project to GitHub
2. Import the repo on https://vercel.com
3. Add env var `GOOGLE_SCRIPT_URL` from step 4 above
4. Deploy → you get a free `*.vercel.app` URL

Full instructions: `docs/SETUP-GOOGLE-SHEET-AND-VERCEL.md`.

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Prisma ORM (SQLite, used as backup storage)
- react-hook-form + zod for form validation
- Framer Motion for animations

## Web developed by Madina Tul Karim Nomal JK
