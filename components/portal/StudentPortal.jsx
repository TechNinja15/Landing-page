"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  ClipboardList,
  Award,
  MessageCircle,
  User,
  Bell,
  Search,
  ChevronRight,
  Play,
  Calendar,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  Github,
  Link as LinkIcon,
  QrCode,
  Linkedin,
  Menu,
  X,
  Flame,
  ArrowRight,
} from "lucide-react";

/* ============================================================
   Brand tokens - identical to the marketing site build
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

/* ============================================================
   Formatting helpers for data coming from Supabase (ISO
   timestamps, etc.) - the mock data used to be pre-formatted
   strings like "Today, 7:00 PM"; real rows aren't.
   ============================================================ */
function formatDateTime(iso) {
  if (!iso) return " - ";
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today, ${time}`;
  if (isTomorrow) return `Tomorrow, ${time}`;
  return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${time}`;
}

function timeAgo(iso) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDueDate(iso) {
  if (!iso) return "No due date";
  const diffDays = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due today";
  return `Due in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
}

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "live", label: "Live Classes", icon: Video },
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "community", label: "Community", icon: MessageCircle },
  { id: "profile", label: "Profile", icon: User },
];

/* ============================================================
   Shared bits
   ============================================================ */
function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size * (845 / 953)} viewBox="0 0 953 845" fill="none">
      <path d="M185.08 260.292H60V200H446.532L474.491 228.752C475.246 229.528 475.246 230.764 474.491 231.54L446.532 260.292H231.776H185.08Z" fill={C.purple} />
      <path d="M767.92 260.292H893V200H506.468L478.509 228.752C477.754 229.528 477.754 230.764 478.509 231.54L506.468 260.292H721.224H767.92Z" fill={C.purple} />
      <path d="M244.067 544.13V645H184.045V256H244.067V506.472V544.13Z" fill="url(#pg1)" />
      <path d="M725.244 544.13V645H665.222V256H725.244V506.472V544.13Z" fill="url(#pg2)" />
      <path d="M450.551 645C425.926 645 401.502 640.157 377.28 630.472C353.059 620.383 331.663 604.241 313.093 586.888V526.5C326.011 540.625 370.216 578.413 389.997 586.888C409.778 595.362 430.164 599.6 451.157 599.6C477.397 599.6 498.389 593.143 514.133 580.229C529.877 567.315 537.749 550.366 537.749 529.381C537.749 512.835 533.914 499.517 526.244 489.428C518.977 478.936 509.087 470.663 496.572 464.61C484.058 458.153 470.332 452.503 455.395 447.66C440.862 442.817 426.127 437.773 411.191 432.527C396.658 427.28 383.134 420.42 370.619 411.945C358.105 403.471 348.012 392.574 340.342 379.257C333.076 365.536 329.442 348.183 329.442 327.198C329.442 304.599 334.489 284.824 344.581 267.875C355.077 250.926 369.61 237.81 388.18 228.528C406.75 218.843 446.424 214 452.368 214C457.519 214 461.361 215.5 465.649 220.5C469.15 224 471.284 226.499 474.652 230L468.65 236.5C467.149 238 467.149 238 464.648 240.5C460.147 245 457.646 248 445.641 260C424.245 260 412.604 265.454 398.474 277.56C384.749 289.667 377.886 305.204 377.886 324.171C377.886 339.103 381.519 351.21 388.786 360.492C396.456 369.773 406.548 377.441 419.063 383.494C431.577 389.144 445.101 394.39 459.634 399.233C474.571 403.672 489.306 408.717 503.839 414.367C518.776 420.016 532.501 427.28 545.016 436.159C557.53 445.037 567.421 456.74 574.687 471.268C582.358 485.393 586.193 503.755 586.193 526.354C586.193 563.078 574.082 592.134 549.86 613.522C525.638 634.507 492.535 645 450.551 645Z" fill={C.purple} />
      <defs>
        <linearGradient id="pg1" x1="214" y1="256" x2="214" y2="645" gradientUnits="userSpaceOnUse"><stop stopColor={C.midnight} /><stop offset="1" stopColor={C.purple} /></linearGradient>
        <linearGradient id="pg2" x1="695" y1="256" x2="695" y2="645" gradientUnits="userSpaceOnUse"><stop stopColor={C.midnight} /><stop offset="1" stopColor={C.purple} /></linearGradient>
      </defs>
    </svg>
  );
}

function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-3xl ${className}`}
      style={{ background: C.white, border: "1px solid rgba(22,0,30,0.08)", boxShadow: "0 16px 48px -28px rgba(22,0,30,0.18)", ...style }}
    >
      {children}
    </div>
  );
}

