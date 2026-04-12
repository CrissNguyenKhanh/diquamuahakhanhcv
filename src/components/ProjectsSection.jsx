import { useRef } from "react";
import "./ProjectsSection.css";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { FiExternalLink } from "react-icons/fi";
import {
  SiOpenjdk, SiSpring, SiSpringboot, SiKotlin, SiAndroid, SiPython, SiFlask,
  SiReact, SiMysql, SiDocker, SiNginx, SiLaravel, SiPhp,
  SiOpencv, SiSocketdotio, SiVite, SiTypescript, SiJavascript,
  SiApachemaven, SiNumpy, SiScikitlearn, SiPandas,
} from "react-icons/si";

const GITHUB_USER = "CrissNguyenKhanh";
const GITHUB_BASE = `https://github.com/${GITHUB_USER}`;

/* Map tech label → { Icon, color } for branded pills */
const TECH_MAP = {
  Java:          { Icon: SiOpenjdk,      color: "#f89820" },
  "Spring Boot": { Icon: SiSpringboot,   color: "#6db33f" },
  Spring:        { Icon: SiSpring,       color: "#6db33f" },
  Kotlin:        { Icon: SiKotlin,       color: "#c792ea" },
  Android:       { Icon: SiAndroid,      color: "#3ddc84" },
  Python:        { Icon: SiPython,       color: "#4b8bbe" },
  Flask:         { Icon: SiFlask,        color: "#e8e8e8" },
  Gunicorn:      { Icon: SiFlask,        color: "#499848" },
  React:         { Icon: SiReact,        color: "#61dafb" },
  MySQL:         { Icon: SiMysql,        color: "#4479a1" },
  Docker:        { Icon: SiDocker,       color: "#2496ed" },
  Nginx:         { Icon: SiNginx,        color: "#009639" },
  Laravel:       { Icon: SiLaravel,      color: "#ff2d20" },
  PHP:           { Icon: SiPhp,          color: "#8993be" },
  OpenCV:        { Icon: SiOpencv,       color: "#5c3ee8" },
  "Socket.IO":   { Icon: SiSocketdotio,  color: "#e8e8e8" },
  Vite:          { Icon: SiVite,         color: "#646cff" },
  JS:            { Icon: SiJavascript,   color: "#f7df1e" },
  TypeScript:    { Icon: SiTypescript,   color: "#3178c6" },
  Maven:         { Icon: SiApachemaven,  color: "#c71a36" },
  NumPy:         { Icon: SiNumpy,        color: "#4dabcf" },
  "scikit-learn":{ Icon: SiScikitlearn,  color: "#f7931e" },
  pandas:        { Icon: SiPandas,       color: "#150458" },
};

function repoHref(owner, slug) {
  return `https://github.com/${owner}/${slug}`;
}

