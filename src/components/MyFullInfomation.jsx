
import "./MyFullInfomation.css";
import avatarImg from "../images/image.png";

const LINKS = {
  github: "https://github.com/CrissNguyenKhanh",
  linkedin: "https://www.linkedin.com/in/qu%E1%BB%91c-kh%C3%A1nh-3679842ba/",
  linktree: "https://tr.ee/cuachukhanh",
  dms: "https://github.com/CrissNguyenKhanh/AI-DRIVER-MONITORING-SYSTEM-DMS",
  android: "https://github.com/CrissNguyenKhanh/MyFinalProjectOfAndroid",
  hayThucKhuya: "https://github.com/CrissNguyenKhanh/HayThucKhuya",
  chatRmi: "https://github.com/CongHien05/Chatapp_RealTime_HEHEH",
  noobApi: "https://github.com/CrissNguyenKhanh/NoobApi",
  nerdAbove: "https://github.com/CrissNguyenKhanh/NERDABOVE",
};

function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  );
}

function ContactRow({ icon, children }) {
  return (
    <div className="mfi-contact-item">
      <span className="mfi-contact-icon" aria-hidden>
        {icon}
      </span>
      <div className="mfi-contact-text">{children}</div>
    </div>
  );
}

function SkillTag({ children }) {
  return <span className="mfi-skill-tag">{children}</span>;
}

