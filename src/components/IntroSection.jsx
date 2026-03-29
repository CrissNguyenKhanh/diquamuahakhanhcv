import "./IntroSection.css";
import avatarImg from "../images/image.png";

const GITHUB = "https://github.com/CrissNguyenKhanh";

export default function IntroSection() {
  return (
    <section id="intro" className="intro">
      <div className="intro__grid">
        <div className="intro__text">
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
              <strong>recently highlighted work</strong> (including newer
              Python / Flask / React / CV stacks).
            </p>
            <p className="intro__cred">
              <strong>Credential:</strong> In{" "}
              <strong>May 2025</strong> I earned a formal{" "}
              <strong>Java certification from FPT</strong>, alongside my
              hands-on JVM and backend projects.
            </p>
            <p>
              On the <strong>AI</strong> side I&apos;m especially comfortable
              with <strong>computer vision</strong> and{" "}
              <strong>machine learning</strong>: end-to-end pipelines,
              classical ML, integrating vision libraries, and{" "}
              <strong>training / iterating on models</strong> until they behave
              well on real inputs — not just calling APIs, but shaping the model
              story from data to deployment (see the driver-monitoring / DMS
              work on GitHub for the fullest example).
            </p>
            <p>
              <a href={GITHUB} target="_blank" rel="noreferrer noopener">
                Browse source &amp; READMEs on GitHub →
              </a>
            </p>
          </div>
        </div>

        <div className="intro__visual">
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
