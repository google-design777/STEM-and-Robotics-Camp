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

  // ---------------------------------------------------------------------------
  // SNO strategy
  // ---------------------------------------------------------------------------
  // The Google Sheet is the single source of truth for SNO. The Apps Script
  // computes SNO = lastRow (so the first data row gets SNO=1) when it appends
  // the row, and returns it as JSON in its response.
  //
  // We do NOT compute SNO from the local DB count — on Vercel the serverless
  // filesystem is ephemeral, so the SQLite file resets on every cold start
  // and `count() + 1` would always return 1. That was the "same ID for
  // everyone" bug.
  //
  // If the Sheet is not reachable, we fall back to a timestamp-based
  // temporary ID so the user still sees something unique. The real SNO will
  // be assigned by the Sheet once the connection is restored.
  // ---------------------------------------------------------------------------

  let sno: number | null = null;
  let snoSource: "sheet" | "fallback" | null = null;

  // 1) Backup to local DB (still useful in dev; on Vercel it's ephemeral but
  //    harmless). SNO is filled in after we hear back from the Sheet.
  let localSaved = false;
  try {
    await db.registration.create({
      data: {
        sno: 0, // placeholder; updated below if we get a real SNO from Sheet
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
  let sheetDetail: string | undefined;
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    sheetDetail =
      "GOOGLE_SCRIPT_URL is not set — submission was saved to local DB only.";
  } else {
    try {
      // Apps Script Web Apps accept form-encoded payloads and read fields
      // via `e.parameter.<field>` inside `doPost(e)`.
      // Note: we do NOT send SNO — the Apps Script computes it from the
      // Sheet's last row, which is the only reliable source of truth.
      const params = new URLSearchParams();
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
        // Try to parse the SNO from the Apps Script's JSON response.
        const text = await upstream.text().catch(() => "");
        try {
          const json = JSON.parse(text);
          if (typeof json.sno === "number" && json.sno > 0) {
            sno = json.sno;
            snoSource = "sheet";
            sheetDetail = `Row #${sno} appended to Google Sheet successfully.`;
          } else if (json.ok === true) {
            sheetDetail =
              "Row appended to Google Sheet, but the script did not return an SNO. Update the Apps Script to return { ok: true, sno: <number> } so the UI can show the real ID.";
          } else {
            sheetDetail = `Row appended, but the Apps Script response was unexpected: ${text.slice(0, 200)}`;
          }
        } catch {
          sheetDetail = `Row appended, but the Apps Script response was not valid JSON: ${text.slice(0, 200)}`;
        }
      } else {
        const bodyText = await upstream.text().catch(() => "");
        sheetDetail = `Apps Script returned HTTP ${upstream.status}. Body: ${bodyText.slice(0, 300)}`;
        console.error("[register] Google Apps Script returned", upstream.status, bodyText);
      }
    } catch (err) {
      sheetDetail = `Could not reach Google Apps Script: ${
        err instanceof Error ? err.message : String(err)
      }`;
      console.error("[register] Google Apps Script forward failed:", err);
    }
  }

  // 3) Fallback SNO if the Sheet didn't return one.
  //    Use a timestamp-based ID (seconds since epoch, last 6 digits) so
  //    submissions are still distinguishable when the Sheet is down.
  if (sno === null) {
    sno = Number(Date.now().toString().slice(-6));
    snoSource = "fallback";
  }

  if (!localSaved && !googleSheet) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not save your registration. Please try again or contact the organizer.",
        sheetDetail,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    sno,
    snoSource,
    googleSheet,
    localSaved,
    sheetDetail,
    warning:
      googleSheet && !localSaved
        ? undefined
        : !googleSheet && localSaved
        ? "Saved locally. The Google Sheet is NOT connected — your registration is in the backup DB and will appear in the Sheet once GOOGLE_SCRIPT_URL is set."
        : undefined,
  });
}

export async function GET() {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  return NextResponse.json({
    ok: true,
    message: "AKLEB STEM & Robotics registration endpoint is live.",
    googleSheetConfigured: Boolean(scriptUrl),
    googleSheetUrl: scriptUrl
      ? `${new URL(scriptUrl).origin}/macros/s/****/exec`
      : null,
    statusEndpoint: "/api/register/status",
  });
}
