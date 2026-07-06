import { clsx } from "clsx";
import { Skeleton } from "./Skeleton";
import { LoadingSequence } from "./LoadingSequence";

interface FeedbackSkeletonProps {
  messages: string[];
  rows?: number;
  className?: string;
}

export function FeedbackSkeleton({
  messages,
  rows = 4,
  className,
}: FeedbackSkeletonProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-5 rounded-lg border border-ink/10 bg-paper p-6 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton
            key={i}
            className={clsx("h-3", i === rows - 1 ? "w-2/3" : "w-full")}
          />
        ))}
      </div>
      <LoadingSequence
        messages={messages}
        className="text-center text-xs font-medium text-stone"
      />
    </div>
  );
}
