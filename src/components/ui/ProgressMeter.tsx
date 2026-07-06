import { clsx } from "clsx";

interface ProgressMeterProps {
  value: number;
  max?: number;
  label?: string;
  valueLabel?: string;
  variant?: "maroon" | "gold" | "forest";
  size?: "sm" | "md";
  className?: string;
}

const fillClasses = {
  maroon: "bg-maroon",
  gold: "bg-gold",
  forest: "bg-forest",
};

export function ProgressMeter({
  value,
  max = 100,
  label,
  valueLabel,
  variant = "maroon",
  size = "md",
  className,
}: ProgressMeterProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className={className}>
      {(label || valueLabel) && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink-soft">
          {label && <span className="font-medium">{label}</span>}
          {valueLabel && <span>{valueLabel}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className={clsx(
          "w-full overflow-hidden rounded-full bg-ink/10",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
      >
        <div
          className={clsx(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            fillClasses[variant]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
