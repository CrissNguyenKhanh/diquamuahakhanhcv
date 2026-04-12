import "./SkillsSection.css";
import { useScrollReveal } from "../hooks/useScrollReveal";

const GITHUB = "https://github.com/CrissNguyenKhanh";

const featuredSkills = [
  {
    id: "java",
    className: "skill-card--java",
    icon: "☕",
    name: "Java ecosystem",
    badge: "Strongest public signal",
    level: 95,
    note: "NoobApi, MyApiProject, sever-socket-demojava, JavaChatApplication, ChatSwing-Java, SwingForFun, & more — APIs, sockets, Swing, coursework.",
    barDelay: "0.45s",
  },
  {
    id: "ai-stack",
    className: "skill-card--ai",
    icon: "◆",
    name: "Vision & data-driven apps",
    badge: "DMS & coursework",
    level: 90,
    note: "OpenCV, MediaPipe, scikit-learn, Flask + React/Vite, Socket.IO, MySQL — see the driver-monitoring (DMS) repo for the full stack.",
    barDelay: "0.55s",
  },
];

const CLEAR_SIGNAL = [
  "Java",
  "Java backend / REST APIs",
  "Spring / Spring Boot (evidenced in repos)",
  "Networking & sockets (Java)",
  "Kotlin",
  "Android (Kotlin)",
  "C++",
  "HTML",
  "CSS",
  "JavaScript",
  "PHP",
  "Laravel",
  "Blade",
  "MySQL",
  "Web UI (JS/HTML repos)",
  "Research & deep dives",
  "Leadership & ownership",
];

const STRONG_EVIDENCE = [
  "Spring / Spring Core",
  "Java Servlet",
  "Hibernate",
  "Java Swing (desktop)",
  "Authentication & authorization",
  "CRUD APIs",
  "Unit testing (per project docs)",
  "Security-minded development",
  "Encryption coursework (e.g. AES/Java scripting)",
  "Maven-style layouts",
];

const RECENT_FOCUS = [
  "Python",
  "Flask",
  "Flask-CORS",
  "Flask-SocketIO",
  "PyMySQL",
  "React 19",
  "Vite",
  "React Router",
  "Socket.IO (client)",
  "OpenCV",
  "MediaPipe",
  "NumPy",
  "scikit-learn",
  "Model training & evaluation",
  "Telegram bot / webhooks",
];

function SkillTier({ title, description, tags, variant }) {
  return (
    <div className={`skills-tier skills-tier--${variant}`}>
      <div className="skills-tier__head">
        <span className="skills-tier__accent" aria-hidden />
        <div>
          <h3 className="skills-tier__title">{title}</h3>
          <p className="skills-tier__desc">{description}</p>
        </div>
      </div>
      <div className="skills-chips" role="list">
        {tags.map((t, i) => (
          <span
            key={t}
            className="skills-chip"
            role="listitem"
            style={{ "--chip-i": i }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const headRef = useScrollReveal();
  const featuredRef = useScrollReveal({ threshold: 0.05 });
  const tiersRef = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="skills" className="skills-section" aria-labelledby="skills-heading">
      <div className="skills-inner">
        <div ref={headRef} data-reveal>
        <p className="skills-kicker">
          <a href={GITHUB} target="_blank" rel="noreferrer noopener">
            @CrissNguyenKhanh
          </a>{" "}
          · Da Nang · evidence from public repos
        </p>
        <h2 id="skills-heading" className="skills-title">
          Skills (GitHub-backed)
        </h2>
        <p className="skills-sub">
          I reviewed my public profile the way a recruiter might: repos,
          languages, READMEs, and visible structure. This is{" "}
          <strong>not</strong> a claim about every skill I possess — only what
          can be <strong>cross-checked</strong> on GitHub today.
        </p>

        <p className="skills-disclaimer" role="note">
          <strong>Method:</strong> clearest signal → strong supporting evidence →
          recently emphasized (newer stacks). Items without solid public proof
          (e.g. deep production DevOps, cloud at scale, CI/CD maturity) are{" "}
          <em>not</em> listed as confirmed skills here.
        </p>
        </div>

        <div className="skills-featured" ref={featuredRef} data-reveal>
          {featuredSkills.map((s) => (
            <article
              key={s.id}
              className={`skill-card--featured ${s.className}`}
            >
              <span className="skill-card__glow" aria-hidden />
              <div className="skill-card__header">
                <div className="skill-card__title-row">
                  {s.icon.length === 1 ? (
                    <span
                      className="skill-card__icon skill-card__icon--letter"
                      aria-hidden
                    >
                      {s.icon}
                    </span>
                  ) : (
                    <span className="skill-card__icon" aria-hidden>
                      {s.icon}
                    </span>
                  )}
                  <div className="skill-card__titles">
                    <h3 className="skill-card__name">{s.name}</h3>
                    <span className="skill-card__badge">{s.badge}</span>
                  </div>
                </div>
                <span className="skill-card__pct">{s.level}%</span>
              </div>
              <div className="skill-card__bar-wrap">
                <div
                  className="skill-card__bar"
                  style={{
                    "--level": `${s.level}%`,
                    "--bar-delay": s.barDelay,
                  }}
                />
              </div>
              <p className="skill-card__note">{s.note}</p>
            </article>
          ))}
        </div>

        <div className="skills-tiers-wrap" ref={tiersRef} data-reveal>
          <p className="skills-tiers-kicker">Skill matrix</p>
          <SkillTier
            variant="clearest"
            title="Clearest public signal"
            description="Core languages and stacks that show up consistently across your public repos."
            tags={CLEAR_SIGNAL}
          />
          <SkillTier
            variant="strong"
            title="Strong supporting evidence"
            description="Patterns and modules that back up README claims — Spring stack, Swing, security habits, tests."
            tags={STRONG_EVIDENCE}
          />
          <SkillTier
            variant="recent"
            title="Recently emphasized"
            description="Python / Flask / React (Vite), sockets, OpenCV-side tooling — anchored by the DMS project on GitHub."
            tags={RECENT_FOCUS}
          />
        </div>

        <p className="skills-uncertain">
          <strong>Not enough public proof to state confidently:</strong> advanced
          platform DevOps, multi-region cloud operations, mature CI/CD in
          production, large-system architecture ownership, or data engineering
          depth — my public GitHub doesn&apos;t fully document those yet.
        </p>

        <aside className="skills-credentials" aria-label="Certifications">
          <h3 className="skills-credentials__title">Certifications</h3>
          <p className="skills-credentials__text">
            <strong>FPT — Java (May 2025):</strong> completed FPT&apos;s Java
            certification program.
          </p>
        </aside>

        <p className="skills-github-hint">
          Always treat this page as a <em>summary</em>. Primary sources live at{" "}
          <a href={GITHUB} target="_blank" rel="noreferrer noopener">
            github.com/CrissNguyenKhanh
          </a>
          . Edit evidence lists in{" "}
          <code>SkillsSection.jsx</code> when you ship new projects.
        </p>
      </div>
    </section>
  );
}
