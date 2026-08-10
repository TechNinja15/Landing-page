"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AuthShell, { AuthInput, AuthButton, AuthError, AuthSuccess, C } from "@/components/auth/AuthShell";

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // profiles row is created automatically by the handle_new_user()
    // trigger (see supabase/migrations/0001_extensions_roles_profiles.sql),
    // seeded from raw_user_meta_data.full_name below. Phone gets backfilled
    // to the profile on first login rather than here, since Supabase Auth's
    // sign-up payload doesn't itself write arbitrary profile columns.
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName, phone: form.phone },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <AuthShell title="Check your inbox" subtitle="">
        <AuthSuccess message={`We've sent a confirmation link to ${form.email}. Click it to activate your account and log in.`} />
        <a href="/login" style={{ color: C.purple, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
          Back to login
        </a>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start with any course — you can enrol after."
      footer={
        <>
          Already have an account?{" "}
          <a href="/login" className="auth-link" style={{ color: C.purple, fontWeight: 600, textDecoration: "none" }}>
            Log in
          </a>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <AuthError message={error} />
        <AuthInput label="Full name" type="text" required value={form.fullName} onChange={set("fullName")} placeholder="Aditi Sharma" />
        <AuthInput label="Email address" type="email" required autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
        <AuthInput label="Mobile number" type="tel" required value={form.phone} onChange={set("phone")} placeholder="9876543210" />
        <AuthInput
          label="Password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={form.password}
          onChange={set("password")}
          placeholder="At least 8 characters"
        />
        <div style={{ marginBottom: 20 }} />
        <AuthButton type="submit" loading={loading}>
          Create account
        </AuthButton>
        <p style={{ fontSize: 12, opacity: 0.5, marginTop: 14, lineHeight: 1.5, color: C.aubergine }}>
          By creating an account you agree to our Terms & Conditions and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
}
