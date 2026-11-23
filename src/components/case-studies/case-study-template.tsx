"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { InfraCoreLapsMockup } from "./infracore-laps-mockup";
import type {
  CaseStudyData,
  CaseStudyVisual,
  CaseStudySection,
  DecisionRows,
  MarkdownBlock,
} from "./types";

const glossaryDefinition = (study: CaseStudyData) =>
  Object.fromEntries((study.presentation.glossary ?? []).map(({ term, definition }) => [term, definition]));

function GlossaryTooltip({ term, definition }: { term: string; definition: string }) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span className={`case-study-term${open ? " is-open" : ""}`}>
      <button
        className="case-study-term__trigger"
        type="button"
        aria-describedby={tooltipId}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        {term}
      </button>
      <span className="case-study-term__definition" id={tooltipId} role="tooltip">
        {definition}
      </span>
    </span>
  );
}

function renderInline(text: string, glossary: Record<string, string>): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\((?:https?:\/\/|mailto:)[^)]+\)|\b(?:MPAN|MPRN|DUoS|TCR|CCL|LoA)\b)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    const link = part.match(/^\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]}>{link[1]}</a>;
    if (glossary[part]) {
      return <GlossaryTooltip key={index} term={part} definition={glossary[part]} />;
    }
    return part;
  });
}

