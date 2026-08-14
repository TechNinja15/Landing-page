/**
 * Hand-written to match supabase/migrations/*.sql.
 * Once your project is running, regenerate the authoritative version with:
 *   npx supabase gen types typescript --project-id <your-project-ref> > types/database.ts
 */

export type UserRole = "super_admin" | "admin" | "trainer" | "student";
export type LeadStage = "new" | "contacted" | "follow_up" | "converted" | "lost";
export type EnrollmentStatus = "active" | "completed" | "cancelled";
export type AttendanceStatus = "present" | "absent" | "late";
export type SubmissionStatus = "submitted" | "reviewed" | "resubmit_requested";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  date_of_birth: string | null;
  notification_preferences: { email: boolean; whatsapp: boolean };
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  summary: string | null;
  level: string | null;
  duration_label: string | null;
  mode: string | null;
  price: number | null;
  currency: string;
  image_url: string | null;
  accent_color: string | null;
  certificate_enabled: boolean;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  video_url: string | null;
  notes_url: string | null;
  duration_minutes: number | null;
  order_index: number;
  is_free_preview: boolean;
  created_at: string;
}

export interface Batch {
  id: string;
  course_id: string;
  name: string;
  trainer_id: string | null;
  start_date: string | null;
  end_date: string | null;
  timing: string | null;
  capacity: number | null;
  status: "upcoming" | "active" | "completed";
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  batch_id: string | null;
  status: EnrollmentStatus;
  progress_percent: number;
  enrolled_at: string;
  completed_at: string | null;
}

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  course_interested: string | null;
  source: string;
  assigned_counselor: string | null;
  stage: LeadStage;
  notes: string | null;
  last_contact_date: string | null;
  next_follow_up_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  student_id: string;
  course_id: string;
  certificate_number: string;
  pdf_url: string | null;
  issued_at: string;
}

/**
 * Minimal Database type so `createBrowserClient<Database>()` /
 * `createServerClient<Database>()` type-check. Expand with the
 * remaining tables (modules, lessons, batches, etc.) as you build
 * against them, or replace this file entirely with the generated one.
 *
 * NOTE: `Relationships: []` on every table and the empty `Views` /
 * `Functions` / `Enums` / `CompositeTypes` blocks below are required —
 * without them, Supabase's query builder generics (.select(), .insert(),
 * .single(), .maybeSingle()) silently fall back to `never` in many
 * places instead of producing a real inferred type or a clear error.
 */
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile>; Relationships: [] };
      courses: { Row: Course; Insert: Partial<Course>; Update: Partial<Course>; Relationships: [] };
      modules: { Row: CourseModule; Insert: Partial<CourseModule>; Update: Partial<CourseModule>; Relationships: [] };
      lessons: { Row: Lesson; Insert: Partial<Lesson>; Update: Partial<Lesson>; Relationships: [] };
      batches: { Row: Batch; Insert: Partial<Batch>; Update: Partial<Batch>; Relationships: [] };
      enrollments: { Row: Enrollment; Insert: Partial<Enrollment>; Update: Partial<Enrollment>; Relationships: [] };
      leads: { Row: Lead; Insert: Partial<Lead>; Update: Partial<Lead>; Relationships: [] };
      certificates: { Row: Certificate; Insert: Partial<Certificate>; Update: Partial<Certificate>; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: {
      verify_certificate: {
        Args: { cert_number: string };
        Returns: any[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
