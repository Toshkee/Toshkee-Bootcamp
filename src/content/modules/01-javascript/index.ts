import type { Module } from "@/content/types";
import promenljive from "./01-promenljive";
import funkcije from "./02-funkcije";
import objekti from "./03-objekti-i-nizovi";
import metodeNizova from "./04-metode-nizova";
import moduli from "./05-moduli";
import asyncAwait from "./06-async-await";

const javascript: Module = {
  slug: "javascript",
  index: 1,
  title: "JavaScript",
  tagline: "Jezik na kome stoji sve ostalo",
  description:
    "TypeScript je JavaScript sa tipovima, pa prvo ide JavaScript: promenljive, funkcije, objekti i nizovi, metode nizova, moduli i asinhroni kod. Sve na primerima iz tvojih projekata.",
  icon: "braces",
  hue: "#facc15",
  lessons: [promenljive, funkcije, objekti, metodeNizova, moduli, asyncAwait],
};

export default javascript;
