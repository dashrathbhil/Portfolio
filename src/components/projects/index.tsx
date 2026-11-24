import Image from "next/image";
import { InfraCoreLapsMockup } from "../case-studies/infracore-laps-mockup";

type ProjectCard = {
  slug: string;
  domain: string;
  name: string;
  description: string;
  images: { src: string; alt: string }[];
};

const projects: ProjectCard[] = [
  {
    slug: "amsl-broker-portal",
    domain: "Energy pricing & contracts",
    name: "AMSL Broker Portal",
    description:
      "Turns supplier price books into ranked quotes with the commission uplift shown, then carries the deal through signature to commission reconciliation.",
    images: [{ src: "/images/projects/amsl-dashboard.webp", alt: "AMSL broker portal dashboard" }],
  },
  {
    slug: "auc-all-utilities-collection",
    domain: "Collections & field operations",
    name: "AUC — All Utilities Collection",
    description:
      "Allocates accounts by postcode, tracks field visits live, and keeps every visit's evidence tied to the account through to the client report.",
    images: [{ src: "/images/projects/auc-dashboard.webp", alt: "AUC debt collection platform dashboard" }],
  },
  {
    slug: "trk-finance-accounting",
    domain: "Loans & accounting",
    name: "TRK Finance & Accounting Management Systems",
    description:
      "Improved database queries, API security, validation, and reusable backend code across an existing loan platform and accounting application.",
    images: [
      { src: "/images/projects/trk-dashboard.webp", alt: "TRK loan management dashboard" },
      { src: "/images/projects/accounting-dashboard.webp", alt: "Accounting management dashboard" },
    ],
  },
  {
    slug: "it-asset-management",
    domain: "Workplace IT",
    name: "IT Asset Management",
    description:
      "Built a PowerShell and web workflow to collect PC details and retrieve asset records through QR-based lookup.",
    images: [],
  },
];

export function ProjectsSection() {
  return (
    <section className="site-section projects-section" id="projects">
      <div className="page-container">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Selected projects</p>
            <h2 className="section-title">Real systems. Clear engineering work.</h2>
          </div>
          <p className="section-summary">
            Selected examples across different domains, focused on the backend work behind each real workflow.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.slug}>
              {project.slug === "it-asset-management" ? (
                <div
                  className="project-image project-image--infracore"
                  role="img"
                  aria-label="InfraCore LAPS app preview showing QR scanning and device details"
                >
                  <div className="project-infracore-screen project-infracore-screen--scan" aria-hidden="true">
                    <InfraCoreLapsMockup screen="scan" label="QR scanning screen" />
                  </div>
                  <div className="project-infracore-screen project-infracore-screen--details" aria-hidden="true">
                    <InfraCoreLapsMockup screen="result" label="Device details screen" />
                  </div>
                </div>
              ) : (
                <div className={"project-image" + (project.images.length > 1 ? " project-image--split" : "")}>
                  {project.images.map((image) => (
                    <div className="project-image__frame" key={image.src}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 540px"
                        className="project-image__asset"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="project-body">
                <p className="project-domain">{project.domain}</p>
                <h3 className="project-title">{project.name}</h3>
                <p className="project-description">{project.description}</p>
                <a className="project-link" href={"/case-studies/" + project.slug}>
                  Read the case study <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
