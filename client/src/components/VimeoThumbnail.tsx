import { useEffect, useState } from "react";

/** Lightweight Vimeo thumbnail — avoids loading the player until the user engages. */
export function vimeoThumbUrl(vimeoId: string) {
  return `/media/thumbs/${vimeoId}.jpg`;
}

export function VimeoThumbnail({
  vimeoId,
  title,
  className = "",
}: {
  vimeoId: string;
  title: string;
  className?: string;
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
        setThumbnail(data.thumbnail_url);
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
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/92 text-[var(--navy)] shadow-sm">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 ml-0.5"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5.5v13l11-6.5L8 5.5z" />
          </svg>
        </span>
      </div>
    </div>
  );
}
