import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";
import { slugify } from "@/lib/slug";

type HastNode = { type: string; value?: string; children?: HastNode[] };
const textOf = (node?: HastNode): string =>
  !node ? "" : node.type === "text" ? (node.value ?? "") : (node.children ?? []).map(textOf).join("");

const blockComponents: Components = {
  h3: ({ node, children }) => <h3 id={slugify(textOf(node as HastNode))}>{children}</h3>,
  a: ({ href, children }) => (
    <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {children}
    </a>
  ),
};

/** Markdown za blokove teksta u lekcijama. */
export function Md({ children, className, tight }: { children: string; className?: string; tight?: boolean }) {
  return (
    <div className={cn("prose-lesson", tight && "prose-tight", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={blockComponents}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

/** Markdown u jednom redu (naslovi, opcije kviza): bez <p> omotača. */
export function MdInline({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("md-inline", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ p: ({ children }) => <>{children}</> }}>
        {children}
      </ReactMarkdown>
    </span>
  );
}
