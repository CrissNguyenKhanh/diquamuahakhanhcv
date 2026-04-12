import "./HeroSection.css";
import avatarImg from "../images/image.png";
import { FiGithub, FiLinkedin, FiExternalLink, FiChevronRight, FiMail, FiMapPin } from "react-icons/fi";
import { useTypewriter } from "../hooks/useTypewriter";
import { IconBrackets } from "./HeroIcons";

const GITHUB   = "https://github.com/CrissNguyenKhanh";
const TREE     = "https://tr.ee/cuachukhanh";
const LINKEDIN = "https://www.linkedin.com/in/qu%E1%BB%91c-kh%C3%A1nh-3679842ba/";

const ROLES = [
  "Software Engineer",
  "Java · Spring Developer",
  "Android · Kotlin Dev",
  "ML · Vision Enthusiast",
];

const TECH_PILLS = [
  { sym: "☕", label: "Java"     },
  { sym: "🌱", label: "Spring"   },
  { sym: "🧠", label: "CV / ML"  },
  { sym: "⚛️", label: "React"    },
  { sym: "⚡", label: "C++"      },
  { sym: "🧪", label: "Flask"    },
  { sym: "📱", label: "Kotlin"   },
  { sym: "🔬", label: "Research" },
  { sym: "🎯", label: "Lead"     },
];

const STATS = [
  { num: "28+", label: "Repos" },
  { num: "3+",  label: "Years" },
  { num: "∞",   label: "Coffee" },
];

