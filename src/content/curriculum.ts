import type { Lesson, Module, ProjectId, UpcomingModule } from "./types";
import osnove from "./modules/00-osnove";
import javascript from "./modules/01-javascript";
import typescript from "./modules/02-typescript";
import react from "./modules/03-react";

export const modules: Module[] = [osnove, javascript, typescript, react];

export const upcoming: UpcomingModule[] = [
  {
    slug: "stil-i-stanje",
    index: 4,
    title: "Stil i stanje",
    tagline: "Tailwind CSS, Zustand i rutiranje",
    icon: "palette",
    hue: "#f472b6",
    projects: ["ReformStudio", "PlazaHome", "Pasted"],
    topics: ["Tailwind klase", "Responsive dizajn", "Zustand store", "react-router-dom"],
  },
  {
    slug: "nextjs",
    index: 5,
    title: "Next.js",
    tagline: "App Router, server i client komponente",
    icon: "layers",
    hue: "#e4e4e7",
    projects: ["PlazaHome", "Pasted", "my-portfolio"],
    topics: ["Rute i layout-i", "Server vs client", "Statički export", "Metadata i SEO", "Slike i fontovi"],
  },
  {
    slug: "firebase",
    index: 6,
    title: "Backend sa Firebase-om",
    tagline: "Baza, autentifikacija, pravila i funkcije",
    icon: "flame",
    hue: "#fb923c",
    projects: ["ReformStudio"],
    topics: ["Firestore", "Auth", "Security Rules", "Cloud Functions", "Storage", "Emulatori", "Slanje mejlova"],
  },
  {
    slug: "deploy",
    index: 7,
    title: "Deploy",
    tagline: "Kako aplikacija stiže na internet",
    icon: "rocket",
    hue: "#a78bfa",
    projects: ["my-portfolio", "PlazaHome", "milenaspajic"],
    topics: ["Vercel", "Cloudflare Workers i wrangler", "OpenNext", "Env promenljive", "Domeni"],
  },
  {
    slug: "testiranje",
    index: 8,
    title: "Testiranje",
    tagline: "Kod koji proverava kod",
    icon: "flask",
    hue: "#a3e635",
    projects: ["ReformStudio", "Looply"],
    topics: ["Vitest", "Jest", "Testovi Firestore pravila", "Šta i koliko testirati"],
  },
  {
    slug: "mobilne",
    index: 9,
    title: "Mobilne aplikacije",
    tagline: "React Native i Expo",
    icon: "smartphone",
    hue: "#2dd4bf",
    projects: ["Looply"],
    topics: ["React Native komponente", "expo-router", "SQLite", "Notifikacije", "Prevodi (i18n)"],
  },
  {
    slug: "animacije",
    index: 10,
    title: "Animacije i video",
    tagline: "GSAP, Lenis, Remotion i Three.js",
    icon: "sparkles",
    hue: "#fb7185",
    projects: ["milenaspajic", "Pasted", "vaky-content"],
    topics: ["GSAP i ScrollTrigger", "Lenis smooth scroll", "Remotion video", "Three.js i R3F", "d3-geo mape"],
  },
  {
    slug: "ai",
    index: 11,
    title: "AI u aplikaciji",
    tagline: "Claude API u tvom kodu",
    icon: "bot",
    hue: "#fbbf24",
    projects: ["my-portfolio"],
    topics: ["Anthropic SDK", "Streaming odgovora", "Pisanje promptova", "API ključevi i bezbednost"],
  },
];

export const projectInfo: Record<ProjectId, { label: string; kind: string }> = {
  ReformStudio: { label: "Reform Studio", kind: "PWA za rezervacije · React + Firebase" },
  Looply: { label: "Looply", kind: "Mobilna app · Expo + React Native" },
  PlazaHome: { label: "Plaza Home", kind: "Sajt · Next.js" },
  Pasted: { label: "Pasted", kind: "Sajt · Next.js + GSAP" },
  "my-portfolio": { label: "Portfolio", kind: "Next.js na Cloudflare-u + Claude API" },
  "vaky-content": { label: "Vaky Content", kind: "Video · Remotion + Three.js" },
  milenaspajic: { label: "Milena Spajić", kind: "Sajt · Vite + GSAP" },
  Bojanka: { label: "Bojanka", kind: "PDF generator · Python" },
};

export const lessonKey = (moduleSlug: string, lessonSlug: string) => `${moduleSlug}/${lessonSlug}`;

export interface LessonRef {
  key: string;
  module: Module;
  lesson: Lesson;
  /** Redni broj lekcije u modulu, od 1. */
  number: number;
}

export const allLessons: LessonRef[] = modules.flatMap((module) =>
  module.lessons.map((lesson, i) => ({
    key: lessonKey(module.slug, lesson.slug),
    module,
    lesson,
    number: i + 1,
  })),
);

export function getModule(slug: string) {
  return modules.find((m) => m.slug === slug);
}

export function getLessonRef(moduleSlug: string, lessonSlug: string) {
  const i = allLessons.findIndex((l) => l.key === lessonKey(moduleSlug, lessonSlug));
  if (i === -1) return undefined;
  return { ref: allLessons[i], prev: allLessons[i - 1], next: allLessons[i + 1] };
}

export const lessonHref = (ref: { module: Module; lesson: Lesson }) =>
  `/learn/${ref.module.slug}/${ref.lesson.slug}`;
