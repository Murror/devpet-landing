/**
 * Codepet waitlist endpoint — Google Apps Script web app.
 *
 * BOUND to a dedicated signups Google Sheet: it appends each subscriber
 * to the FIRST tab of whatever spreadsheet this script is attached to,
 * so there are no spreadsheet IDs to hardcode. Create the sheet from
 * inside Google Sheets, then open Extensions → Apps Script there.
 *
 * Setup:
 *   1. Create a new Google Sheet for signups.
 *   2. Put these headers in row 1 (dedupe scans column B):
 *        A: Timestamp   B: Email   C: Locale   D: UserAgent
 *   3. In that sheet: Extensions → Apps Script, paste this file, Save.
 *   4. Run doGet once to clear the authorization prompt.
 *   5. Deploy → New deployment → Web app
 *        (Execute as: Me · Who has access: Anyone) → copy the /exec URL.
 *   6. Set GOOGLE_SHEET_WEBHOOK_URL = that /exec URL in Vercel (and
 *      .env.local), then redeploy the site.
 *
 * Contract (matches app/api/waitlist/route.ts):
 *   Request  — POST JSON: { "email": "...", "locale": "en" }
 *   Response — { "result": "ok" } on insert,
 *              { "result": "duplicate" } if email already present,
 *              { "result": "error", "message": "..." } on failure.
 */

function doPost(e) {
  // Serialize writes so two near-simultaneous signups can't both slip
  // past the dedupe check and create twin rows.
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return _json({ result: 'error', message: 'busy' });
  }
  try {
    // The Next.js route forwards the original JSON body untouched, so
    // the payload arrives as postData.contents (not e.parameter).
    const raw = (e && e.postData && e.postData.contents) || '{}';
    const body = JSON.parse(raw);

    const email = (body.email || '').toString().trim().toLowerCase();
    const locale = (body.locale || '').toString().trim();
    const ua = (body.ua || '').toString().slice(0, 500);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return _json({ result: 'error', message: 'invalid_email' });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Dedupe: scan the whole Email column (B) from row 1. Starting at row
    // 1 keeps it correct whether or not a header row is present (a header
    // like "Email" can never collide with a real address anyway).
    const lastRow = sheet.getLastRow();
    if (lastRow >= 1) {
      const existing = sheet.getRange(1, 2, lastRow, 1).getValues();
      for (let i = 0; i < existing.length; i++) {
        const cell = (existing[i][0] || '').toString().trim().toLowerCase();
        if (cell === email) {
          return _json({ result: 'duplicate' });
        }
      }
    }

    sheet.appendRow([new Date(), email, locale, ua]);
    // Commit the row NOW (before the lock is released) so the next
    // request's dedupe scan can actually see it.
    SpreadsheetApp.flush();
    return _json({ result: 'ok' });
  } catch (err) {
    return _json({ result: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return _json({
    result: 'ok',
    hint: 'POST JSON { email, locale } to save an address.',
  });
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