function ProgressBar({ value, accent = C.purple }) {
  return (
    <div className="w-full rounded-full h-2" style={{ background: "rgba(22,0,30,0.08)" }}>
      <div className="h-2 rounded-full" style={{ width: `${value}%`, background: accent, transition: "width .6s cubic-bezier(.16,1,.3,1)" }} />
    </div>
  );
}

function Pill({ children, tone = "purple" }) {
  const map = {
    purple: { bg: `${C.purple}15`, fg: C.purple },
    gold: { bg: `${C.gold}30`, fg: "#8a6b00" },
    orange: { bg: `${C.orange}20`, fg: "#a5601c" },
    neutral: { bg: "rgba(22,0,30,0.06)", fg: C.aubergine },
  };
  const s = map[tone];
  return (
    <span style={{ background: s.bg, color: s.fg, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999, fontFamily: fontBody }}>
      {children}
    </span>
  );
}

function Button({ variant = "primary", children, icon, className = "", style, ...props }) {
  const base = {
    fontFamily: fontBody, fontWeight: 600, fontSize: 14, borderRadius: 12,
    padding: "10px 18px", display: "inline-flex", alignItems: "center", gap: 8,
    transition: "transform .2s, filter .2s", cursor: "pointer", border: "none",
  };
  const styles = {
    primary: { background: C.purple, color: C.white },
    secondary: { background: C.white, color: C.aubergine, border: "1px solid rgba(22,0,30,0.15)" },
    accent: { background: C.orange, color: C.aubergine },
  };
  return (
    <button {...props} className={`btn-hover ${className}`} style={{ ...base, ...styles[variant], ...style }}>
      {children}{icon}
    </button>
  );
}

const WHATSAPP_LINK = "https://wa.me/918369953959?text=Hi%2C%20I%20have%20a%20question%20about%20my%20course.";

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

/* ============================================================
   Screens
   ============================================================ */
