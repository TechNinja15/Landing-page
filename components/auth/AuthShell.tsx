import React from "react";

const C = {
  purple: "#8B5CF6",
  lavender: "#FCF7FF",
  gold: "#FADF63",
  orange: "#FFA552",
  midnight: "#331E38",
  aubergine: "#16001E",
  white: "#FFFFFF",
};

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * (845 / 953)} viewBox="0 0 953 845" fill="none">
      <path d="M185.08 260.292H60V200H446.532L474.491 228.752C475.246 229.528 475.246 230.764 474.491 231.54L446.532 260.292H231.776H185.08Z" fill={C.purple} />
      <path d="M767.92 260.292H893V200H506.468L478.509 228.752C477.754 229.528 477.754 230.764 478.509 231.54L506.468 260.292H721.224H767.92Z" fill={C.purple} />
      <path d="M244.067 544.13V645H184.045V256H244.067V506.472V544.13Z" fill="url(#authg1)" />
      <path d="M725.244 544.13V645H665.222V256H725.244V506.472V544.13Z" fill="url(#authg2)" />
      <path d="M450.551 645C425.926 645 401.502 640.157 377.28 630.472C353.059 620.383 331.663 604.241 313.093 586.888V526.5C326.011 540.625 370.216 578.413 389.997 586.888C409.778 595.362 430.164 599.6 451.157 599.6C477.397 599.6 498.389 593.143 514.133 580.229C529.877 567.315 537.749 550.366 537.749 529.381C537.749 512.835 533.914 499.517 526.244 489.428C518.977 478.936 509.087 470.663 496.572 464.61C484.058 458.153 470.332 452.503 455.395 447.66C440.862 442.817 426.127 437.773 411.191 432.527C396.658 427.28 383.134 420.42 370.619 411.945C358.105 403.471 348.012 392.574 340.342 379.257C333.076 365.536 329.442 348.183 329.442 327.198C329.442 304.599 334.489 284.824 344.581 267.875C355.077 250.926 369.61 237.81 388.18 228.528C406.75 218.843 446.424 214 452.368 214C457.519 214 461.361 215.5 465.649 220.5C469.15 224 471.284 226.499 474.652 230L468.65 236.5C467.149 238 467.149 238 464.648 240.5C460.147 245 457.646 248 445.641 260C424.245 260 412.604 265.454 398.474 277.56C384.749 289.667 377.886 305.204 377.886 324.171C377.886 339.103 381.519 351.21 388.786 360.492C396.456 369.773 406.548 377.441 419.063 383.494C431.577 389.144 445.101 394.39 459.634 399.233C474.571 403.672 489.306 408.717 503.839 414.367C518.776 420.016 532.501 427.28 545.016 436.159C557.53 445.037 567.421 456.74 574.687 471.268C582.358 485.393 586.193 503.755 586.193 526.354C586.193 563.078 574.082 592.134 549.86 613.522C525.638 634.507 492.535 645 450.551 645Z" fill={C.purple} />
      <defs>
        <linearGradient id="authg1" x1="214" y1="256" x2="214" y2="645" gradientUnits="userSpaceOnUse"><stop stopColor={C.midnight} /><stop offset="1" stopColor={C.purple} /></linearGradient>
        <linearGradient id="authg2" x1="695" y1="256" x2="695" y2="645" gradientUnits="userSpaceOnUse"><stop stopColor={C.midnight} /><stop offset="1" stopColor={C.purple} /></linearGradient>
      </defs>
    </svg>
  );
}

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: C.lavender, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .auth-input:focus { outline: 2px solid ${C.purple}; outline-offset: 1px; border-color: transparent !important; }
        .auth-btn:hover { transform: translateY(-1px); filter: brightness(1.04); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>

      {/* Left - form panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px", maxWidth: 480, margin: "0 auto", width: "100%" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: C.aubergine, textDecoration: "none" }}>
          <LogoMark size={28} /> Thrive Skill Tech
        </a>

        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, color: C.aubergine, marginBottom: 8 }}>{title}</h1>
        <p style={{ fontSize: 14.5, color: C.aubergine, opacity: 0.6, marginBottom: 32 }}>{subtitle}</p>

        {children}

        {footer && <div style={{ marginTop: 28, fontSize: 13.5, color: C.aubergine, opacity: 0.7 }}>{footer}</div>}
      </div>

      {/* Right - brand panel (hidden on small screens via inline media query workaround) */}
      <div
        className="auth-brand-panel"
        style={{
          flex: 1,
          background: C.midnight,
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.purple}33, transparent 70%)`,
            top: "-10%",
            right: "-10%",
          }}
        />
        <div style={{ position: "relative", textAlign: "center", padding: 48, maxWidth: 440 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 34, color: C.lavender, lineHeight: 1.2 }}>
            Content to Career.
            <br />
            <span style={{ color: C.purple }}>Built with AI.</span>
          </div>
          <p style={{ color: "rgba(252,247,255,0.6)", fontSize: 14.5, marginTop: 16, lineHeight: 1.6 }}>
            AI Agents, Automation, Digital Marketing and Content Creation - taught live, by practitioners.
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .auth-brand-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

export function AuthInput({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: C.aubergine, opacity: 0.75, display: "block", marginBottom: 6 }}>
        {label}
      </label>
      <input
        {...props}
        className="auth-input"
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid rgba(22,0,30,0.15)",
          background: C.white,
          fontSize: 14.5,
          color: C.aubergine,
          transition: "border-color .15s",
        }}
      />
    </div>
  );
}

export function AuthButton({
  children,
  loading,
  ...props
}: { children: React.ReactNode; loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="auth-btn"
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
        transition: "transform .15s, filter .15s",
      }}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      style={{
        background: "#FEECEC",
        border: "1px solid #F5B8B8",
        color: "#9B2C2C",
        fontSize: 13.5,
        borderRadius: 10,
        padding: "10px 14px",
        marginBottom: 18,
      }}
    >
      {message}
    </div>
  );
}

export function AuthSuccess({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      style={{
        background: `${C.purple}12`,
        border: `1px solid ${C.purple}40`,
        color: C.purple,
        fontSize: 13.5,
        borderRadius: 10,
        padding: "10px 14px",
        marginBottom: 18,
      }}
    >
      {message}
    </div>
  );
}

export { C };
