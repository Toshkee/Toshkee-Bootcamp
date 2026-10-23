import type { Module } from "@/content/types";
import terminal from "./01-terminal";
import nodeINpm from "./02-node-i-npm";
import git from "./03-git";
import anatomijaProjekta from "./04-anatomija-projekta";

const osnove: Module = {
  slug: "osnove",
  index: 0,
  title: "Osnove: alat i okruženje",
  tagline: "Terminal, npm, git i kako je projekat složen",
  description:
    "Pre koda dolazi alat. Ovde učiš da koristiš terminal, šta rade npm i package.json, kako git pamti istoriju i šta je svaki fajl u korenu tvojih projekata.",
  icon: "terminal",
  hue: "#34d399",
  lessons: [terminal, nodeINpm, git, anatomijaProjekta],
};

export default osnove;
