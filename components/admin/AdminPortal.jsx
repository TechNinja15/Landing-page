"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  Award,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  UserCheck,
  Percent,
  Filter,
  Download,
  Phone,
  Mail,
  MoreHorizontal,
  ChevronDown,
  Plus,
  Save,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ============================================================
   Brand tokens — same system across landing / student / admin
   ============================================================ */
const C = {
  purple: "#8B5CF6",
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

const STAGES = [
  { key: "new", label: "New", tone: "neutral" },
  { key: "contacted", label: "Contacted", tone: "purple" },
  { key: "follow_up", label: "Follow-Up", tone: "orange" },
  { key: "converted", label: "Converted", tone: "gold" },
  { key: "lost", label: "Lost", tone: "muted" },
];

const SOURCE_COLORS = [C.purple, C.orange, C.gold, C.midnight, "#B8A6E0", "#4A9B8E"];

function timeAgoDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: TrendingUp },
  { id: "students", label: "Students", icon: Users },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "batches", label: "Batches", icon: Layers },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "content", label: "Website Content", icon: Settings },
];

/* ============================================================
   Shared bits
   ============================================================ */
function LogoMark({ size = 26 }) {
  return (
    <svg width={size} height={size * (845 / 953)} viewBox="0 0 953 845" fill="none">
      <path d="M185.08 260.292H60V200H446.532L474.491 228.752C475.246 229.528 475.246 230.764 474.491 231.54L446.532 260.292H231.776H185.08Z" fill={C.purple} />
      <path d="M767.92 260.292H893V200H506.468L478.509 228.752C477.754 229.528 477.754 230.764 478.509 231.54L506.468 260.292H721.224H767.92Z" fill={C.purple} />
      <path d="M244.067 544.13V645H184.045V256H244.067V506.472V544.13Z" fill="url(#ag1)" />
      <path d="M725.244 544.13V645H665.222V256H725.244V506.472V544.13Z" fill="url(#ag2)" />
      <path d="M450.551 645C425.926 645 401.502 640.157 377.28 630.472C353.059 620.383 331.663 604.241 313.093 586.888V526.5C326.011 540.625 370.216 578.413 389.997 586.888C409.778 595.362 430.164 599.6 451.157 599.6C477.397 599.6 498.389 593.143 514.133 580.229C529.877 567.315 537.749 550.366 537.749 529.381C537.749 512.835 533.914 499.517 526.244 489.428C518.977 478.936 509.087 470.663 496.572 464.61C484.058 458.153 470.332 452.503 455.395 447.66C440.862 442.817 426.127 437.773 411.191 432.527C396.658 427.28 383.134 420.42 370.619 411.945C358.105 403.471 348.012 392.574 340.342 379.257C333.076 365.536 329.442 348.183 329.442 327.198C329.442 304.599 334.489 284.824 344.581 267.875C355.077 250.926 369.61 237.81 388.18 228.528C406.75 218.843 446.424 214 452.368 214C457.519 214 461.361 215.5 465.649 220.5C469.15 224 471.284 226.499 474.652 230L468.65 236.5C467.149 238 467.149 238 464.648 240.5C460.147 245 457.646 248 445.641 260C424.245 260 412.604 265.454 398.474 277.56C384.749 289.667 377.886 305.204 377.886 324.171C377.886 339.103 381.519 351.21 388.786 360.492C396.456 369.773 406.548 377.441 419.063 383.494C431.577 389.144 445.101 394.39 459.634 399.233C474.571 403.672 489.306 408.717 503.839 414.367C518.776 420.016 532.501 427.28 545.016 436.159C557.53 445.037 567.421 456.74 574.687 471.268C582.358 485.393 586.193 503.755 586.193 526.354C586.193 563.078 574.082 592.134 549.86 613.522C525.638 634.507 492.535 645 450.551 645Z" fill={C.purple} />
      <defs>
        <linearGradient id="ag1" x1="214" y1="256" x2="214" y2="645" gradientUnits="userSpaceOnUse"><stop stopColor={C.midnight} /><stop offset="1" stopColor={C.purple} /></linearGradient>
        <linearGradient id="ag2" x1="695" y1="256" x2="695" y2="645" gradientUnits="userSpaceOnUse"><stop stopColor={C.midnight} /><stop offset="1" stopColor={C.purple} /></linearGradient>
      </defs>
    </svg>
  );
}

