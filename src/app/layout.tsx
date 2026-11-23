import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { BackToTop } from "@/components/ui/back-to-top";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dashrath Bhil — Backend Software Engineer",
  description:
    "Senior Backend Developer building Node.js systems across API design, data processing, integrations, and production workflows.",
  keywords: [
    "backend software engineer",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Redis",
    "BullMQ",
    "WebSockets",
    "production engineering",
    "data processing",
  ],
  authors: [{ name: "Dashrath Bhil" }],
  openGraph: {
    type: "website",
    title: "Dashrath Bhil — Backend Software Engineer",
    description:
      "Backend systems for complex business workflows, from data models and processing logic to integrations and production support.",
    siteName: "Dashrath Bhil",
  },
};

const themeBootstrapScript = `(() => {
  try {
    const savedTheme = localStorage.getItem("portfolio-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : systemPrefersDark ? "dark" : "light";
  } catch {
    document.documentElement.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main id="main-content" className="relative z-10 flex-1">
          {children}
        </main>
        <BackToTop />
      </body>
    </html>
  );
}
