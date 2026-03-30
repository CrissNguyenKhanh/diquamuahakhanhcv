import "./ProjectsSection.css";

const GITHUB_USER = "CrissNguyenKhanh";
const GITHUB_BASE = `https://github.com/${GITHUB_USER}`;

function repoHref(owner, slug) {
  return `https://github.com/${owner}/${slug}`;
}

/** GitHub `created_at` (UTC) — verified via API; update if you rename or recreate a repo */
function formatRepoCreated(isoDate) {
  const d = new Date(`${isoDate}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/**
 * Curated portfolio — your strongest work plus one collaborative repo.
 * `owner` defaults to your account; omit for CrissNguyenKhanh/*.
 */
const FEATURED_PROJECTS = [
  {
    slug: "AI-DRIVER-MONITORING-SYSTEM-DMS",
    title: "AI Driver Monitoring System (DMS)",
    blurb:
      "Flask + Gunicorn APIs, React 19 (Vite) dashboard, Socket.IO channels, and MySQL for sessions and telemetry. Vision path uses OpenCV preprocessing and MediaPipe landmarks; tabular risk scoring runs through scikit-learn classifiers. Telegram hooks carry alert payloads out of the core services.",
    stack: [
      "Python",
      "Flask",
      "Gunicorn",
      "React",
      "Vite",
      "JS",
      "MySQL",
      "Socket.IO",
      "OpenCV",
      "MediaPipe",
      "scikit-learn",
    ],
    accent: "cyan",
    createdAt: "2026-03-16",
  },
  {
    slug: "MyFinalProjectOfAndroid",
    title: "Healthcare mobile suite",
    blurb:
      "Kotlin Android app (Material, coroutines, Retrofit/OkHttp) talks to a Spring Boot REST tier with DTO validation, service layers, and MySQL via JPA. JSON Web Tokens secure mobile sessions; admin or companion views can ship as the same API consumer pattern.",
    stack: [
      "Kotlin",
      "Android",
      "Material",
      "Retrofit",
      "Spring Boot",
      "Java",
      "REST",
      "JPA",
      "MySQL",
      "JWT",
    ],
    accent: "java",
    createdAt: "2025-05-13",
  },
  {
    slug: "HayThucKhuya",
    title: "HayThucKhuya — diagnostic assistant",
    blurb:
      "Symptom features are vectorized with pandas/NumPy, trained with scikit-learn Gaussian Naive Bayes (probabilistic classification), and exposed through a small Python web layer. The Ubuntu host runs systemd units plus Nginx as the edge: proxy to the app, gzip/brotli-friendly static bundles, and painless rolling updates.",
    stack: [
      "Python",
      "pandas",
      "NumPy",
      "scikit-learn",
      "Naive Bayes",
      "Flask",
      "Ubuntu",
      "Nginx",
      "systemd",
    ],
    accent: "cyan",
    createdAt: "2025-12-12",
  },
  {
    slug: "Chatapp_RealTime_HEHEH",
    owner: "CongHien05",
    title: "Realtime chat (RMI + security)",
    blurb:
      "Collaborative Java/Maven build: Spring-aware services expose RMI endpoints with hardened stubs, structured DTOs, and logging suitable for audits. Clients stay on explicit Java RMI contracts while the server JVM owns remote object lifecycles.",
    stack: [
      "Java",
      "Maven",
      "Spring",
      "RMI",
      "JUnit",
      "SLF4J",
      "JSON",
    ],
    accent: "violet",
    collab: true,
    createdAt: "2025-11-25",
  },
  {
    slug: "NoobApi",
    title: "NoobApi",
    blurb:
      "Java REST API with auth filters, layered controllers, MySQL persistence, and JUnit/Mockito coverage. Docker images pin JDK/runtime deps so teammates reproduce the same ports, env files, and integration tests locally.",
    stack: [
      "Java",
      "REST",
      "MySQL",
      "Docker",
      "JUnit",
      "Mockito",
      "JSON",
      "Maven",
    ],
    accent: "java",
    createdAt: "2025-05-30",
  },
  {
    slug: "JavaChatApplication",
    title: "JavaChatApplication",
    blurb:
      "Thread-pooled socket server, JSON-framed messages, and Swing or console clients sharing one protocol definition. JDBC-backed MySQL (or lightweight embedded demos) can store user rosters and session metadata.",
    stack: [
      "Java",
      "Sockets",
      "Threads",
      "Swing",
      "JSON",
      "JDBC",
      "MySQL",
      "Maven",
    ],
    accent: "java",
    createdAt: "2024-06-24",
  },
  {
    slug: "ChatSwing-Java",
    title: "ChatSwing-Java",
    blurb:
      "Portfolio bundle spanning Swing desktops, servlet/JSP modules, Hibernate mappings, Spring MVC samples, and raw socket labs. Typical coursework stack: Tomcat or embedded servers, MySQL schemas, and JavaScript sprinkles on server-rendered views.",
    stack: [
      "Java",
      "Swing",
      "Servlets",
      "JSP",
      "Spring",
      "Hibernate",
      "MySQL",
      "JavaScript",
      "Tomcat",
      "Maven",
    ],
    accent: "violet",
    createdAt: "2025-09-18",
  },
  {
    slug: "NERDABOVE",
    title: "NERDABOVE",
    blurb:
      "Laravel MVC with Eloquent models, Blade components, vanilla or lightweight JS on the blade layer, and MySQL migrations. Front-end assets compile through Vite; queues and schedules stay Laravel-native when you grow past the first deploy.",
    stack: [
      "Laravel",
      "PHP",
      "Blade",
      "MySQL",
      "Eloquent",
      "JavaScript",
      "Vite",
      "Composer",
    ],
    accent: "violet",
    createdAt: "2024-12-01",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="projects-section" aria-labelledby="projects-heading">
      <div className="projects-inner">
        <p className="projects-kicker">
          <a href={GITHUB_BASE} target="_blank" rel="noreferrer noopener">
            github.com/{GITHUB_USER}
          </a>
        </p>
        <h2 id="projects-heading" className="projects-title">
          Featured projects
        </h2>
        <p className="projects-sub">
          Each card lists concrete languages and frameworks — MySQL where data
          lives, React/Vite or Android on the client, Docker or Tomcat only when
          the repo actually uses them. <strong>Nginx</strong> appears solely on{" "}
          HayThucKhuya, where the Ubuntu deployment is fronted for real traffic.
          ML callouts stay explicit (
          <strong>scikit-learn</strong> + OpenCV/MediaPipe on DMS;{" "}
          <strong>Gaussian Naive Bayes</strong> on HayThucKhuya).{" "}
          <strong>Repo created</strong> dates match each repository&apos;s
          GitHub <code>created_at</code> (UTC) so hiring teams can see steady
          activity over time. Links open the canonical GitHub repository.
        </p>

        <ul className="projects-grid">
          {FEATURED_PROJECTS.map((p) => {
            const owner = p.owner ?? GITHUB_USER;
            const href = repoHref(owner, p.slug);
            const pathLabel = `${owner}/${p.slug}`;
            return (
              <li key={pathLabel}>
                <article
                  className={`project-card project-card--accent-${p.accent}`}
                >
                  {p.collab ? (
                    <p className="project-card__badge" lang="en">
                      Collaborative
                    </p>
                  ) : null}
                  <h3 className="project-card__title">{p.title}</h3>
                  <p className="project-card__repo" lang="en">
                    <code>{pathLabel}</code>
                  </p>
                  <p className="project-card__created" lang="en">
                    <time dateTime={p.createdAt}>
                      Repo created {formatRepoCreated(p.createdAt)}
                    </time>
                  </p>
                  <p className="project-card__blurb">{p.blurb}</p>
                  <ul className="project-card__stack" aria-label="Tech stack">
                    {p.stack.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <a
                    className="project-card__link"
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    View on GitHub
                    <span className="project-card__arrow" aria-hidden>
                      →
                    </span>
                  </a>
                </article>
              </li>
            );
          })}
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
