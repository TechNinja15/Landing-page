import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle2, XCircle, ArrowLeft, Award } from "lucide-react";

const C = {
  purple: "#8B5CF6",
  lavender: "#FCF7FF",
  gold: "#FADF63",
  midnight: "#331E38",
  aubergine: "#16001E",
  white: "#FFFFFF",
};

interface Props {
  params: Promise<{ certificate_number: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certificate_number } = await params;
  return {
    title: `Verify Certificate ${certificate_number}`,
    // Certificate results include a real person's name — kept out of
    // search results deliberately, same reasoning as the portal pages.
    robots: { index: false, follow: false },
  };
}

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * (845 / 953)} viewBox="0 0 953 845" fill="none">
      <path d="M185.08 260.292H60V200H446.532L474.491 228.752C475.246 229.528 475.246 230.764 474.491 231.54L446.532 260.292H231.776H185.08Z" fill={C.purple} />
      <path d="M767.92 260.292H893V200H506.468L478.509 228.752C477.754 229.528 477.754 230.764 478.509 231.54L506.468 260.292H721.224H767.92Z" fill={C.purple} />
      <path d="M244.067 544.13V645H184.045V256H244.067V506.472V544.13Z" fill="url(#vg1)" />
      <path d="M725.244 544.13V645H665.222V256H725.244V506.472V544.13Z" fill="url(#vg2)" />
      <path d="M450.551 645C425.926 645 401.502 640.157 377.28 630.472C353.059 620.383 331.663 604.241 313.093 586.888V526.5C326.011 540.625 370.216 578.413 389.997 586.888C409.778 595.362 430.164 599.6 451.157 599.6C477.397 599.6 498.389 593.143 514.133 580.229C529.877 567.315 537.749 550.366 537.749 529.381C537.749 512.835 533.914 499.517 526.244 489.428C518.977 478.936 509.087 470.663 496.572 464.61C484.058 458.153 470.332 452.503 455.395 447.66C440.862 442.817 426.127 437.773 411.191 432.527C396.658 427.28 383.134 420.42 370.619 411.945C358.105 403.471 348.012 392.574 340.342 379.257C333.076 365.536 329.442 348.183 329.442 327.198C329.442 304.599 334.489 284.824 344.581 267.875C355.077 250.926 369.61 237.81 388.18 228.528C406.75 218.843 446.424 214 452.368 214C457.519 214 461.361 215.5 465.649 220.5C469.15 224 471.284 226.499 474.652 230L468.65 236.5C467.149 238 467.149 238 464.648 240.5C460.147 245 457.646 248 445.641 260C424.245 260 412.604 265.454 398.474 277.56C384.749 289.667 377.886 305.204 377.886 324.171C377.886 339.103 381.519 351.21 388.786 360.492C396.456 369.773 406.548 377.441 419.063 383.494C431.577 389.144 445.101 394.39 459.634 399.233C474.571 403.672 489.306 408.717 503.839 414.367C518.776 420.016 532.501 427.28 545.016 436.159C557.53 445.037 567.421 456.74 574.687 471.268C582.358 485.393 586.193 503.755 586.193 526.354C586.193 563.078 574.082 592.134 549.86 613.522C525.638 634.507 492.535 645 450.551 645Z" fill={C.purple} />
      <defs>
        <linearGradient id="vg1" x1="214" y1="256" x2="214" y2="645" gradientUnits="userSpaceOnUse"><stop stopColor={C.midnight} /><stop offset="1" stopColor={C.purple} /></linearGradient>
        <linearGradient id="vg2" x1="695" y1="256" x2="695" y2="645" gradientUnits="userSpaceOnUse"><stop stopColor={C.midnight} /><stop offset="1" stopColor={C.purple} /></linearGradient>
      </defs>
    </svg>
  );
}

export default async function VerifyCertificatePage({ params }: Props) {
  const { certificate_number } = await params;
  const supabase = await createClient();

  // verify_certificate is a public SECURITY DEFINER RPC (see
  // 0003_assignments_certificates_payments.sql) — it deliberately
  // exposes only student_name/course_title/issued_at/is_valid, never
  // the full certificates row, so this page works for anonymous
  // visitors without granting broader table access.
  const { data, error } = await supabase.rpc("verify_certificate", { cert_number: certificate_number });
  const result = Array.isArray(data) && data.length > 0 ? data[0] : null;
  const isValid = !error && result?.is_valid;

  return (
    <div style={{ minHeight: "100vh", background: C.lavender, fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <header style={{ padding: "24px 24px 0" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: C.aubergine, textDecoration: "none" }}>
          <LogoMark size={26} /> Thrive Skill Tech
        </a>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 480, width: "100%" }}>
          {isValid ? (
            <div
              style={{
                background: C.white,
                borderRadius: 32,
                padding: 40,
                textAlign: "center",
                boxShadow: "0 30px 80px -30px rgba(51,30,56,0.25)",
                border: `1px solid rgba(139,92,246,0.15)`,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(139,92,246,0.12)",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 20px",
                }}
              >
                <CheckCircle2 size={32} color={C.purple} />
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.purple, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Verified Certificate
              </div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 26, color: C.aubergine, lineHeight: 1.25, marginBottom: 8 }}>
                {result.student_name}
              </h1>
              <p style={{ fontSize: 15, color: C.aubergine, opacity: 0.75, marginBottom: 24 }}>
                has successfully completed
                <br />
                <span style={{ fontWeight: 600, opacity: 1 }}>{result.course_title}</span>
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderRadius: 16,
                  background: C.lavender,
                  fontSize: 13,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ opacity: 0.5, marginBottom: 2 }}>Issued</div>
                  <div style={{ fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>
                    {new Date(result.issued_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ opacity: 0.5, marginBottom: 2 }}>Certificate ID</div>
                  <div style={{ fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>{certificate_number}</div>
                </div>
              </div>

              <p style={{ fontSize: 12, opacity: 0.45, marginTop: 20, lineHeight: 1.5 }}>
                This page confirms the certificate above was genuinely issued by Thrive Skill Tech. Verified
                directly against our records — nothing on this page can be edited by the certificate holder.
              </p>
            </div>
          ) : (
            <div
              style={{
                background: C.white,
                borderRadius: 32,
                padding: 40,
                textAlign: "center",
                boxShadow: "0 30px 80px -30px rgba(51,30,56,0.15)",
                border: "1px solid rgba(22,0,30,0.08)",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(22,0,30,0.06)",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 20px",
                }}
              >
                <XCircle size={32} color="rgba(22,0,30,0.4)" />
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(22,0,30,0.5)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Not Found
              </div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: C.aubergine, lineHeight: 1.3, marginBottom: 10 }}>
                We couldn't verify this certificate
              </h1>
              <p style={{ fontSize: 14, color: C.aubergine, opacity: 0.65, lineHeight: 1.6, marginBottom: 24 }}>
                No certificate matches ID <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{certificate_number}</span>.
                Double-check the ID, or it may have been entered incorrectly.
              </p>
              <a
                href="mailto:thriveskilltech@gmail.com"
                style={{ fontSize: 13.5, fontWeight: 600, color: C.purple, textDecoration: "none" }}
              >
                Contact us if you believe this is an error →
              </a>
            </div>
          )}

          <a href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 24, fontSize: 13.5, color: C.aubergine, opacity: 0.6, textDecoration: "none" }}>
            <ArrowLeft size={14} /> Back to Thrive Skill Tech
          </a>
        </div>
      </main>
    </div>
  );
}
