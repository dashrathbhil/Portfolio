const skillGroups = [
  {
    title: "Backend",
    skills: ["JavaScript (ES6+)", "Node.js", "Express.js"],
  },
  {
    title: "Data & processing",
    skills: ["SQL", "PostgreSQL", "MongoDB", "Redis", "Sequelize", "Prisma", "BullMQ", "WebSockets"],
  },
  {
    title: "Cloud & integrations",
    skills: ["AWS S3", "MediaConvert", "Zoho Sign API", "Aircall API", "Supabase"],
  },
  {
    title: "Tools & supporting skills",
    skills: ["Git", "GitHub", "Postman", "React.js", "HTML5", "CSS3", "Figma"],
  },
];

export function SkillsSection() {
  return (
    <section className="site-section skills-section" id="skills">
      <div className="page-container">
        <div className="section-intro section-intro--compact">
          <div>
            <p className="eyebrow">Technical skills</p>
            <h2 className="section-title">Tools I use in the work.</h2>
          </div>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group) => (
            <div className="skill-group" key={group.title}>
              <h3>{group.title}</h3>
              <p>{group.skills.join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
