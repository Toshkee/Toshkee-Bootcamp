"use client";

import { Command } from "cmdk";
import { ArrowRight, Check, Home, Repeat2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ModuleBadge } from "@/components/ui/module-icon";
import { Kbd } from "@/components/ui/kbd";
import type { NavModule } from "@/lib/nav";
import { pad } from "@/lib/nav";
import { useProgress } from "@/lib/progress";

export function CommandPalette({
  nav,
  open,
  onOpenChange,
}: {
  nav: NavModule[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const completed = useProgress((s) => s.completed);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const itemClass =
    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-muted data-[selected=true]:bg-subtle data-[selected=true]:text-fg";

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Pretraga"
      loop
      overlayClassName="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] animate-[fade-up_0.2s_ease-out]"
      contentClassName="fixed left-1/2 top-[14vh] z-50 w-[min(640px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-2xl border border-line-strong bg-elev shadow-card animate-pop"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Command.Input
          autoFocus
          placeholder="Traži lekciju, modul ili temu…"
          className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
        />
        <Kbd>esc</Kbd>
      </div>
      <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-10 text-center text-sm text-faint">Ništa nije pronađeno.</Command.Empty>

        <Command.Group heading="Stranice" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-faint [&_[cmdk-group-heading]]:uppercase">
          <Command.Item value="pocetna početna home dashboard" onSelect={() => go("/")} className={itemClass}>
            <Home size={16} className="text-faint" /> Početna
          </Command.Item>
          <Command.Item value="ponavljanje kartice review flashcards" onSelect={() => go("/review")} className={itemClass}>
            <Repeat2 size={16} className="text-faint" /> Ponavljanje kartica
          </Command.Item>
        </Command.Group>

        {nav
          .filter((m) => !m.upcoming && m.lessons.length > 0)
          .map((m) => (
            <Command.Group
              key={m.slug}
              heading={`${pad(m.index)} · ${m.title}`}
              className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-faint [&_[cmdk-group-heading]]:uppercase"
            >
              {m.lessons.map((l) => (
                <Command.Item
                  key={l.key}
                  value={`${m.title} ${l.title} ${l.summary}`}
                  onSelect={() => go(l.href)}
                  className={itemClass}
                >
                  <ModuleBadge name={m.icon} hue={m.hue} size={22} />
                  <span className="flex-1 truncate">{l.title}</span>
                  {completed[l.key] ? (
                    <Check size={14} className="text-success" />
                  ) : (
                    <span className="text-[12px] text-faint tabular-nums">{l.minutes} min</span>
                  )}
                  <ArrowRight size={14} className="text-faint opacity-0 [[data-selected=true]_&]:opacity-100" />
                </Command.Item>
              ))}
            </Command.Group>
          ))}
      </Command.List>
      <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[12px] text-faint">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> biraj
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd> otvori
        </span>
      </div>
    </Command.Dialog>
  );
}
