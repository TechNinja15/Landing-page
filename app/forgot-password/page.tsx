"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AuthShell, { AuthInput, AuthButton, AuthError, AuthSuccess, C } from "@/components/auth/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    // Always show the same success message regardless of whether the email
    // exists - this avoids leaking which addresses have accounts.
    if (resetError) {
      setError("Something went wrong. Please try again in a moment.");
      return;
    }
    setSent(true);
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a link to set a new one."
      footer={
        <a href="/login" style={{ color: C.purple, fontWeight: 600, textDecoration: "none" }}>
          Back to login
        </a>
      }
    >
      {sent ? (
        <AuthSuccess message={`If an account exists for ${email}, a reset link is on its way.`} />
      ) : (
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
          <div style={{ marginBottom: 6 }} />
          <AuthButton type="submit" loading={loading}>
            Send reset link
          </AuthButton>
        </form>
      )}
    </AuthShell>
  );
}
