import { Info, Lightbulb, Shapes, TriangleAlert } from "lucide-react";
import { Md, MdInline } from "@/components/ui/md";
import type { CalloutBlock, CodeBlock } from "@/content/types";
import { highlightToHtml } from "@/lib/highlight";
import { CopyButton } from "./copy-button";

const LANG_LABEL: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  jsx: "JSX",
  json: "JSON",
  bash: "Terminal",
  css: "CSS",
  html: "HTML",
  python: "Python",
  text: "Tekst",
};

export async function CodeView({ block }: { block: CodeBlock }) {
  const html = await highlightToHtml(block.code, block.lang, block.highlight);
  return (
    <figure className="my-7">
      <div className="overflow-hidden rounded-xl border border-line bg-code shadow-card">
        <div className="flex h-10 items-center justify-between border-b border-line bg-subtle/40 pr-2 pl-4">
          <div className="flex items-center gap-2 text-[12.5px]">
            <span className="font-mono text-muted">{block.filename ?? LANG_LABEL[block.lang]}</span>
            {block.filename && <span className="text-faint">· {LANG_LABEL[block.lang]}</span>}
          </div>
          <CopyButton text={block.code} />
        </div>
        <div className="code-static" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      {block.caption && (
        <figcaption className="mt-2.5 px-1 text-[13.5px] leading-relaxed text-muted">
          <MdInline>{block.caption}</MdInline>
        </figcaption>
      )}
    </figure>
  );
}

const TONES = {
  info: { icon: Info, color: "var(--info)", label: "Dobro je znati" },
  tip: { icon: Lightbulb, color: "var(--success)", label: "Savet" },
  warn: { icon: TriangleAlert, color: "var(--warn)", label: "Pazi" },
  analogy: { icon: Shapes, color: "#a78bfa", label: "Zamisli ovako" },
} as const;

export function CalloutView({ block }: { block: CalloutBlock }) {
  const tone = TONES[block.tone];
  const Icon = tone.icon;
  return (
    <aside
      className="my-7 rounded-xl border p-4 pr-5 sm:p-5"
      style={{
        borderColor: `color-mix(in oklab, ${tone.color} 26%, transparent)`,
        background: `color-mix(in oklab, ${tone.color} 7%, transparent)`,
      }}
    >
      <div className="flex gap-3.5">
        <span
          className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg"
          style={{ color: tone.color, background: `color-mix(in oklab, ${tone.color} 14%, transparent)` }}
        >
          <Icon size={15} strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[13px] font-semibold" style={{ color: `color-mix(in oklab, ${tone.color} 75%, var(--fg))` }}>
            {block.title ?? tone.label}
          </div>
          <Md tight>{block.md}</Md>
        </div>
      </div>
    </aside>
  );
}
