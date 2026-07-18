# AI Literacy Camp — Deployment Guide

This guide explains how to connect your **existing Google Sheet** to the registration portal and how to deploy the app to **Vercel for free**.

---

## 1. Connect your Google Sheet

The portal forwards each registration to a Google Apps Script Web App, which appends a row to your Google Sheet. Setup takes ~3 minutes.

### Your Sheet's columns (already in this order)

| SNO | Name of Student | Gender | Age | Class | WhatsApp | JK Name | School Name | Day1 | Day2 | Day3 | Day4 | Day5 | Day6 |
|-----|-----------------|--------|-----|-------|----------|---------|-------------|------|------|------|------|------|------|

The portal writes the first 8 columns. Day1–Day6 stay empty for you to fill in during the camp.

### Step 1 — Open your Google Sheet

Open the sheet you already made in Google Sheets.

### Step 2 — Open the Apps Script editor

In Google Sheets, go to **Extensions → Apps Script**. A new tab opens with a code editor.

### Step 3 — Paste this code (replace the default `Code.gs` content)

> **IMPORTANT — read the note below the code block.** The Apps Script is the
> single source of truth for the registration ID (SNO). It computes SNO from
> the Sheet's last row, so every submission gets a unique, sequential ID even
> when the app is hosted on Vercel (where the local database resets on every
> cold start).

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Read fields sent from the Next.js app
    var p = e.parameter;

    // Compute SNO from the Sheet's last row.
    // - Header row is row 1, so the first data row is row 2 → SNO = 1.
    // - This is the ONLY reliable source of SNO. The Next.js app does NOT
    //   compute SNO on its own because its database is ephemeral on Vercel.
    var lastRow = sheet.getLastRow();
    var sno = Math.max(0, lastRow); // lastRow=1 (header) → sno=1 for first entry

    var row = [
      sno,
      p.Name,
      p.Gender,
      p.Age,
      p.Class,
      p.WhatsApp,
      p.JKName,
      p.School,
      '', '', '', '', '', ''  // Day1..Day6 — left blank for manual attendance
    ];

    sheet.appendRow(row);

    // Return the assigned SNO so the Next.js app can show it to the user.
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, sno: sno }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional but recommended: a simple doGet so you can test the Web App URL
// in your browser. Visiting it should return {"ok":true,"ping":true}.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, ping: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

> **If you already deployed an earlier version of the script** (without the
> SNO computation), you must:
> 1. Replace the code with the version above.
> 2. Click **Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy**.
> 3. The Web App URL stays the same — no need to update Vercel.

### Step 4 — Deploy as a Web App

