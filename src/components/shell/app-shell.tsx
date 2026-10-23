"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { NavModule } from "@/lib/nav";
import { useProgress } from "@/lib/progress";
import { CommandPalette } from "./command-palette";
import { Logo, Sidebar } from "./sidebar";

export function AppShell({ nav, children }: { nav: NavModule[]; children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const touch = useProgress((s) => s.touch);

  useEffect(() => {
    touch();
  }, [touch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[272px] shrink-0 border-r border-line bg-bg lg:block">
        <Sidebar nav={nav} onSearch={() => setSearchOpen(true)} />
      </aside>

      {/* Mobilni: gornja traka + fioka */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-bg/80 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={26} />
          <span className="text-[15px] font-semibold tracking-tight">Bootcamp</span>
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="grid size-9 place-items-center rounded-lg border border-line text-muted"
          aria-label="Otvori meni"
        >
          <Menu size={18} />
        </button>
      </div>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity lg:hidden",
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[300px] max-w-[85vw] border-r border-line bg-bg shadow-card transition-transform duration-300 ease-out lg:hidden",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="absolute top-4 right-3 grid size-8 place-items-center rounded-lg text-faint hover:text-fg"
          aria-label="Zatvori meni"
        >
          <X size={18} />
        </button>
        <Sidebar
          nav={nav}
          onSearch={() => {
            setDrawerOpen(false);
            setSearchOpen(true);
          }}
          onNavigate={() => setDrawerOpen(false)}
        />
      </aside>

      <main className="min-w-0 flex-1 pt-14 lg:pt-0">{children}</main>

      <CommandPalette nav={nav} open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
