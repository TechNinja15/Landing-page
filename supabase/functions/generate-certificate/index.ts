// supabase/functions/generate-certificate/index.ts
//
// ============================================================
// Deploy:  supabase functions deploy generate-certificate
// Secrets: supabase secrets set SITE_URL=https://thriveskilltech.com
//          (SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY
//          are injected automatically by the platform - no need to set
//          those three yourself)
// Invoke:  supabase.functions.invoke('generate-certificate', { body: { enrollment_id } })
//          or { body: { bulk: true } } to scan every enrollment at 100%
//          without a certificate yet - this is what the admin portal's
//          "Bulk generate" button calls.
// ============================================================
//
// This function is intentionally the only place that writes to the
// `certificates` table with a real PDF - nothing else in the app
// fabricates a certificate. It uses the service-role key (bypasses
// RLS) because it runs server-side, triggered either by the database
// trigger in 0007_certificate_trigger.sql or by an admin action, not
// directly by a student's browser.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

const BRAND = {
  purple: rgb(0.545, 0.365, 0.965), // #8B5CF6
  midnight: rgb(0.2, 0.118, 0.22), // #331E38
  gold: rgb(0.98, 0.875, 0.388), // #FADF63
  aubergine: rgb(0.086, 0, 0.118), // #16001E
};

interface GenerateOne {
  enrollment_id: string;
}
interface GenerateBulk {
  bulk: true;
}

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://thriveskilltech.com";
    const supabase = createClient(supabaseUrl, serviceKey);

    // ---------- authorization ----------
    // Two legitimate callers:
    //  1. The database trigger (0007_certificate_generation.sql), which
    //     sends `Authorization: Bearer <service-role key>` directly -
    //     trusted implicitly, since only server-side SQL config has it.
    //  2. An admin/super_admin calling this from the admin portal's
    //     "Bulk generate" button, sending their own user JWT - verified
    //     below by looking up their profile role with the service client
    //     (bypassing RLS is fine here, this IS the authorization check).
    // Anyone else - including a logged-in student - is rejected. Without
    // this check, any authenticated user could trigger bulk generation
    // for the entire student body, since Edge Functions are reachable
    // by anyone holding a valid Supabase JWT (even the anon key) unless
    // the function itself enforces something stricter.
    const authHeader = req.headers.get("Authorization") ?? "";
    const isServiceRoleCaller = authHeader === `Bearer ${serviceKey}`;

    if (!isServiceRoleCaller) {
      const callerClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const {
        data: { user },
      } = await callerClient.auth.getUser();

      if (!user) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (!profile || !["admin", "super_admin"].includes(profile.role)) {
        return new Response(JSON.stringify({ error: "Admin access required" }), { status: 403 });
      }
    }

    const body: GenerateOne | GenerateBulk = await req.json();

    let enrollmentIds: string[];

    if ("bulk" in body && body.bulk) {
      const { data: eligible, error } = await supabase
        .from("enrollments")
        .select("id, student_id, course_id")
        .eq("progress_percent", 100);
      if (error) throw error;

      // filter out enrollments that already have a certificate for this course
      const { data: existing } = await supabase.from("certificates").select("student_id, course_id");
      const existingSet = new Set((existing ?? []).map((c: any) => `${c.student_id}:${c.course_id}`));
      enrollmentIds = (eligible ?? [])
        .filter((e: any) => !existingSet.has(`${e.student_id}:${e.course_id}`))
        .map((e: any) => e.id);
    } else {
      enrollmentIds = [(body as GenerateOne).enrollment_id];
    }

    const results = [];
    for (const enrollmentId of enrollmentIds) {
      results.push(await generateForEnrollment(supabase, enrollmentId, siteUrl));
    }

    return new Response(JSON.stringify({ generated: results }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function generateForEnrollment(supabase: any, enrollmentId: string, siteUrl: string) {
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("student_id, course_id, progress_percent, profiles:student_id(full_name), courses:course_id(title, certificate_enabled)")
    .eq("id", enrollmentId)
    .single();

  if (enrollmentError || !enrollment) throw new Error(`Enrollment not found: ${enrollmentId}`);
  if (enrollment.progress_percent < 100) throw new Error(`Enrollment ${enrollmentId} is not at 100% yet`);
  if (enrollment.courses?.certificate_enabled === false) throw new Error(`Certificates disabled for this course`);

  // idempotency: don't double-issue if this runs twice for the same student+course
  const { data: existing } = await supabase
    .from("certificates")
    .select("id, certificate_number, pdf_url")
    .eq("student_id", enrollment.student_id)
    .eq("course_id", enrollment.course_id)
    .maybeSingle();
  if (existing) return existing;

  const certificateNumber = `TST-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const verifyUrl = `${siteUrl}/verify/${certificateNumber}`;

  // QR code via a hosted generator rather than a Deno QR library - keeps
  // the function's dependency surface small. Swap for a self-hosted QR
  // library (e.g. deno.land/x/qrcode) if depending on a third party for
  // certificate generation is a concern at production scale.
  const qrRes = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(verifyUrl)}`);
  const qrBytes = new Uint8Array(await qrRes.arrayBuffer());

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const qrImage = await pdfDoc.embedPng(qrBytes);

  // background + border, brand colors
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.988, 0.969, 1) }); // lavender
  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, borderColor: BRAND.purple, borderWidth: 2 });
  page.drawRectangle({ x: 0, y: height - 14, width, height: 14, color: BRAND.purple });

  page.drawText("THRIVE SKILL TECH", { x: 60, y: height - 90, size: 16, font: fontBold, color: BRAND.midnight });
  page.drawText("Certificate of Completion", { x: 60, y: height - 200, size: 34, font: fontBold, color: BRAND.aubergine });

  page.drawText("This certifies that", { x: 60, y: height - 250, size: 13, font, color: rgb(0.3, 0.3, 0.3) });
  page.drawText(enrollment.profiles?.full_name ?? "Student", { x: 60, y: height - 290, size: 28, font: fontBold, color: BRAND.purple });

  page.drawText("has successfully completed", { x: 60, y: height - 330, size: 13, font, color: rgb(0.3, 0.3, 0.3) });
  page.drawText(enrollment.courses?.title ?? "Course", { x: 60, y: height - 365, size: 20, font: fontBold, color: BRAND.aubergine });

  const issuedDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  page.drawText(`Issued ${issuedDate}`, { x: 60, y: 90, size: 11, font, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(`Certificate ID: ${certificateNumber}`, { x: 60, y: 70, size: 11, font, color: rgb(0.4, 0.4, 0.4) });

  page.drawImage(qrImage, { x: width - 190, y: 60, width: 110, height: 110 });
  page.drawText("Scan to verify", { x: width - 180, y: 48, size: 9, font, color: rgb(0.4, 0.4, 0.4) });

  const pdfBytes = await pdfDoc.save();

  const storagePath = `${enrollment.student_id}/${certificateNumber}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("certificates")
    .upload(storagePath, pdfBytes, { contentType: "application/pdf", upsert: false });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from("certificates").getPublicUrl(storagePath);

  const { data: certRow, error: insertError } = await supabase
    .from("certificates")
    .insert({
      student_id: enrollment.student_id,
      course_id: enrollment.course_id,
      certificate_number: certificateNumber,
      pdf_url: publicUrlData.publicUrl,
    })
    .select()
    .single();
  if (insertError) throw insertError;

  return certRow;
}