function ProjectCard({ title, period, href, bullets }) {
  return (
    <div className="mfi-project-card">
      <div className="mfi-exp-header">
        <span className="mfi-project-name">{title}</span>
        <span className="mfi-project-period">{period}</span>
      </div>
      <div className="mfi-project-link">
        <ExternalLink href={href}>{href.replace("https://", "")}</ExternalLink>
      </div>
      <ul className="mfi-project-bullets">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

export default function MyFullInfomation() {
  return (
    <section
      id="full-info"
      className="mfi-section"
      aria-labelledby="full-info-heading"
    >
      <div className="mfi-inner">
        <p className="mfi-back-home">
          <a href="/">← Back to portfolio</a>
        </p>
        <div className="mfi-actions" aria-label="CV actions">
          <a
            className="mfi-action"
            href="/cv/cv-quoc-khanh-software-engineer.pdf"
            download
          >
            Download CV (PDF)
          </a>
          <a
            className="mfi-action"
            href="/cv/cv-quoc-khanh-software-engineer.html"
            download
          >
            Download CV (HTML)
          </a>
          <a
            className="mfi-action"
            href="/cv/cv-quoc-khanh-software-engineer.doc"
            download
          >
            Download CV (DOC)
          </a>
          <button
            type="button"
            className="mfi-action mfi-action--secondary"
            onClick={() => window.print()}
          >
            Print / Save as PDF
          </button>
        </div>
        <h2 id="full-info-heading" className="mfi-title">
          Full CV (one-page)
        </h2>

        <div className="mfi-cv">
          <aside className="mfi-left" aria-label="CV sidebar">
            <div className="mfi-avatar">
              <img
                src={avatarImg}
                alt="Quoc Khanh"
                className="mfi-avatar-img"
                width={84}
                height={84}
              />
            </div>
            <div className="mfi-name-block">
              <h3>Quoc Khanh</h3>
              <p>Software Engineer</p>
            </div>

            <div className="mfi-left-section">
              <div className="mfi-left-label">Contact</div>
              <ContactRow icon="🎂">02/09/2005 · Male</ContactRow>
              <ContactRow icon="✉">quockhanhdz295@gmail.com</ContactRow>
              <ContactRow icon="☎">(+84) 0949103246</ContactRow>
              <ContactRow icon="📍">Da Nang, Vietnam</ContactRow>
              <ContactRow icon="GitHub">
                <ExternalLink href={LINKS.github}>
                  github.com/CrissNguyenKhanh
                </ExternalLink>
              </ContactRow>
              <ContactRow icon="in">
                <ExternalLink href={LINKS.linkedin}>LinkedIn Profile</ExternalLink>
              </ContactRow>
              <ContactRow icon="🔗">
                <ExternalLink href={LINKS.linktree}>tr.ee/cuachukhanh</ExternalLink>
              </ContactRow>
            </div>

            <div className="mfi-left-section">
              <div className="mfi-left-label">Education</div>
              <div className="mfi-edu-degree">Computer Science / IT</div>
              <div className="mfi-edu-school">
                Self-taught via online resources &amp; personal GitHub projects
              </div>
              <div className="mfi-edu-degree">FPT — Java Certificate</div>
              <div className="mfi-edu-period">May 2025</div>
            </div>

            <div className="mfi-left-section">
              <div className="mfi-left-label">Tech skills</div>
              <div className="mfi-skills-wrap">
                <SkillTag>Java / Spring Boot</SkillTag>
                <SkillTag>REST API</SkillTag>
                <SkillTag>Kotlin / Android</SkillTag>
                <SkillTag>Python / Flask</SkillTag>
                <SkillTag>React 19 + Vite</SkillTag>
                <SkillTag>JavaScript</SkillTag>
                <SkillTag>MySQL</SkillTag>
                <SkillTag>Socket.IO</SkillTag>
                <SkillTag>OpenCV</SkillTag>
                <SkillTag>MediaPipe</SkillTag>
                <SkillTag>scikit-learn</SkillTag>
                <SkillTag>Git / GitHub</SkillTag>
                <SkillTag>JUnit / Mockito</SkillTag>
                <SkillTag>Ubuntu</SkillTag>
                <SkillTag>systemd</SkillTag>
                <SkillTag>Nginx (HayThucKhuya)</SkillTag>
              </div>
            </div>

            <div className="mfi-left-section">
              <div className="mfi-left-label">Interests</div>
              <div className="mfi-interest-item">
                Reading technical blogs &amp; system architecture articles
              </div>
              <div className="mfi-interest-item">
                Building &amp; optimizing personal projects with real data
              </div>
              <div className="mfi-interest-item">Music &amp; movies</div>
            </div>

            <div className="mfi-left-section">
              <div className="mfi-left-label">References</div>
              <div className="mfi-ref-text">Available upon request.</div>
            </div>
          </aside>

          <div className="mfi-right" aria-label="CV main content">
            <div className="mfi-right-section">
              <div className="mfi-section-title">Career Objective</div>
              <p className="mfi-objective-text">
                With a self-taught foundation and a track record of building
                personal projects, I&apos;m seeking a Software Engineer role in
                an environment with clear processes, regular code reviews, and
                products used by real users. I aim to leverage Java backend,
                Python/Flask, and React — backed by projects like an AI Driver
                Monitoring System (DMS), an Android healthcare app, and a Java
                REST API — to contribute meaningful, measurable features.
              </p>
              <p className="mfi-objective-text mfi-objective-text--spaced">
                Short-term (1–2 years): join a product team with frequent code
                reviews and real-world deployment exposure. Long-term: grow into
                an engineer capable of designing modules, mentoring juniors, and
                maintaining a transparent GitHub portfolio.
              </p>
            </div>

            <div className="mfi-right-section">
              <div className="mfi-section-title">Work Experience</div>
              <div className="mfi-exp-entry">
                <div className="mfi-exp-header">
                  <span className="mfi-exp-title">
                    Software Engineer (Personal Projects)
                  </span>
                  <span className="mfi-exp-period">2024 – Present</span>
                </div>
                <div className="mfi-exp-company">Independent / Open Source</div>
                <ul className="mfi-exp-bullets">
                  <li>
                    Built end-to-end projects: AI DMS, Android healthcare app,
                    Java REST APIs, and realtime chat prototypes.
                  </li>
                  <li>
                    Learned from official docs (Spring, Flask, React) and applied
                    the patterns directly to codebases with READMEs and visible
                    structure.
                  </li>
                  <li>
                    Maintained clean Git workflow: small commits, clear messages,
                    and feature branches.
                  </li>
                  <li>
                    Focused on correctness: validation, layered architecture,
                    logging, and reproducible run steps.
                  </li>
                </ul>
              </div>
            </div>

            <div className="mfi-right-section">
              <div className="mfi-section-title">Featured Projects</div>

              <ProjectCard
                title="AI Driver Monitoring System (DMS)"
                period="03/2026"
                href={LINKS.dms}
                bullets={[
                  "Real-time driver monitoring using OpenCV preprocessing and MediaPipe landmarks.",
                  "scikit-learn classifiers for scoring / classification; Flask + Gunicorn backend; React 19 + Vite frontend.",
                  "Realtime channels via Socket.IO; MySQL persistence; Telegram notifications.",
                ]}
              />

              <ProjectCard
                title="Healthcare Mobile Suite (Android)"
                period="05/2025 – 08/2025"
                href={LINKS.android}
                bullets={[
                  "Kotlin Android app for appointment booking and user-facing flows.",
                  "Spring Boot REST backend secured with JWT; JPA + MySQL persistence.",
                  "Retrofit/OkHttp, coroutines, and Material components.",
                ]}
              />

              <div className="mfi-two-col">
                <ProjectCard
                  title="HayThucKhuya — Diagnostic assistant"
                  period="12/2025"
                  href={LINKS.hayThucKhuya}
                  bullets={[
                    "Gaussian Naive Bayes (scikit-learn) over symptom features.",
                    "pandas/NumPy preprocessing pipeline; small Python web layer.",
                    "Deployed on Ubuntu with systemd + Nginx edge proxy.",
                  ]}
                />
                <ProjectCard
                  title="NoobApi — Java REST API"
                  period="05/2025"
                  href={LINKS.noobApi}
                  bullets={[
                    "Auth + role-based access; CRUD across multiple entities.",
                    "Layered structure (controller/service/repository), with JUnit/Mockito tests where applicable.",
                    "MySQL-backed persistence and clear JSON contracts.",
                  ]}
                />
              </div>

              <div className="mfi-two-col mfi-two-col--spaced">
                <ProjectCard
                  title="Realtime chat — RMI + security (collab)"
                  period="11–12/2025"
                  href={LINKS.chatRmi}
                  bullets={[
                    "Java RMI client–server chat; structured DTO design.",
                    "Security-focused handling: validation, exception boundaries, and auditable logs.",
                  ]}
                />
                <ProjectCard
                  title="NERDABOVE — Laravel web app"
                  period="12/2024"
                  href={LINKS.nerdAbove}
                  bullets={[
                    "Laravel MVC: routing, Eloquent ORM, Blade templates.",
                    "MySQL + Vite + JavaScript for a dynamic web interface.",
                  ]}
                />
              </div>
            </div>

            <div className="mfi-two-col">
              <div className="mfi-right-section">
                <div className="mfi-section-title">Achievements</div>
                <div className="mfi-award-row">
                  <span className="mfi-award-year">2024</span>
                  <span className="mfi-award-desc">
                    Published JavaChatApplication &amp; NERDABOVE — expanded
                    from Java to full-stack web evidence.
                  </span>
                </div>
                <div className="mfi-award-row">
                  <span className="mfi-award-year">2025</span>
                  <span className="mfi-award-desc">
                    Deployed HayThucKhuya (Naive Bayes diagnostic demo) on Ubuntu
                    and documented run steps for repeatability.
                  </span>
                </div>
              </div>
              <div className="mfi-right-section">
                <div className="mfi-section-title">
                  Certifications &amp; Activities
                </div>
                <div className="mfi-cert-row">
                  <span className="mfi-cert-year">2025</span>
                  <span className="mfi-cert-text">
                    FPT — Java Certificate (May 2025)
                  </span>
                </div>
                <div className="mfi-activity">
                  <strong className="mfi-activity-title">
                    Community &amp; self-learning (2023 – Present)
                  </strong>
                  <div className="mfi-activity-text">
                    Active in online programming communities (Java, Python,
                    React). Maintains public repos and helps peers with debugging
                    and mini-projects.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
