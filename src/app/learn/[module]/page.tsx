import { Clock, FolderGit2, Layers } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ModuleLessons } from "@/components/module/module-lessons";
import { ModuleBadge } from "@/components/ui/module-icon";
import { getModule, modules, projectInfo } from "@/content/curriculum";
import { getNav, pad } from "@/lib/nav";
import { plural } from "@/lib/plural";

export function generateStaticParams() {
  return modules.map((m) => ({ module: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[module]">): Promise<Metadata> {
  const m = getModule((await params).module);
  return m ? { title: m.title, description: m.tagline } : {};
}

export default function ModulePage({ params }: PageProps<"/learn/[module]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[920px] px-5 pt-16"><div className="h-40 animate-pulse rounded-2xl bg-subtle" /></div>}>
      <ModuleContent params={params} />
    </Suspense>
  );
}

async function ModuleContent({ params }: Pick<PageProps<"/learn/[module]">, "params">) {
  const { module: slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();
  const nav = getNav().find((m) => m.slug === slug)!;
  const minutes = mod.lessons.reduce((n, l) => n + l.minutes, 0);
  const projects = [...new Set(mod.lessons.flatMap((l) => l.projects))];

  return (
    <div className="relative" style={{ "--hue": mod.hue } as React.CSSProperties}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[480px] overflow-hidden">
        <div
          className="absolute -top-44 left-1/2 h-[460px] w-[1000px] -translate-x-1/2 rounded-full opacity-[0.16] blur-[100px]"
          style={{ background: `radial-gradient(closest-side, ${mod.hue}, transparent)` }}
        />
        <div className="dot-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      </div>

      <div className="relative mx-auto max-w-[920px] px-5 pt-12 pb-24 sm:px-8 lg:pt-20">
        <header className="animate-fade-up">
          <div className="flex items-center gap-3">
            <ModuleBadge name={mod.icon} hue={mod.hue} size={44} />
            <span className="font-mono text-[13px] text-faint">Modul {pad(mod.index)}</span>
          </div>
          <h1 className="mt-6 font-display text-[54px] leading-[0.98] tracking-[-0.02em] sm:text-[76px]">{mod.title}</h1>
          <p className="mt-3 text-[20px] text-hue-strong">{mod.tagline}</p>
          <p className="mt-5 max-w-[62ch] text-[16.5px] leading-relaxed text-muted">{mod.description}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-[13px] text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-elev/60 px-2.5 py-1">
              <Layers size={13} className="opacity-70" /> {mod.lessons.length}{" "}
              {plural(mod.lessons.length, "lekcija", "lekcije", "lekcija")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-elev/60 px-2.5 py-1">
              <Clock size={13} className="opacity-70" /> ~{minutes} min
            </span>
            {projects.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-hue-soft bg-hue-soft px-2.5 py-1 text-hue-strong">
                <FolderGit2 size={13} className="opacity-70" /> {projectInfo[p].label}
              </span>
            ))}
          </div>
        </header>

        <ModuleLessons module={nav} />
      </div>
    </div>
  );
}
