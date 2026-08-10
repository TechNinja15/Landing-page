"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, ArrowRight } from "lucide-react";

const C = {
  purple: "#8B5CF6",
  lavender: "#FCF7FF",
  aubergine: "#16001E",
  white: "#FFFFFF",
};

export default function VerifyLookupPage() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) router.push(`/verify/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.lavender, fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <header style={{ padding: "24px 24px 0" }}>
        <a href="/" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: C.aubergine, textDecoration: "none" }}>
          Thrive Skill Tech
        </a>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: 420, width: "100%", background: C.white, borderRadius: 32, padding: 40, textAlign: "center", boxShadow: "0 30px 80px -30px rgba(51,30,56,0.2)" }}
        >
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(139,92,246,0.12)", display: "grid", placeItems: "center", margin: "0 auto 18px" }}>
            <Award size={26} color={C.purple} />
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 21, color: C.aubergine, marginBottom: 8 }}>
            Verify a certificate
          </h1>
          <p style={{ fontSize: 13.5, color: C.aubergine, opacity: 0.6, marginBottom: 22 }}>
            Enter the Certificate ID found on the certificate (e.g. TST-2026-A1B2C3D4).
          </p>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="TST-2026-XXXXXXXX"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(22,0,30,0.15)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 14,
              marginBottom: 16,
              textAlign: "center",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px 20px",
              borderRadius: 12,
              border: "none",
              background: C.purple,
              color: C.white,
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            Verify <ArrowRight size={16} />
          </button>
        </form>
      </main>
    </div>
  );
}
