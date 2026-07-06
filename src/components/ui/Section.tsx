import { clsx } from "clsx";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  width?: "narrow" | "default" | "wide";
  as?: "section" | "div";
  surface?: "paper" | "dim";
}

const widthClasses = {
  narrow: "max-w-2xl",
  default: "max-w-4xl",
  wide: "max-w-6xl",
};

export function Section({
  width = "default",
  as: As = "section",
  surface,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <As
      className={clsx(
        "px-6 py-20 sm:py-28",
        surface === "dim" && "bg-paper-dim",
        className
      )}
      {...props}
    >
      <div className={clsx("mx-auto w-full", widthClasses[width])}>{children}</div>
    </As>
  );
}
