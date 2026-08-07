"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as UpChunk from "@mux/upchunk";
import {
  ArrowLeft,
  Check,
  LoaderCircle,
  Search,
  Upload,
} from "lucide-react";
import { track } from "@/lib/analytics/posthog";
import { CATEGORY_LABELS } from "@/lib/seed/data";
import type { VideoCategory } from "@/lib/types/database";
import type { HostelCard } from "@/lib/types/views";
import {
  ACCEPTED_VIDEO_MIME_TYPES,
  MAX_VIDEO_SECONDS,
  TARGET_VIDEO_MAX_SECONDS,
  TARGET_VIDEO_MIN_SECONDS,
  videoCategories,
} from "@/lib/validation/upload";
import { cn } from "@/lib/utils/cn";

type Step =
  | "hostel"
  | "category"
  | "guidance"
  | "uploading"
  | "metadata"
  | "success"
  | "error";

type RatingState = {
  cleanliness: number;
  sleep: number;
  social: number;
  security: number;
  location: number;
  vibe_score: number;
};

type Props = {
  initialHostels: HostelCard[];
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

async function readVideoDuration(file: File): Promise<number> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const duration = await new Promise<number>((resolve, reject) => {
      const el = document.createElement("video");
      el.preload = "metadata";
      el.onloadedmetadata = () => {
        resolve(el.duration);
      };
      el.onerror = () => reject(new Error("Could not read that video file."));
      el.src = objectUrl;
    });
    return duration;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function UploadFlow({ initialHostels }: Props) {
  const [step, setStep] = useState<Step>("hostel");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [hostel, setHostel] = useState<HostelCard | null>(null);
  const [category, setCategory] = useState<VideoCategory | null>(null);
  const [progress, setProgress] = useState(0);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [filmedAt, setFilmedAt] = useState(todayIsoDate());
  const [error, setError] = useState<string | null>(null);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestName, setSuggestName] = useState("");
  const [suggestDestination, setSuggestDestination] = useState("");
  const [suggestNotes, setSuggestNotes] = useState("");
  const [suggestSaved, setSuggestSaved] = useState(false);
  const [submittingMeta, setSubmittingMeta] = useState(false);
  const [processingNote, setProcessingNote] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchResults, setSearchResults] = useState<HostelCard[] | null>(null);
  const [ratings, setRatings] = useState<RatingState>({
    cleanliness: 0,
    sleep: 0,
    social: 0,
    security: 0,
    location: 0,
    vibe_score: 50,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hostels = !query.trim() ? initialHostels : (searchResults ?? []);

  useEffect(() => {
    track("upload_page_viewed");
  }, []);

  useEffect(() => {
    if (step !== "hostel") return;
    const q = query.trim();
    if (!q) return;

    const handle = window.setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/hostels/search?q=${encodeURIComponent(q)}`);
        const data = (await res.json()) as { results: HostelCard[] };
        setSearchResults(data.results);
      } finally {
        setSearching(false);
      }
    }, 220);

    return () => window.clearTimeout(handle);
  }, [query, step]);

  useEffect(() => {
    if (!videoId || step !== "metadata") return;

    const poll = window.setInterval(async () => {
      const res = await fetch(`/api/uploads/${videoId}`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        video: { status: string; mux_playback_id: string | null };
      };
      if (data.video.status === "ready" || data.video.status === "pending") {
        setProcessingNote(false);
        track("video_processing_completed", { video_id: videoId });
      } else if (data.video.status === "errored") {
        setError("Mux could not process this video. Try a different clip.");
        setStep("error");
      } else {
        setProcessingNote(true);
      }
    }, 2500);

    return () => window.clearInterval(poll);
  }, [videoId, step]);

  const canChooseVideo = Boolean(hostel && category);

  const categoryOptions = useMemo(
    () =>
      videoCategories.map((value) => ({
        value,
        label: CATEGORY_LABELS[value],
      })),
    [],
  );

  async function startUpload(file: File) {
    if (!hostel || !category || isUploading) return;

    const mimeOk =
      ACCEPTED_VIDEO_MIME_TYPES.includes(
        file.type as (typeof ACCEPTED_VIDEO_MIME_TYPES)[number],
      ) || file.type.startsWith("video/");

    if (!mimeOk) {
      setError("That file isn’t a supported video format. Try MP4 or MOV from your camera.");
      setStep("error");
      track("upload_failed", { reason: "unsupported_file" });
      return;
    }

    try {
      const duration = await readVideoDuration(file);
      if (!Number.isFinite(duration) || duration <= 0) {
        setError("We couldn’t read the length of that video. Try exporting it again.");
        setStep("error");
        track("upload_failed", { reason: "duration_unreadable" });
        return;
      }
      if (duration > MAX_VIDEO_SECONDS) {
        setError(
          `That video is over ${MAX_VIDEO_SECONDS} seconds. Trim it and try again.`,
        );
        setStep("error");
        track("upload_failed", { reason: "too_long", duration });
        return;
      }
    } catch {
      setError("We couldn’t read that video file. Try another clip from your camera roll.");
      setStep("error");
      track("upload_failed", { reason: "file_unreadable" });
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);
    setStep("uploading");
    track("upload_video_selected", { category });
    track("upload_started", { hostel_slug: hostel.slug, category });

    try {
      const createRes = await fetch("/api/uploads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostelId: hostel.id,
          category,
          filmedAt,
        }),
      });
      const createData = (await createRes.json()) as {
        error?: string;
        videoId?: string;
        uploadUrl?: string;
      };

      if (!createRes.ok || !createData.uploadUrl || !createData.videoId) {
        throw new Error(createData.error ?? "Could not start the Mux upload.");
      }

      setVideoId(createData.videoId);

      await new Promise<void>((resolve, reject) => {
        const upload = UpChunk.createUpload({
          endpoint: createData.uploadUrl!,
          file,
          chunkSize: 5120,
        });

        upload.on("error", (err) => {
          reject(new Error(err.detail ?? "Upload failed. Check your connection and try again."));
        });

        upload.on("progress", (evt) => {
          setProgress(Math.min(99, Math.round(evt.detail)));
        });

        upload.on("success", () => {
          setProgress(100);
          resolve();
        });
      });

      await fetch(`/api/uploads/${createData.videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "processing" }),
      });

      track("upload_completed", { video_id: createData.videoId });
      track("video_processing_started", { video_id: createData.videoId });
      setProcessingNote(true);
      setStep("metadata");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Check your connection and try again.";
      setError(message);
      setStep("error");
      track("upload_failed", { reason: "upload_error" });
    } finally {
      setIsUploading(false);
    }
  }

  async function submitMetadata() {
    if (!videoId || submittingMeta) return;

    const incomplete = (
      ["cleanliness", "sleep", "social", "security", "location"] as const
    ).some((key) => ratings[key] < 1);
    if (incomplete) {
      setError("Rate all five categories before submitting.");
      return;
    }

    setSubmittingMeta(true);
    setError(null);

    try {
      const res = await fetch(`/api/uploads/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption: caption.trim() || null,
          filmedAt,
          rating: ratings,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Could not save your Looksee details.");
      }
      track("video_submitted", { video_id: videoId });
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your Looksee details.");
    } finally {
      setSubmittingMeta(false);
    }
  }

  async function submitSuggestion() {
    setError(null);
    const res = await fetch("/api/hostel-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: suggestName,
        destination: suggestDestination,
        notes: suggestNotes || undefined,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Could not save that hostel suggestion.");
      return;
    }
    setSuggestSaved(true);
  }

  function resetFlow() {
    setStep("hostel");
    setHostel(null);
    setCategory(null);
    setProgress(0);
    setVideoId(null);
    setCaption("");
    setFilmedAt(todayIsoDate());
    setError(null);
    setProcessingNote(false);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
      {step !== "success" && step !== "hostel" ? (
        <button
          type="button"
          onClick={() => {
            if (step === "category") setStep("hostel");
            else if (step === "guidance") setStep("category");
            else if (step === "error") setStep("guidance");
            else if (step === "metadata") return;
          }}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted"
          disabled={step === "uploading" || step === "metadata"}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      ) : null}

      {step === "hostel" ? (
        <section>
          <h1 className="text-2xl font-extrabold tracking-tight">Where did you stay?</h1>
          <p className="mt-2 text-sm text-muted">Search for the hostel you filmed.</p>

          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-card p-2 ring-1 ring-border">
            <Search className="ml-2 h-5 w-5 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hostel or destination"
              className="h-11 w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
            />
          </div>

          <div className="mt-4 space-y-2">
            {searching ? (
              <p className="text-sm text-muted">Searching…</p>
            ) : hostels.length === 0 ? (
              <p className="text-sm text-muted">No hostels matched that search.</p>
            ) : (
              hostels.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setHostel(item);
                    track("upload_hostel_selected", { hostel_slug: item.slug });
                    setStep("category");
                  }}
                  className="flex w-full gap-3 rounded-2xl bg-card p-2.5 text-left ring-1 ring-border transition hover:ring-accent/40"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted-bg">
                    {item.hero_image_url ? (
                      <Image src={item.hero_image_url} alt="" fill className="object-cover" sizes="64px" />
                    ) : null}
                  </div>
                  <div className="min-w-0 py-1">
                    <p className="truncate font-semibold">{item.name}</p>
                    <p className="text-sm text-muted">{item.destination_name}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={() => setSuggestOpen((v) => !v)}
            className="mt-6 text-sm font-semibold text-accent"
          >
            Can&apos;t find it? Suggest a hostel
          </button>

          {suggestOpen ? (
            <div className="mt-3 space-y-3 rounded-2xl bg-muted-bg p-4">
              {suggestSaved ? (
                <p className="text-sm font-medium text-success">
                  Thanks — we&apos;ll review that hostel suggestion.
                </p>
              ) : (
                <>
                  <input
                    value={suggestName}
                    onChange={(e) => setSuggestName(e.target.value)}
                    placeholder="Hostel name"
                    className="h-11 w-full rounded-xl bg-card px-3 text-sm outline-none ring-1 ring-border"
                  />
                  <input
                    value={suggestDestination}
                    onChange={(e) => setSuggestDestination(e.target.value)}
                    placeholder="Destination / city"
                    className="h-11 w-full rounded-xl bg-card px-3 text-sm outline-none ring-1 ring-border"
                  />
                  <textarea
                    value={suggestNotes}
                    onChange={(e) => setSuggestNotes(e.target.value)}
                    placeholder="Anything else? (optional)"
                    rows={3}
                    className="w-full rounded-xl bg-card px-3 py-2 text-sm outline-none ring-1 ring-border"
                  />
                  <button
                    type="button"
                    onClick={() => void submitSuggestion()}
                    className="h-11 w-full rounded-xl bg-foreground text-sm font-bold text-white"
                  >
                    Submit suggestion
                  </button>
                </>
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      {step === "category" ? (
        <section>
          <h1 className="text-2xl font-extrabold tracking-tight">What are you showing?</h1>
          <p className="mt-2 text-sm text-muted">{hostel?.name}</p>
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setCategory(option.value);
                  track("upload_category_selected", { category: option.value });
                  setStep("guidance");
                }}
                className={cn(
                  "min-h-[4.5rem] rounded-2xl bg-card px-3 py-4 text-left text-sm font-semibold ring-1 ring-border transition hover:ring-accent/50",
                  category === option.value && "ring-2 ring-accent",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === "guidance" ? (
        <section>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Give travellers the real picture.
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            Don&apos;t make an ad. Just show what you&apos;d want to see before booking.
          </p>

          <ul className="mt-6 space-y-2 text-sm">
            {[
              "entrance",
              "bed",
              "locker/storage",
              "bathroom",
              "kitchen",
              "common space",
              "social area",
            ].map((shot) => (
              <li key={shot} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent" />
                {shot}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-xs text-muted">
            Target {TARGET_VIDEO_MIN_SECONDS}–{TARGET_VIDEO_MAX_SECONDS}s · max{" "}
            {MAX_VIDEO_SECONDS}s
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,video/mp4,video/quicktime,.mp4,.mov"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void startUpload(file);
            }}
          />

          <button
            type="button"
            disabled={!canChooseVideo || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-white hover:bg-accent-hover disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            Choose video
          </button>
        </section>
      ) : null}

      {step === "uploading" ? (
        <section className="py-8 text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-accent" />
          <h1 className="mt-4 text-xl font-extrabold tracking-tight">
            Uploading your Looksee
          </h1>
          <p className="mt-2 text-3xl font-extrabold tabular-nums text-accent">{progress}%</p>
          <div className="mx-auto mt-5 h-2 max-w-xs overflow-hidden rounded-full bg-muted-bg">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-muted">Keep this screen open until the upload finishes.</p>
        </section>
      ) : null}

      {step === "metadata" ? (
        <section>
          <div className="rounded-2xl bg-accent-soft px-4 py-3 text-sm">
            <p className="font-semibold text-accent">Video uploaded</p>
            <p className="mt-1 text-foreground/80">
              We&apos;re getting your Looksee ready. This usually only takes a moment.
            </p>
            {processingNote ? (
              <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                Processing on Mux…
              </p>
            ) : null}
          </div>

          <h1 className="mt-6 text-xl font-extrabold tracking-tight">
            Anything travellers should know?
          </h1>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, 180))}
            maxLength={180}
            rows={4}
            placeholder="Optional caption"
            className="mt-3 w-full rounded-2xl bg-card px-3 py-3 text-sm outline-none ring-1 ring-border"
          />
          <p className="mt-1 text-right text-xs text-muted">{caption.length}/180</p>

          <label className="mt-4 block text-sm font-semibold">
            Filmed on
            <input
              type="date"
              value={filmedAt}
              max={todayIsoDate()}
              onChange={(e) => setFilmedAt(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl bg-card px-3 text-sm outline-none ring-1 ring-border"
            />
          </label>

          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-bold tracking-tight">Quick rating</h2>
            {(
              [
                ["cleanliness", "Cleanliness"],
                ["sleep", "Sleep"],
                ["social", "Social"],
                ["security", "Security"],
                ["location", "Location"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold">{label}</span>
                  <span className="tabular-nums text-muted">
                    {ratings[key] ? `${ratings[key]}/5` : "Tap a score"}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRatings((r) => ({ ...r, [key]: n }))}
                      className={cn(
                        "h-11 rounded-xl text-sm font-bold ring-1 ring-border",
                        ratings[key] === n
                          ? "bg-accent text-white ring-accent"
                          : "bg-card text-foreground",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">Vibe</span>
                <span className="text-muted">
                  {ratings.vibe_score <= 35
                    ? "Party"
                    : ratings.vibe_score >= 65
                      ? "Chill"
                      : "Mixed"}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={ratings.vibe_score}
                onChange={(e) =>
                  setRatings((r) => ({ ...r, vibe_score: Number(e.target.value) }))
                }
                className="w-full accent-[var(--accent)]"
              />
              <div className="mt-1 flex justify-between text-xs font-medium text-muted">
                <span>Party</span>
                <span>Chill</span>
              </div>
            </div>
          </div>

          {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

          <button
            type="button"
            disabled={submittingMeta}
            onClick={() => void submitMetadata()}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-bold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            {submittingMeta ? "Submitting…" : "Submit Looksee"}
          </button>
        </section>
      ) : null}

      {step === "success" ? (
        <section className="py-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white">
            <Check className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight">Your Looksee is in.</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            Once approved, it&apos;ll help other travellers see what this hostel really looks like.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {hostel ? (
              <Link
                href={`/hostel/${hostel.slug}`}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white hover:bg-accent-hover"
              >
                View hostel
              </Link>
            ) : null}
            <button
              type="button"
              onClick={resetFlow}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-muted-bg text-sm font-bold"
            >
              Upload another
            </button>
            <Link href="/admin" className="text-xs font-medium text-muted underline">
              Admin moderation
            </Link>
          </div>
        </section>
      ) : null}

      {step === "error" ? (
        <section className="py-6">
          <h1 className="text-xl font-extrabold tracking-tight">Upload blocked</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-danger">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStep("guidance");
            }}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-bold text-white"
          >
            Try again
          </button>
        </section>
      ) : null}

      <p className="mt-10 text-center text-[11px] text-muted">
        Real travellers. Recent videos. No marketing spin.
      </p>
    </div>
  );
}
