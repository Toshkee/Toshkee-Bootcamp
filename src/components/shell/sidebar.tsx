"use client";

import { Check, ChevronRight, Home, Lock, Repeat2, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { ModuleBadge } from "@/components/ui/module-icon";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/cn";
import type { NavModule } from "@/lib/nav";
import { pad } from "@/lib/nav";
import { useProgress } from "@/lib/progress";
import { useIsClient } from "@/lib/use-is-client";
import { useNow } from "@/lib/use-now";
import { ThemeToggle } from "./theme";

export function Sidebar({
  nav,
  onSearch,
  onNavigate,
}: {
  nav: NavModule[];
  onSearch: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const ready = useIsClient();
  const completed = useProgress((s) => s.completed);
  const cards = useProgress((s) => s.cards);

  const now = useNow();
  const dueCount = useMemo(
    () => (ready ? Object.values(cards).filter((c) => c.due <= now).length : 0),
    [cards, ready, now],
  );

  const active = nav.filter((m) => !m.upcoming);
  const soon = nav.filter((m) => m.upcoming);
  const currentModule = pathname.split("/")[2];

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const isOpen = (slug: string) => open[slug] ?? slug === currentModule;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
        <Link href="/" onClick={onNavigate} className="group flex items-center gap-2.5">
          <Logo />
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight">Bootcamp</div>
            <div className="text-[11.5px] text-faint">tvoj kod, tvoj tempo</div>
          </div>
        </Link>
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={onSearch}
          className="flex h-9 w-full items-center gap-2 rounded-lg border border-line bg-subtle/60 px-2.5 text-[13px] text-faint transition-colors hover:border-line-strong hover:text-muted"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Pretraži lekcije…</span>
          <Kbd>⌘K</Kbd>
        </button>
      </div>

      <nav className="mt-3 flex flex-col gap-0.5 px-3">
        <NavItem href="/" icon={<Home size={15} />} active={pathname === "/"} onClick={onNavigate}>
          Početna
        </NavItem>
        <NavItem
          href="/review"
          icon={<Repeat2 size={15} />}
          active={pathname === "/review"}
          onClick={onNavigate}
          badge={dueCount > 0 ? dueCount : undefined}
        >
          Ponavljanje
        </NavItem>
      </nav>

      <div className="mt-5 flex-1 overflow-y-auto px-3 pb-4">
        <SectionLabel>Moduli</SectionLabel>
        <ul className="flex flex-col gap-0.5">
          {active.map((m) => {
            const done = m.lessons.filter((l) => completed[l.key]).length;
            const total = m.lessons.length;
            const expanded = isOpen(m.slug);
            return (
              <li key={m.slug} style={{ "--hue": m.hue } as React.CSSProperties}>
                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [m.slug]: !expanded }))}
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13.5px] transition-colors hover:bg-subtle",
                    currentModule === m.slug ? "text-fg" : "text-muted",
                  )}
                  aria-expanded={expanded}
                >
                  <ModuleBadge name={m.icon} hue={m.hue} size={24} />
                  <span className="flex-1 truncate font-medium">
                    <span className="mr-1.5 font-mono text-[11px] text-faint">{pad(m.index)}</span>
                    {m.title}
                  </span>
                  {ready && total > 0 && (
                    <ProgressRing value={done / total} size={16} stroke={2.25}>
                      {done === total && <Check size={8} strokeWidth={4} className="text-hue-strong" />}
                    </ProgressRing>
                  )}
                  <ChevronRight
                    size={14}
                    className={cn("text-faint transition-transform duration-200", expanded && "rotate-90")}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <ul className="overflow-hidden">
                    <li className="relative ml-[19px] border-l border-line py-1 pl-3">
                      <Link
                        href={m.href}
                        onClick={onNavigate}
                        className={cn(
                          "block rounded-md px-2 py-1 text-[12.5px] transition-colors hover:text-fg",
                          pathname === m.href ? "text-fg" : "text-faint",
                        )}
                      >
                        Pregled modula
                      </Link>
                      {m.lessons.length === 0 && (
                        <span className="block px-2 py-1 text-[12.5px] text-faint italic">Lekcije stižu…</span>
                      )}
                      {m.lessons.map((l, i) => {
                        const isActive = pathname === l.href;
                        const isDone = ready && !!completed[l.key];
                        return (
                          <Link
                            key={l.key}
                            href={l.href}
                            onClick={onNavigate}
                            className={cn(
                              "relative flex items-center gap-2 rounded-md px-2 py-1 text-[13px] transition-colors",
                              isActive ? "bg-hue-soft text-fg" : "text-muted hover:bg-subtle hover:text-fg",
                            )}
                          >
                            {isActive && (
                              <span className="absolute top-1.5 bottom-1.5 -left-[13px] w-[2px] rounded-full bg-hue" />
                            )}
                            <span
                              className={cn(
                                "grid size-4 shrink-0 place-items-center rounded-full border text-[9px] font-semibold",
                                isDone
                                  ? "border-transparent bg-hue text-bg"
                                  : isActive
                                    ? "border-hue text-hue-strong"
                                    : "border-line-strong text-faint",
                              )}
                            >
                              {isDone ? <Check size={10} strokeWidth={3.5} /> : i + 1}
                            </span>
                            <span className="truncate">{l.title}</span>
                          </Link>
                        );
                      })}
                    </li>
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>

        <SectionLabel className="mt-5">Uskoro</SectionLabel>
        <ul className="flex flex-col gap-0.5">
          {soon.map((m) => (
            <li key={m.slug}>
              <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] text-faint" title={m.tagline}>
                <ModuleBadge name={m.icon} hue={m.hue} size={24} dim />
                <span className="flex-1 truncate">
                  <span className="mr-1.5 font-mono text-[11px]">{pad(m.index)}</span>
                  {m.title}
                </span>
                <Lock size={12} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <span className="text-[12px] text-faint">Tema</span>
        <ThemeToggle />
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  active,
  children,
  badge,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  active: boolean;
  children: React.ReactNode;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13.5px] font-medium transition-colors",
        active ? "bg-subtle text-fg" : "text-muted hover:bg-subtle hover:text-fg",
      )}
    >
      <span className={active ? "text-fg" : "text-faint"}>{icon}</span>
      <span className="flex-1">{children}</span>
      {badge !== undefined && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-fg px-1.5 text-[11px] font-semibold text-bg tabular-nums">
          {badge}
        </span>
      )}
    </Link>
  );
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-1.5 px-2 text-[11px] font-medium tracking-[0.08em] text-faint uppercase", className)}>
      {children}
    </div>
  );
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span
      className="relative grid place-items-center overflow-hidden rounded-[9px] bg-fg text-bg shadow-sm"
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "conic-gradient(from 200deg at 70% 30%, #34d399, #facc15, #4f8ff7, #22d3ee, #fb923c, #a78bfa, #34d399)",
        }}
      />
      <span className="absolute inset-[1.5px] rounded-[7.5px] bg-fg" />
      <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} className="relative" fill="none">
        <path d="M8 7 3 12l5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m16 7 5 5-5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m13.5 5-3 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
      </svg>
    </span>
  );
}
