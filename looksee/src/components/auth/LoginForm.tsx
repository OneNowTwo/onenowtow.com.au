"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics/posthog";
import { Logo } from "@/components/brand/Logo";
import { safeNextPath } from "@/lib/auth/redirect";

type Mode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"), "/profile");
  const authErrorParam = searchParams.get("error");

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    authErrorParam === "auth"
      ? "Sign-in link expired or was opened in a different browser. Try password sign-in instead."
      : null,
  );
  const [loading, setLoading] = useState(false);

  async function signInWithPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    track("signup_started", { method: "password_signin" });

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      track("login_completed", { method: "password" });
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    track("signup_started", { method: "password_signup" });

    try {
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }
      const supabase = createClient();
      const origin = window.location.origin;
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (authError) throw authError;

      if (data.session) {
        track("login_completed", { method: "password_signup" });
        router.replace(next);
        router.refresh();
        return;
      }

      setMessage(
        "Account created. If your project requires email confirmation, check your inbox once — after that you can sign in with your password.",
      );
      setMode("signin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
    } finally {
      setLoading(false);
    }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    track("signup_started", { method: "magic_link" });

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (otpError) throw otpError;
      setMessage("Check your email for a magic link. Open it in this same browser.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send magic link.");
    } finally {
      setLoading(false);
    }
  }

  async function sendPasswordReset() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (!email) throw new Error("Enter your email first.");
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/profile?tab=settings")}`,
      });
      if (resetError) throw resetError;
      setMessage("Password reset email sent. Use it once to choose a new password, then sign in normally.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <Logo />
      <h1 className="mt-8 text-2xl font-extrabold tracking-tight">Sign in to looksee</h1>
      <p className="mt-2 text-sm text-muted">
        Use your email and password. No inbox needed after you set one up.
      </p>

      <div className="mt-6 flex gap-2 rounded-xl bg-muted-bg p-1">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError(null);
            setMessage(null);
          }}
          className={`h-10 flex-1 rounded-lg text-sm font-semibold ${
            mode === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
            setMessage(null);
          }}
          className={`h-10 flex-1 rounded-lg text-sm font-semibold ${
            mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted"
          }`}
        >
          Create account
        </button>
      </div>

      <form
        onSubmit={(e) => void (mode === "signin" ? signInWithPassword(e) : signUpWithPassword(e))}
        className="mt-6 space-y-3"
      >
        <label className="block text-sm font-semibold">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl bg-card px-3 text-sm outline-none ring-1 ring-border"
            placeholder="you@email.com"
            autoComplete="email"
          />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl bg-card px-3 text-sm outline-none ring-1 ring-border"
            placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            minLength={6}
          />
        </label>

        {mode === "signin" ? (
          <button
            type="button"
            onClick={() => void sendPasswordReset()}
            className="text-xs font-medium text-muted underline"
            disabled={loading}
          >
            Forgot password?
          </button>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-accent text-sm font-bold text-white hover:bg-accent-hover disabled:opacity-60"
        >
          {loading
            ? mode === "signin"
              ? "Signing in…"
              : "Creating…"
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setShowMagicLink((v) => !v)}
          className="text-xs font-medium text-muted underline"
        >
          {showMagicLink ? "Hide magic link" : "Use a magic link instead"}
        </button>
        {showMagicLink ? (
          <form onSubmit={(e) => void sendMagicLink(e)} className="mt-3 space-y-3">
            <p className="text-xs text-muted">
              Sends a one-time email link. Prefer password for day-to-day use.
            </p>
            <button
              type="submit"
              disabled={loading || !email}
              className="h-11 w-full rounded-xl bg-foreground text-sm font-bold text-white disabled:opacity-60"
            >
              {loading ? "Sending…" : "Email me a link"}
            </button>
          </form>
        ) : null}
      </div>

      {message ? <p className="mt-4 text-sm text-success">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