function formatRepoCreated(isoDate) {
  const d = new Date(`${isoDate}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  }).format(d);
}

const FEATURED_PROJECTS = [
  {
    slug: "AI-DRIVER-MONITORING-SYSTEM-DMS",
    title: "AI Driver Monitoring System",
    blurb:
      "Flask + Gunicorn APIs, React 19 (Vite) dashboard, Socket.IO channels, and MySQL for sessions and telemetry. Vision path uses OpenCV preprocessing and MediaPipe landmarks; tabular risk scoring runs through scikit-learn classifiers. Telegram hooks carry alert payloads out of the core services.",
    stack: ["Python","Flask","Gunicorn","React","Vite","JS","MySQL","Socket.IO","OpenCV","scikit-learn"],
    accent: "cyan",
    createdAt: "2026-03-16",
    featured: true,
  },
  {
    slug: "MyFinalProjectOfAndroid",
    title: "Healthcare Mobile Suite",
    blurb:
      "Kotlin Android app (Material, coroutines, Retrofit/OkHttp) talks to a Spring Boot REST tier with DTO validation, service layers, and MySQL via JPA. JWT secures mobile sessions.",
    stack: ["Kotlin","Android","Spring Boot","Java","MySQL","Maven"],
    accent: "java",
    createdAt: "2025-05-13",
  },
  {
    slug: "HayThucKhuya",
    title: "HayThucKhuya — Diagnostic AI",
    blurb:
      "Symptom features vectorized with pandas/NumPy, trained with scikit-learn Gaussian Naive Bayes. Ubuntu host runs systemd + Nginx as edge proxy for rolling deployments.",
    stack: ["Python","pandas","NumPy","scikit-learn","Flask","Nginx"],
    accent: "cyan",
    createdAt: "2025-12-12",
  },
  {
    slug: "Chatapp_RealTime_HEHEH",
    owner: "CongHien05",
    title: "Realtime Chat (RMI)",
    blurb:
      "Collaborative Java/Maven: Spring-aware services expose hardened RMI endpoints with structured DTOs, security stubs, and SLF4J audit logging.",
    stack: ["Java","Maven","Spring","Maven"],
    accent: "violet",
    collab: true,
    createdAt: "2025-11-25",
  },
  {
    slug: "NoobApi",
    title: "NoobApi",
    blurb:
      "Java REST API with auth filters, layered controllers, MySQL persistence, and JUnit/Mockito coverage. Docker images pin JDK/runtime deps.",
    stack: ["Java","MySQL","Docker","Maven"],
    accent: "java",
    createdAt: "2025-05-30",
  },
  {
    slug: "JavaChatApplication",
    title: "JavaChatApplication",
    blurb:
      "Thread-pooled socket server, JSON-framed messages, and Swing/console clients sharing one protocol definition. JDBC-backed MySQL.",
    stack: ["Java","MySQL","Maven"],
    accent: "java",
    createdAt: "2024-06-24",
  },
  {
    slug: "ChatSwing-Java",
    title: "ChatSwing-Java",
    blurb:
      "Portfolio bundle spanning Swing desktops, servlet/JSP modules, Hibernate mappings, Spring MVC samples, and raw socket labs. Tomcat + MySQL backend.",
    stack: ["Java","Spring","MySQL","JS","Maven"],
    accent: "violet",
    createdAt: "2025-09-18",
  },
  {
    slug: "NERDABOVE",
    title: "NERDABOVE",
    blurb:
      "Laravel MVC with Eloquent models, Blade components, vanilla JS, MySQL migrations, and Vite asset compilation.",
    stack: ["Laravel","PHP","MySQL","JS","Vite"],
    accent: "violet",
    createdAt: "2024-12-01",
  },
];

/* ── Language color dots (like GitHub) ─────── */
const LANG_COLOR = {
  Java: "#b07219", Python: "#3572a5", Kotlin: "#a97bff",
  PHP: "#4f5d95", JavaScript: "#f1e05a", TypeScript: "#3178c6",
};
const PRIMARY_LANG = {
  "AI-DRIVER-MONITORING-SYSTEM-DMS": "Python",
  MyFinalProjectOfAndroid: "Kotlin",
  HayThucKhuya: "Python",
  Chatapp_RealTime_HEHEH: "Java",
  NoobApi: "Java",
  JavaChatApplication: "Java",
  "ChatSwing-Java": "Java",
  NERDABOVE: "PHP",
};

function TechPill({ tech }) {
  const entry = TECH_MAP[tech];
  return (
    <li className="project-card__pill">
      {entry && (
        <entry.Icon
          className="project-card__pill-icon"
          style={{ color: entry.color }}
          aria-hidden
        />
      )}
      {tech}
    </li>
  );
}

function ProjectCard({ p, index }) {
  const cardRef = useRef(null);
  const owner    = p.owner ?? GITHUB_USER;
  const href     = repoHref(owner, p.slug);
  const langName = PRIMARY_LANG[p.slug];
  const langCol  = LANG_COLOR[langName];

  function handleTilt(e) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${y * -9}deg`);
    card.style.setProperty("--tilt-y", `${x *  9}deg`);
    card.style.setProperty("--shine-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--shine-y", `${((e.clientY - rect.top)  / rect.height) * 100}%`);
  }
  function resetTilt() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <li style={{ "--card-i": index }}>
      <article
        ref={cardRef}
        className={`project-card project-card--accent-${p.accent}${p.featured ? " project-card--featured" : ""}`}
        onMouseMove={handleTilt}
        onMouseLeave={resetTilt}
      >
        {/* Shine layer */}
        <div className="project-card__shine" aria-hidden />

        {/* Top bar */}
        <div className="project-card__top">
          <div className="project-card__meta-row">
            {p.collab && (
              <span className="project-card__badge project-card__badge--collab">Collaborative</span>
            )}
            {p.featured && (
              <span className="project-card__badge project-card__badge--feat">Featured</span>
            )}
          </div>
          <a
            className="project-card__icon-link"
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`GitHub: ${p.title}`}
          >
            <FiExternalLink />
          </a>
        </div>

        {/* Title */}
        <h3 className="project-card__title">{p.title}</h3>

        {/* Repo path */}
        <p className="project-card__repo">
          <code>{owner}/{p.slug}</code>
        </p>

        {/* Language dot + created */}
        <div className="project-card__foot-meta">
          {langName && (
            <span className="project-card__lang">
              <span
                className="project-card__lang-dot"
                style={{ background: langCol }}
                aria-hidden
              />
              {langName}
            </span>
          )}
          <time className="project-card__created" dateTime={p.createdAt}>
            Created {formatRepoCreated(p.createdAt)}
          </time>
        </div>

        {/* Blurb */}
        <p className="project-card__blurb">{p.blurb}</p>

        {/* Stack pills */}
        <ul className="project-card__stack" aria-label="Tech stack">
          {p.stack.filter((t, i, a) => a.indexOf(t) === i).map((t) => (
            <TechPill key={t} tech={t} />
          ))}
        </ul>

        {/* CTA */}
        <a className="project-card__link" href={href} target="_blank" rel="noreferrer noopener">
          View on GitHub
          <span className="project-card__arrow" aria-hidden>→</span>
        </a>
      </article>
    </li>
  );
}

export default function ProjectsSection() {
  const headRef = useScrollReveal();
  const gridRef = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="projects" className="projects-section" aria-labelledby="projects-heading">
      <div className="projects-inner">

        <div ref={headRef} data-reveal>
          <div className="sec-label">
            <span className="sec-label__num">02</span>
            <span className="sec-label__line" />
          </div>
          <h2 id="projects-heading" className="projects-title">
            Featured Work
          </h2>
          <p className="projects-sub">
            Real repositories with verifiable stacks — MySQL where data lives, React/Vite or
            Android on the client. ML callouts stay explicit:{" "}
            <strong>scikit-learn</strong> + OpenCV/MediaPipe on DMS;{" "}
            <strong>Gaussian Naive Bayes</strong> on HayThucKhuya.
            Hover cards for a 3-D peek. Links open GitHub.
          </p>
        </div>

        <ul className="projects-grid" ref={gridRef} data-reveal>
          {FEATURED_PROJECTS.map((p, i) => (
            <ProjectCard key={`${p.owner ?? GITHUB_USER}/${p.slug}`} p={p} index={i} />
          ))}
        </ul>

        <p className="projects-foot">
          <a href={GITHUB_BASE} target="_blank" rel="noreferrer noopener">
            See all {GITHUB_USER} repositories →
          </a>
        </p>
      </div>
    </section>
  );
}
