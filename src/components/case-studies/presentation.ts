import type { CaseStudyPresentation } from "./types";

const image = (
  src: string,
  alt: string,
  dimensions?: { width: number; height: number; mobile?: boolean },
) => ({ type: "image" as const, src: `/images/projects/${src}`, alt, ...dimensions });
const infraCoreMockup = (screen: "scan" | "result", alt: string) => ({
  type: "infracore-mockup" as const,
  screen,
  alt,
});

export const caseStudyPresentation: Record<string, CaseStudyPresentation> = {
  "amsl-broker-portal": {
    role: "Sole backend engineer",
    domain: "UK commercial energy",
    scope: "Backend architecture and data model",
    workflow: {
      sectionTitle: "The platform workflow",
      steps: [
        {
          label: "Ingest",
          sourceHeading: "Bring different supplier data into one pricing workflow",
          images: [
            image("pricing-upload-dashboard.webp", "Supplier price-book upload"),
            image("pricing-mapping-dashboard.webp", "Supplier field mapping"),
          ],
        },
        {
          label: "Quote",
          sourceHeading: "Turn customer details into an eligible quote",
          images: [
            image("quote-generation-dashboard.webp", "AMSL quote generation"),
            image("quote-results-dashboard.webp", "AMSL quote results"),
          ],
        },
        {
          label: "Sign",
          sourceHeading: "Carry an accepted quote through to signature",
          images: [
            image("crm-customer-dashboard.webp", "AMSL customer record"),
            image("crm-contract-dashboard.webp", "AMSL contract workflow"),
          ],
        },
        {
          label: "Reconcile",
          sourceHeading: "Reconcile what suppliers pay",
        },
      ],
    },
    decisionRows: {
      "Keep supplier flexibility and quote consistency together": {
        problem: "Supplier price books change independently, while quote searches rely on a stable set of fields.",
        decision: "Keeping shared dimensions relational and supplier-specific details in JSONB",
        why: "gave the ingestion model room to evolve without making common pricing operations opaque.",
      },
    },
    architecture: true,
    glossary: [
      { term: "MPAN", definition: "electricity meter point ID." },
      { term: "MPRN", definition: "gas meter point ID." },
      { term: "DUoS", definition: "network distribution charges." },
      { term: "TCR", definition: "banded network charges from the Targeted Charging Review." },
      { term: "CCL", definition: "Climate Change Levy, a tax on business energy." },
      { term: "LoA", definition: "letter of authority letting the broker act for the customer." },
    ],
  },
  "auc-all-utilities-collection": {
    role: "Senior Backend Developer",
    domain: "UK utility debt recovery and field operations",
    scope: "Database architecture and backend workflows",
    workflow: {
      sectionTitle: "The platform workflow",
      steps: [
        {
          label: "Allocate",
          sourceHeading: "Allocate work to the right coverage area",
          images: [
            image("auc-customer-upload-dashboard.webp", "AUC account portfolio upload"),
            image("auc-agent-coverage-dashboard.webp", "AUC field-agent coverage"),
          ],
        },
        {
          label: "Visit",
          sourceHeading: "Record the visit with its evidence",
          images: [
            image("auc-customer-details-dashboard.webp", "AUC customer account details"),
            image("auc-site-visit-dashboard.webp", "AUC site visit record"),
          ],
        },
        {
          label: "Live view",
          sourceHeading: "Give managers a live operational view",
          images: [image("auc-agent-coverage-dashboard.webp", "AUC field activity view")],
        },
        {
          label: "Recovery & reporting",
          sourceHeading: "Follow recovery through payment and reporting",
          images: [
            image("auc-payment-collection-dashboard.webp", "AUC payment collection"),
            image("commission-reports-dashboard.webp", "AUC commission report"),
          ],
        },
      ],
    },
    decisionRows: {
      "Control the workload of large reports": {
        problem: "Client reports combine large portfolios with visit and payment details.",
        decision: "I bounded report concurrency, controlled agent-level aggregation, and used streamed spreadsheet generation",
        why: "so reporting work could run predictably without overwhelming the application or delaying other organizations.",
      },
      "Keep evidence connected to the account and visit": {
        problem: "For an operational review, a photo alone is not enough; teams need its account, visit, time, and location context.",
        decision: "Images are validated and processed before they are stored in private AWS S3 storage; time-limited signed links control access for authorized users.",
        why: "This gives office teams a more complete evidence trail for review and warrant preparation.",
      },
    },
  },
  "trk-finance-accounting": {
    role: "Not specified in the case-study text",
    domain: "Loan management and accounting",
    scope: "Backend improvements across loan and accounting applications",
    workflow: {
      sectionTitle: "My contribution",
      steps: [
        {
          label: "Database and API optimization",
          sourceItemPrefix: "**Database and API optimization:**",
          images: [image("trk-dashboard.webp", "TRK loan management dashboard")],
        },
        {
          label: "Backend refactoring",
          sourceItemPrefix: "**Backend refactoring:**",
          images: [image("accounting-dashboard.webp", "Accounting application dashboard")],
        },
        {
          label: "API security and validation",
          sourceItemPrefix: "**API security and validation:**",
          images: [image("trk-document-review-dashboard.webp", "TRK document review screen")],
        },
        {
          label: "Production stability",
          sourceItemPrefix: "**Production stability:**",
          images: [image("trk-emi-tracking-dashboard.webp", "TRK repayment tracking screen")],
        },
      ],
    },
  },
  "it-asset-management": {
    role: "Full-stack developer",
    domain: "Workplace IT inventory",
    scope: "Device inventory and QR-based lookup",
    stack: ["Node.js", "React.js", "Prisma ORM", "Supabase"],
    workflow: {
      sectionTitle: "How the workflow fits together",
      steps: [
        { label: "Collect", sourceSentenceIndex: 0 },
        {
          label: "Identify",
          sourceSentenceIndex: 1,
          images: [infraCoreMockup("scan", "InfraCore LAPS QR scanning screen")],
        },
        {
          label: "Look up",
          sourceSentenceIndex: 2,
          images: [infraCoreMockup("result", "InfraCore LAPS device details screen")],
        },
      ],
    },
  },
};
