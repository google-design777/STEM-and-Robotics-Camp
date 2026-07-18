import { NextResponse } from "next/server";

/**
 * GET /api/register/status
 *
 * Reports whether the Google Sheet integration is wired up AND reachable.
 *
 * Returns:
 *   {
 *     configured: boolean,  // GOOGLE_SCRIPT_URL env var is set
 *     reachable:  boolean,  // a real ping to the Apps Script returned 2xx
 *     url:        string,   // masked URL for debug (only the host + path prefix)
 *     detail:     string,   // human-readable status message
 *     checkedAt:  string    // ISO timestamp
 *   }
 *
 * The UI uses this to show a green/amber/red badge above the form so the
 * organizer immediately knows whether submissions are landing in the Sheet.
 */

export async function GET() {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json({
      configured: false,
      reachable: false,
      url: null,
      detail:
        "GOOGLE_SCRIPT_URL is not set. Submissions are saved to the local backup DB only.",
      checkedAt: new Date().toISOString(),
    });
  }

  // Basic URL sanity check
  let parsed: URL;
  try {
    parsed = new URL(scriptUrl);
  } catch {
    return NextResponse.json({
      configured: true,
      reachable: false,
      url: "(invalid URL)",
      detail:
        "GOOGLE_SCRIPT_URL is set but is not a valid URL. Please fix the env var.",
      checkedAt: new Date().toISOString(),
    });
  }

  // We don't want to leak the full URL (it contains the script ID) — mask it.
  const maskedUrl = `${parsed.origin}/macros/s/****/exec`;

  // Ping the Apps Script with a HEAD (or GET) request to verify reachability.
  // Apps Script Web Apps respond to GET with whatever doGet returns; if no
  // doGet is defined, they respond with a default HTML page (still 200).
  // We treat any 2xx/3xx response as "reachable".
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(scriptUrl, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const reachable = res.ok || (res.status >= 200 && res.status < 400);

    return NextResponse.json({
      configured: true,
      reachable,
      url: maskedUrl,
      detail: reachable
        ? "Google Sheet is connected and the Apps Script is reachable."
        : `Apps Script responded with HTTP ${res.status}. Check the deployment URL and permissions.`,
      httpStatus: res.status,
      checkedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.name === "AbortError"
          ? "Timed out after 8s while trying to reach the Apps Script."
          : err.message
        : String(err);

    return NextResponse.json({
      configured: true,
      reachable: false,
      url: maskedUrl,
      detail: `Could not reach the Apps Script: ${message}`,
      checkedAt: new Date().toISOString(),
    });
  }
}
