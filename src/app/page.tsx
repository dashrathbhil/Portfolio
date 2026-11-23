import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects";
import { SkillsSection } from "@/components/skills-section";
import {
  EngineeringApproachSection,
  ContactSection,
  Footer,
} from "@/components/about-contact";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <SkillsSection />
      <EngineeringApproachSection />
      <ContactSection />
      <Footer />
    </>
  );
}
