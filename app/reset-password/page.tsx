"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell, { AuthInput, AuthButton, AuthError, C } from "@/components/auth/AuthShell";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // The recovery link lands the user here already authenticated (the
  // /auth/callback route handler exchanges the code for a session before
  // redirecting here). Confirm a session actually exists before letting
  // them submit — otherwise updateUser() would silently fail.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setError("This reset link has expired. Request a new one.");
      }
      setReady(true);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/login");
  };

  if (!ready) return null;

  return (
    <AuthShell title="Set a new password" subtitle="Choose something you haven't used before.">
      <form onSubmit={handleSubmit}>
        <AuthError message={error} />
        <AuthInput
          label="New password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />
        <AuthInput
          label="Confirm new password"
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter password"
        />
        <div style={{ marginBottom: 6 }} />
        <AuthButton type="submit" loading={loading}>
          Update password
        </AuthButton>
      </form>
    </AuthShell>
  );
}
