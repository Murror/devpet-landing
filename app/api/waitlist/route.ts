import { NextResponse } from 'next/server'
import { google } from 'googleapis'

/**
 * Codepet waitlist endpoint — direct Google Sheets API write.
 *
 * Replaces the old Apps Script webhook architecture. Instead of POSTing to
 * a Google Apps Script `/exec` URL (which adds 1–2s of latency on each
 * request because Apps Script is slow), this route authenticates as a
 * service account and writes to the bound Google Sheet via the Sheets v4
 * API directly. Round-trip drops from ~1.5s → ~250ms.
 *
 * Required environment variables (all set in Vercel → Project Settings →
 * Environment Variables):
 *
 *   GOOGLE_SHEET_ID                     — the spreadsheet ID from its URL
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL        — the service account's client_email
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY  — the service account's private_key
 *
 * Setup:
 *   1. In Google Cloud Console, create (or pick) a project.
 *   2. Enable the Google Sheets API for that project.
 *   3. Create a service account and download its JSON key.
 *   4. Share the waitlist Google Sheet with the service account's email
 *      address (give "Editor" access).
 *   5. Paste `client_email` and `private_key` from the JSON, plus the
 *      spreadsheet ID, into Vercel env vars.
 *
 * The bound sheet's first sheet (Sheet1) should still have these headers
 * in row 1:
 *   A: Timestamp   B: Email   C: Locale   D: UserAgent
 *
 * Response shape stays the same as the old Apps Script wrapper so the
 * front-end forms (FinalCta.tsx, Product.tsx) need no changes:
 *   200 { status: 'ok' }         — appended successfully
 *   200 { status: 'duplicate' }  — email already in sheet
 *   400 { error: 'Invalid email' }
 *   500 { error: 'Server misconfigured' | 'Save failed' }
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: { email?: string; locale?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email || '').toString().trim().toLowerCase()
  const locale = (body.locale || '').toString().trim()

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const sheetId = process.env.GOOGLE_SHEET_ID
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  // Vercel stores multi-line env vars with literal "\n" sequences; convert
  // those back to real newlines so the PEM parser is happy.
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n'
  )

  if (!sheetId || !clientEmail || !privateKey) {
    const diag = {
      hasSheetId: Boolean(sheetId),
      hasClientEmail: Boolean(clientEmail),
      hasPrivateKey: Boolean(privateKey),
      privateKeyLen: privateKey?.length ?? 0,
      privateKeyStartsWithBegin:
        privateKey?.startsWith('-----BEGIN') ?? false,
      // Vercel auto-sets these so we can tell whether the function
      // has access to ANY env vars or just specifically can't see ours
      vercelEnv: process.env.VERCEL_ENV ?? null,
      nodeEnv: process.env.NODE_ENV ?? null,
      // Names of GOOGLE_* env vars actually visible to the function
      googleEnvKeys: Object.keys(process.env).filter((k) =>
        k.startsWith('GOOGLE_')
      ),
    }
    console.error('Missing Google Sheets env vars', diag)
    // TEMPORARY: include diag in response body so we can diagnose without
    // log access. Remove this `detail` field once the env vars are working.
    return NextResponse.json(
      { error: 'Server misconfigured', detail: diag },
      { status: 500 }
    )
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    // Dedupe pass — read column B (Email) and look for a case-insensitive
    // match. One round trip; ~80–120ms even with thousands of rows.
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!B2:B',
      majorDimension: 'COLUMNS',
    })

    const emails = (existing.data.values?.[0] ?? []).map((cell) =>
      (cell ?? '').toString().trim().toLowerCase()
    )

    if (emails.includes(email)) {
      return NextResponse.json({ status: 'duplicate' })
    }

    // Append. RAW vs USER_ENTERED affects how Sheets parses the timestamp;
    // we use USER_ENTERED so the date stays a real date rather than a
    // string, which keeps existing column-A formatting intact.
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:D',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[new Date().toISOString(), email, locale, '']],
      },
    })

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('Sheets API write failed:', err)
    return NextResponse.json(
      {
        error: 'Save failed',
        detail: err instanceof Error ? err.message : 'unknown',
      },
      { status: 500 }
    )
  }
}
