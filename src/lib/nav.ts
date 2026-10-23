import { modules, upcoming, lessonKey } from "@/content/curriculum";
import type { ModuleIcon } from "@/content/types";

/** Lagan, serijalizabilan opis kurikuluma za navigaciju i pretragu (client komponente). */
export interface NavLesson {
  key: string;
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  href: string;
  cardIds: string[];
  exerciseIds: string[];
}

export interface NavModule {
  slug: string;
  index: number;
  title: string;
  tagline: string;
  icon: ModuleIcon;
  hue: string;
  href: string;
  lessons: NavLesson[];
  upcoming?: boolean;
  topics?: string[];
}

export function getNav(): NavModule[] {
  const active: NavModule[] = modules.map((m) => ({
    slug: m.slug,
    index: m.index,
    title: m.title,
    tagline: m.tagline,
    icon: m.icon,
    hue: m.hue,
    href: `/learn/${m.slug}`,
    lessons: m.lessons.map((l) => ({
      key: lessonKey(m.slug, l.slug),
      slug: l.slug,
      title: l.title,
      summary: l.summary,
      minutes: l.minutes,
      href: `/learn/${m.slug}/${l.slug}`,
      cardIds: l.flashcards.map((c) => c.id),
      exerciseIds: l.blocks.flatMap((b) => (b.kind === "exercise" ? [b.id] : [])),
    })),
  }));
  const soon: NavModule[] = upcoming.map((m) => ({
    slug: m.slug,
    index: m.index,
    title: m.title,
    tagline: m.tagline,
    icon: m.icon,
    hue: m.hue,
    href: `/#mapa`,
    lessons: [],
    upcoming: true,
    topics: m.topics,
  }));
  return [...active, ...soon];
}

export const pad = (n: number) => String(n).padStart(2, "0");
