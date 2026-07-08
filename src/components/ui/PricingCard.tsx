import { Check } from "lucide-react";
import { clsx } from "clsx";
import { ButtonLink } from "./Button";
import { UpgradeButton, type PaidTier } from "@/components/UpgradeButton";

interface PricingCardProps {
  name: string;
  price: string;
  cadence?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaTier?: PaidTier;
  featured?: boolean;
  footnote?: string;
}

export function PricingCard({
  name,
  price,
  cadence,
  description,
  features,
  ctaLabel,
  ctaHref,
  ctaTier,
  featured = false,
  footnote,
}: PricingCardProps) {
  return (
    <div
      className={clsx(
        "flex h-full flex-col rounded-lg border p-7",
        featured
          ? "border-maroon bg-ink text-paper shadow-[0.375rem_0.375rem_0_0_var(--maroon)]"
          : "border-ink/10 bg-paper text-ink shadow-[var(--shadow-card)]"
      )}
    >
      {featured && (
        <span className="mb-4 inline-flex w-fit items-center rounded-full bg-maroon px-3 py-1 text-xs font-semibold tracking-wide text-paper">
          Most popular
        </span>
      )}
      <h3 className="font-display text-xl font-semibold">{name}</h3>
      <p
        className={clsx(
          "mt-1 text-sm",
          featured ? "text-paper/70" : "text-ink-soft"
        )}
      >
        {description}
      </p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl font-semibold">{price}</span>
        {cadence && (
          <span className={clsx("text-sm", featured ? "text-paper/60" : "text-stone")}>
            {cadence}
          </span>
        )}
      </div>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check
              size={16}
              className={clsx(
                "mt-0.5 shrink-0",
                featured ? "text-gold" : "text-maroon"
              )}
            />
            <span className={featured ? "text-paper/90" : "text-ink-soft"}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {ctaTier ? (
        <UpgradeButton
          tier={ctaTier}
          variant={featured ? "inverse" : "secondary"}
          size="lg"
          className="mt-7 w-full"
        >
          {ctaLabel}
        </UpgradeButton>
      ) : (
        <ButtonLink
          href={ctaHref}
          variant={featured ? "inverse" : "secondary"}
          size="lg"
          className="mt-7 w-full"
        >
          {ctaLabel}
        </ButtonLink>
      )}

      {footnote && (
        <p
          className={clsx(
            "mt-3 text-center text-xs",
            featured ? "text-paper/50" : "text-stone"
          )}
        >
          {footnote}
        </p>
      )}
    </div>
  );
}
