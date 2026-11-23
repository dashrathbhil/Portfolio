export type MarkdownBlock =
  | { kind: "heading"; level: 2 | 3 | 4; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "table"; headers: string[]; rows: string[][] };

export type CaseStudySection = {
  title: string;
  id: string;
  blocks: MarkdownBlock[];
};

export type CaseStudyVisual =
  | {
      type: "image";
      src: string;
      alt: string;
      width?: number;
      height?: number;
      mobile?: boolean;
    }
  | {
      type: "infracore-mockup";
      screen: "scan" | "result";
      alt: string;
    };

export type CaseStudyWorkflowStep = {
  label: string;
  sourceHeading?: string;
  sourceItemPrefix?: string;
  sourceSentenceIndex?: number;
  images?: CaseStudyVisual[];
};

export type CaseStudyWorkflow = {
  sectionTitle: string;
  steps: CaseStudyWorkflowStep[];
};

export type DecisionRows = {
  problem: string;
  decision: string;
  why: string;
};

export type CaseStudyPresentation = {
  role: string;
  domain: string;
  scope: string;
  stack?: string[];
  workflow?: CaseStudyWorkflow;
  decisionRows?: Record<string, DecisionRows>;
  architecture?: boolean;
  glossary?: { term: string; definition: string }[];
};

export type CaseStudyData = {
  slug: string;
  title: string;
  summary: string;
  sections: CaseStudySection[];
  presentation: CaseStudyPresentation;
  previous: { slug: string; title: string };
  next: { slug: string; title: string };
};
