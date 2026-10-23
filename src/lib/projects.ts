import type { ProjectId } from "@/content/types";

const HOME = "/Users/toshkee";

const ROOTS: Record<ProjectId, string> = {
  ReformStudio: `${HOME}/ReformStudio`,
  Looply: `${HOME}/Looply`,
  PlazaHome: `${HOME}/PlazaHome`,
  Pasted: `${HOME}/Pasted`,
  "my-portfolio": `${HOME}/my-portfolio`,
  "vaky-content": `${HOME}/vaky-content`,
  milenaspajic: `${HOME}/milenaspajic`,
  Bojanka: `${HOME}/Desktop/Bojanka/bojanka`,
};

/** Link koji otvara fajl na tačnoj liniji u VS Code-u. */
export const editorHref = (project: ProjectId, file: string, line = 1) =>
  `vscode://file${ROOTS[project]}/${file}:${line}`;
