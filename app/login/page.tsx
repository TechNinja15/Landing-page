"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell, { AuthInput, AuthButton, AuthError, C } from "@/components/auth/AuthShell";
import type { Profile } from "@/types/database";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : signInError.message
      );
      setLoading(false);
      return;
    }
    // Respect a role-gated redirect from middleware.ts if present,
    // otherwise route by role so admins land in /admin, everyone else in /portal.
    if (redirectTo) {
      router.push(redirectTo);
      router.refresh();
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single<Pick<Profile, "role">>();
    const destination = profile && ["admin", "super_admin"].includes(profile.role) ? "/admin" : "/portal";
    router.push(destination);
    router.refresh();
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your course."
      footer={
        <>
          Don't have an account?{" "}
          <a href="/signup" className="auth-link" style={{ color: C.purple, fontWeight: 600, textDecoration: "none" }}>
            Create one
          </a>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <AuthError message={error} />
        <AuthInput
          label="Email address"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: C.aubergine, opacity: 0.75, marginBottom: 6, display: "block" }}>
              Password
            </label>
            <a href="/forgot-password" className="auth-link" style={{ fontSize: 12.5, color: C.purple, fontWeight: 600, textDecoration: "none" }}>
              Forgot password?
            </a>
          </div>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(22,0,30,0.15)",
              background: C.white,
              fontSize: 14.5,
              color: C.aubergine,
              marginBottom: 24,
            }}
          />
        </div>
        <AuthButton type="submit" loading={loading}>
          Log in
        </AuthButton>
      </form>
    </AuthShell>
  );
}
