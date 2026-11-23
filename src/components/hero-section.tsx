"use client";

import { useState, type KeyboardEvent } from "react";

const thinkingExamples = [
  {
    title: "Visible pricing",
    steps: [
      { label: "Rule", text: "A customer must see the broker's commission before signing." },
      { label: "Data", text: "The uplift is stored with the quote's pricing inputs." },
      { label: "Production", text: "Shown on every quote, with its assumptions attached." },
    ],
  },
  {
    title: "Vulnerability",
    steps: [
      { label: "Rule", text: "A visit with a vulnerable customer needs extra care." },
      { label: "Data", text: "The condition is recorded on the visit, linked to the account." },
      { label: "Production", text: "Recording it triggers further processing, not just a note." },
    ],
  },
  {
    title: "Safe events",
    steps: [
      { label: "Rule", text: "A signature event must never apply twice or out of order." },
      { label: "Data", text: "Event state and idempotency checks live in the database." },
      { label: "Production", text: "Repeated or reordered notifications can't move a document backward." },
    ],
  },
];

export function HeroSection() {
  const [activeTab, setActiveTab] = useState(0);
  const activeExample = thinkingExamples[activeTab];

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    let nextTab = activeTab;

    if (event.key === "ArrowRight") nextTab = (activeTab + 1) % thinkingExamples.length;
    else if (event.key === "ArrowLeft") nextTab = (activeTab - 1 + thinkingExamples.length) % thinkingExamples.length;
    else if (event.key === "Home") nextTab = 0;
    else if (event.key === "End") nextTab = thinkingExamples.length - 1;
    else return;

    event.preventDefault();
    setActiveTab(nextTab);
    document.getElementById(`hero-thinking-tab-${nextTab}`)?.focus();
  }

  return (
    <section className="hero-section" id="hero">
      <div className="page-container hero-layout">
        <div className="hero-heading">
          <p className="eyebrow hero-eyebrow">
            <span className="status-dot" aria-hidden="true" />
            Senior Backend Developer at Azentra Technologies <span className="eyebrow-divider">·</span> Ahmedabad, Gujarat
          </p>

          <h1 className="hero-title">
            <span className="hero-title__line">From business logic to production,</span>{" "}
            <span className="hero-title__accent">I own all of it.</span>
          </h1>
        </div>

        <div className="hero-copy">
          <p className="hero-deck">
            I learn the business fast and build for what it will need next, not just what was asked. Node.js and PostgreSQL.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#projects">
              I&apos;m hiring <span aria-hidden="true">↓</span>
            </a>
            <a className="button button-quiet" href="#contact">
              I have a project <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="hero-meta">
            <span className="hero-meta__dot" aria-hidden="true" />
            <span className="hero-meta__text">Open to backend roles and freelance projects.</span>
          </p>
        </div>

        <aside className="hero-thinking-card" aria-labelledby="hero-thinking-title">
          <h2 className="hero-thinking-title" id="hero-thinking-title">How I think</h2>

          <div className="hero-thinking-tabs" role="tablist" aria-labelledby="hero-thinking-title">
            {thinkingExamples.map((example, index) => (
              <button
                className={`hero-thinking-tab${activeTab === index ? " is-active" : ""}`}
                type="button"
                role="tab"
                id={`hero-thinking-tab-${index}`}
                aria-controls="hero-thinking-panel"
                aria-selected={activeTab === index}
                tabIndex={activeTab === index ? 0 : -1}
                key={example.title}
                onClick={() => setActiveTab(index)}
                onKeyDown={handleTabKeyDown}
              >
                {example.title}
              </button>
            ))}
          </div>

          <div
            className="hero-thinking-panel"
            id="hero-thinking-panel"
            role="tabpanel"
            aria-labelledby={`hero-thinking-tab-${activeTab}`}
            tabIndex={0}
            key={activeTab}
          >
            <div className="hero-thinking-flow">
              {activeExample.steps.map((step, index) => (
                <div className="hero-thinking-step-wrap" key={step.label}>
                  <div className="hero-thinking-step">
                    <span className="hero-thinking-label">{step.label}</span>
                    <p className="hero-thinking-text">{step.text}</p>
                  </div>
                  {index < activeExample.steps.length - 1 && (
                    <svg className="hero-thinking-arrow" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                      <path d="M6 1v7M3.5 5.5 6 8l2.5-2.5" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
