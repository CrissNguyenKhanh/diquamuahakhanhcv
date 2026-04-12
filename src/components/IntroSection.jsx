import "./IntroSection.css";
import avatarImg from "../images/image.png";
import { useScrollReveal } from "../hooks/useScrollReveal";

const GITHUB = "https://github.com/CrissNguyenKhanh";

export default function IntroSection() {
  const textRef = useScrollReveal();
  const visualRef = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="intro" className="intro">
      <div className="intro__grid">
        <div className="intro__text" ref={textRef} data-reveal="left">
          <h2 className="intro__heading">
            LET ME <span className="intro__hlt">INTRODUCE</span> MYSELF
          </h2>
          <div className="intro__body">
            <p>
              I&apos;m <em className="intro__em">Criss Nguyen</em> —{" "}
              <strong>Software Engineer</strong> based in{" "}
              <strong>Da Nang</strong>. My public bio is short (&quot;Nerd
              above&quot;), but my{" "}
              <a href={GITHUB} target="_blank" rel="noreferrer noopener">
                GitHub
              </a>{" "}
              profile is the real résumé: language stats, READMEs, folder
              structure, and commit history.
            </p>
            <p>
              I don&apos;t claim this site lists <em>every</em> skill I have —
              only what you can <em>verify</em> from{" "}
              <strong>29 public repositories</strong>, pinned projects, and
              documented features (APIs, tests, security notes, stack
              lists). Below &quot;Skills&quot; I group items as{" "}
              <strong>clearest signal</strong>,{" "}
              <strong>strong supporting evidence</strong>, and{" "}
              <strong>recently highlighted work</strong> (including Python,
              Flask, and React stacks).
            </p>
            <p className="intro__cred">
              <strong>Credential:</strong> In{" "}
              <strong>May 2025</strong> I earned a formal{" "}
              <strong>Java certification from FPT</strong>, alongside JVM and
              backend projects grounded in public repos.
            </p>
            <p>
              Recent builds include a{" "}
              <strong>driver-monitoring (DMS)</strong> stack on GitHub — Python,
              Flask, React, vision tooling, and classical ML where the problem
              calls for it.
            </p>
            <p>
              <a href={GITHUB} target="_blank" rel="noreferrer noopener">
                Browse source &amp; READMEs on GitHub →
              </a>
            </p>
          </div>
        </div>

        <div className="intro__visual" ref={visualRef} data-reveal="right">
          <span className="intro__vertical" aria-hidden>
            ABOUT ME
          </span>
          <div className="intro__photo-frame">
            <img
              src={avatarImg}
              alt="Criss Nguyen"
              className="intro__photo"
              width={320}
              height={400}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
