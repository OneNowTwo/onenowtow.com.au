import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export const buttonClasses = {
  base: "inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition disabled:cursor-not-allowed disabled:opacity-50",
  sizes: {
    lg: "h-12 px-7 text-base",
    md: "h-11 px-5 text-sm",
    sm: "h-9 px-4 text-sm",
  },
  variants: {
    primary: "cursor-pointer bg-accent text-white hover:bg-accent-hover",
    secondary:
      "cursor-pointer border border-foreground/15 bg-card text-foreground hover:border-foreground/40 hover:bg-muted-bg",
    ghost: "cursor-pointer text-ink-soft hover:bg-muted-bg hover:text-foreground",
    danger: "cursor-pointer bg-danger text-white hover:opacity-90",
    inverse: "cursor-pointer bg-card text-foreground hover:bg-white",
  },
} as const;

type Variant = keyof typeof buttonClasses.variants;
type Size = keyof typeof buttonClasses.sizes;

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(
    buttonClasses.base,
    buttonClasses.sizes[size],
    buttonClasses.variants[variant],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  className,
  variant = "primary",
  size = "md",
  children,
  onClick,
  target,
  rel,
}: {
  href: string;
  className?: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  onClick?: () => void;
  target?: string;
  rel?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      className={buttonClassName({ variant, size, className })}
    >
      {children}
    </Link>
  );
}
