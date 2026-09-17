/**
 * Codepet waitlist + profile-survey Apps Script.
 *
 * Drop-in replacement for the existing doPost. Keeps the original
 * column layout (A=Email, B=Timestamp) intact and adds the new
 * profile columns after them, so existing rows stay untouched.
 *
 * ─── COLUMN LAYOUT ───────────────────────────────────────────
 *   A  Email
 *   B  Timestamp
 *   C  Locale
 *   D  Age
 *   E  Gender
 *   F  Source
 *   G  Source (other)
 *   H  Signup For
 *   I  Family Member Age
 *   J  Needs
 *   K  Profile Submitted At
 *
 * No header row is required — column letters are fixed below.
 * If you ever want headers for readability, add them to row 1
 * and update FIRST_DATA_ROW from 1 → 2.
 * ──────────────────────────────────────────────────────────────
 */

const FIRST_DATA_ROW = 2 // row 1 holds headers ("Email", "Time", …)

// 1-indexed column numbers (A = 1, B = 2, …)
const COL = {
  email: 1,
  timestamp: 2,
  locale: 3,
  age: 4,
  gender: 5,
  source: 6,
  sourceOther: 7,
  signupFor: 8,
  familyAge: 9,
  needs: 10,
  profileSubmittedAt: 11,
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
    var data = JSON.parse(e.postData.contents || '{}')
    var email = String(data.email || '').trim().toLowerCase()
    if (!email) return jsonOut({ result: 'error', message: 'missing email' })

    // Anything beyond email/locale signals a profile-survey submit.
    var isProfile =
      data.age != null ||
      data.gender != null ||
      data.source != null ||
      data.sourceOther != null ||
      data.signupFor != null ||
      data.familyAge != null ||
      data.needs != null

    if (isProfile) {
      return handleProfile(sheet, email, data)
    } else {
      return handleSignup(sheet, email, data)
    }
  } catch (err) {
    return jsonOut({ result: 'error', message: String(err && err.message || err) })
  }
}

// Optional sanity check — visit the deployment URL in a browser
// and you'll see this JSON.
function doGet() {
  return jsonOut({ result: 'ok', message: 'Codepet waitlist endpoint live' })
}

/**
 * One-time setup helper — writes header labels into row 1 of the
 * bound spreadsheet so the columns are self-documenting. Run this
 * ONCE from the Apps Script editor:
 *   1. Pick `initHeaders` from the function dropdown (next to Run)
 *   2. Click Run
 *   3. Approve the sheet-write permission prompt the first time
 *
 * Safe to re-run: it only writes the labels and bolds row 1; it
 * never touches data in rows 2+.
 */
function initHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  var headers = [
    'Email',
    'Timestamp',
    'Locale',
    'Age',
    'Gender',
    'Source',
    'Source (other)',
    'Signup For',
    'Family Member Age',
    'Needs',
    'Profile Submitted At',
  ]
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold')
  sheet.setFrozenRows(1)
}

/* ─── Signup flow (email + locale) ───────────────────────────── */
function handleSignup(sheet, email, data) {
  if (findRowByEmail(sheet, email) > 0) {
    return jsonOut({ result: 'duplicate' })
  }

  // Build a row that matches the column order. Empty trailing
  // cells stay blank — the profile fields fill in later when the
  // survey is submitted.
  var row = [
    email,                                 // A Email
    new Date(),                            // B Timestamp
    String(data.locale || '').trim(),      // C Locale
  ]
  sheet.appendRow(row)
  return jsonOut({ result: 'ok' })
}

/* ─── Profile flow (survey fields) ───────────────────────────── */
function handleProfile(sheet, email, data) {
  var rowNum = findRowByEmail(sheet, email)

  // Pairs of [columnNumber, value] to write. Skip empties so a
  // re-submit doesn't blank a previously-saved field.
  var writes = [
    [COL.age,         data.age],
    [COL.gender,      data.gender],
    [COL.source,      data.source],
    [COL.sourceOther, data.sourceOther],
    [COL.signupFor,   data.signupFor],
    [COL.familyAge,   data.familyAge],
    [COL.needs,       data.needs],
  ].filter(function (pair) {
    return pair[1] != null && String(pair[1]).trim() !== ''
  })

  if (rowNum > 0) {
    // Update profile columns on the existing row.
    writes.forEach(function (pair) {
      sheet.getRange(rowNum, pair[0]).setValue(pair[1])
    })
    sheet.getRange(rowNum, COL.profileSubmittedAt).setValue(new Date())
    return jsonOut({ result: 'ok' })
  }

  // No row for this email yet — insert a fresh one with the
  // profile fields. Builds a sparse row indexed by COL.* values.
  var row = []
  row[COL.email - 1] = email
  row[COL.timestamp - 1] = new Date()
  writes.forEach(function (pair) {
    row[pair[0] - 1] = pair[1]
  })
  row[COL.profileSubmittedAt - 1] = new Date()
  // Pad to expected width so trailing undefineds don't trip
  // appendRow.
  while (row.length < COL.profileSubmittedAt) row.push('')
  sheet.appendRow(row)
  return jsonOut({ result: 'ok' })
}

/* ─── Helpers ────────────────────────────────────────────────── */
function findRowByEmail(sheet, email) {
  var lastRow = sheet.getLastRow()
  if (lastRow < FIRST_DATA_ROW) return -1
  var rows = lastRow - FIRST_DATA_ROW + 1
  if (rows < 1) return -1
  var values = sheet.getRange(FIRST_DATA_ROW, COL.email, rows, 1).getValues()
  for (var i = 0; i < values.length; i++) {
    var cell = String(values[i][0] || '').trim().toLowerCase()
    if (cell === email) return FIRST_DATA_ROW + i
  }
  return -1
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}