export default function HeroSection() {
  const { text: role, done } = useTypewriter(ROLES);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="hero" className="hero">
      {/* Decorative background */}
      <div className="hero__bg" aria-hidden>
        <span className="hero__orb hero__orb--a" />
        <span className="hero__orb hero__orb--b" />
        <span className="hero__orb hero__orb--c" />
        <span className="hero__gridlines" />
      </div>

      <div className="hero__grid">
        {/* ── Left column ─────────────────── */}
        <div className="hero__left">

          {/* Availability badge */}
          <div className="hero__available" aria-label="Open to work">
            <span className="hero__available-dot" aria-hidden />
            Open to work
          </div>

          {/* Avatar + copy row */}
          <div className="hero__intro">
            <div className="hero__avatar-shell">
              <div className="hero__avatar-ring" />
              <img
                src={avatarImg}
                alt="Criss Nguyen"
                className="hero__avatar-img"
                width={112}
                height={112}
              />
              <span className="hero__avatar-badge" aria-hidden>
                <IconBrackets />
              </span>
            </div>

            <div className="hero__copy">
              <p className="hero__hello">
                <span className="hero__hello-icon" aria-hidden>✦</span>
                Hi there!{" "}
                <span className="hero__wave" aria-hidden>👋</span>
              </p>

              <h1 className="hero__title">
                I&apos;M{" "}
                <span className="hero__name">Criss Nguyen</span>
              </h1>

              {/* Typewriter role */}
              <p className="hero__role" aria-label={`Role: ${role}`}>
                <span className="hero__role-label">{role}</span>
                <span className={`hero__cursor${done ? " hero__cursor--blink" : ""}`} aria-hidden>|</span>
                <span className="hero__role-dot" aria-hidden>·</span>
                <span className="hero__accent">Nerd above</span>
              </p>

              <p className="hero__loc">
                <FiMapPin className="hero__loc-icon" aria-hidden />
                Da Nang, Vietnam
              </p>

              <p className="hero__tagline">
                I ship APIs, desktop &amp; mobile experiments, web UIs, and
                full-stack + vision projects — with{" "}
                <strong className="hero__tag-em">Java</strong> &amp;{" "}
                <strong className="hero__tag-em">Spring</strong> as my most
                visible backbone, plus strong work in{" "}
                <strong className="hero__tag-em">computer vision</strong>,{" "}
                <strong className="hero__tag-em">ML</strong>, and{" "}
                <strong className="hero__tag-em">training models</strong> end to
                end. Proof on{" "}
                <a href={GITHUB} target="_blank" rel="noreferrer noopener" className="hero__inline-link">
                  GitHub
                </a>
                .
              </p>

              {/* Tech pills */}
              <div className="hero__pills" aria-label="Tech highlights">
                {TECH_PILLS.map((t) => (
                  <span key={t.label} className="hero__pill">
                    <span className="hero__pill-sym" aria-hidden>{t.sym}</span>
                    {t.label}
                  </span>
                ))}
              </div>

              {/* Social + actions row */}
              <div className="hero__bottom-row">
                <div className="hero__social" aria-label="Social links">
                  <a className="hero__social-btn" href={GITHUB}   target="_blank" rel="noreferrer noopener" aria-label="GitHub">
                    <FiGithub />
                  </a>
                  <a className="hero__social-btn" href={LINKEDIN} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
                    <FiLinkedin />
                  </a>
                  <a className="hero__social-btn" href={TREE}     target="_blank" rel="noreferrer noopener" aria-label="Links">
                    <FiExternalLink />
                  </a>
                </div>

                <div className="hero__actions">
                  <button type="button" className="hero__btn hero__btn--outline" onClick={() => scrollTo("skills")}>
                    <span className="hero__btn-icon" aria-hidden>◇</span>
                    MY SKILLS
                    <FiChevronRight className="hero__btn-arrow" aria-hidden />
                  </button>
                  <button type="button" className="hero__btn hero__btn--solid" onClick={() => scrollTo("contact")}>
                    <FiMail aria-hidden />
                    GET IN TOUCH
                  </button>
                </div>
              </div>

              {/* Stats strip */}
              <div className="hero__stats" aria-label="Quick stats">
                {STATS.map((s, i) => (
                  <span key={s.label}>
                    <span className="hero__stat">
                      <strong className="hero__stat-num">{s.num}</strong>
                      <span className="hero__stat-label">{s.label}</span>
                    </span>
                    {i < STATS.length - 1 && (
                      <span className="hero__stat-sep" aria-hidden>·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column — code window ── */}
        <div className="hero__code-col">
          <div className="hero__code-window" aria-hidden>
            <div className="hero__code-accent" />
            <div className="hero__code-titlebar">
              <span className="hero__dot hero__dot--r" />
              <span className="hero__dot hero__dot--y" />
              <span className="hero__dot hero__dot--g" />
              <span className="hero__code-filename">criss.profile.ts</span>
            </div>
            <pre className="hero__pre">
              <code className="hero__code">
                <span className="tok-k">interface</span>{" "}
                <span className="tok-v">CrissProfile</span>{" "}
                <span className="tok-br">{"{"}</span>
                {"\n  "}
                <span className="tok-k">role</span><span className="tok-p">:</span>{" "}
                <span className="tok-s">&quot;Software Engineer&quot;</span><span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">location</span><span className="tok-p">:</span>{" "}
                <span className="tok-s">&quot;Da Nang, VN&quot;</span><span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">focus</span><span className="tok-p">:</span>{" "}
                <span className="tok-br">[</span>
                <span className="tok-s">&quot;Java&quot;</span><span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;Spring&quot;</span>
                <span className="tok-br">]</span><span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">languages</span><span className="tok-p">:</span>{" "}
                <span className="tok-br">[</span>
                <span className="tok-s">&quot;Java&quot;</span><span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;Kotlin&quot;</span><span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;Python&quot;</span><span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;JS&quot;</span><span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;C++&quot;</span><span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;PHP&quot;</span>
                <span className="tok-br">]</span><span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">databases</span><span className="tok-p">:</span>{" "}
                <span className="tok-br">[</span>
                <span className="tok-s">&quot;MySQL&quot;</span>
                <span className="tok-br">]</span><span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">stack</span><span className="tok-p">:</span>{" "}
                <span className="tok-br">[</span>
                <span className="tok-s">&quot;Spring&quot;</span><span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;React&quot;</span><span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;Laravel&quot;</span><span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;Flask&quot;</span>
                <span className="tok-br">]</span><span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">aiStrengths</span><span className="tok-p">:</span>{" "}
                <span className="tok-br">[</span>
                <span className="tok-s">&quot;Computer vision&quot;</span><span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;ML&quot;</span>
                <span className="tok-br">]</span><span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-f">hireable</span><span className="tok-p">():</span>{" "}
                <span className="tok-k">boolean</span><span className="tok-p">;</span>
                {"\n"}
                <span className="tok-br">{"}"}</span>
                {"\n\n"}
                <span className="tok-muted">{"// "}</span>
                <span className="tok-muted">const dev</span>{" "}
                <span className="tok-p">=</span>{" "}
                <span className="tok-k">new</span>{" "}
                <span className="tok-v">CrissProfile</span>
                <span className="tok-p">();</span>
                {"\n"}
                <span className="tok-muted">{"// "}</span>
                <span className="tok-muted">dev</span>
                <span className="tok-p">.</span>
                <span className="tok-f">hireable</span>
                <span className="tok-p">()</span>{" "}
                <span className="tok-p">===</span>{" "}
                <span className="tok-s">true</span>{" "}
                <span className="tok-muted">✓</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
