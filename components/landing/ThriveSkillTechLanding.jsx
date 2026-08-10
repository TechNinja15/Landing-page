"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  MessageCircle,
  FileDown,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  Bot,
  Megaphone,
  PenTool,
  CheckCircle2,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Facebook,
} from "lucide-react";

/* ============================================================
   THRIVE SKILL TECH — brand tokens (from Brand Identity System v1.0)
   ============================================================ */
const C = {
  purple: "#8B5CF6",
  purpleDeep: "#6D3FD1",
  lavender: "#FCF7FF",
  gold: "#FADF63",
  orange: "#FFA552",
  midnight: "#331E38",
  aubergine: "#16001E",
  white: "#FFFFFF",
};

const fontDisplay = "'Space Grotesk', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'IBM Plex Mono', monospace";

/* ============================================================
   Logo — inlined official master artwork (TST monogram)
   ============================================================ */
function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size * (845 / 953)} viewBox="0 0 953 845" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M185.08 260.292H60V200H446.532L474.491 228.752C475.246 229.528 475.246 230.764 474.491 231.54L446.532 260.292H231.776H185.08Z" fill={C.purple} />
      <path d="M767.92 260.292H893V200H506.468L478.509 228.752C477.754 229.528 477.754 230.764 478.509 231.54L506.468 260.292H721.224H767.92Z" fill={C.purple} />
      <path d="M244.067 544.13V645H184.045V256H244.067V506.472V544.13Z" fill="url(#g1)" />
      <path d="M725.244 544.13V645H665.222V256H725.244V506.472V544.13Z" fill="url(#g2)" />
      <path d="M450.551 645C425.926 645 401.502 640.157 377.28 630.472C353.059 620.383 331.663 604.241 313.093 586.888V526.5C326.011 540.625 370.216 578.413 389.997 586.888C409.778 595.362 430.164 599.6 451.157 599.6C477.397 599.6 498.389 593.143 514.133 580.229C529.877 567.315 537.749 550.366 537.749 529.381C537.749 512.835 533.914 499.517 526.244 489.428C518.977 478.936 509.087 470.663 496.572 464.61C484.058 458.153 470.332 452.503 455.395 447.66C440.862 442.817 426.127 437.773 411.191 432.527C396.658 427.28 383.134 420.42 370.619 411.945C358.105 403.471 348.012 392.574 340.342 379.257C333.076 365.536 329.442 348.183 329.442 327.198C329.442 304.599 334.489 284.824 344.581 267.875C355.077 250.926 369.61 237.81 388.18 228.528C406.75 218.843 446.424 214 452.368 214C457.519 214 461.361 215.5 465.649 220.5C469.15 224 471.284 226.499 474.652 230L468.65 236.5C467.149 238 467.149 238 464.648 240.5C460.147 245 457.646 248 445.641 260C424.245 260 412.604 265.454 398.474 277.56C384.749 289.667 377.886 305.204 377.886 324.171C377.886 339.103 381.519 351.21 388.786 360.492C396.456 369.773 406.548 377.441 419.063 383.494C431.577 389.144 445.101 394.39 459.634 399.233C474.571 403.672 489.306 408.717 503.839 414.367C518.776 420.016 532.501 427.28 545.016 436.159C557.53 445.037 567.421 456.74 574.687 471.268C582.358 485.393 586.193 503.755 586.193 526.354C586.193 563.078 574.082 592.134 549.86 613.522C525.638 634.507 492.535 645 450.551 645Z" fill={C.purple} />
      <defs>
        <linearGradient id="g1" x1="214" y1="256" x2="214" y2="645" gradientUnits="userSpaceOnUse">
          <stop stopColor={C.midnight} />
          <stop offset="1" stopColor={C.purple} />
        </linearGradient>
        <linearGradient id="g2" x1="695" y1="256" x2="695" y2="645" gradientUnits="userSpaceOnUse">
          <stop stopColor={C.midnight} />
          <stop offset="1" stopColor={C.purple} />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ============================================================
   Signature element — "Content → Career" thread
   A single hand-drawn scribble on the left resolves into a clean
   ascending line on the right, threading through the three domain
   pills. This is the tagline ("Content to Career") made literal
   and structural, not decorative.
   ============================================================ */
