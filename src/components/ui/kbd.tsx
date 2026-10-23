import { cn } from "@/lib/cn";

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-strong bg-elev px-1 font-mono text-[11px] leading-none font-medium text-muted shadow-[0_1px_0_var(--line-strong)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
