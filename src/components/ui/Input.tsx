import { clsx } from "clsx";

const fieldClasses =
  "w-full rounded-md border border-stone-light bg-paper px-4 py-3 text-ink placeholder:text-stone outline-none transition-colors focus:border-maroon focus:ring-1 focus:ring-maroon disabled:cursor-not-allowed disabled:opacity-50";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(fieldClasses, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={clsx(fieldClasses, "resize-y", className)} {...props} />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={clsx("mb-2 block text-sm font-medium text-ink-soft", className)}
      {...props}
    />
  );
}
