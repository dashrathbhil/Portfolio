"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const resumePath = "/Dashrath_Bhil_Backend_Software_Engineer_Resume.pdf";

type NavLink = { label: string; href: string; external?: boolean };

const navLinks: NavLink[] = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "How I work", href: "#approach" },
  { label: "Resume", href: resumePath, external: true },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    let savedTheme: string | null = null;
    try {
      savedTheme = window.localStorage.getItem("portfolio-theme");
    } catch {
      // System theme remains available when browser storage is restricted.
    }
    const initialTheme = savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : media.matches ? "dark" : "light";

    document.documentElement.dataset.theme = initialTheme;
    setTheme(initialTheme);

    const updateFromSystem = (event: MediaQueryListEvent) => {
      try {
        const saved = window.localStorage.getItem("portfolio-theme");
        if (saved === "light" || saved === "dark") return;
      } catch {
        // Continue following the system preference when storage is restricted.
      }
      const systemTheme = event.matches ? "dark" : "light";
      document.documentElement.dataset.theme = systemTheme;
      setTheme(systemTheme);
    };

    media.addEventListener("change", updateFromSystem);
    return () => media.removeEventListener("change", updateFromSystem);
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.dataset.theme ?? "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem("portfolio-theme", nextTheme);
    } catch {
      // Keep the selected theme for this page even if storage is unavailable.
    }
    setTheme(nextTheme);
  };

  return (
    <header className="site-header">
      <div className="page-container site-header__inner">
        <a href="/#hero" className="site-logo" aria-label="Dashrath Bhil, home">
          <span className="site-logo__mark" aria-hidden="true">DB</span>
          <span>Dashrath Bhil</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.slice(0, 4).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className="theme-toggle"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={theme === "dark"}
            onClick={toggleTheme}
          >
            <span className="theme-toggle__icon" aria-hidden="true">
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.1 15.1A8.4 8.4 0 0 1 8.9 3.9 8.5 8.5 0 1 0 20.1 15.1Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                </svg>
              )}
            </span>
          </button>
          <a className="header-contact" href="#contact">Contact</a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span aria-hidden="true">{isOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="page-container mobile-nav__links">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="mobile-nav__link"
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                  <span aria-hidden="true">→</span>
                </a>
              ))}
              <div className="mobile-nav__socials">
                <a href="https://github.com/dashrathbhil" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://linkedin.com/in/dashrathbhil" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="mailto:dashrathbhil.in@gmail.com">Email</a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
