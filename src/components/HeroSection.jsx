import "./HeroSection.css";
import avatarImg from "../images/image.png";
import {
  IconBrackets,
  IconGithub,
  IconLinkedIn,
  IconLinkOut,
  IconMapPin,
} from "./HeroIcons";

const GITHUB = "https://github.com/CrissNguyenKhanh";
const TREE = "https://tr.ee/cuachukhanh";
const LINKEDIN =
  "https://www.linkedin.com/in/qu%E1%BB%91c-kh%C3%A1nh-3679842ba/";

const TECH_PILLS = [
  { sym: "☕", label: "Java" },
  { sym: "🌱", label: "Spring" },
  { sym: "🧠", label: "CV / ML" },
  { sym: "⚛️", label: "React" },
  { sym: "⚡", label: "C++" },
  { sym: "🧪", label: "Flask" },
  { sym: "📱", label: "Kotlin" },
  { sym: "🔬", label: "Research" },
  { sym: "🎯", label: "Lead" },
];

export default function HeroSection() {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="hero" className="hero">
      <div className="hero__bg" aria-hidden>
        <span className="hero__orb hero__orb--a" />
        <span className="hero__orb hero__orb--b" />
        <span className="hero__gridlines" />
      </div>

      <div className="hero__grid">
        <div className="hero__left">
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
                <span className="hero__hello-icon" aria-hidden>
                  ✦
                </span>
                Hi there! <span className="hero__wave">👋</span>
              </p>
              <h1 className="hero__title">
                I&apos;M <span className="hero__name">Criss Nguyen</span>
              </h1>
              <p className="hero__role">
                <span className="hero__role-strong">Software Engineer</span>
                <span className="hero__role-dot" aria-hidden>
                  ·
                </span>
                <span className="hero__accent">Nerd above</span>
              </p>
              <p className="hero__loc">
                <IconMapPin className="hero__loc-icon" />
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
                <a
                  href={GITHUB}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hero__inline-link"
                >
                  GitHub
                </a>
                .
              </p>

              <div className="hero__pills" aria-label="Tech highlights">
                {TECH_PILLS.map((t) => (
                  <span key={t.label} className="hero__pill">
                    <span className="hero__pill-sym" aria-hidden>
                      {t.sym}
                    </span>
                    {t.label}
                  </span>
                ))}
              </div>

              <div className="hero__social" aria-label="Social links">
                <a
                  className="hero__social-btn"
                  href={GITHUB}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="GitHub"
                >
                  <IconGithub />
                </a>
                <a
                  className="hero__social-btn"
                  href={LINKEDIN}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LinkedIn"
                >
                  <IconLinkedIn />
                </a>
                <a
                  className="hero__social-btn"
                  href={TREE}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Link tree"
                >
                  <IconLinkOut />
                </a>
              </div>

              <div className="hero__actions">
                <button
                  type="button"
                  className="hero__btn hero__btn--outline"
                  onClick={() => scrollTo("skills")}
                >
                  <span className="hero__btn-icon" aria-hidden>
                    ◇
                  </span>
                  MY SKILLS
                </button>
                <button
                  type="button"
                  className="hero__btn hero__btn--solid"
                  onClick={() => scrollTo("contact")}
                >
                  GET IN TOUCH <span aria-hidden>📩</span>
                </button>
              </div>
            </div>
          </div>
        </div>

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
                <span className="tok-k">role</span>
                <span className="tok-p">:</span>{" "}
                <span className="tok-s">&quot;Software Engineer&quot;</span>
                <span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">location</span>
                <span className="tok-p">:</span>{" "}
                <span className="tok-s">&quot;Da Nang, VN&quot;</span>
                <span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">focus</span>
                <span className="tok-p">:</span>{" "}
                <span className="tok-br">[</span>
                <span className="tok-s">&quot;Java&quot;</span>
                <span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;Spring&quot;</span>
                <span className="tok-br">]</span>
                <span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">languages</span>
                <span className="tok-p">:</span>{" "}
                <span className="tok-br">[</span>
                <span className="tok-s">&quot;Java&quot;</span>
                <span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;Kotlin&quot;</span>
                <span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;Python&quot;</span>
                <span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;JS&quot;</span>
                <span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;C++&quot;</span>
                <span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;PHP&quot;</span>
                <span className="tok-br">]</span>
                <span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">databases</span>
                <span className="tok-p">:</span>{" "}
                <span className="tok-br">[</span>
                <span className="tok-s">&quot;MySQL&quot;</span>
                <span className="tok-br">]</span>
                <span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">stack</span>
                <span className="tok-p">:</span>{" "}
                <span className="tok-br">[</span>
                <span className="tok-s">&quot;Spring&quot;</span>
                <span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;React&quot;</span>
                <span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;Laravel&quot;</span>
                <span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;Flask&quot;</span>
                <span className="tok-br">]</span>
                <span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">traits</span>
                <span className="tok-p">:</span>{" "}
                <span className="tok-br">[</span>
                <span className="tok-s">&quot;Research&quot;</span>
                <span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;Lead&quot;</span>
                <span className="tok-br">]</span>
                <span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-k">aiStrengths</span>
                <span className="tok-p">:</span>{" "}
                <span className="tok-br">[</span>
                <span className="tok-s">&quot;Computer vision&quot;</span>
                <span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;ML&quot;</span>
                <span className="tok-p">,</span>{" "}
                <span className="tok-s">&quot;Train models&quot;</span>
                <span className="tok-br">]</span>
                <span className="tok-p">;</span>
                {"\n  "}
                <span className="tok-f">hireable</span>
                <span className="tok-p">():</span>{" "}
                <span className="tok-k">boolean</span>
                <span className="tok-p">;</span>
                {"\n"}
                <span className="tok-br">{"}"}</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
