/**
 * Thrive Skill Tech — "Book a Demo" form -> Google Sheets
 * ============================================================
 * WHAT THIS IS
 * A Google Apps Script Web App. It's the "backend" for the demo
 * booking form on the landing page — no server needed. The form
 * POSTs JSON to this script's deployed URL, and this script
 * appends a row to a Google Sheet.
 *
 * SETUP (5 minutes)
 * 1. Create a new Google Sheet (or open an existing one).
 * 2. In the Sheet: Extensions -> Apps Script.
 * 3. Delete the placeholder code and paste this whole file in.
 * 4. Click Deploy -> New deployment.
 *      - Type: "Web app"
 *      - Execute as: "Me"
 *      - Who has access: "Anyone"
 *    (This does NOT expose your sheet's data for reading — it
 *    only lets anyone POST a new row in, which is what a public
 *    lead form needs. Nobody can GET existing rows through this.)
 * 5. Click Deploy, authorize the permissions Google asks for.
 * 6. Copy the "Web app URL" it gives you — it ends in /exec.
 * 7. Paste that URL into ThriveSkillTechLanding.jsx, replacing
 *    the GOOGLE_SHEET_WEBHOOK_URL constant near the top of the file.
 *
 * That's it. Every demo booking now lands as a row in your Sheet.
 *
 * NOTE ON READING THE RESPONSE
 * The React form calls this with `mode: "no-cors"` to avoid a
 * CORS preflight that Apps Script doesn't handle well for JSON.
 * That means the browser can't read this script's response —
 * but the row still gets appended. If you later want confirmation
 * in the UI, you'd need to swap this for a real backend (a Next.js
 * API route, or a Supabase Edge Function) that can set CORS headers
 * properly.
 * ============================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Demo Bookings');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Demo Bookings');
      sheet.appendRow(['Submitted At', 'Name', 'Email', 'Phone', 'Course Interested', 'Preferred Time', 'Source']);
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.submitted_at || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.course || '',
      data.preferred_time || '',
      data.source || 'website',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Optional: lets you sanity-check the deployment by visiting the
 * /exec URL directly in a browser — should show "Web app is live".
 */
function doGet(e) {
  return ContentService.createTextOutput('Web app is live. POST demo-booking JSON here.');
}
