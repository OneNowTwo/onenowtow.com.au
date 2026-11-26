"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function FoodImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        className={cn("absolute inset-0 bg-muted-bg", className)}
        role="img"
        aria-label={alt || "Dinner photo unavailable"}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