function Card({ children, className = "", style = {} }) {
  return (
    <div className={`rounded-3xl ${className}`} style={{ background: C.white, border: "1px solid rgba(22,0,30,0.08)", boxShadow: "0 16px 48px -28px rgba(22,0,30,0.16)", ...style }}>
      {children}
    </div>
  );
}

function StagePill({ stage }) {
  const s = STAGES.find((x) => x.key === stage);
  const tones = {
    neutral: { bg: "rgba(22,0,30,0.06)", fg: C.aubergine },
    purple: { bg: `${C.purple}18`, fg: C.purple },
    orange: { bg: `${C.orange}22`, fg: "#a5601c" },
    gold: { bg: `${C.gold}35`, fg: "#8a6b00" },
    muted: { bg: "rgba(22,0,30,0.04)", fg: "rgba(22,0,30,0.4)" },
  };
  const t = tones[s.tone];
  return <span style={{ background: t.bg, color: t.fg, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>{s.label}</span>;
}

function Button({ variant = "primary", children, icon, className = "", style, ...props }) {
  const base = { fontFamily: fontBody, fontWeight: 600, fontSize: 13.5, borderRadius: 11, padding: "9px 16px", display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", border: "none", transition: "transform .15s, filter .15s" };
  const styles = {
    primary: { background: C.purple, color: C.white },
    secondary: { background: C.white, color: C.aubergine, border: "1px solid rgba(22,0,30,0.14)" },
  };
  return (
    <button {...props} className={`btn-hover ${className}`} style={{ ...base, ...styles[variant], ...style }}>
      {children}{icon}
    </button>
  );
}

/* ============================================================
   Dashboard
   ============================================================ */
function MetricCard({ label, value, icon, note }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: `${C.purple}15`, color: C.purple }}>{icon}</div>
      </div>
      <div style={{ fontFamily: fontMono, fontSize: 24, fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: 12.5, opacity: 0.6, marginTop: 3 }}>{label}</div>
      {note && <div style={{ fontSize: 11, opacity: 0.4, marginTop: 6 }}>{note}</div>}
    </Card>
  );
}

