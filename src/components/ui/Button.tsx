import Link from "next/link";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-maroon text-paper hover:bg-maroon-dark",
  secondary:
    "border border-ink/25 text-ink bg-transparent hover:border-ink hover:bg-ink/5",
  ghost: "text-ink-soft hover:text-ink hover:bg-ink/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-14 px-8 text-base gap-2",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return clsx(
    "inline-flex items-center justify-center rounded-md font-semibold whitespace-nowrap transition-colors duration-150",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
