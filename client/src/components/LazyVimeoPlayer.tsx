import { useState } from "react";
import { VimeoThumbnail } from "@/components/VimeoThumbnail";

/** Loads the Vimeo player only after the user clicks play. */
export function LazyVimeoPlayer({
  vimeoId,
  title,
}: {
  vimeoId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="block w-full text-left group cursor-pointer border-0 p-0 bg-transparent"
        aria-label={`Play ${title}`}
      >
        <VimeoThumbnail vimeoId={vimeoId} title={title} className="rounded-lg" />
      </button>
    );
  }

  return (
    <div className="aspect-video bg-[var(--surface)] rounded-lg overflow-hidden relative">
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title}
      />
    </div>
  );
}
