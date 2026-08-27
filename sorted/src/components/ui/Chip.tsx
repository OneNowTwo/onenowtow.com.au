import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ChipProps = {
  selected?: boolean;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function Chip({ selected, children, onClick, disabled, className }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-ink-soft hover:border-foreground/30",
        disabled && "opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
