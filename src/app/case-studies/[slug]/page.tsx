import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { CaseStudyTemplate } from "@/components/case-studies/case-study-template";
import { caseStudyPresentation } from "@/components/case-studies/presentation";
import type { CaseStudyData, CaseStudySection, MarkdownBlock } from "@/components/case-studies/types";

const caseStudyFiles: Record<string, string> = {
  "amsl-broker-portal": "amsl-broker-portal.md",
  "auc-all-utilities-collection": "auc-all-utilities-collection.md",
  "trk-finance-accounting": "trk-finance-accounting.md",
  "it-asset-management": "it-asset-management.md",
};

const projectOrder = [
  { slug: "amsl-broker-portal", title: "AMSL Broker Portal" },
  { slug: "auc-all-utilities-collection", title: "AUC — All Utilities Collection" },
  { slug: "trk-finance-accounting", title: "TRK Finance & Accounting Systems" },
  { slug: "it-asset-management", title: "InfraCore LAPS" },
];

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
      blocks.push({ kind: "heading", level: heading[1].length as 2 | 3 | 4, text: heading[2] });
      index += 1;
      continue;
    }

    if (line.includes("|") && index + 1 < lines.length && isTableSeparator(lines[index + 1].trim())) {
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

function groupSections(blocks: MarkdownBlock[]): CaseStudySection[] {
  const sections: CaseStudySection[] = [];
  let current: CaseStudySection | null = null;

  for (const block of blocks) {
    if (block.kind === "heading" && block.level === 2) {
      current = {
        title: block.text,
        id: `section-${block.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
        blocks: [],
      };
      sections.push(current);
    } else if (current) {
      current.blocks.push(block);
    }
  }

  return sections;
}

async function loadStudy(slug: string): Promise<CaseStudyData | null> {
  const fileName = caseStudyFiles[slug];
  const presentation = caseStudyPresentation[slug];
  if (!fileName || !presentation) return null;

  const filePath = path.join(process.cwd(), "content", "case-studies", fileName);
  const source = await readFile(filePath, "utf8");
  const title = source.match(/^#\s+(.+)$/m)?.[1] ?? "Project case study";
  const body = source.replace(/^#\s+.+\r?\n/, "");
  const blocks = parseMarkdown(body);
  const summary = blocks[0]?.kind === "paragraph" ? blocks[0].text : "";
  const details = summary ? blocks.slice(1) : blocks;
  const orderIndex = projectOrder.findIndex((project) => project.slug === slug);
  const previous = projectOrder[(orderIndex - 1 + projectOrder.length) % projectOrder.length];
  const next = projectOrder[(orderIndex + 1) % projectOrder.length];

  return {
    slug,
    title,
    summary,
    sections: groupSections(details),
    presentation,
    previous,
    next,
  };
}

export function generateStaticParams() {
  return Object.keys(caseStudyFiles).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await loadStudy(slug);
  return {
    title: study ? `${study.title} | Dashrath Bhil` : "Project case study | Dashrath Bhil",
    description: study?.summary.replace(/\*\*|`/g, ""),
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await loadStudy(slug);
  if (!study) notFound();
  return <CaseStudyTemplate study={study} />;
}