1. Click **Deploy → New deployment** (top right).
2. Click the gear icon → choose **Web app**.
3. Fill in:
   - **Description**: `AI Camp Registration`
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone**
4. Click **Deploy**.
5. Authorize the app when prompted (Google will warn that the app isn't verified — choose **Advanced → Go to project → Allow**; this is safe because you wrote the script yourself).
6. Copy the **Web app URL** that ends in `/exec`. It looks like:
   `https://script.google.com/macros/s/AKfyc.../exec`

### Step 5 — Set the URL in your environment

Set this URL as the `GOOGLE_SCRIPT_URL` environment variable on Vercel (next section) or in your local `.env` file:

```
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfyc.../exec
```

That's it. Every registration will now appear as a new row in your Google Sheet within seconds.

> **Backup safety net:** Even if the Sheet isn't connected yet, every submission is also saved to the app's own database — so no registration is ever lost.

---

## 2. Deploy to Vercel (free tier)

### Step 1 — Unzip the project locally

```bash
unzip akleb-ai-camp-portal.zip
cd akleb-ai-camp-portal
```

### Step 2 — Push the code to GitHub

1. Create a new GitHub repository (e.g. `akleb-ai-camp`).
2. Push the project to it:

```bash
git init
git add .
git commit -m "AI Literacy Camp registration portal"
git branch -M main
git remote add origin https://github.com/<your-username>/akleb-ai-camp.git
git push -u origin main
```

### Step 3 — Import into Vercel

1. Go to <https://vercel.com> and sign in with GitHub.
2. Click **Add New → Project**.
3. Select your `akleb-ai-camp` repository.
4. Vercel auto-detects Next.js — keep the defaults:
   - Framework preset: **Next.js**
   - Build command: `next build` (the `package.json` already has this — don't override it)
   - Output directory: `.next` (auto)
   - Install command: leave as `npm install` (the project includes `package-lock.json`)
5. Open **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `GOOGLE_SCRIPT_URL` | `https://script.google.com/macros/s/AKfyc.../exec` |

6. Click **Deploy**. The first deploy takes ~2 minutes.

### Step 4 — Open your live site

After deployment, Vercel gives you a URL like `https://akleb-ai-camp.vercel.app`. Test it by submitting a registration — within seconds a new row should appear in your Google Sheet.

### Optional — Custom domain

In your Vercel project settings → **Domains**, you can add a custom domain (e.g. `register.akleb.org`). Vercel walks you through DNS setup. Free tier supports custom domains.

---

## 3. Verifying everything works

After deploy:

1. Open your Vercel URL.
2. Fill in the registration form and submit.
3. Open your Google Sheet — a new row should appear at the bottom.
4. The Day1–Day6 columns stay empty for you to mark attendance during the camp.

If a submission doesn't appear in the Sheet:
- Check that the Web App URL is set correctly on Vercel.
- Re-deploy the Apps Script with **Manage deployments → Edit → New version** if you changed the script.
- The app keeps a backup in its own DB even if the Sheet call fails, so no data is lost.

---

## 4. Updating the Sheet columns

If you ever change the Sheet columns (add/remove), also update the `row` array in the Apps Script `doPost` function so the indices match. The portal always sends: `Name, Gender, Age, Class, WhatsApp, JKName, School` (SNO is computed by the Apps Script itself — don't send it from the app).

---

## 5. Troubleshooting

### "Vercel deployment failed"

The most common cause is a custom `build` script that tries to copy files into a `.next/standalone/` directory — that worked locally but breaks on Vercel's serverless filesystem. The latest version of this project has a clean `build: "next build"` script in `package.json`, no `output: "standalone"` in `next.config.ts`, and a `vercel.json` that pins the framework to Next.js. If you're upgrading from an earlier version, replace these three files (`package.json`, `next.config.ts`, `vercel.json`) with the latest ones from the zip and redeploy.

Other common causes:
- **`prisma generate` not running** — fixed by the `postinstall` script in `package.json`. If you removed it, run `npx prisma generate` before `next build`.
- **Node version mismatch** — the `.nvmrc` file pins Node 20. If Vercel is using a different version, set the override in Project Settings → General → Node.js Version.
- **A dependency failed to install** — check the build logs for `npm ERR!`. Usually a typo in `package.json` or an unsupported package.

To see the full build log, run from your terminal:
```bash
npx vercel login            # one-time, if not logged in
npx vercel inspect <deployment-id> --logs
```

### "Every submission gets the same ID (e.g. #001)"

This happens when the Next.js app tries to compute the ID itself, but its database is ephemeral on Vercel (the serverless filesystem resets on every cold start). **Fix:** make sure the Apps Script in your Google Sheet is the version above that computes `sno` from `sheet.getLastRow()` and returns `{ ok: true, sno: <number> }`. If you previously deployed an older version of the script, replace it and create a new deployment version (Deploy → Manage deployments → Edit → New version).

### "I submit but nothing appears in the Sheet"

1. Look at the badge next to "Registration is open" in the form — it tells you whether the Sheet is connected and reachable:
   - 🟢 **Sheet connected** — the Apps Script responded to a ping
   - 🟠 **Sheet not connected** — `GOOGLE_SCRIPT_URL` is missing on Vercel
   - 🔴 **Sheet reachable? No** — the URL is set but the Apps Script didn't respond (wrong URL, or the script throws an error)
2. Submit a test registration. The success screen will tell you whether the row actually reached the Sheet ("You're registered!") or only landed in the local backup ("Saved — but action needed").
3. Check the Vercel function logs (Vercel dashboard → your project → Logs) — the API prints the upstream status and response body when the Apps Script fails.

### "The Apps Script response was not valid JSON"

This means the script ran but didn't return the expected `{ ok: true, sno: <number> }` JSON. Make sure you copied the full `doPost` function from Step 3 above, including the `ContentService.createTextOutput(JSON.stringify(...))` line.

### "I want to test the connection without submitting a form"

Visit your Web App URL in a browser — it should return `{"ok":true,"ping":true}` (the `doGet` handler). If you see HTML instead, the script wasn't deployed as a Web App, or `doGet` is missing.

You can also hit the status endpoint directly: `https://<your-vercel-url>/api/register/status` — it returns JSON with `configured`, `reachable`, and a human-readable `detail`.

---

## Quick reference

| What | Where |
|------|-------|
| Live site | `https://<your-project>.vercel.app` |
| Google Sheet | Your existing sheet |
| Apps Script | `https://script.google.com/home` |
| Vercel dashboard | `https://vercel.com/dashboard` |
| Repo | `https://github.com/<your-username>/akleb-ai-camp` |
| Status check | `https://<your-vercel-url>/api/register/status` |

Built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui.
