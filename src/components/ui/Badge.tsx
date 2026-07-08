import { clsx } from "clsx";

export type BadgeVariant = "neutral" | "maroon" | "gold" | "forest";

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-ink/5 text-ink-soft border-ink/10",
  maroon: "bg-maroon/10 text-maroon border-maroon/20",
  gold: "bg-gold/10 text-[#8a6b28] border-gold/25",
  forest: "bg-forest/10 text-forest border-forest/20",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  variant = "neutral",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
