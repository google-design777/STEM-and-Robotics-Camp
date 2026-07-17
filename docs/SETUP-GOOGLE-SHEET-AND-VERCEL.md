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

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Read fields sent from the Next.js app
    var p = e.parameter;
    var row = [
      p.SNO,
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

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

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

### Step 1 — Push the code to GitHub

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

### Step 2 — Import into Vercel

1. Go to <https://vercel.com> and sign in with GitHub.
2. Click **Add New → Project**.
3. Select your `akleb-ai-camp` repository.
4. Vercel auto-detects Next.js — keep the defaults:
   - Framework preset: **Next.js**
   - Build command: `next build` (auto)
   - Output directory: `.next` (auto)
5. Open **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `GOOGLE_SCRIPT_URL` | `https://script.google.com/macros/s/AKfyc.../exec` |

6. Click **Deploy**. The first deploy takes ~2 minutes.

### Step 3 — Open your live site

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

If you ever change the Sheet columns (add/remove), also update the `row` array in the Apps Script `doPost` function so the indices match. The portal always sends: `SNO, Name, Gender, Age, Class, WhatsApp, JKName, School`.

---

## Quick reference

| What | Where |
|------|-------|
| Live site | `https://<your-project>.vercel.app` |
| Google Sheet | Your existing sheet |
| Apps Script | `https://script.google.com/home` |
| Vercel dashboard | `https://vercel.com/dashboard` |
| Repo | `https://github.com/<your-username>/akleb-ai-camp` |

Built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui.