function ContentToCareerThread({ reduced }) {
  const pathRef = useRef(null);
  useEffect(() => {
    if (reduced || !pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${len}`;
    pathRef.current.style.strokeDashoffset = `${len}`;
    pathRef.current.getBoundingClientRect();
    pathRef.current.style.transition = "stroke-dashoffset 2.4s cubic-bezier(.16,1,.3,1) .2s";
    pathRef.current.style.strokeDashoffset = "0";
  }, [reduced]);

  return (
    <div className="relative w-full" style={{ maxWidth: 620 }}>
      <svg viewBox="0 0 620 360" width="100%" height="auto" fill="none">
        <path
          ref={pathRef}
          d="M20,260 C55,230 40,190 75,180 C110,170 95,225 130,220 C165,215 150,150 190,155 C230,160 210,240 255,235 C310,229 300,120 360,110 C430,99 470,70 560,40"
          stroke={C.purple}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <circle cx="20" cy="260" r="6" fill={C.midnight} />
        <circle cx="560" cy="40" r="7" fill={C.gold} stroke={C.aubergine} strokeWidth="1.5" />
      </svg>

      {/* floating glass domain pills threaded along the path */}
      <FloatPill style={{ left: "4%", top: "58%" }} icon={<PenTool size={14} />} label="Content" delay="0s" />
      <FloatPill style={{ left: "34%", top: "36%" }} icon={<Bot size={14} />} label="AI Agents" delay=".4s" />
      <FloatPill style={{ left: "58%", top: "52%" }} icon={<Megaphone size={14} />} label="Marketing" delay=".8s" />
      <FloatPill style={{ left: "84%", top: "6%" }} icon={<Briefcase size={14} />} label="Career" delay="1.2s" accent />
    </div>
  );
}

function FloatPill({ style, icon, label, delay, accent }) {
  return (
    <div
      className="thread-pill absolute flex items-center gap-1.5 rounded-full backdrop-blur-md px-3 py-1.5 text-xs font-medium shadow-lg"
      style={{
        ...style,
        background: accent ? "rgba(250,223,99,0.9)" : "rgba(255,255,255,0.75)",
        border: `1px solid ${accent ? C.gold : "rgba(139,92,246,0.25)"}`,
        color: C.aubergine,
        fontFamily: fontBody,
        animationDelay: delay,
      }}
    >
      <span style={{ color: accent ? C.aubergine : C.purple }}>{icon}</span>
      {label}
    </div>
  );
}

/* ============================================================
   Reveal-on-scroll wrapper
   ============================================================ */
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}s, transform .7s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   Buttons — per brand system (09 Buttons)
   ============================================================ */
function Button({ variant = "primary", children, icon, className = "", style, ...props }) {
  const base = {
    fontFamily: fontBody,
    fontWeight: 600,
    fontSize: 15,
    borderRadius: 14,
    padding: "13px 24px",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: "transform .2s ease, box-shadow .2s ease, background .2s ease",
    cursor: "pointer",
    border: "none",
  };
  const styles = {
    primary: { background: C.purple, color: C.white, boxShadow: "0 12px 40px -12px rgba(139,92,246,0.55)" },
    secondary: { background: C.white, color: C.aubergine, border: `1px solid rgba(22,0,30,0.15)` },
    ghost: { background: "transparent", color: C.purple, border: `1px solid rgba(139,92,246,0.35)` },
    accent: { background: C.orange, color: C.aubergine, boxShadow: "0 12px 40px -14px rgba(255,165,82,0.6)" },
  };
  return (
    <button
      {...props}
      className={`btn-hover ${className}`}
      style={{ ...base, ...styles[variant], ...style }}
    >
      {children}
      {icon}
    </button>
  );
}

/* ============================================================
   Data — real content pulled from curriculum docs / brief.
   Stats intentionally show placeholders, not invented numbers.
   ============================================================ */
const COURSES = [
  {
    id: "ai-agents",
    tag: "Most in-demand",
    title: "AI Agents & Automation Mastery",
    duration: "10–12 Weeks",
    mode: "Live Online / Hybrid",
    level: "Beginner → Intermediate",
    icon: <Bot size={22} />,
    accent: C.purple,
    summary:
      "Build agentic workflows and marketing automations with Python, LangChain and LangGraph — from your first API call to a deployed multi-agent system.",
    modules: [
      "AI & LLM Fundamentals, Prompt Engineering",
      "Agent Architecture — Planning, Memory, Tool Use",
      "LangChain: Models, Chains, Tools, Memory",
      "LangGraph: States, Nodes, Conditional Routing",
      "Retrieval-Augmented Generation & Vector DBs",
      "Multi-Agent Systems (Research → Writer → Editor)",
      "WhatsApp & Voice Agents, n8n, Zapier, Make.com",
      "OpenAI API, Anthropic API, Supabase integration",
      "Deployment — FastAPI, Streamlit, monitoring",
    ],
    projects: ["SEO Content Assistant", "AI Blog Production Workflow", "Multi-Agent Marketing Agency", "Capstone: Your AI Marketing Employee"],
    certificate: "Verified certificate with QR code",
  },
  {
    id: "digital-marketing",
    tag: "Career fundamentals",
    title: "Digital Marketing Professional",
    duration: "8–10 Weeks · 28+ Hours",
    mode: "Live Online / Hybrid",
    level: "Beginner → Advanced",
    icon: <Megaphone size={22} />,
    accent: C.orange,
    summary:
      "A complete, hour-mapped curriculum from website planning to paid media — SEO, Google & Meta Ads, analytics and conversion, taught end to end.",
    modules: [
      "Digital Marketing Fundamentals & AIDA Funnel",
      "Website Planning — WordPress, HTML/CSS, 5-page build",
      "Google Analytics, Search Console, Technical SEO",
      "On-Page, Off-Page & Local SEO, Competitor Analysis",
      "Google Ads — Search, Display, Video, Shopping, Remarketing",
      "Meta Ads — Campaign Structure, Pixels, Lookalike Audiences",
      "LinkedIn, Pinterest, Quora, Snapchat, WhatsApp & SMS Marketing",
      "Email Marketing, Copywriting, Content & Affiliate Marketing",
      "Online Reputation Management",
    ],
    projects: ["Live Ad Account Setup", "SEO Audit Report", "Full-Funnel Campaign Launch"],
    certificate: "Verified certificate with QR code",
  },
  {
    id: "content-branding",
    tag: "Creator track",
    title: "Content Creation & Personal Branding",
    duration: "6–8 Weeks",
    mode: "Live Online / Hybrid",
    level: "Beginner → Intermediate",
    icon: <PenTool size={22} />,
    accent: C.gold,
    summary:
      "Turn a point of view into a portfolio: content strategy, short-form video, and an AI-assisted production workflow across Instagram, YouTube and LinkedIn.",
    modules: [
      "Content Strategy & Storytelling",
      "Instagram & Reels Growth, Short-form Content",
      "YouTube Fundamentals",
      "LinkedIn for Personal Branding",
      "Video Editing — CapCut & Canva",
      "AI-Assisted Content Creation",
      "Portfolio Building",
    ],
    projects: ["30-Day Content Calendar", "Personal Brand Portfolio"],
    certificate: "Verified certificate with QR code",
  },
];

const WHY_US = [
  { icon: <Users size={20} />, label: "Live instructor-led training" },
  { icon: <Briefcase size={20} />, label: "Real client projects" },
  { icon: <GraduationCap size={20} />, label: "Internship opportunities" },
  { icon: <Award size={20} />, label: "Placement assistance" },
  { icon: <CheckCircle2 size={20} />, label: "Small batch sizes" },
  { icon: <Sparkles size={20} />, label: "Hands-on AI tool training" },
];

const FAQS = [
  { q: "How long are the courses?", a: "Programs run 6–12 weeks depending on the track, delivered live online or hybrid, with recordings available for every session." },
  { q: "Is there EMI or scholarship support?", a: "Yes — flexible payment plans and merit-based scholarships are available. Speak with a counsellor during your free demo to see what applies to you." },
  { q: "Do I get a certificate?", a: "Every completed course issues a verified certificate with a unique ID and QR code, shareable directly to LinkedIn." },
  { q: "What if I miss a live class?", a: "All sessions are recorded and added to your Student Portal within 24 hours, so you never lose your place." },
  { q: "Is placement assistance guaranteed?", a: "We provide resume building, mock interviews and active placement support — outcomes depend on your portfolio and effort, and we're upfront about that." },
];

/* ============================================================
   Main Page
   ============================================================ */
// Real WhatsApp deep link from the brand doc — used by every WhatsApp CTA.
const WHATSAPP_LINK = "https://wa.me/918369953959?text=Hi%2C%20I'd%20like%20to%20know%20more%20about%20Thrive%20Skill%20Tech%20courses.";

// Google Sheets mirroring now happens server-side in /api/leads (route.ts) —
// set GOOGLE_SHEET_WEBHOOK_URL as an environment variable there, not here.
// Keeping API keys and webhook URLs out of client bundles is the point.

const DEMO_COURSES = ["AI Agents & Automation Mastery", "Digital Marketing Professional", "Content Creation & Personal Branding", "Not sure yet"];

function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [message, onDone]);
  if (!message) return null;
  return (
    <div
      className="fixed bottom-6 left-1/2 z-[999] px-5 py-3 rounded-2xl"
      style={{
        transform: "translateX(-50%)",
        background: C.aubergine,
        color: C.white,
        fontSize: 14,
        fontWeight: 500,
        boxShadow: "0 20px 50px -15px rgba(22,0,30,0.5)",
        animation: "toastIn .3s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {message}
    </div>
  );
}

function CurriculumModal({ course, onClose, onBookDemo }) {
  if (!course) return null;
  return (
    <div
      className="fixed inset-0 z-[998] flex items-center justify-center p-4"
      style={{ background: "rgba(22,0,30,0.5)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl w-full overflow-y-auto"
        style={{ maxWidth: 560, maxHeight: "85vh", background: C.white, padding: 32 }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: course.accent }}>{course.tag}</span>
            <h3 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22, marginTop: 4 }}>{course.title}</h3>
          </div>
          <button onClick={onClose} aria-label="Close"><X size={20} style={{ opacity: 0.5 }} /></button>
        </div>
        <p style={{ fontSize: 14.5, opacity: 0.75, lineHeight: 1.6, marginBottom: 20 }}>{course.summary}</p>

        <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, marginBottom: 10 }}>
          Full curriculum
        </div>
        <ul className="space-y-2 mb-6">
          {course.modules.map((m) => (
            <li key={m} className="flex items-start gap-2" style={{ fontSize: 14 }}>
              <CheckCircle2 size={15} style={{ color: course.accent, marginTop: 2, flexShrink: 0 }} />
              <span style={{ opacity: 0.85 }}>{m}</span>
            </li>
          ))}
        </ul>

        <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, marginBottom: 10 }}>
          Projects you'll ship
        </div>
        <ul className="space-y-2 mb-6">
          {course.projects.map((p) => (
            <li key={p} style={{ fontSize: 14, opacity: 0.85 }}>• {p}</li>
          ))}
        </ul>

        <Button
          variant="primary"
          className="w-full justify-center"
          icon={<ArrowRight size={15} />}
          onClick={() => {
            onClose();
            onBookDemo(course.title);
          }}
        >
          Book a free demo for this course
        </Button>
      </div>
    </div>
  );
}

function BookDemoModal({ open, onClose, notify, presetCourse }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", course: presetCourse || DEMO_COURSES[0], preferred_time: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setForm((f) => ({ ...f, course: presetCourse || DEMO_COURSES[0] }));
  }, [open, presetCourse]);

  if (!open) return null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Posts to /api/leads (the Next.js route in route.ts) which writes to
  // Supabase server-side and mirrors into Google Sheets — replacing the
  // old client-side no-cors fetch, so this can now read a real
  // success/failure response instead of assuming it worked.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      notify("Please fill in name, email and phone");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "Website — Book Demo" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Booking failed");
      }

      notify("Demo booked! We'll confirm by WhatsApp shortly.");
      setForm({ name: "", email: "", phone: "", course: DEMO_COURSES[0], preferred_time: "" });
      onClose();
    } catch (err) {
      // In this standalone preview there's no live /api/leads to hit, so
      // this branch is expected here — in the deployed Next.js app it
      // only fires on a genuine failure.
      notify("Couldn't reach the booking API in this preview — wire up /api/leads to test live.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center p-4" style={{ background: "rgba(22,0,30,0.5)" }} onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="rounded-3xl w-full"
        style={{ maxWidth: 440, background: C.white, padding: 32, maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="flex items-start justify-between mb-1">
          <h3 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 21, color: C.aubergine }}>Book your free demo</h3>
          <button type="button" onClick={onClose} aria-label="Close"><X size={20} style={{ opacity: 0.5 }} /></button>
        </div>
        <p style={{ fontSize: 13.5, opacity: 0.6, marginBottom: 20 }}>30 minutes, no pressure — see the curriculum and ask a trainer anything.</p>

        {[
          { key: "name", label: "Full name", type: "text" },
          { key: "email", label: "Email address", type: "email" },
          { key: "phone", label: "Phone number", type: "tel" },
        ].map((f) => (
          <div key={f.key} className="mb-4">
            <label style={{ fontSize: 13, fontWeight: 500, opacity: 0.7, color: C.aubergine }}>{f.label}</label>
            <input
              type={f.type}
              required
              value={form[f.key]}
              onChange={set(f.key)}
              className="focus-ring w-full mt-1.5 rounded-xl px-4 py-3"
              style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.12)", fontSize: 14.5, color: C.aubergine }}
              placeholder={f.label}
            />
          </div>
        ))}

        <div className="mb-4">
          <label style={{ fontSize: 13, fontWeight: 500, opacity: 0.7, color: C.aubergine }}>Course you're interested in</label>
          <select
            value={form.course}
            onChange={set("course")}
            className="focus-ring w-full mt-1.5 rounded-xl px-4 py-3"
            style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.12)", fontSize: 14.5, color: C.aubergine }}
          >
            {DEMO_COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="mb-6">
          <label style={{ fontSize: 13, fontWeight: 500, opacity: 0.7, color: C.aubergine }}>Preferred time (optional)</label>
          <input
            type="text"
            value={form.preferred_time}
            onChange={set("preferred_time")}
            className="focus-ring w-full mt-1.5 rounded-xl px-4 py-3"
            style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.12)", fontSize: 14.5, color: C.aubergine }}
            placeholder="e.g. weekday evenings"
          />
        </div>

        <Button variant="primary" type="submit" className="w-full justify-center" disabled={submitting}>
          {submitting ? "Booking…" : "Confirm free demo"}
        </Button>
        <p style={{ fontSize: 11.5, opacity: 0.5, marginTop: 10, textAlign: "center" }}>
          We'll never spam you. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}

export default function ThriveSkillTechLanding() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [toast, setToast] = useState("");
  const [curriculumCourse, setCurriculumCourse] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" });
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoPresetCourse, setDemoPresetCourse] = useState(null);

  const openDemoModal = (courseTitle) => {
    setDemoPresetCourse(courseTitle || null);
    setDemoModalOpen(true);
  };

  const notify = (msg) => setToast(msg);

  // Same /api/leads backend as the demo booking modal — just tagged
  // with a different source so the CRM can tell resource downloads
  // apart from demo bookings in the leads table.
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email) {
      notify("Please add your name and email");
      return;
    }
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone || undefined,
          source: "Website — Free Resources",
        }),
      });
      if (!res.ok) throw new Error();
      notify("Sent! Check your inbox for the resources.");
      setLeadForm({ name: "", email: "", phone: "" });
    } catch {
      notify("Couldn't reach the booking API in this preview — wire up /api/leads to test live.");
    }
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bg = dark ? C.midnight : C.lavender;
  const text = dark ? C.lavender : C.aubergine;
  const cardBg = dark ? "rgba(255,255,255,0.06)" : C.white;
  const cardBorder = dark ? "rgba(255,255,255,0.10)" : "rgba(22,0,30,0.08)";

  return (
    <div
      style={{ background: bg, color: text, fontFamily: fontBody, minHeight: "100vh", transition: "background .4s ease, color .4s ease" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .btn-hover:hover { transform: translateY(-2px); filter: brightness(1.04); }
        .btn-hover:active { transform: translateY(0); }
        .course-card { transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s ease; }
        .course-card:hover { transform: translateY(-6px); }
        @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 12px);} to { opacity: 1; transform: translate(-50%, 0);} }
        .thread-pill { animation: floatY 4.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .thread-pill { animation: none; }
          html { scroll-behavior: auto; }
        }
        ::selection { background: ${C.purple}; color: white; }
        .focus-ring:focus-visible { outline: 2px solid ${C.purple}; outline-offset: 3px; }
      `}</style>

      {/* ============ NAV ============ */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? (dark ? "rgba(51,30,56,0.85)" : "rgba(252,247,255,0.85)") : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? `1px solid ${cardBorder}` : "1px solid transparent",
          transition: "all .3s ease",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
          <a href="#top" className="flex items-center gap-2.5 focus-ring" style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 20 }}>
            <LogoMark size={30} />
            Thrive Skill Tech
          </a>

          <nav className="hidden lg:flex items-center gap-8" style={{ fontSize: 14.5, fontWeight: 500 }}>
            {["Courses", "Projects", "Resources", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="focus-ring hover:opacity-70" style={{ transition: "opacity .2s" }}>
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              aria-label="Toggle dark mode"
              onClick={() => setDark((d) => !d)}
              className="focus-ring"
              style={{ width: 38, height: 38, borderRadius: 12, border: `1px solid ${cardBorder}`, display: "grid", placeItems: "center", background: cardBg }}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Button variant="primary" onClick={() => openDemoModal()}>
              Book Demo
            </Button>
          </div>

          <button className="lg:hidden focus-ring" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden px-6 pb-5 flex flex-col gap-4" style={{ background: bg }}>
            {["Courses", "Projects", "Resources", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ fontSize: 16, fontWeight: 500 }}>
                {item}
              </a>
            ))}
            <Button
              variant="primary"
              className="w-full justify-center mt-2"
              onClick={() => {
                setMenuOpen(false);
                openDemoModal();
              }}
            >
              Book Demo
            </Button>
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section id="top" className="relative overflow-hidden pt-36 pb-20 px-6">
        <div
          className="absolute -top-40 -right-40 rounded-full pointer-events-none"
          style={{ width: 520, height: 520, background: `radial-gradient(circle, ${C.purple}22, transparent 70%)`, filter: "blur(10px)" }}
        />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">
          <div>
            <Reveal>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold mb-6"
                style={{ background: `${C.purple}15`, color: C.purple, fontFamily: fontBody, border: `1px solid ${C.purple}30` }}
              >
                <Sparkles size={13} /> AI-First Career Accelerator
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1
                style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: "clamp(38px, 5vw, 64px)", lineHeight: 1.08, letterSpacing: "-0.02em" }}
              >
                Content to Career.<br />
                <span style={{ color: C.purple }}>Built with AI.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p style={{ fontSize: 18, lineHeight: 1.6, marginTop: 22, maxWidth: 480, opacity: 0.85 }}>
                Learn AI Agents, Automation, Digital Marketing and Content Creation from industry
                practitioners — through live instruction, real projects, and a portfolio that
                gets you hired.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="flex flex-wrap gap-3 mt-9">
                <Button
                  variant="primary"
                  icon={<ArrowRight size={16} />}
                  onClick={() => openDemoModal()}
                >
                  Book Free Demo
                </Button>
                <Button
                  variant="secondary"
                  icon={<FileDown size={16} />}
                  onClick={() => notify("Brochure download starting…")}
                >
                  Download Brochure
                </Button>
                <Button
                  variant="ghost"
                  icon={<MessageCircle size={16} />}
                  onClick={() => window.open(WHATSAPP_LINK, "_blank")}
                >
                  Join WhatsApp
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="flex gap-8 mt-14 flex-wrap" style={{ fontFamily: fontMono }}>
                {[
                  { k: "students", v: "—" },
                  { k: "projects shipped", v: "—" },
                  { k: "live courses", v: "3" },
                  { k: "industry experts", v: "—" },
                ].map((s) => (
                  <div key={s.k}>
                    <div style={{ fontSize: 26, fontWeight: 600, color: C.purple }}>{s.v}</div>
                    <div style={{ fontSize: 12, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.k}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11.5, opacity: 0.5, marginTop: 8 }}>
                Live figures publish here once available — set from the Admin Portal, never invented.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div
              className="relative rounded-[32px] p-8 flex items-center justify-center"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: "0 30px 80px -30px rgba(51,30,56,0.25)" }}
            >
              <ContentToCareerThread reduced={reducedMotion} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="px-6 py-16" id="about">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { title: "Mission", body: "Empower learners through practical AI education, real-world projects, mentorship, and career-focused learning." },
            { title: "Vision", body: "To become India's most trusted AI-first learning institution, preparing students for the future of work." },
            { title: "Promise", body: "We don't teach software. We build AI-ready professionals — one live project at a time." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="rounded-3xl p-7 h-full" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
                <div style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 18, color: C.purple, marginBottom: 10 }}>{item.title}</div>
                <p style={{ opacity: 0.8, lineHeight: 1.6, fontSize: 15 }}>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ COURSES ============ */}
      <section id="courses" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="max-w-xl mb-14">
              <span style={{ color: C.purple, fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" }}>Programs</span>
              <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: "clamp(28px,3.5vw,42px)", marginTop: 10, lineHeight: 1.15 }}>
                Three paths. One career outcome.
              </h2>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-7">
            {COURSES.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.1}>
                <div
                  className="course-card rounded-3xl p-7 h-full flex flex-col"
                  style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: "0 20px 60px -30px rgba(22,0,30,0.15)" }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-11 h-11 rounded-2xl grid place-items-center"
                      style={{ background: `${c.accent}18`, color: c.accent }}
                    >
                      {c.icon}
                    </div>
                    <span
                      style={{ fontSize: 11, fontWeight: 600, color: c.accent, background: `${c.accent}15`, padding: "4px 10px", borderRadius: 999 }}
                    >
                      {c.tag}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 21, lineHeight: 1.25 }}>{c.title}</h3>
                  <p style={{ opacity: 0.75, fontSize: 14.5, lineHeight: 1.6, marginTop: 10 }}>{c.summary}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-5" style={{ fontSize: 12.5, opacity: 0.65, fontFamily: fontMono }}>
                    <span>{c.duration}</span>
                    <span>·</span>
                    <span>{c.mode}</span>
                    <span>·</span>
                    <span>{c.level}</span>
                  </div>

                  <div className="mt-6 flex-1">
                    <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, marginBottom: 10 }}>
                      What you'll build
                    </div>
                    <ul className="space-y-2">
                      {c.modules.slice(0, 5).map((m) => (
                        <li key={m} className="flex items-start gap-2" style={{ fontSize: 13.5, lineHeight: 1.45 }}>
                          <CheckCircle2 size={14} style={{ color: c.accent, marginTop: 2, flexShrink: 0 }} />
                          <span style={{ opacity: 0.85 }}>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 mt-6 pt-5" style={{ borderTop: `1px solid ${cardBorder}`, fontSize: 12.5, opacity: 0.65 }}>
                    <Award size={14} /> {c.certificate}
                  </div>

                  <Button
                    variant="primary"
                    className="w-full justify-center mt-5"
                    icon={<ArrowRight size={15} />}
                    onClick={() => setCurriculumCourse(c)}
                  >
                    View curriculum
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="px-6 py-20" style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(139,92,246,0.04)" }}>
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: "clamp(26px,3vw,36px)", marginBottom: 40 }}>Why train with us</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US.map((w, i) => (
              <Reveal key={w.label} delay={i * 0.05}>
                <div
                  className="rounded-2xl p-5 flex items-center gap-3.5"
                  style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
                >
                  <div className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0" style={{ background: `${C.purple}18`, color: C.purple }}>
                    {w.icon}
                  </div>
                  <span style={{ fontSize: 14.5, fontWeight: 500 }}>{w.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RESOURCES / LEAD MAGNET ============ */}
      <section id="resources" className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div>
              <span style={{ color: C.orange, fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" }}>Free resources</span>
              <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: "clamp(26px,3vw,38px)", marginTop: 10, lineHeight: 1.2 }}>
                Get the AI Prompt Guide & 50 AI Tools list
              </h2>
              <p style={{ opacity: 0.75, marginTop: 14, lineHeight: 1.6, maxWidth: 440 }}>
                Practical, no-fluff guides used inside our own courses — sent straight to your
                inbox, no obligation to enrol.
              </p>
              <ul className="mt-6 space-y-2.5">
                {["AI Prompt Guide", "50 AI Tools PDF", "Digital Marketing Checklist", "SEO Checklist"].map((r) => (
                  <li key={r} className="flex items-center gap-2.5" style={{ fontSize: 14.5 }}>
                    <FileDown size={15} style={{ color: C.orange }} /> {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <form
              className="rounded-3xl p-8"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: "0 20px 60px -30px rgba(22,0,30,0.15)" }}
              onSubmit={handleLeadSubmit}
            >
              {[
                { key: "name", label: "Full name" },
                { key: "email", label: "Email address" },
                { key: "phone", label: "Phone number" },
              ].map((f) => (
                <div key={f.key} className="mb-4">
                  <label style={{ fontSize: 13, fontWeight: 500, opacity: 0.7 }}>{f.label}</label>
                  <input
                    type="text"
                    value={leadForm[f.key]}
                    onChange={(e) => setLeadForm({ ...leadForm, [f.key]: e.target.value })}
                    className="focus-ring w-full mt-1.5 rounded-xl px-4 py-3"
                    style={{ background: dark ? "rgba(255,255,255,0.05)" : C.lavender, border: `1px solid ${cardBorder}`, fontSize: 14.5, color: text }}
                    placeholder={f.label}
                  />
                </div>
              ))}
              <Button variant="accent" className="w-full justify-center mt-2" type="submit">Send me the resources</Button>
              <p style={{ fontSize: 11.5, opacity: 0.5, marginTop: 10, textAlign: "center" }}>
                We'll never spam you. Unsubscribe anytime.
              </p>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="px-6 py-20" style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(139,92,246,0.04)" }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: "clamp(26px,3vw,36px)", marginBottom: 32 }}>
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
                  <button
                    className="focus-ring w-full flex items-center justify-between text-left px-5 py-4"
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{f.q}</span>
                    <ChevronDown
                      size={18}
                      style={{ transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform .25s", flexShrink: 0, marginLeft: 12 }}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4" style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>
                      {f.a}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER / CONTACT ============ */}
      <footer id="contact" className="px-6 pt-20 pb-10" style={{ background: C.midnight, color: C.lavender }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 pb-14" style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div>
            <div className="flex items-center gap-2 mb-4" style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 18 }}>
              <LogoMark size={26} /> Thrive Skill Tech
            </div>
            <p style={{ opacity: 0.65, fontSize: 13.5, lineHeight: 1.6 }}>Content to Career.</p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: <Twitter size={15} />, href: "https://x.com/thriveskilltech" },
                { icon: <Instagram size={15} />, href: "https://www.instagram.com/thriveskill_tech" },
                { icon: <Facebook size={15} />, href: "https://www.facebook.com/share/1DKAHZraG8/" },
                { icon: <Linkedin size={15} />, href: "https://in.linkedin.com/in/thrive-skills-5088b8426" },
                { icon: <Youtube size={15} />, href: "https://youtube.com/@thriveskilltech" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring w-9 h-9 rounded-full grid place-items-center"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Explore" items={["Courses", "Projects", "Resources", "About"]} />
          <FooterCol title="Legal" items={["Privacy Policy", "Terms & Conditions", "Refund Policy"]} />

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>
              Contact
            </div>
            <div className="space-y-3" style={{ fontSize: 13.5 }}>
              <a href="mailto:thriveskilltech@gmail.com" className="flex items-center gap-2 opacity-80 hover:opacity-100">
                <Mail size={14} /> thriveskilltech@gmail.com
              </a>
              <a href="tel:+918459612191" className="flex items-center gap-2 opacity-80 hover:opacity-100">
                <Phone size={14} /> 84596 12191
              </a>
              <a href="https://wa.me/918369953959" className="flex items-center gap-2 opacity-80 hover:opacity-100">
                <MessageCircle size={14} /> WhatsApp: 8369953959
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between gap-2" style={{ fontSize: 12.5, opacity: 0.5 }}>
          <span>© {new Date().getFullYear()} Thrive Skill Tech. All rights reserved.</span>
          <span>EdTech · Training Institute</span>
        </div>
      </footer>

      <CurriculumModal course={curriculumCourse} onClose={() => setCurriculumCourse(null)} onBookDemo={openDemoModal} />
      <BookDemoModal open={demoModalOpen} onClose={() => setDemoModalOpen(false)} notify={notify} presetCourse={demoPresetCourse} />
      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>
        {title}
      </div>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li key={i}>
            <a href="#" style={{ fontSize: 13.5, opacity: 0.8 }} className="hover:opacity-100">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
