export function HeroSection() {
  return (
    <section className="hero-section" id="hero">
      <div className="page-container">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span className="status-dot" aria-hidden="true" />
            Senior Backend Developer at Azentra Technologies <span className="eyebrow-divider">·</span> Ahmedabad, Gujarat
          </p>

          <h1 className="hero-title">
            <span className="hero-title-mask hero-title-mask--first">
              <span className="hero-title-line">From business logic to production,</span>
            </span>
            <span className="hero-title-mask hero-title-mask--second">
              <span className="hero-title-line hero-title-line--accent hero-title__accent">I own all of it.</span>
            </span>
          </h1>

          <p className="hero-deck">
            I translate strict business rules into reliable server-side code: high-speed APIs, resilient database architecture, and fault-tolerant engines.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              Contact me
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
            <a
              className="button button-quiet"
              href="/Dashrath_Bhil_Backend_Software_Engineer_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              View resume
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 4h6v6M20 4 10 14" />
                <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
              </svg>
            </a>
          </div>

          <p className="hero-meta">
            <span className="hero-meta__dot" aria-hidden="true" />
            <span className="hero-meta__text">Open to backend roles and freelance projects.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
