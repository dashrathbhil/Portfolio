import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

const caseStudyFiles: Record<string, string> = {
  "amsl-broker-portal": "amsl-broker-portal.md",
  "auc-all-utilities-collection": "auc-all-utilities-collection.md",
  "trk-finance-accounting": "trk-finance-accounting.md",
  "it-asset-management": "it-asset-management.md",
};

type MarkdownBlock =
  | { kind: "heading"; level: 2 | 3 | 4; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "table"; headers: string[]; rows: string[][] };

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  const cells = splitTableRow(line);
  return line.includes("|") && cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function getListItem(line: string): { ordered: boolean; text: string } | null {
  const match = line.match(/^(?:([-*])\s+|(\d+)\.\s+)(.+)$/);
  if (!match) return null;
  return { ordered: Boolean(match[2]), text: match[3] };
}

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1].length as 2 | 3 | 4,
        text: heading[2],
      });
      index += 1;
      continue;
    }

    if (
      line.includes("|") &&
      index + 1 < lines.length &&
      isTableSeparator(lines[index + 1].trim())
    ) {
      const headers = splitTableRow(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].trim().includes("|")) {
        rows.push(splitTableRow(lines[index].trim()));
        index += 1;
      }
      blocks.push({ kind: "table", headers, rows });
      continue;
    }

    const firstListItem = getListItem(line);
    if (firstListItem) {
      const items: string[] = [];
      while (index < lines.length) {
        const listItem = getListItem(lines[index].trim());
        if (!listItem || listItem.ordered !== firstListItem.ordered) break;
        items.push(listItem.text);
        index += 1;
      }
      blocks.push({ kind: "list", ordered: firstListItem.ordered, items });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{2,4})\s+/.test(lines[index].trim()) &&
      !getListItem(lines[index].trim()) &&
      !(lines[index].trim().includes("|") && index + 1 < lines.length && isTableSeparator(lines[index + 1].trim()))
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\((?:https?:\/\/|mailto:)[^)]+\))/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    const link = part.match(/^\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)]+)\)$/);
    if (link) {
      return <a key={index} href={link[2]}>{link[1]}</a>;
    }
    return part;
  });
}

async function loadStudy(slug: string) {
  const fileName = caseStudyFiles[slug];
  if (!fileName) return null;

  const filePath = path.join(process.cwd(), "content", "case-studies", fileName);
  const source = await readFile(filePath, "utf8");
  const title = source.match(/^#\s+(.+)$/m)?.[1] ?? "Project case study";
  const body = source.replace(/^#\s+.+\r?\n/, "");
  const blocks = parseMarkdown(body);
  const summary = blocks[0]?.kind === "paragraph" ? blocks[0].text : "";
  const details = summary ? blocks.slice(1) : blocks;

  return { title, summary, details };
}

export function generateStaticParams() {
  return Object.keys(caseStudyFiles).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await loadStudy(slug);

  return {
    title: study ? study.title + " | Dashrath Bhil" : "Project case study | Dashrath Bhil",
    description: study?.summary.replace(/\*\*|`/g, ""),
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await loadStudy(slug);
  if (!study) notFound();

  return (
    <div className="case-study-page">
      <div className="case-study-shell">
        <a className="case-study-back" href="/#projects">
          <span aria-hidden="true">←</span> Back to selected projects
        </a>

        <article className="case-study-card">
          <p className="case-study-label">Project case study</p>
          <h1 className="case-study-title">{study.title}</h1>
          {study.summary && <p className="case-study-summary">{renderInline(study.summary)}</p>}

          <div className="case-study-content">
            {study.details.map((block, index) => {
              if (block.kind === "heading") {
                if (block.level === 2) return <h2 key={index}>{block.text}</h2>;
                if (block.level === 3) return <h3 key={index}>{block.text}</h3>;
                return <h4 key={index}>{block.text}</h4>;
              }

              if (block.kind === "list") {
                const List = block.ordered ? "ol" : "ul";
                return (
                  <List key={index}>
                    {block.items.map((item) => (
                      <li key={item}>{renderInline(item)}</li>
                    ))}
                  </List>
                );
              }

              if (block.kind === "table") {
                return (
                  <div className="case-study-table-wrap" key={index} role="region" aria-label="Case study outcomes" tabIndex={0}>
                    <table>
                      <thead>
                        <tr>{block.headers.map((cell, cellIndex) => <th key={`${cell}-${cellIndex}`}>{renderInline(cell)}</th>)}</tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {block.headers.map((_, cellIndex) => <td key={cellIndex}>{renderInline(row[cellIndex] ?? "")}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              return <p key={index}>{renderInline(block.text)}</p>;
            })}
          </div>

          <footer className="case-study-footer">
            <a href="/#projects">Selected projects</a>
            <a href="/#contact">Contact Dashrath</a>
          </footer>
        </article>
      </div>
    </div>
  );
}
