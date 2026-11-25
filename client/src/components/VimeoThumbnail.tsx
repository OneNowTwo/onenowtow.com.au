import { useEffect, useState } from "react";

/** Lightweight Vimeo thumbnail — avoids loading the player until the user engages. */
export function vimeoThumbUrl(vimeoId: string) {
  return `/media/thumbs/${vimeoId}.jpg`;
}

export function VimeoThumbnail({
  vimeoId,
  title,
  className = "",
  size = "card",
  showPlay = true,
}: {
  vimeoId: string;
  title: string;
  className?: string;
  size?: "card" | "player";
  showPlay?: boolean;
}) {
  const [thumbnail, setThumbnail] = useState(vimeoThumbUrl(vimeoId));
  const [missingThumbnail, setMissingThumbnail] = useState(false);

  useEffect(() => {
    setThumbnail(vimeoThumbUrl(vimeoId));
    setMissingThumbnail(false);
  }, [vimeoId]);

  const onThumbnailError = () => {
    if (thumbnail !== vimeoThumbUrl(vimeoId)) {
      setMissingThumbnail(true);
      return;
    }

    // Older films have local stills. For new Vimeo uploads, try the
    // official oEmbed thumbnail before falling back to an intentional tile.
    fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${vimeoId}`)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Vimeo thumbnail unavailable");
        return response.json() as Promise<{ thumbnail_url?: string }>;
      })
      .then((data) => {
        if (!data.thumbnail_url) throw new Error("Vimeo thumbnail missing");
        setThumbnail(data.thumbnail_url.replace(/_\d+x\d+/, "_1280x720"));
      })
      .catch(() => setMissingThumbnail(true));
  };

  return (
    <div className={`aspect-video relative overflow-hidden bg-[var(--surface)] ${className}`}>
      {missingThumbnail ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--navy)] px-6 text-center">
          <span className="font-serif text-lg md:text-xl text-white leading-snug">{title}</span>
        </div>
      ) : (
        <img
          src={thumbnail}
          alt={title}
          onError={onThumbnailError}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
      )}
      {showPlay && (
        <>
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <span
              className={`inline-flex items-center justify-center rounded-full bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.45)] group-hover:scale-105 transition-transform ${
                size === "player"
                  ? "h-20 w-20 md:h-24 md:w-24"
                  : "h-16 w-16 md:h-[4.5rem] md:w-[4.5rem]"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`ml-1 ${size === "player" ? "w-9 h-9 md:w-11 md:h-11" : "w-7 h-7 md:w-8 md:h-8"}`}
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5.5v13l11-6.5L8 5.5z" />
              </svg>
            </span>
            <span
              className={`text-white font-semibold tracking-[0.18em] uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] ${
                size === "player" ? "text-sm md:text-base" : "text-xs md:text-sm"
              }`}
            >
              Play
            </span>
          </div>
        </>
      )}
    </div>
  );
}