function DashboardHome({ setActive, notify, profile, enrollments, liveClasses, announcements, assignments, certificates }) {
  const pendingAssignments = assignments.filter((a) => !a.submission || a.submission.status !== "reviewed");
  const firstName = (profile?.full_name || "there").split(" ")[0];
  const inProgress = enrollments.filter((e) => e.status === "active" && e.progress_percent < 100);
  const completedCount = enrollments.filter((e) => e.status === "completed").length;
  const nextCertifiable = inProgress.sort((a, b) => b.progress_percent - a.progress_percent)[0];
  const accents = [C.purple, C.orange, C.gold, C.midnight];

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 26 }}>Welcome back, {firstName} 👋</h1>
          <p style={{ opacity: 0.6, fontSize: 14, marginTop: 4 }}>Here's where you left off.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" icon={<Play size={15} />} onClick={() => setActive("courses")}>Resume Learning</Button>
          <Button variant="secondary" icon={<Video size={15} />} onClick={() => setActive("live")}>Join Live Class</Button>
        </div>
      </div>

      {/* enrolled courses */}
      {enrollments.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen size={22} style={{ opacity: 0.35, margin: "0 auto 10px" }} />
          <p style={{ fontSize: 14, opacity: 0.6 }}>You're not enrolled in any courses yet.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {enrollments.map((e, i) => (
            <Card key={e.id} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 16 }}>{e.courses?.title}</span>
                <span style={{ fontFamily: fontMono, fontSize: 13, color: accents[i % accents.length], fontWeight: 600 }}>{e.progress_percent}%</span>
              </div>
              <ProgressBar value={e.progress_percent} accent={accents[i % accents.length]} />
              <p style={{ fontSize: 13, opacity: 0.65, marginTop: 12 }}>{e.batches?.name || "No batch assigned yet"}</p>
              <button
                onClick={() => setActive("courses")}
                className="btn-hover flex items-center gap-1.5 mt-4"
                style={{ color: accents[i % accents.length], fontSize: 13.5, fontWeight: 600 }}
              >
                Continue course <ArrowRight size={14} />
              </button>
            </Card>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* live classes */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 16 }}>Upcoming live classes</h3>
            <button onClick={() => setActive("live")} style={{ fontSize: 13, color: C.purple, fontWeight: 600 }}>View all</button>
          </div>
          {liveClasses.length === 0 ? (
            <p style={{ fontSize: 13.5, opacity: 0.5, padding: "12px 0" }}>No live classes scheduled right now.</p>
          ) : (
            <div className="space-y-3">
              {liveClasses.map((l) => (
                <div key={l.id} className="flex items-center justify-between p-3.5 rounded-2xl" style={{ background: C.lavender }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: `${C.purple}18`, color: C.purple }}>
                      <Video size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{l.title}</div>
                      <div style={{ fontSize: 12, opacity: 0.6 }}>{l.batches?.name} · {l.batches?.profiles?.full_name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: C.purple }}>{formatDateTime(l.scheduled_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* announcements + certificate status */}
        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={15} style={{ color: C.orange }} />
              <h3 style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 15 }}>Announcements</h3>
            </div>
            {announcements.length === 0 ? (
              <p style={{ fontSize: 13, opacity: 0.5 }}>Nothing new right now.</p>
            ) : (
              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.id}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a.title}</div>
                    <div style={{ fontSize: 11.5, opacity: 0.5 }}>{timeAgo(a.published_at)}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6" style={{ background: C.midnight, color: C.lavender, border: "none" }}>
            <div className="flex items-center gap-2 mb-2">
              <Flame size={16} style={{ color: C.gold }} />
              <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>Certificate status</span>
            </div>
            <p style={{ fontSize: 13.5, opacity: 0.75, lineHeight: 1.5 }}>
              {completedCount} course{completedCount === 1 ? "" : "s"} completed.{" "}
              {nextCertifiable
                ? `${nextCertifiable.courses?.title} unlocks a certificate at 100% progress.`
                : "Enrol in a course to start earning certificates."}
            </p>
          </Card>
        </div>
      </div>

      {/* pending assignments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 16 }}>Pending assignments</h3>
          <button onClick={() => setActive("assignments")} style={{ fontSize: 13, color: C.purple, fontWeight: 600 }}>View all</button>
        </div>
        {pendingAssignments.length === 0 ? (
          <p style={{ fontSize: 13.5, opacity: 0.5, padding: "8px 0" }}>Nothing pending - you're caught up.</p>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(22,0,30,0.06)" }}>
            {pendingAssignments.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{a.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.55 }}>{a.courses?.title}</div>
                </div>
                <Pill tone={a.submission ? "orange" : "neutral"}>{a.submission ? "Submitted - awaiting review" : formatDueDate(a.due_date)}</Pill>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function CoursesScreen({ enrollments, notify }) {
  const [selectedId, setSelectedId] = useState(enrollments[0]?.id ?? null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const selected = enrollments.find((e) => e.id === selectedId);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setLoading(true);
    const supabase = createClient();

    (async () => {
      const { data: moduleRows } = await supabase
        .from("modules")
        .select("id, title, order_index")
        .eq("course_id", selected.course_id)
        .order("order_index");

      const moduleIds = (moduleRows ?? []).map((m) => m.id);
      const { data: lessonRows } = moduleIds.length
        ? await supabase.from("lessons").select("id, module_id").in("module_id", moduleIds)
        : { data: [] };
      const { data: progressRows } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed")
        .eq("enrollment_id", selected.id);

      const completedIds = new Set((progressRows ?? []).filter((p) => p.completed).map((p) => p.lesson_id));
      const shaped = (moduleRows ?? []).map((m) => {
        const lessonsInModule = (lessonRows ?? []).filter((l) => l.module_id === m.id);
        return {
          id: m.id,
          title: m.title,
          lessons: lessonsInModule.length,
          done: lessonsInModule.filter((l) => completedIds.has(l.id)).length,
        };
      });

      if (!cancelled) {
        setModules(shaped);
        setLoading(false);
      }
    })().catch(() => {
      if (!cancelled) {
        notify("Couldn't load course modules");
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  if (enrollments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <BookOpen size={22} style={{ opacity: 0.35, margin: "0 auto 10px" }} />
        <p style={{ fontSize: 14, opacity: 0.6 }}>You're not enrolled in any courses yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {enrollments.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {enrollments.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedId(e.id)}
              className="btn-hover"
              style={{
                fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 999,
                background: selectedId === e.id ? C.aubergine : "rgba(22,0,30,0.06)",
                color: selectedId === e.id ? C.white : C.aubergine,
              }}
            >
              {e.courses?.title}
            </button>
          ))}
        </div>
      )}

      <Card className="p-7">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <h2 style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 22 }}>{selected?.courses?.title}</h2>
          <span style={{ fontFamily: fontMono, fontWeight: 600, color: C.purple }}>{selected?.progress_percent}% complete</span>
        </div>
        <ProgressBar value={selected?.progress_percent ?? 0} />
      </Card>

      <Card className="p-2">
        {loading ? (
          <p style={{ fontSize: 13.5, opacity: 0.5, padding: 20 }}>Loading modules…</p>
        ) : modules.length === 0 ? (
          <p style={{ fontSize: 13.5, opacity: 0.5, padding: 20 }}>No modules published for this course yet.</p>
        ) : (
          modules.map((m, i) => (
            <div
              key={m.id}
              className="flex items-center justify-between p-4"
              style={{ borderBottom: i < modules.length - 1 ? "1px solid rgba(22,0,30,0.06)" : "none" }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-9 h-9 rounded-full grid place-items-center flex-shrink-0"
                  style={{
                    background: m.lessons > 0 && m.done === m.lessons ? `${C.purple}18` : "rgba(22,0,30,0.05)",
                    color: m.lessons > 0 && m.done === m.lessons ? C.purple : "rgba(22,0,30,0.4)",
                  }}
                >
                  {m.lessons > 0 && m.done === m.lessons ? <CheckCircle2 size={16} /> : <span style={{ fontFamily: fontMono, fontSize: 12 }}>{i + 1}</span>}
                </div>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 500 }}>{m.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.55 }}>{m.done}/{m.lessons} lessons complete</div>
                </div>
              </div>
              <ChevronRight size={16} style={{ opacity: 0.4 }} />
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

function LiveClassesScreen({ liveClasses, notify }) {
  const addToCalendar = (l) => {
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(l.title)}&details=${encodeURIComponent(`${l.batches?.name ?? ""} with ${l.batches?.profiles?.full_name ?? ""}`)}`;
    window.open(url, "_blank");
  };
  return (
    <div className="space-y-4">
      {liveClasses.length === 0 ? (
        <Card className="p-8 text-center">
          <Video size={22} style={{ opacity: 0.35, margin: "0 auto 10px" }} />
          <p style={{ fontSize: 14, opacity: 0.6 }}>No live classes scheduled right now.</p>
        </Card>
      ) : (
        liveClasses.map((l) => (
          <Card key={l.id} className="p-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl grid place-items-center flex-shrink-0" style={{ background: `${C.purple}18`, color: C.purple }}>
                <Video size={20} />
              </div>
              <div>
                <div style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 16 }}>{l.title}</div>
                <div style={{ fontSize: 13, opacity: 0.6, marginTop: 2 }}>{l.batches?.name} · Trainer: {l.batches?.profiles?.full_name}</div>
                <div className="flex items-center gap-1.5 mt-1.5" style={{ fontSize: 12.5, color: C.purple, fontWeight: 600 }}>
                  <Calendar size={13} /> {formatDateTime(l.scheduled_at)}
                </div>
              </div>
            </div>
            <div className="flex gap-2.5">
              <Button variant="secondary" icon={<Calendar size={14} />} onClick={() => addToCalendar(l)}>Add to Calendar</Button>
              <Button
                variant="primary"
                icon={<Play size={14} />}
                onClick={() => (l.zoom_link ? window.open(l.zoom_link, "_blank") : notify("Zoom link not added yet - check back closer to class time"))}
              >
                Join
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

function AssignmentsScreen({ assignments: initialAssignments, studentId, notify }) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [links, setLinks] = useState({}); // id -> { file, github, drive }

  const setLink = (id, key, value) => setLinks((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));

  const [submitting, setSubmitting] = useState(null); // assignment id currently submitting

  // Real insert into `submissions` - RLS (0005_row_level_security.sql)
  // only allows a student to insert their own submission, so studentId
  // must match the authenticated user or this fails at the database.
  const handleSubmit = async (a) => {
    const l = links[a.id] || {};
    if (!l.file && !l.github && !l.drive) {
      notify("Add a file, GitHub link, or Drive link first");
      return;
    }
    setSubmitting(a.id);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("submissions")
      .insert({
        assignment_id: a.id,
        student_id: studentId,
        file_url: l.file || null,
        github_url: l.github || null,
        drive_url: l.drive || null,
        status: "submitted",
      })
      .select()
      .single();

    setSubmitting(null);

    if (error) {
      notify(error.code === "23505" ? "You've already submitted this assignment" : "Couldn't submit - try again");
      return;
    }

    setAssignments((prev) => prev.map((x) => (x.id === a.id ? { ...x, submission: data } : x)));
    notify(`Submitted "${a.title}"`);
  };

  if (assignments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <ClipboardList size={22} style={{ opacity: 0.35, margin: "0 auto 10px" }} />
        <p style={{ fontSize: 14, opacity: 0.6 }}>No assignments yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((a) => {
        const sub = a.submission;
        const isReviewed = sub?.status === "reviewed";
        return (
          <Card key={a.id} className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 15.5 }}>{a.title}</div>
                <div style={{ fontSize: 12.5, opacity: 0.6, marginTop: 3 }}>{a.courses?.title}</div>
              </div>
              <Pill tone={isReviewed ? "purple" : sub ? "orange" : "neutral"}>
                {isReviewed ? `${sub.score ?? " - "}/100` : sub ? "Submitted - awaiting review" : formatDueDate(a.due_date)}
              </Pill>
            </div>
            {isReviewed ? (
              <p style={{ fontSize: 13.5, opacity: 0.7, marginTop: 12, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600 }}>Trainer feedback: </span>{sub.feedback || "No written feedback left."}
              </p>
            ) : sub ? (
              <p style={{ fontSize: 13, opacity: 0.55, marginTop: 12 }}>Your trainer will leave feedback here once reviewed.</p>
            ) : (
              <div className="flex flex-wrap gap-2.5 mt-4">
                <Button
                  variant="secondary"
                  icon={<Upload size={14} />}
                  onClick={() => { setLink(a.id, "file", "assignment.zip"); notify("File attached: assignment.zip"); }}
                  style={links[a.id]?.file ? { borderColor: C.purple, color: C.purple } : {}}
                >
                  {links[a.id]?.file ? "File attached ✓" : "Upload file"}
                </Button>
                <Button
                  variant="secondary"
                  icon={<Github size={14} />}
                  onClick={() => {
                    const url = window.prompt("Paste your GitHub repository link");
                    if (url) { setLink(a.id, "github", url); notify("GitHub link added"); }
                  }}
                  style={links[a.id]?.github ? { borderColor: C.purple, color: C.purple } : {}}
                >
                  {links[a.id]?.github ? "GitHub linked ✓" : "Add GitHub link"}
                </Button>
                <Button
                  variant="secondary"
                  icon={<LinkIcon size={14} />}
                  onClick={() => {
                    const url = window.prompt("Paste your Google Drive link");
                    if (url) { setLink(a.id, "drive", url); notify("Drive link added"); }
                  }}
                  style={links[a.id]?.drive ? { borderColor: C.purple, color: C.purple } : {}}
                >
                  {links[a.id]?.drive ? "Drive linked ✓" : "Add Drive link"}
                </Button>
                <Button variant="primary" onClick={() => handleSubmit(a)} disabled={submitting === a.id}>
                  {submitting === a.id ? "Submitting…" : "Submit"}
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function CertificatesScreen({ certificates, enrollments, notify }) {
  const shareOnLinkedIn = (c) => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://thriveskilltech.com/verify/" + c.certificate_number)}`;
    window.open(url, "_blank");
  };
  const inProgressWithoutCert = enrollments.filter(
    (e) => e.progress_percent < 100 && !certificates.some((c) => c.course_id === e.course_id)
  );
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {certificates.map((c) => (
        <Card key={c.id} className="p-7" style={{ background: C.midnight, color: C.lavender, border: "none" }}>
          <div className="flex items-center justify-between mb-6">
            <Award size={26} style={{ color: C.gold }} />
            <QrCode size={26} style={{ opacity: 0.6 }} />
          </div>
          <div style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 17 }}>{c.courses?.title}</div>
          <div style={{ fontFamily: fontMono, fontSize: 12, opacity: 0.6, marginTop: 6 }}>{c.certificate_number}</div>
          <div style={{ fontSize: 12.5, opacity: 0.6, marginTop: 2 }}>
            Issued {new Date(c.issued_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
          </div>
          <div className="flex gap-2.5 mt-6">
            <Button
              variant="accent"
              icon={<Download size={14} />}
              onClick={() => (c.pdf_url ? window.open(c.pdf_url, "_blank") : notify("PDF not generated yet - check back shortly"))}
            >
              Download PDF
            </Button>
            <Button
              variant="secondary"
              icon={<Linkedin size={14} />}
              style={{ background: "rgba(255,255,255,0.1)", color: C.lavender, border: "1px solid rgba(255,255,255,0.2)" }}
              onClick={() => shareOnLinkedIn(c)}
            >
              Share
            </Button>
          </div>
        </Card>
      ))}
      {inProgressWithoutCert.map((e) => (
        <Card key={e.id} className="p-7 flex flex-col items-center justify-center text-center" style={{ borderStyle: "dashed" }}>
          <Clock size={26} style={{ opacity: 0.35, marginBottom: 10 }} />
          <div style={{ fontSize: 14, fontWeight: 500, opacity: 0.6 }}>{e.courses?.title}</div>
          <div style={{ fontSize: 12.5, opacity: 0.45, marginTop: 4 }}>{e.progress_percent}% complete - certificate unlocks at 100%</div>
        </Card>
      ))}
      {certificates.length === 0 && inProgressWithoutCert.length === 0 && (
        <Card className="p-8 text-center md:col-span-2">
          <Award size={22} style={{ opacity: 0.35, margin: "0 auto 10px" }} />
          <p style={{ fontSize: 14, opacity: 0.6 }}>Enrol in a course to start earning certificates.</p>
        </Card>
      )}
    </div>
  );
}

function CommunityScreen() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Card className="p-7 text-center">
        <MessageCircle size={26} style={{ color: "#25D366", marginBottom: 10 }} className="mx-auto" />
        <div style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 16 }}>WhatsApp Community</div>
        <p style={{ fontSize: 13.5, opacity: 0.65, marginTop: 8, lineHeight: 1.5 }}>Batch updates, peer support, and quick trainer Q&A.</p>
        <Button variant="primary" className="mt-5 mx-auto" icon={<ArrowRight size={14} />} onClick={() => window.open(WHATSAPP_LINK, "_blank")}>
          Join on WhatsApp
        </Button>
      </Card>
      <Card className="p-7 text-center" style={{ opacity: 0.6 }}>
        <MessageCircle size={26} style={{ marginBottom: 10 }} className="mx-auto" />
        <div style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 16 }}>Discord</div>
        <p style={{ fontSize: 13.5, opacity: 0.7, marginTop: 8 }}>Coming soon.</p>
      </Card>
    </div>
  );
}

function ProfileScreen({ profile, notify }) {
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    linkedin_url: profile?.linkedin_url || "",
    github_url: profile?.github_url || "",
  });
  const [saving, setSaving] = useState(false);
  const fields = [
    { key: "full_name", label: "Full name" },
    { key: "email", label: "Email", disabled: true }, // change email via Supabase Auth flow, not a plain profile update
    { key: "phone", label: "Mobile number" },
    { key: "linkedin_url", label: "LinkedIn profile" },
    { key: "github_url", label: "GitHub profile" },
  ];
  const initials = (profile?.full_name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.full_name, phone: form.phone, linkedin_url: form.linkedin_url, github_url: form.github_url })
      .eq("id", profile.id);
    setSaving(false);
    notify(error ? "Couldn't save - try again" : "Profile updated");
  };

  return (
    <Card className="p-7 max-w-xl">
      <div className="flex items-center gap-4 mb-7">
        <div className="w-16 h-16 rounded-full grid place-items-center" style={{ background: `${C.purple}18`, color: C.purple, fontFamily: fontDisplay, fontWeight: 600, fontSize: 22 }}>
          {initials}
        </div>
        <div>
          <div style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 17 }}>{profile?.full_name || "Your name"}</div>
          <button style={{ fontSize: 12.5, color: C.purple, fontWeight: 600 }} onClick={() => notify("Photo upload not wired up yet - needs a Supabase Storage bucket")}>
            Change photo
          </button>
        </div>
      </div>
      {fields.map((f) => (
        <div key={f.key} className="mb-4">
          <label style={{ fontSize: 12.5, fontWeight: 500, opacity: 0.6 }}>{f.label}</label>
          <input
            value={form[f.key]}
            disabled={f.disabled}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full mt-1.5 rounded-xl px-4 py-2.5"
            style={{ background: C.lavender, border: "1px solid rgba(22,0,30,0.1)", fontSize: 14, opacity: f.disabled ? 0.6 : 1 }}
          />
        </div>
      ))}
      <Button variant="primary" className="mt-2" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </Card>
  );
}

/* ============================================================
   Shell
   ============================================================ */
export default function StudentPortal({ initialData }) {
  const { profile, enrollments, liveClasses, announcements, assignments, certificates } = initialData;
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");
  const notify = (msg) => setToast(msg);
  const initials = (profile?.full_name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const screens = {
    dashboard: (
      <DashboardHome
        setActive={setActive}
        notify={notify}
        profile={profile}
        enrollments={enrollments}
        liveClasses={liveClasses}
        announcements={announcements}
        assignments={assignments}
        certificates={certificates}
      />
    ),
    courses: <CoursesScreen enrollments={enrollments} notify={notify} />,
    live: <LiveClassesScreen liveClasses={liveClasses} notify={notify} />,
    assignments: <AssignmentsScreen assignments={assignments} studentId={profile?.id} notify={notify} />,
    certificates: <CertificatesScreen certificates={certificates} enrollments={enrollments} notify={notify} />,
    community: <CommunityScreen />,
    profile: <ProfileScreen profile={profile} notify={notify} />,
  };

  return (
    <div style={{ background: C.lavender, minHeight: "100vh", fontFamily: fontBody, color: C.aubergine }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .btn-hover:hover { transform: translateY(-1px); filter: brightness(1.04); }
        .focus-ring:focus-visible { outline: 2px solid ${C.purple}; outline-offset: 2px; }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 12px);} to { opacity: 1; transform: translate(-50%, 0);} }
      `}</style>

      <div className="flex">
        {/* ---------- Sidebar ---------- */}
        <aside
          className={`fixed lg:sticky top-0 h-screen z-40 flex flex-col transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          style={{ width: 250, background: C.midnight, color: C.lavender, padding: "22px 16px" }}
        >
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-2" style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 16 }}>
              <LogoMark size={26} /> Thrive
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
                  className="focus-ring w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left"
                  style={{
                    background: isActive ? "rgba(139,92,246,0.2)" : "transparent",
                    color: isActive ? C.white : "rgba(252,247,255,0.65)",
                    fontSize: 14, fontWeight: 500, transition: "all .2s",
                  }}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="rounded-2xl p-4 mt-4" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 12.5, opacity: 0.7, lineHeight: 1.5 }}>Need help? Reach your counsellor on WhatsApp anytime.</div>
          </div>

          <form action="/auth/signout" method="post" className="mt-3">
            <button type="submit" className="focus-ring w-full text-left px-3.5 py-2.5" style={{ fontSize: 13, opacity: 0.55, color: C.lavender }}>
              Log out
            </button>
          </form>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* ---------- Main ---------- */}
        <div className="flex-1 min-w-0">
          <header className="flex items-center justify-between px-6 lg:px-9 py-4 sticky top-0 z-20" style={{ background: "rgba(252,247,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(22,0,30,0.06)" }}>
            <div className="flex items-center gap-3">
              <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
              <div className="hidden sm:flex items-center gap-2 rounded-full px-4 py-2" style={{ background: C.white, border: "1px solid rgba(22,0,30,0.08)", width: 260 }}>
                <Search size={15} style={{ opacity: 0.4 }} />
                <input
                  placeholder="Search course content"
                  style={{ border: "none", outline: "none", background: "transparent", fontSize: 13.5, width: "100%" }}
                  onKeyDown={(e) => e.key === "Enter" && e.currentTarget.value && notify(`Search isn't wired to course content yet - searched "${e.currentTarget.value}"`)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Bell size={18} style={{ opacity: 0.6 }} />
              <button
                onClick={() => setActive("profile")}
                className="w-9 h-9 rounded-full grid place-items-center focus-ring"
                style={{ background: `${C.purple}18`, color: C.purple, fontFamily: fontDisplay, fontWeight: 600, fontSize: 13 }}
                aria-label="Your profile"
              >
                {initials}
              </button>
            </div>
          </header>

          <main className="p-6 lg:p-9 max-w-6xl">{screens[active]}</main>
        </div>
      </div>

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}
