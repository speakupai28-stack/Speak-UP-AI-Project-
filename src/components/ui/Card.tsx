import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg" | "none";
  interactive?: boolean;
  surface?: "paper" | "dim";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  padding = "md",
  interactive = false,
  surface = "paper",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-lg border",
        surface === "paper" ? "bg-paper border-ink/10" : "bg-paper-dim border-ink/10",
        "shadow-[var(--shadow-card)]",
        interactive &&
          "transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
