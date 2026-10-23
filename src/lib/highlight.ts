import "server-only";
import { createHighlighter, type Highlighter } from "shiki";
import type { CodeLang } from "@/content/types";

const THEMES = { light: "vitesse-light", dark: "vitesse-dark" } as const;
const LANGS = ["ts", "tsx", "js", "jsx", "json", "bash", "css", "html", "python"];

let highlighter: Promise<Highlighter> | undefined;
const getHighlighter = () =>
  (highlighter ??= createHighlighter({ themes: Object.values(THEMES), langs: LANGS }));

const shikiLang = (lang: CodeLang) => (lang === "text" ? "text" : lang);

/** HTML sa bojama za obe teme (CSS promenljive --shiki-light / --shiki-dark). */
export async function highlightToHtml(code: string, lang: CodeLang, highlight: number[] = []) {
  "use cache";
  const hl = await getHighlighter();
  return hl.codeToHtml(code.replace(/\n$/, ""), {
    lang: shikiLang(lang),
    themes: THEMES,
    defaultColor: false,
    transformers: [
      {
        line(node, line) {
          if (highlight.includes(line)) this.addClassToHast(node, "hl");
        },
      },
    ],
  });
}

export interface Token {
  content: string;
  light?: string;
  dark?: string;
}

/** Tokeni po linijama, za interaktivni prikaz koda (korak-po-korak objašnjenja). */
export async function highlightToTokens(code: string, lang: CodeLang): Promise<Token[][]> {
  "use cache";
  const hl = await getHighlighter();
  const { tokens } = hl.codeToTokens(code.replace(/\n$/, ""), {
    lang: shikiLang(lang),
    themes: THEMES,
    defaultColor: false,
  });
  return tokens.map((line) =>
    line.map((t) => {
      const style = (t.htmlStyle ?? {}) as Record<string, string>;
      return { content: t.content, light: style["--shiki-light"], dark: style["--shiki-dark"] };
    }),
  );
}
