"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  initial: {
    first_name: string;
    nationality: string;
    current_city: string;
    avatar_url: string;
  };
};

export function ProfileSettingsForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          nationality: form.nationality || null,
          current_city: form.current_city || null,
          avatar_url: form.avatar_url || null,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not save profile");
      setMessage("Profile updated");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={(e) => void save(e)} className="space-y-3">
      {(
        [
          ["first_name", "First name"],
          ["nationality", "Nationality (optional)"],
          ["current_city", "Current city (optional)"],
          ["avatar_url", "Avatar URL (optional)"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block text-sm font-semibold">
          {label}
          <input
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="mt-1.5 h-11 w-full rounded-xl bg-card px-3 text-sm outline-none ring-1 ring-border"
          />
        </label>
      ))}
      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-xl bg-accent px-4 text-sm font-bold text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
