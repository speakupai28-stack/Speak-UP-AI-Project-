import { Card } from "./Card";

interface SessionPanelProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function SessionPanel({
  title,
  description,
  icon: Icon,
  actions,
  children,
}: SessionPanelProps) {
  return (
    <Card padding="lg" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-maroon/10 text-maroon">
              <Icon size={18} />
            </div>
          )}
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
            {description && (
              <p className="mt-0.5 text-sm text-ink-soft">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      {children}
    </Card>
  );
}
