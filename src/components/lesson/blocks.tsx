import { Md, MdInline } from "@/components/ui/md";
import { projectInfo } from "@/content/curriculum";
import type { Block, Lesson } from "@/content/types";
import { highlightToHtml, highlightToTokens } from "@/lib/highlight";
import { editorHref } from "@/lib/projects";
import { slugify } from "@/lib/slug";
import { CodeWalkthrough } from "./code-walkthrough";
import { Exercise } from "./exercise";
import type { TocEntry } from "./lesson-chrome";
import { Quiz } from "./quiz";
import { CalloutView, CodeView } from "./static-blocks";
import { Terminal } from "./terminal";

/** ID sidra za blok (za sadržaj lekcije i linkove). */
export function blockAnchor(block: Block, index: number) {
  switch (block.kind) {
    case "exercise":
      return `vezba-${block.id}`;
    case "playground":
      return `probaj-${block.id}`;
    case "quiz":
      return `kviz-${block.id}`;
    case "terminal":
      return `terminal-${block.id}`;
    case "fromYourCode":
      return `kod-${index}`;
    default:
      return undefined;
  }
}

const plain = (md: string) => md.replace(/[`*_]/g, "");

export function buildToc(lesson: Lesson): TocEntry[] {
  const out: TocEntry[] = [];
  let exercise = 0;
  lesson.blocks.forEach((b, i) => {
    if (b.kind === "prose") {
      for (const m of b.md.matchAll(/^###\s+(.+)$/gm)) {
        out.push({ id: slugify(plain(m[1])), label: plain(m[1]), kind: "heading" });
      }
    } else if (b.kind === "exercise") {
      exercise++;
      out.push({ id: blockAnchor(b, i)!, label: `Vežba ${exercise}: ${plain(b.title)}`, kind: "exercise", exerciseId: b.id });
    } else if (b.kind === "playground") {
      out.push({ id: blockAnchor(b, i)!, label: `Probaj: ${plain(b.title)}`, kind: "exercise" });
    } else if (b.kind === "quiz") {
      out.push({ id: blockAnchor(b, i)!, label: plain(b.title ?? "Kviz"), kind: "quiz" });
    } else if (b.kind === "terminal") {
      out.push({ id: blockAnchor(b, i)!, label: `Terminal: ${plain(b.title)}`, kind: "terminal" });
    } else if (b.kind === "fromYourCode") {
      out.push({ id: blockAnchor(b, i)!, label: `Iz tvog koda: ${b.file.split("/").pop()}`, kind: "code" });
    }
  });
  return out;
}

export async function LessonBlocks({ lesson }: { lesson: Lesson }) {
  let exerciseNumber = 0;
  const rendered = await Promise.all(
    lesson.blocks.map(async (block, i) => {
      const anchor = blockAnchor(block, i);
      let node: React.ReactNode;
      switch (block.kind) {
        case "prose":
          node = <Md>{block.md}</Md>;
          break;
        case "callout":
          node = <CalloutView block={block} />;
          break;
        case "code":
          node = <CodeView block={block} />;
          break;
        case "fromYourCode": {
          const tokens = await highlightToTokens(block.code, block.lang);
          node = (
            <CodeWalkthrough
              projectLabel={projectInfo[block.project].label}
              file={block.file}
              startLine={block.startLine ?? 1}
              editorHref={editorHref(block.project, block.file, block.startLine ?? 1)}
              intro={block.intro ? <MdInline>{block.intro}</MdInline> : undefined}
              lines={tokens}
              steps={block.steps.map((s) => {
                const [from, to] = Array.isArray(s.lines) ? s.lines : [s.lines, s.lines];
                return { from, to, body: <Md tight>{s.md}</Md> };
              })}
            />
          );
          break;
        }
        case "exercise": {
          exerciseNumber++;
          node = (
            <Exercise
              id={block.id}
              number={exerciseNumber}
              title={block.title}
              lang={block.lang}
              previewName={block.preview}
              starter={block.starter}
              solution={block.solution}
              solutionHtml={await highlightToHtml(block.solution, block.lang)}
              tests={block.tests}
              requireNoTypeErrors={block.requireNoTypeErrors}
              prompt={<Md tight>{block.prompt}</Md>}
              hints={block.hints.map((h, j) => (
                <MdInline key={j}>{h}</MdInline>
              ))}
              explanation={block.explanation ? <MdInline>{block.explanation}</MdInline> : undefined}
            />
          );
          break;
        }
        case "playground":
          node = (
            <Exercise
              id={block.id}
              number={0}
              mode="playground"
              title={block.title}
              lang={block.lang}
              previewName={block.preview}
              starter={block.code}
              solution=""
              solutionHtml=""
              tests={[]}
              prompt={block.prompt ? <Md tight>{block.prompt}</Md> : null}
              hints={[]}
            />
          );
          break;
        case "quiz":
          node = (
            <Quiz
              id={block.id}
              title={block.title}
              questions={await Promise.all(
                block.questions.map(async (q) => ({
                  q: <MdInline>{q.q}</MdInline>,
                  codeHtml: q.code ? await highlightToHtml(q.code, q.codeLang ?? "ts") : undefined,
                  options: q.options.map((o, j) => <MdInline key={j}>{o}</MdInline>),
                  answer: q.answer,
                  why: <MdInline>{q.why}</MdInline>,
                })),
              )}
            />
          );
          break;
        case "terminal":
          node = (
            <Terminal
              id={block.id}
              title={block.title}
              intro={block.intro ? <MdInline>{block.intro}</MdInline> : undefined}
              cwd={block.cwd}
              steps={block.steps.map((s) => ({
                task: <MdInline>{s.task}</MdInline>,
                accept: s.accept,
                output: s.output,
                hint: <MdInline>{s.hint}</MdInline>,
                cwd: s.cwd,
              }))}
            />
          );
          break;
      }
      return (
        <div key={i} id={anchor} className="scroll-mt-20">
          {node}
        </div>
      );
    }),
  );
  return <>{rendered}</>;
}