function DashboardScreen({ leads, students, courses, payments }) {
  const counts = useMemo(() => {
    const total = leads.length;
    const converted = leads.filter((l) => l.stage === "converted").length;
    const newLeads = leads.filter((l) => l.stage === "new").length;
    return { total, converted, newLeads, rate: total ? Math.round((converted / total) * 100) : 0 };
  }, [leads]);

  const revenueTrend = useMemo(() => {
    // Groups real `payments` rows by month. Stays an empty-value series
    // (0 for every month) until payments actually exist — never backfilled
    // with invented figures.
    const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const byMonth = Object.fromEntries(months.map((m) => [m, 0]));
    payments.forEach((p) => {
      const m = new Date(p.paid_at).toLocaleDateString("en-IN", { month: "short" });
      if (m in byMonth) byMonth[m] += Number(p.amount);
    });
    return months.map((m) => ({ month: m, revenue: byMonth[m] }));
  }, [payments]);

  const leadSources = useMemo(() => {
    const counts = {};
    leads.forEach((l) => {
      counts[l.source] = (counts[l.source] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: SOURCE_COLORS[i % SOURCE_COLORS.length] }));
  }, [leads]);

  const courseCompletionData = useMemo(
    () =>
      courses.map((c) => {
        const inCourse = students.filter((s) => s.course_id === c.id);
        const completed = inCourse.filter((s) => s.progress_percent >= 100).length;
        return { name: c.title.split(" ").slice(0, 2).join(" "), rate: inCourse.length ? Math.round((completed / inCourse.length) * 100) : 0 };
      }),
    [courses, students]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 24 }}>Overview</h1>
        <p style={{ fontSize: 13.5, opacity: 0.55, marginTop: 3 }}>Live from your Supabase tables — nothing here is invented.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total leads" value={counts.total} icon={<TrendingUp size={17} />} />
        <MetricCard label="New leads" value={counts.newLeads} icon={<UserCheck size={17} />} />
        <MetricCard label="Conversion rate" value={`${counts.rate}%`} icon={<Percent size={17} />} />
        <MetricCard label="Active students" value={students.length} icon={<Users size={17} />} note="From enrollments table" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <h3 style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 15 }}>Monthly revenue</h3>
            <DollarSign size={16} style={{ opacity: 0.4 }} />
          </div>
          <p style={{ fontSize: 11.5, opacity: 0.45, marginBottom: 10 }}>Empty until payments are recorded — no placeholder revenue shown.</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.purple} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: C.aubergine, opacity: 0.5 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: C.aubergine, opacity: 0.5 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(22,0,30,0.1)", fontSize: 12.5 }} />
              <Area type="monotone" dataKey="revenue" stroke={C.purple} strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Lead sources</h3>
          {leadSources.length === 0 ? (
            <p style={{ fontSize: 13, opacity: 0.5, padding: "20px 0" }}>No leads yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={leadSources} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {leadSources.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12.5 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {leadSources.map((s) => (
                  <div key={s.name} className="flex items-center justify-between" style={{ fontSize: 12.5 }}>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: s.color }} />{s.name}</span>
                    <span style={{ opacity: 0.6 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h3 style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Course completion rate</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={courseCompletionData}>
            <XAxis dataKey="name" tick={{ fontSize: 11.5, fill: C.aubergine, opacity: 0.5 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: C.aubergine, opacity: 0.5 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12.5 }} />
            <Bar dataKey="rate" fill={C.orange} radius={[8, 8, 0, 0]} barSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

/* ============================================================
   Leads (mini CRM)
   ============================================================ */
function Toast({ message, onDone }) {
  React.useEffect(() => {
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
        background: C.midnight,
        color: C.lavender,
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

function AddLeadDrawer({ open, onClose, onCreate, courses, sources }) {
  const [draft, setDraft] = useState({ name: "", mobile: "", email: "", course_interested: courses[0]?.id ?? "", source: sources[0] ?? "Website" });
  if (!open) return null;
  const fields = [
    { key: "name", label: "Full name" },
    { key: "mobile", label: "Mobile number" },
    { key: "email", label: "Email" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(22,0,30,0.35)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="h-full overflow-y-auto" style={{ width: 380, maxWidth: "92vw", background: C.white, padding: "26px 24px", boxShadow: "-20px 0 60px -20px rgba(22,0,30,0.3)" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 18 }}>Add lead</h3>
          <button onClick={onClose}><X size={18} style={{ opacity: 0.5 }} /></button>
        </div>
        {fields.map((f) => (
          <div key={f.key} className="mb-4">
            <label style={{ fontSize: 12, fontWeight: 600, opacity: 0.6 }}>{f.label}</label>
            <input
              value={draft[f.key]}
              onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              className="w-full mt-1.5 rounded-xl px-3.5 py-2.5"
              style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.1)", fontSize: 14 }}
            />
          </div>
        ))}
        <label style={{ fontSize: 12, fontWeight: 600, opacity: 0.6 }}>Course interested</label>
        <select
          value={draft.course_interested}
          onChange={(e) => setDraft({ ...draft, course_interested: e.target.value })}
          className="w-full mt-1.5 mb-4 rounded-xl px-3.5 py-2.5"
          style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.1)", fontSize: 14 }}
        >
          {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <label style={{ fontSize: 12, fontWeight: 600, opacity: 0.6 }}>Source</label>
        <select
          value={draft.source}
          onChange={(e) => setDraft({ ...draft, source: e.target.value })}
          className="w-full mt-1.5 mb-6 rounded-xl px-3.5 py-2.5"
          style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.1)", fontSize: 14 }}
        >
          {sources.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <Button
          variant="primary"
          className="w-full justify-center"
          icon={<Plus size={14} />}
          onClick={() => {
            if (!draft.name || !draft.mobile) return;
            onCreate(draft);
          }}
        >
          Create lead
        </Button>
      </div>
    </div>
  );
}

function EditLeadDrawer({ lead, onClose, onSave, onDelete, counselors }) {
  const [draft, setDraft] = useState(lead);
  useEffect(() => {
    setDraft(lead);
  }, [lead]);
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(22,0,30,0.35)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full overflow-y-auto"
        style={{ width: 380, maxWidth: "92vw", background: C.white, padding: "26px 24px", boxShadow: "-20px 0 60px -20px rgba(22,0,30,0.3)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 18 }}>Edit lead</h3>
          <button onClick={onClose}><X size={18} style={{ opacity: 0.5 }} /></button>
        </div>
        <p style={{ fontSize: 12.5, opacity: 0.5, marginBottom: 20 }}>{draft.name} · {draft.mobile}</p>

        <label style={{ fontSize: 12, fontWeight: 600, opacity: 0.6 }}>Stage</label>
        <select
          value={draft.stage}
          onChange={(e) => setDraft({ ...draft, stage: e.target.value })}
          className="w-full mt-1.5 mb-4 rounded-xl px-3.5 py-2.5"
          style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.1)", fontSize: 14 }}
        >
          {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>

        <label style={{ fontSize: 12, fontWeight: 600, opacity: 0.6 }}>Assigned counselor</label>
        <select
          value={draft.assigned_counselor || ""}
          onChange={(e) => setDraft({ ...draft, assigned_counselor: e.target.value || null })}
          className="w-full mt-1.5 mb-4 rounded-xl px-3.5 py-2.5"
          style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.1)", fontSize: 14 }}
        >
          <option value="">Unassigned</option>
          {counselors.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
        </select>

        <label style={{ fontSize: 12, fontWeight: 600, opacity: 0.6 }}>Next follow-up date</label>
        <input
          type="date"
          value={draft.next_follow_up_date || ""}
          onChange={(e) => setDraft({ ...draft, next_follow_up_date: e.target.value || null })}
          className="w-full mt-1.5 mb-4 rounded-xl px-3.5 py-2.5"
          style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.1)", fontSize: 14, fontFamily: fontMono }}
        />

        <label style={{ fontSize: 12, fontWeight: 600, opacity: 0.6 }}>Notes</label>
        <textarea
          rows={4}
          value={draft.notes || ""}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          placeholder="Call summary, objections, next steps…"
          className="w-full mt-1.5 mb-6 rounded-xl px-3.5 py-2.5"
          style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.1)", fontSize: 14 }}
        />

        <div className="flex items-center justify-between">
          <button
            onClick={() => onDelete(draft.id)}
            className="btn-hover flex items-center gap-1.5"
            style={{ fontSize: 13, fontWeight: 600, color: "#c0392b" }}
          >
            <Trash2 size={14} /> Delete lead
          </button>
          <Button variant="primary" icon={<Save size={14} />} onClick={() => onSave(draft)}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

function LeadsScreen({ notify, initialLeads, courses, counselors }) {
  const [leads, setLeads] = useState(initialLeads);
  const [filter, setFilter] = useState("all");
  const [editingLead, setEditingLead] = useState(null);
  const [addingLead, setAddingLead] = useState(false);
  const filtered = filter === "all" ? leads : leads.filter((l) => l.stage === filter);
  const sources = ["Website", "WhatsApp", "Google Ads", "Meta Ads", "Referral", "Organic"];

  const handleSave = async (draft) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({
        stage: draft.stage,
        assigned_counselor: draft.assigned_counselor,
        next_follow_up_date: draft.next_follow_up_date,
        notes: draft.notes,
      })
      .eq("id", draft.id);

    if (error) {
      notify("Couldn't save — try again");
      return;
    }

    const counselorName = counselors.find((c) => c.id === draft.assigned_counselor)?.full_name ?? null;
    setLeads((prev) => prev.map((l) => (l.id === draft.id ? { ...l, ...draft, profiles: counselorName ? { full_name: counselorName } : null } : l)));
    setEditingLead(null);
    notify("Lead updated");
  };

  const handleDelete = async (id) => {
    const supabase = createClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      notify("Couldn't delete — try again");
      return;
    }
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setEditingLead(null);
    notify("Lead deleted");
  };

  const handleCreate = async (draft) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: draft.name,
        mobile: draft.mobile,
        email: draft.email || null,
        course_interested: draft.course_interested || null,
        source: draft.source,
        stage: "new",
      })
      .select("*, courses:course_interested(title), profiles:assigned_counselor(full_name)")
      .single();

    if (error) {
      notify("Couldn't create lead — try again");
      return;
    }

    setLeads((prev) => [data, ...prev]);
    setAddingLead(false);
    notify("Lead created");
  };

  // Client-side CSV export — real download, no backend needed.
  const handleExport = () => {
    const headers = ["Name", "Mobile", "Email", "Course", "Source", "Stage", "Counselor", "Next Follow-up"];
    const rows = filtered.map((l) => [l.name, l.mobile, l.email, l.courses?.title, l.source, l.stage, l.profiles?.full_name || "Unassigned", l.next_follow_up_date]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${filter}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify(`Exported ${filtered.length} leads`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 24 }}>Leads</h1>
        <div className="flex gap-2.5">
          <Button variant="secondary" icon={<Download size={14} />} onClick={handleExport}>Export CSV</Button>
          <Button variant="primary" icon={<Plus size={14} />} onClick={() => setAddingLead(true)}>Add Lead</Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className="btn-hover"
          style={{ fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 999, background: filter === "all" ? C.aubergine : "rgba(22,0,30,0.06)", color: filter === "all" ? C.white : C.aubergine }}
        >
          All ({leads.length})
        </button>
        {STAGES.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className="btn-hover"
            style={{ fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 999, background: filter === s.key ? C.aubergine : "rgba(22,0,30,0.06)", color: filter === s.key ? C.white : C.aubergine }}
          >
            {s.label} ({leads.filter((l) => l.stage === s.key).length})
          </button>
        ))}
      </div>

      <Card className="overflow-x-auto">
        {filtered.length === 0 ? (
          <p style={{ fontSize: 13.5, opacity: 0.5, padding: 24, textAlign: "center" }}>No leads in this stage yet.</p>
        ) : (
          <table className="w-full" style={{ fontSize: 13.5 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(22,0,30,0.08)" }}>
                {["Name", "Contact", "Course interested", "Source", "Stage", "Counselor", "Next follow-up", ""].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, opacity: 0.5, fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.03em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} style={{ borderBottom: "1px solid rgba(22,0,30,0.05)" }}>
                  <td style={{ padding: "13px 16px", fontWeight: 600 }}>{l.name}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <div className="flex items-center gap-1.5 opacity-70"><Phone size={12} />{l.mobile}</div>
                    <div className="flex items-center gap-1.5 opacity-50 mt-0.5"><Mail size={12} />{l.email || "—"}</div>
                  </td>
                  <td style={{ padding: "13px 16px", opacity: 0.75 }}>{l.courses?.title || "—"}</td>
                  <td style={{ padding: "13px 16px", opacity: 0.75 }}>{l.source}</td>
                  <td style={{ padding: "13px 16px" }}><StagePill stage={l.stage} /></td>
                  <td style={{ padding: "13px 16px", opacity: 0.75 }}>{l.profiles?.full_name || "Unassigned"}</td>
                  <td style={{ padding: "13px 16px", opacity: 0.75, fontFamily: fontMono, fontSize: 12.5 }}>{timeAgoDate(l.next_follow_up_date)}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <button
                      onClick={() => setEditingLead(l)}
                      className="btn-hover flex items-center gap-1.5"
                      style={{ fontSize: 12.5, fontWeight: 600, color: C.purple, padding: "5px 10px", borderRadius: 8, background: `${C.purple}12` }}
                    >
                      <Pencil size={12} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <EditLeadDrawer lead={editingLead} onClose={() => setEditingLead(null)} onSave={handleSave} onDelete={handleDelete} counselors={counselors} />
      <AddLeadDrawer open={addingLead} onClose={() => setAddingLead(false)} onCreate={handleCreate} courses={courses} sources={sources} />
    </div>
  );
}

/* ============================================================
   Students
   ============================================================ */
function StudentsScreen({ notify, students, payments }) {
  const hasPaid = (studentId, courseId) =>
    payments.some((p) => p.student_id === studentId && p.course_id === courseId && p.status === "paid");

  return (
    <div className="space-y-5">
      <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 24 }}>Students</h1>
      <Card className="overflow-x-auto">
        {students.length === 0 ? (
          <p style={{ fontSize: 13.5, opacity: 0.5, padding: 24, textAlign: "center" }}>No active students yet.</p>
        ) : (
        <table className="w-full" style={{ fontSize: 13.5 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(22,0,30,0.08)" }}>
              {["Name", "Course", "Batch", "Progress", "Fee status", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, opacity: 0.5, fontSize: 11.5, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const paid = hasPaid(s.student_id, s.course_id);
              return (
                <tr key={s.id} style={{ borderBottom: "1px solid rgba(22,0,30,0.05)" }}>
                  <td style={{ padding: "13px 16px", fontWeight: 600 }}>{s.profiles?.full_name}</td>
                  <td style={{ padding: "13px 16px", opacity: 0.75 }}>{s.courses?.title}</td>
                  <td style={{ padding: "13px 16px", opacity: 0.75 }}>{s.batches?.name || "—"}</td>
                  <td style={{ padding: "13px 16px", width: 160 }}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-full h-1.5" style={{ background: "rgba(22,0,30,0.08)" }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${s.progress_percent}%`, background: C.purple }} />
                      </div>
                      <span style={{ fontSize: 12, fontFamily: fontMono, opacity: 0.6 }}>{s.progress_percent}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: paid ? `${C.purple}18` : `${C.orange}22`, color: paid ? C.purple : "#a5601c" }}>
                      {paid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <button onClick={() => notify(`Opening ${s.profiles?.full_name}'s student profile…`)} className="btn-hover">
                      <MoreHorizontal size={16} style={{ opacity: 0.4, cursor: "pointer" }} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </Card>
    </div>
  );
}

/* ============================================================
   Courses
   ============================================================ */
function CoursesScreen({ notify, courses }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 24 }}>Courses</h1>
        <Button variant="primary" icon={<Plus size={14} />} onClick={() => notify("Course builder opens here")}>New course</Button>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {courses.map((c) => (
          <Card key={c.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl" style={{ background: `${c.accent_color || C.purple}18` }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: c.is_published ? `${C.purple}18` : "rgba(22,0,30,0.06)", color: c.is_published ? C.purple : "rgba(22,0,30,0.5)" }}>
                {c.is_published ? "Published" : "Draft"}
              </span>
            </div>
            <div style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 15.5 }}>{c.title}</div>
            <div style={{ fontSize: 12.5, opacity: 0.6, marginTop: 8 }}>{c.moduleCount} modules · {c.batchCount} active batches</div>
            <Button variant="secondary" className="w-full justify-center mt-5" onClick={() => notify(`Opening curriculum builder for "${c.title}"`)}>
              Edit curriculum
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Batches
   ============================================================ */
function BatchesScreen({ notify, batches, students }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 24 }}>Batches</h1>
        <Button variant="primary" icon={<Plus size={14} />} onClick={() => notify("Batch creation form opens here")}>New batch</Button>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {batches.length === 0 ? (
          <Card className="p-8 text-center md:col-span-3">
            <Layers size={22} style={{ opacity: 0.35, margin: "0 auto 10px" }} />
            <p style={{ fontSize: 14, opacity: 0.6 }}>No batches created yet.</p>
          </Card>
        ) : (
          batches.map((b) => {
            const enrolledCount = students.filter((s) => s.batch_id === b.id).length;
            return (
              <Card key={b.id} className="p-6">
                <div style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 15 }}>{b.name}</div>
                <div style={{ fontSize: 12.5, opacity: 0.6, marginTop: 6 }}>Trainer: {b.profiles?.full_name || "Unassigned"}</div>
                <div className="flex items-center justify-between mt-4">
                  <span style={{ fontSize: 12.5, opacity: 0.6 }}>{enrolledCount}/{b.capacity ?? "—"} students</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: C.purple, textTransform: "capitalize" }}>{b.status}</span>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Certificates
   ============================================================ */
function CertificatesScreen({ notify, students }) {
  const [generating, setGenerating] = useState(false);
  const nearCompletion = students
    .filter((s) => s.progress_percent >= 80 && s.progress_percent < 100)
    .sort((a, b) => b.progress_percent - a.progress_percent);
  const readyNow = students.filter((s) => s.progress_percent >= 100);

  const handleBulkGenerate = async () => {
    if (readyNow.length === 0) {
      notify("No students at 100% completion right now");
      return;
    }
    setGenerating(true);
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke("generate-certificate", { body: { bulk: true } });
    setGenerating(false);
    if (error) {
      notify("Couldn't reach the certificate function — check it's deployed (see supabase/functions/generate-certificate)");
      return;
    }
    notify(`Generated ${data?.generated?.length ?? 0} certificate(s)`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 24 }}>Certificates</h1>
        <Button variant="primary" icon={<Award size={14} />} onClick={handleBulkGenerate} disabled={generating}>
          {generating ? "Generating…" : "Bulk generate"}
        </Button>
      </div>
      {nearCompletion.length === 0 ? (
        <Card className="p-8 text-center">
          <Award size={22} style={{ opacity: 0.35, margin: "0 auto 10px" }} />
          <p style={{ fontSize: 14, opacity: 0.6 }}>No students within reach of a certificate right now.</p>
        </Card>
      ) : (
        nearCompletion.map((s) => (
          <Card key={s.id} className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl grid place-items-center" style={{ background: `${C.gold}30`, color: "#8a6b00" }}>
                <Award size={18} />
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.profiles?.full_name} — {s.courses?.title}</div>
                <div style={{ fontSize: 12.5, opacity: 0.55, marginTop: 2 }}>{s.progress_percent}% complete — eligible for auto-generation on completion</div>
              </div>
            </div>
          </Card>
        ))
      )}
      <p style={{ fontSize: 12.5, opacity: 0.5 }}>
        Certificates issue automatically via a Supabase Edge Function (<code>supabase/functions/generate-certificate</code>) triggered when <code>enrollments.progress_percent</code> reaches 100 — generating a unique <code>certificate_number</code>, a PDF with an embedded QR code, and storing both via the public <code>verify_certificate()</code> RPC. "Bulk generate" above calls the same function directly for anything the trigger missed.
      </p>
    </div>
  );
}

/* ============================================================
   Website Content (bound to website_settings jsonb table)
   ============================================================ */
function ContentScreen({ initialSettings, adminId, notify }) {
  const [hero, setHero] = useState(initialSettings.heroContent);
  const [stats, setStats] = useState({
    students: initialSettings.heroStats.students ?? "",
    projects: initialSettings.heroStats.projects ?? "",
    industry_experts: initialSettings.heroStats.industry_experts ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const cleanStats = {
      students: stats.students === "" ? null : Number(stats.students),
      projects: stats.projects === "" ? null : Number(stats.projects),
      industry_experts: stats.industry_experts === "" ? null : Number(stats.industry_experts),
    };

    const { error } = await supabase.from("website_settings").upsert(
      [
        { key: "hero_content", value: hero, updated_by: adminId },
        { key: "hero_stats", value: cleanStats, updated_by: adminId },
      ],
      { onConflict: "key" }
    );

    setSaving(false);
    notify(error ? "Couldn't save — try again" : "Saved to website_settings ✓");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 24 }}>Website Content</h1>
        <p style={{ fontSize: 13, opacity: 0.55, marginTop: 3 }}>
          Edits here write to the <code>website_settings</code> table — no deploy needed for the homepage to update.
        </p>
      </div>

      <Card className="p-6">
        <h3 style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Hero section</h3>
        <label style={{ fontSize: 12.5, fontWeight: 500, opacity: 0.6 }}>Headline</label>
        <input
          value={hero.headline}
          onChange={(e) => setHero({ ...hero, headline: e.target.value })}
          className="w-full mt-1.5 mb-4 rounded-xl px-4 py-2.5"
          style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.1)", fontSize: 14 }}
        />
        <label style={{ fontSize: 12.5, fontWeight: 500, opacity: 0.6 }}>Subheading</label>
        <textarea
          value={hero.subheading}
          onChange={(e) => setHero({ ...hero, subheading: e.target.value })}
          rows={3}
          className="w-full mt-1.5 rounded-xl px-4 py-2.5"
          style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.1)", fontSize: 14 }}
        />
      </Card>

      <Card className="p-6">
        <h3 style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Homepage statistics</h3>
        <p style={{ fontSize: 12, opacity: 0.5, marginBottom: 14 }}>Leave blank to show nothing rather than a placeholder number.</p>
        <div className="grid grid-cols-3 gap-3">
          {["students", "projects", "industry_experts"].map((k) => (
            <div key={k}>
              <label style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.6, textTransform: "capitalize" }}>{k.replace("_", " ")}</label>
              <input
                value={stats[k]}
                onChange={(e) => setStats({ ...stats, [k]: e.target.value.replace(/[^0-9]/g, "") })}
                className="w-full mt-1.5 rounded-xl px-3 py-2.5"
                style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.1)", fontSize: 14, fontFamily: fontMono }}
                placeholder="—"
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button variant="primary" icon={<Save size={14} />} onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Publish changes"}
        </Button>
      </div>
    </div>
  );
}

/* ============================================================
   Shell
   ============================================================ */
export default function AdminPortal({ initialData, currentAdmin, websiteSettings, counselors }) {
  const { leads, students, courses, batches, payments } = initialData;
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");
  const notify = (msg) => setToast(msg);
  const initials = (currentAdmin?.full_name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const screens = {
    dashboard: <DashboardScreen leads={leads} students={students} courses={courses} payments={payments} />,
    leads: <LeadsScreen notify={notify} initialLeads={leads} courses={courses} counselors={counselors} />,
    students: <StudentsScreen notify={notify} students={students} payments={payments} />,
    courses: <CoursesScreen notify={notify} courses={courses} />,
    batches: <BatchesScreen notify={notify} batches={batches} students={students} />,
    certificates: <CertificatesScreen notify={notify} students={students} />,
    content: <ContentScreen initialSettings={websiteSettings} adminId={currentAdmin?.id} notify={notify} />,
  };

  return (
    <div style={{ background: C.lavender, minHeight: "100vh", fontFamily: fontBody, color: C.aubergine }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .btn-hover:hover { transform: translateY(-1px); filter: brightness(1.04); }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 12px);} to { opacity: 1; transform: translate(-50%, 0);} }
      `}</style>

      <div className="flex">
        <aside
          className={`fixed lg:sticky top-0 h-screen z-40 flex flex-col transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          style={{ width: 240, background: C.midnight, color: C.lavender, padding: "22px 16px" }}
        >
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-2" style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 15 }}>
              <LogoMark size={24} /> Admin
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
          </div>

          <nav className="flex-1 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                  className="btn-hover w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left"
                  style={{ background: isActive ? "rgba(139,92,246,0.2)" : "transparent", color: isActive ? C.white : "rgba(252,247,255,0.65)", fontSize: 13.5, fontWeight: 500 }}
                >
                  <Icon size={16} />{item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0" style={{ background: `${C.purple}30`, fontFamily: fontDisplay, fontWeight: 600, fontSize: 12 }}>{initials}</div>
            <div style={{ fontSize: 12 }}>
              <div style={{ fontWeight: 600 }}>{currentAdmin?.full_name || "Admin"}</div>
              <div style={{ opacity: 0.5 }}>{currentAdmin?.email}</div>
            </div>
          </div>

          <form action="/auth/signout" method="post" className="mt-3">
            <button type="submit" className="w-full text-left px-3.5 py-2" style={{ fontSize: 12.5, opacity: 0.5, color: C.lavender }}>
              Log out
            </button>
          </form>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <div className="flex-1 min-w-0">
          <header className="flex items-center justify-between px-6 lg:px-9 py-4 sticky top-0 z-20" style={{ background: "rgba(252,247,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(22,0,30,0.06)" }}>
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="hidden sm:flex items-center gap-2 rounded-full px-4 py-2" style={{ background: C.white, border: "1px solid rgba(22,0,30,0.08)", width: 300 }}>
              <Search size={15} style={{ opacity: 0.4 }} />
              <input
                placeholder="Search leads, students, courses"
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 13.5, width: "100%" }}
                onKeyDown={(e) => {
                  if (e.key !== "Enter" || !e.currentTarget.value) return;
                  const q = e.currentTarget.value.toLowerCase();
                  const hit = leads.find((l) => l.name.toLowerCase().includes(q)) || students.find((s) => s.profiles?.full_name?.toLowerCase().includes(q));
                  if (hit) {
                    setActive(leads.includes(hit) ? "leads" : "students");
                    notify(`Found a match in ${leads.includes(hit) ? "Leads" : "Students"}`);
                  } else {
                    notify("No matches found");
                  }
                }}
              />
            </div>
            <Bell size={18} style={{ opacity: 0.6 }} />
          </header>
          <main className="p-6 lg:p-9 max-w-6xl">{screens[active]}</main>
        </div>
      </div>

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}
