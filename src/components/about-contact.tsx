"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";

type ContactValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ContactErrors = Partial<Record<keyof ContactValues, string>> & {
  general?: string;
};

export function EngineeringApproachSection() {
  const principles = [
    {
      title: "Architecture & data",
      description: "Shape data models, API boundaries, and access rules around how the business works.",
    },
    {
      title: "Processing & calculations",
      description: "Build pricing and financial logic, high-volume data processing, queues, and real-time updates.",
    },
    {
      title: "Production ownership",
      description: "Ship integrations, secure API routes, tune queries, and troubleshoot deployed systems.",
    },
  ];

  return (
    <section className="site-section approach-section" id="approach">
      <div className="page-container">
        <div className="section-intro section-intro--compact">
          <div>
            <p className="eyebrow">How I work</p>
            <h2 className="section-title">From system design through production.</h2>
          </div>
          <p className="section-summary">
            I focus on the details that let business software process data correctly and stay useful in day-to-day work.
          </p>
        </div>
        <div className="approach-grid">
          {principles.map((principle) => (
            <article className="approach-card" key={principle.title}>
              <h3 className="approach-title">{principle.title}</h3>
              <p className="approach-description">{principle.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="site-section about-section" id="about">
      <div className="page-container">
        <div className="profile-band">
          <div className="profile-identity">
            <Image
              className="profile-photo"
              src="/images/profile.webp"
              alt="Dashrath Bhil"
              width={96}
              height={96}
            />
            <div>
              <p className="eyebrow">Experience</p>
              <h2 className="profile-name">Dashrath Bhil</h2>
              <p className="profile-role">Backend Software Engineer</p>
              <p className="profile-location">Ahmedabad, Gujarat</p>
            </div>
          </div>

          <div className="experience">
            <div className="experience-grid">
              <div className="experience-item">
                <span className="experience-period">June 2025 — Present</span>
                <strong>Senior Backend Developer</strong>
                <span>Azentra Technologies</span>
              </div>
              <div className="experience-item">
                <span className="experience-period">May 2024 — June 2025</span>
                <strong>Software Developer Intern</strong>
                <span>FramboxxIT Pvt Ltd</span>
              </div>
            </div>
            <p className="education-line">
              B.Com, J.J.C. Education Commerce College · Academic First Rank Award · 2021–2024
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState<ContactValues>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactErrors>({});

  function updateField(field: keyof ContactValues, value: string) {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (field === "email" || field === "phone") {
        return { ...previous, email: undefined, phone: undefined, general: undefined };
      }
      return { ...previous, [field]: undefined, general: undefined };
    });
  }

  function validateForm() {
    const nextErrors: ContactErrors = {};
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!formData.name.trim()) nextErrors.name = "Please add your name.";
    if (!formData.message.trim()) {
      nextErrors.message = "Please add a message.";
    } else if (formData.message.length > 5000) {
      nextErrors.message = "Message is too long.";
    }

    if (!email && !phone) {
      nextErrors.email = "Add an email address or phone number.";
      nextErrors.phone = "Add an email address or phone number.";
    } else if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        window.setTimeout(() => {
          setStatus("idle");
          setFormData({ name: "", email: "", phone: "", message: "" });
        }, 3000);
        return;
      }

      const payload: { error?: string } = await response.json().catch(() => ({}));
      setErrors({ general: payload.error || "Something went wrong. Please try again." });
      setStatus("error");
    } catch {
      setErrors({ general: "Connection issue. Please try again." });
      setStatus("error");
    }
  }

  return (
    <section className="site-section contact-section" id="contact">
      <div className="page-container contact-layout">
        <div className="contact-copy">
          <p className="eyebrow">Contact</p>
          <h2 className="section-title">Let&apos;s talk about the work.</h2>
          <p className="contact-description">
            For backend roles or project conversations about business software, send me a note.
          </p>
          <a className="contact-email" href="mailto:dashrathbhil.in@gmail.com">
            dashrathbhil.in@gmail.com <span aria-hidden="true">↗</span>
          </a>
          <div className="contact-links" aria-label="Professional links">
            <a href="https://github.com/dashrathbhil" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/dashrathbhil" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a
              href="/Dashrath_Bhil_Backend_Software_Engineer_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Dashrath_Bhil_Backend_Software_Engineer_Resume.pdf"
            >
              Resume
            </a>
          </div>
        </div>

        <div className="contact-form-wrap">
          {status === "success" ? (
            <div className="form-success" role="status">
              <span className="form-success__mark" aria-hidden="true">✓</span>
              <strong>Message sent.</strong>
              <span>Thanks for reaching out.</span>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {errors.general && <p className="form-error form-error--general" role="alert">{errors.general}</p>}

              <div className="form-grid">
                <div className="form-field form-field--wide">
                  <label className="form-label" htmlFor="contact-name">Full name <span>*</span></label>
                  <input
                    id="contact-name"
                    className="field-input"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                  />
                  {errors.name && <span className="form-error" id="contact-name-error">{errors.name}</span>}
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="contact-email">Email address</label>
                  <input
                    id="contact-email"
                    className="field-input"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                  />
                  {errors.email && <span className="form-error" id="contact-email-error">{errors.email}</span>}
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="contact-phone">Phone number</label>
                  <input
                    id="contact-phone"
                    className="field-input"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                  />
                  {errors.phone && <span className="form-error" id="contact-phone-error">{errors.phone}</span>}
                </div>

                <div className="form-field form-field--wide">
                  <label className="form-label" htmlFor="contact-message">Message <span>*</span></label>
                  <textarea
                    id="contact-message"
                    className="field-input field-input--message"
                    rows={4}
                    maxLength={5000}
                    value={formData.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                  />
                  {errors.message && <span className="form-error" id="contact-message-error">{errors.message}</span>}
                </div>
              </div>

              <div className="form-footer">
                <p>Contact details are used only to respond to your enquiry.</p>
                <button className="button button-primary form-submit" type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Sending…" : "Send message"}
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container site-footer__inner">
        <span>© 2026 Dashrath Bhil</span>
        <span>Backend Software Engineer · Ahmedabad, Gujarat</span>
        <a href="#hero">Back to top ↑</a>
      </div>
    </footer>
  );
}
