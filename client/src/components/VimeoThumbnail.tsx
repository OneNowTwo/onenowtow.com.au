/** Lightweight Vimeo thumbnail — avoids loading the player until the user engages. */
export function vimeoThumbUrl(vimeoId: string) {
  return `https://vumbnail.com/${vimeoId}.jpg`;
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
  return (
    <div className={`aspect-video relative overflow-hidden bg-[var(--surface)] ${className}`}>
      <img
        src={vimeoThumbUrl(vimeoId)}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        decoding="async"
      />
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