function renderBlocks(blocks: MarkdownBlock[], glossary: Record<string, string>): ReactNode[] {
  return blocks.map((block, index) => {
    if (block.kind === "heading") {
      if (block.level === 2) return <h2 key={index}>{renderInline(block.text, glossary)}</h2>;
      if (block.level === 3) return <h3 key={index}>{renderInline(block.text, glossary)}</h3>;
      return <h4 key={index}>{renderInline(block.text, glossary)}</h4>;
    }

    if (block.kind === "list") {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List key={index}>
          {block.items.map((item, itemIndex) => <li key={`${index}-${itemIndex}`}>{renderInline(item, glossary)}</li>)}
        </List>
      );
    }

    if (block.kind === "table") {
      return (
        <div className="case-study-table-wrap" key={index} role="region" aria-label="Case study data table" tabIndex={0}>
          <table>
            <thead><tr>{block.headers.map((cell, cellIndex) => <th key={`${cell}-${cellIndex}`}>{renderInline(cell, glossary)}</th>)}</tr></thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>{block.headers.map((_, cellIndex) => <td key={cellIndex}>{renderInline(row[cellIndex] ?? "", glossary)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return <p key={index}>{renderInline(block.text, glossary)}</p>;
  });
}

function sectionAnchor(title: string): string {
  if (title === "Business context" || title === "The systems" || title === "The business problem") return "business-context";
  if (title === "The platform workflow" || title === "How the workflow fits together") return "workflow";
  if (title === "Engineering decisions") return "decisions";
  if (title === "Results") return "results";
  if (title === "Technology") return "technology";
  return `section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

function sectionLabel(title: string): string {
  if (title === "The systems" || title === "The business problem") return "Business context";
  if (title === "The platform workflow" || title === "How the workflow fits together") return "Workflow";
  if (title === "Engineering decisions") return "Decisions";
  return title;
}

function getTableRows(section?: CaseStudySection) {
  return section?.blocks.find((block) => block.kind === "table")?.rows ?? [];
}

function splitResult(description: string) {
  const movedTo = description.match(/^(.+?) moved to (.+)\.$/);
  if (movedTo) return { before: movedTo[1], after: movedTo[2].replace(/\.$/, "") };
  const gaveWay = description.match(/^(.+?) gave way to (.+)\.$/);
  if (gaveWay) return { before: gaveWay[1], after: gaveWay[2].replace(/\.$/, "") };
  const movedInto = description.match(/^(.+?) moved into (.+)\.$/);
  if (movedInto) return { before: movedInto[1], after: movedInto[2].replace(/\.$/, "") };
  const reduced = description.match(/^(.+?), reducing (.+)\.$/);
  if (reduced) return { before: reduced[1], after: `reducing ${reduced[2]}` };
  return { before: description.replace(/\.$/, ""), after: "" };
}

function ResultCards({ rows, preview = false }: { rows: string[][]; preview?: boolean }) {
  const visibleRows = preview ? rows.slice(0, 4) : rows;
  if (!visibleRows.length) return null;

  return (
    <div className={preview ? "case-study-glance-grid" : "case-study-results-grid"}>
      {visibleRows.map(([area, description], index) => {
        const shift = splitResult(description ?? "");
        return (
          <article className="case-study-result-card" key={`${area}-${index}`}>
            <h3>{area}</h3>
            <div className="case-study-result-shift">
              <span className="case-study-result-before">{shift.before}</span>
              {shift.after && (
                <>
                  <span className="case-study-result-arrow" aria-hidden="true">→</span>
                  <span className="case-study-result-after">{shift.after}</span>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function AccessibleResultsTable({ section, glossary }: { section: CaseStudySection; glossary: Record<string, string> }) {
  const table = section.blocks.find((block) => block.kind === "table");
  if (!table || table.kind !== "table") return null;

  return (
    <table className="case-study-results-sr-only">
      <caption>{section.title}</caption>
      <thead><tr>{table.headers.map((header, index) => <th key={`${header}-${index}`} scope="col">{renderInline(header, glossary)}</th>)}</tr></thead>
      <tbody>
        {table.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>{table.headers.map((_, index) => <td key={index}>{renderInline(row[index] ?? "", glossary)}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

function MockupFrame({ visual }: { visual: Extract<CaseStudyVisual, { type: "infracore-mockup" }> }) {
  return (
    <figure className="case-study-screenshot case-study-screenshot--mockup">
      <InfraCoreLapsMockup screen={visual.screen} label={visual.alt} />
    </figure>
  );
}

function ImageScreenshotFrame({ image }: { image: Extract<CaseStudyVisual, { type: "image" }> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <figure className={`case-study-screenshot${image.mobile ? " case-study-screenshot--mobile" : ""}`}>
        {!image.mobile && <div className="case-study-browser-bar" aria-hidden="true"><span /><span /><span /><i /></div>}
        <button
          ref={triggerRef}
          className="case-study-screenshot__open"
          type="button"
          aria-label={`Enlarge screenshot: ${image.alt}`}
          onClick={() => setIsOpen(true)}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width ?? 1440}
            height={image.height ?? 900}
            sizes={image.mobile ? "(max-width: 700px) 86vw, 320px" : "(max-width: 700px) 90vw, (max-width: 1100px) 70vw, 680px"}
            loading="lazy"
          />
          <span className="case-study-screenshot__hint">Click to enlarge</span>
        </button>
      </figure>
      {isOpen && mounted && createPortal(
        <div className="case-study-lightbox" onClick={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <div className="case-study-lightbox__dialog" role="dialog" aria-modal="true" aria-label={`Enlarged screenshot: ${image.alt}`}>
            <button ref={closeRef} className="case-study-lightbox__close" type="button" onClick={() => setIsOpen(false)} aria-label="Close enlarged screenshot">×</button>
            <Image src={image.src} alt={image.alt} width={image.width ?? 1920} height={image.height ?? 1200} sizes="95vw" />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function ScreenshotFrame({ image }: { image: CaseStudyVisual }) {
  if (image.type === "infracore-mockup") return <MockupFrame visual={image} />;
  return <ImageScreenshotFrame image={image} />;
}

type WorkflowPanel = { label: string; blocks: MarkdownBlock[]; images: CaseStudyVisual[] };

function workflowPanels(section: CaseStudySection, study: CaseStudyData): WorkflowPanel[] {
  const config = study.presentation.workflow;
  if (!config || config.sectionTitle !== section.title) return [];

  return config.steps.map((step) => {
    let blocks: MarkdownBlock[] = [];
    if (step.sourceHeading) {
      const start = section.blocks.findIndex((block) => block.kind === "heading" && block.level === 3 && block.text === step.sourceHeading);
      if (start >= 0) {
        let end = start + 1;
        while (end < section.blocks.length) {
          const block = section.blocks[end];
          if (block.kind === "heading" && block.level <= 3) break;
          end += 1;
        }
        blocks = section.blocks.slice(start, end);
      }
    } else if (step.sourceItemPrefix) {
      const sourceList = section.blocks.find((block) => block.kind === "list" && block.items.some((item) => item.startsWith(step.sourceItemPrefix!)));
      const item = sourceList?.kind === "list" ? sourceList.items.find((value) => value.startsWith(step.sourceItemPrefix!)) : undefined;
      if (item) blocks = [{ kind: "paragraph", text: item }];
    } else if (step.sourceSentenceIndex !== undefined) {
      const source = section.blocks.find((block) => block.kind === "paragraph");
      if (source?.kind === "paragraph") {
        const sentences = source.text.split(/(?<=\.)\s+/);
        const sentence = sentences[step.sourceSentenceIndex];
        if (sentence) blocks = [{ kind: "paragraph", text: sentence }];
      }
    }
    return { label: step.label, blocks, images: step.images ?? [] };
  });
}

function WorkflowStepper({ section, study, glossary }: { section: CaseStudySection; study: CaseStudyData; glossary: Record<string, string> }) {
  const panels = workflowPanels(section, study);
  const [activeStep, setActiveStep] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const config = study.presentation.workflow;
  if (!config || !panels.length) return null;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    let nextIndex = activeStep;
    if (event.key === "ArrowRight") nextIndex = (activeStep + 1) % panels.length;
    else if (event.key === "ArrowLeft") nextIndex = (activeStep - 1 + panels.length) % panels.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = panels.length - 1;
    else return;
    event.preventDefault();
    setActiveStep(nextIndex);
    tabsRef.current[nextIndex]?.focus();
  }

  const activePanel = panels[activeStep];
  const allStepHeadings = config.steps.map((step) => step.sourceHeading).filter(Boolean);
  const firstHeadingIndex = section.blocks.findIndex((block) => block.kind === "heading" && block.level === 3 && allStepHeadings.includes(block.text));
  const consumedItems = config.steps.map((step) => step.sourceItemPrefix).filter(Boolean);
  const consumedSentenceSection = config.steps.some((step) => step.sourceSentenceIndex !== undefined);
  const leadingBlocks = section.blocks.filter((block, index) => {
    if (firstHeadingIndex >= 0 && index >= firstHeadingIndex) return false;
    if (block.kind === "list" && consumedItems.length) return !block.items.some((item) => consumedItems.some((prefix) => item.startsWith(prefix!)));
    if (block.kind === "paragraph" && consumedSentenceSection) return false;
    return true;
  });

  return (
    <>
      {renderBlocks(leadingBlocks, glossary)}
      <div className="case-study-stepper">
        <div className="case-study-stepper__tabs" role="tablist" aria-label={`${sectionLabel(section.title)} steps`}>
          {panels.map((panel, index) => (
            <button
              ref={(element) => { tabsRef.current[index] = element; }}
              id={`workflow-tab-${index}`}
              className={`case-study-stepper__tab${activeStep === index ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeStep === index}
              aria-controls="case-study-step-panel"
              tabIndex={activeStep === index ? 0 : -1}
              key={panel.label}
              onClick={() => setActiveStep(index)}
              onKeyDown={handleKeyDown}
            >
              {panel.label}
            </button>
          ))}
        </div>
        <div
          id="case-study-step-panel"
          className="case-study-stepper__panel"
          role="tabpanel"
          aria-labelledby={`workflow-tab-${activeStep}`}
          tabIndex={0}
          key={activeStep}
        >
          {renderBlocks(activePanel.blocks, glossary)}
          {activePanel.images.length > 0 && (
            <div className="case-study-screenshots">
              {activePanel.images.map((image) => (
                <ScreenshotFrame key={image.type === "image" ? image.src : `${image.type}-${image.screen}`} image={image} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function getDecisionGroups(section: CaseStudySection) {
  const groups: { title: string; blocks: MarkdownBlock[] }[] = [];
  let current: { title: string; blocks: MarkdownBlock[] } | null = null;
  for (const block of section.blocks) {
    if (block.kind === "heading" && block.level === 3) {
      current = { title: block.text, blocks: [] };
      groups.push(current);
    } else if (current) {
      current.blocks.push(block);
    }
  }
  return groups;
}

function DecisionCards({ section, study, glossary }: { section: CaseStudySection; study: CaseStudyData; glossary: Record<string, string> }) {
  const rows: Record<string, DecisionRows> = study.presentation.decisionRows ?? {};
  return (
    <div className="case-study-decision-grid">
      {getDecisionGroups(section).map((group) => {
        const originalLength = group.blocks.map((block) => block.kind === "paragraph" ? block.text.length : 0).reduce((sum, length) => sum + length, 0);
        const split = rows[group.title];
        return (
          <details className="case-study-decision-card" open={originalLength < 300} key={group.title}>
            <summary>
              <span>{group.title}</span>
              <span className="case-study-decision-card__toggle" aria-hidden="true">+</span>
            </summary>
            {split ? (
              <dl className="case-study-decision-rows">
                <div><dt>Problem</dt><dd>{renderInline(split.problem, glossary)}</dd></div>
                <div><dt>Decision</dt><dd>{renderInline(split.decision, glossary)}</dd></div>
                <div><dt>Why</dt><dd>{renderInline(split.why, glossary)}</dd></div>
              </dl>
            ) : (
              <div className="case-study-decision-original">{renderBlocks(group.blocks, glossary)}</div>
            )}
          </details>
        );
      })}
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div className="case-study-architecture-scroll" role="region" aria-label="AMSL architecture diagram" tabIndex={0}>
      <svg className="case-study-architecture" viewBox="0 0 1160 500" role="img" aria-labelledby="amsl-architecture-title amsl-architecture-description">
        <title id="amsl-architecture-title">AMSL pricing, contract and reconciliation architecture</title>
        <desc id="amsl-architecture-description">Supplier Excel and CSV files pass through field mapping into PostgreSQL with relational and JSONB data, then the pricing engine, quotes, contracts and letters of authority, and Zoho Sign events. Supplier remittance files pass through OCR to matching. Redis and BullMQ workers support ingestion, document generation and OCR.</desc>
        <defs>
          <marker id="architecture-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <g className="case-study-architecture__connectors" markerEnd="url(#architecture-arrow)">
          <path d="M149 92 H184" /><path d="M309 92 H349" /><path d="M494 92 H534" />
          <path d="M654 92 H689" /><path d="M784 92 H819" /><path d="M969 92 H1009" />
          <path d="M275 360 H345" /><path d="M475 360 H555" />
        </g>
        <g className="case-study-architecture__worker-links">
          <path d="M250 190 V140" /><path d="M895 190 V140" /><path d="M410 278 V322" />
        </g>
        <g className="case-study-architecture__node">
          <rect x="24" y="55" width="125" height="74" rx="10" />
          <text x="86.5" y="84" textAnchor="middle"><tspan>Supplier</tspan><tspan x="86.5" dy="20">Excel / CSV</tspan></text>
        </g>
        <g className="case-study-architecture__node">
          <rect x="184" y="55" width="125" height="74" rx="10" />
          <text x="246.5" y="84" textAnchor="middle"><tspan>Field</tspan><tspan x="246.5" dy="20">mapping</tspan></text>
        </g>
        <g className="case-study-architecture__node case-study-architecture__node--accent">
          <rect x="349" y="55" width="145" height="74" rx="10" />
          <text x="421.5" y="84" textAnchor="middle"><tspan>PostgreSQL</tspan><tspan x="421.5" dy="20">relational + JSONB</tspan></text>
        </g>
        <g className="case-study-architecture__node">
          <rect x="534" y="55" width="120" height="74" rx="10" />
          <text x="594" y="84" textAnchor="middle"><tspan>Pricing</tspan><tspan x="594" dy="20">engine</tspan></text>
        </g>
        <g className="case-study-architecture__node">
          <rect x="689" y="55" width="95" height="74" rx="10" />
          <text x="736.5" y="99" textAnchor="middle">Quote</text>
        </g>
        <g className="case-study-architecture__node">
          <rect x="819" y="55" width="150" height="74" rx="10" />
          <text x="894" y="84" textAnchor="middle"><tspan>Contract +</tspan><tspan x="894" dy="20">letter of authority</tspan></text>
        </g>
        <g className="case-study-architecture__node">
          <rect x="1009" y="55" width="145" height="74" rx="10" />
          <text x="1081.5" y="84" textAnchor="middle"><tspan>Zoho Sign</tspan><tspan x="1081.5" dy="20">events</tspan></text>
        </g>
        <g className="case-study-architecture__workers">
          <rect x="220" y="190" width="740" height="88" rx="12" />
          <text x="590" y="222" textAnchor="middle" className="case-study-architecture__workers-title">Redis / BullMQ workers</text>
          <text x="590" y="250" textAnchor="middle">Ingestion · document generation · OCR</text>
        </g>
        <g className="case-study-architecture__node">
          <rect x="75" y="322" width="200" height="76" rx="10" />
          <text x="175" y="351" textAnchor="middle"><tspan>Supplier remittance</tspan><tspan x="175" dy="20">files</tspan></text>
        </g>
        <g className="case-study-architecture__node">
          <rect x="345" y="322" width="130" height="76" rx="10" />
          <text x="410" y="366" textAnchor="middle">OCR</text>
        </g>
        <g className="case-study-architecture__node case-study-architecture__node--accent">
          <rect x="555" y="322" width="360" height="76" rx="10" />
          <text x="735" y="351" textAnchor="middle"><tspan>Matching against contract</tspan><tspan x="735" dy="20">uplift records</tspan></text>
        </g>
      </svg>
    </div>
  );
}

function Glossary({ terms }: { terms: { term: string; definition: string }[] }) {
  if (!terms.length) return null;
  return (
    <div className="case-study-glossary">
      <h3>Glossary</h3>
      <div className="case-study-glossary__grid">
        {terms.map(({ term, definition }) => (
          <details className="case-study-glossary__term" key={term}>
            <summary>{term}</summary>
            <span>{definition}</span>
          </details>
        ))}
      </div>
    </div>
  );
}

function CaseStudySectionContent({ section, study, glossary }: { section: CaseStudySection; study: CaseStudyData; glossary: Record<string, string> }) {
  const workflow = study.presentation.workflow?.sectionTitle === section.title;
  const decisionSection = section.title === "Engineering decisions";
  const resultSection = section.title === "Results";
  const technologySection = section.title === "Technology";
  const sectionId = sectionAnchor(section.title);

  if (workflow) {
    return (
      <section className="case-study-content-section case-study-reveal" id={sectionId} key={sectionId}>
        <h2>{section.title}</h2>
        <WorkflowStepper section={section} study={study} glossary={glossary} />
      </section>
    );
  }

  if (decisionSection) {
    return (
      <section className="case-study-content-section case-study-reveal" id={sectionId} key={sectionId}>
        <h2>{section.title}</h2>
        <DecisionCards section={section} study={study} glossary={glossary} />
      </section>
    );
  }

  if (resultSection) {
    const rows = getTableRows(section);
    return (
      <section className="case-study-content-section case-study-reveal" id={sectionId} key={sectionId}>
        <h2>{section.title}</h2>
        <ResultCards rows={rows} />
        <AccessibleResultsTable section={section} glossary={glossary} />
      </section>
    );
  }

  return (
    <section className="case-study-content-section case-study-reveal" id={sectionId} key={sectionId}>
      <h2>{section.title}</h2>
      {renderBlocks(section.blocks, glossary)}
      {technologySection && study.presentation.architecture && <ArchitectureDiagram />}
      {technologySection && study.presentation.glossary && <Glossary terms={study.presentation.glossary} />}
    </section>
  );
}

function ReadingProgress() {
  useEffect(() => {
    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      document.documentElement.style.setProperty("--case-study-progress", String(progress));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.documentElement.style.removeProperty("--case-study-progress");
    };
  }, []);
  return <div className="case-study-reading-progress" aria-hidden="true" />;
}

export function CaseStudyTemplate({ study }: { study: CaseStudyData }) {
  const tocDetails = useRef<HTMLDetailsElement>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const glossary = glossaryDefinition(study);
  const resultSection = study.sections.find((section) => section.title === "Results");
  const resultRows = getTableRows(resultSection);
  const technologySection = study.sections.find((section) => section.title === "Technology");
  const inferredStack = technologySection?.blocks
    .filter((block): block is Extract<MarkdownBlock, { kind: "paragraph" }> => block.kind === "paragraph")
    .flatMap((block) => block.text.split(","))
    .map((item) => item.trim().replace(/\.$/, "")) ?? [];
  const stack = study.presentation.stack ?? inferredStack.slice(0, 4);
  const tocItems = useMemo(() => [
    { id: "overview", label: "Overview" },
    ...study.sections.map((section) => ({ id: sectionAnchor(section.title), label: sectionLabel(section.title) })),
  ].filter((item, index, items) => items.findIndex((other) => other.id === item.id) === index), [study.sections]);

  useEffect(() => {
    const updateActive = () => {
      let current = "overview";
      for (const item of tocItems) {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= 160) current = item.id;
      }
      setActiveSection(current);
    };
    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08 });
    document.querySelectorAll(".case-study-reveal").forEach((section) => revealObserver.observe(section));
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [tocItems]);

  const closeMobileToc = () => tocDetails.current?.removeAttribute("open");

  return (
    <div className="case-study-page">
      <ReadingProgress />
      <div className="case-study-shell">
        <header className="case-study-header" id="overview">
          <a className="case-study-back" href="/#projects"><span aria-hidden="true">←</span> Back to selected projects</a>
          <p className="case-study-label">Project case study</p>
          <h1 className="case-study-title">{study.title}</h1>
          {study.summary && <p className="case-study-summary">{renderInline(study.summary, glossary)}</p>}

          <dl className="case-study-meta-grid">
            <div><dt>Role</dt><dd>{study.presentation.role}</dd></div>
            <div><dt>Domain</dt><dd>{study.presentation.domain}</dd></div>
            <div>
              <dt>Stack</dt>
              <dd className="case-study-stack">
                {stack.length ? stack.slice(0, 4).map((item) => <span key={item}>{item}</span>) : <span>Not specified in the case-study text</span>}
              </dd>
            </div>
            <div><dt>Scope</dt><dd>{study.presentation.scope}</dd></div>
          </dl>

          {resultRows.length > 0 && (
            <div className="case-study-glance" aria-labelledby="case-study-glance-title">
              <h2 id="case-study-glance-title">Results at a glance</h2>
              <ResultCards rows={resultRows} preview />
            </div>
          )}
        </header>

        <details className="case-study-mobile-toc" ref={tocDetails}>
          <summary>On this page</summary>
          <nav aria-label="On this page">
            {tocItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={closeMobileToc}>{item.label}</a>
            ))}
          </nav>
        </details>

        <div className="case-study-layout">
          <aside className="case-study-sidebar">
            <p>On this page</p>
            <nav aria-label="Case study contents">
              {tocItems.map((item) => (
                <a key={item.id} className={activeSection === item.id ? "is-active" : ""} href={`#${item.id}`} aria-current={activeSection === item.id ? "location" : undefined}>
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
          <article className="case-study-content">
            {study.sections.map((section) => (
              <CaseStudySectionContent key={section.id} section={section} study={study} glossary={glossary} />
            ))}
            <footer className="case-study-project-navigation">
              <a href={`/case-studies/${study.previous.slug}`}>
                <span>Previous project</span>
                <strong><span aria-hidden="true">←</span> {study.previous.title}</strong>
              </a>
              <a className="case-study-contact-button" href="/#contact">Contact <span aria-hidden="true">↗</span></a>
              <a className="case-study-project-navigation__next" href={`/case-studies/${study.next.slug}`}>
                <span>Next project</span>
                <strong>{study.next.title} <span aria-hidden="true">→</span></strong>
              </a>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}
