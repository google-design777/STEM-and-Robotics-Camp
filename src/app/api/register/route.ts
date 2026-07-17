import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Registration endpoint
 *
 * Receives form data, then:
 *   1. Persists a backup copy to the local SQLite database (via Prisma)
 *   2. Forwards the data to a Google Apps Script Web App URL if configured
 *      via the GOOGLE_SCRIPT_URL environment variable. The Apps Script then
 *      appends a row to the connected Google Sheet.
 *
 * The Google Sheet columns (in order) must be:
 *   SNO | Name of Student | Gender | Age | Class | WhatsApp | JK Name | School Name | Day1 | Day2 | Day3 | Day4 | Day5 | Day6
 *
 * If GOOGLE_SCRIPT_URL is not set, the API still succeeds (the local copy
 * is saved) but responds with `googleSheet: false` so the UI can warn the
 * operator that the Sheet integration is not yet wired up.
 */

type RegisterBody = {
  name?: unknown;
  gender?: unknown;
  age?: unknown;
  class?: unknown;
  whatsapp?: unknown;
  jkName?: unknown;
  school?: unknown;
};

export async function POST(req: NextRequest) {
  let body: RegisterBody;
  try {
    body = (await req.json()) as RegisterBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const gender = typeof body.gender === "string" ? body.gender.trim() : "";
  const ageRaw = body.age;
  const classVal = typeof body.class === "string" ? body.class.trim() : "";
  const whatsapp = typeof body.whatsapp === "string" ? body.whatsapp.trim() : "";
  const jkName =
    typeof body.jkName === "string" && body.jkName.trim()
      ? body.jkName.trim()
      : "Madina Tul Karim Nomal";
  const school = typeof body.school === "string" ? body.school.trim() : "";

  // Basic validation
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required";
  if (!gender) errors.gender = "Gender is required";
  const ageNum = Number(ageRaw);
  if (!ageRaw || Number.isNaN(ageNum) || ageNum < 5 || ageNum > 30)
    errors.age = "Age must be between 5 and 30";
  if (!classVal) errors.class = "Class is required";
  if (!whatsapp) errors.whatsapp = "WhatsApp number is required";
  else if (!/^[0-9 +\-()]{7,20}$/.test(whatsapp))
    errors.whatsapp = "Enter a valid WhatsApp number";
  if (!school) errors.school = "School name is required";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, errors, error: "Please fix the highlighted fields" },
      { status: 422 }
    );
  }

  // Compute SNO — next serial in local DB (matches Sheet SNO if Sheet is empty initially)
  let sno = 1;
  try {
    const count = await db.registration.count();
    sno = count + 1;
  } catch {
    // DB not ready; non-fatal
  }

  // 1) Backup to local DB
  let localSaved = false;
  try {
    await db.registration.create({
      data: {
        sno,
        name,
        gender,
        age: ageNum,
        class: classVal,
        whatsapp,
        jkName,
        school,
      },
    });
    localSaved = true;
  } catch (err) {
    console.error("[register] local DB save failed:", err);
  }

  // 2) Forward to Google Apps Script Web App (Google Sheets integration)
  let googleSheet = false;
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    try {
      // Apps Script Web Apps accept form-encoded payloads and read fields
      // via `e.parameter.<field>` inside `doPost(e)`.
      const params = new URLSearchParams();
      params.set("SNO", String(sno));
      params.set("Name", name);
      params.set("Gender", gender);
      params.set("Age", String(ageNum));
      params.set("Class", classVal);
      params.set("WhatsApp", whatsapp);
      params.set("JKName", jkName);
      params.set("School", school);

      const upstream = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: params.toString(),
        // Apps Script redirects to /macro/svc/.../exec — we need to follow
        redirect: "follow",
        cache: "no-store",
      });

      if (upstream.ok) {
        googleSheet = true;
      } else {
        console.error(
          "[register] Google Apps Script returned",
          upstream.status,
          await upstream.text().catch(() => "")
        );
      }
    } catch (err) {
      console.error("[register] Google Apps Script forward failed:", err);
    }
  }

  if (!localSaved && !googleSheet) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not save your registration. Please try again or contact the organizer.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    sno,
    googleSheet,
    localSaved,
    warning:
      googleSheet && !localSaved
        ? undefined
        : !googleSheet && localSaved
        ? "Saved locally. The organizer has not connected the live Google Sheet yet — your registration is still recorded."
        : undefined,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "AKLEB STEM & Robotics registration endpoint is live.",
    googleSheetConfigured: Boolean(process.env.GOOGLE_SCRIPT_URL),
  });
}
