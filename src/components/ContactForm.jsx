import { useState } from "react";
import "./ContactForm.css";
import avatarImg from "../images/image.png";

const GITHUB = "https://github.com/CrissNguyenKhanh";
const TREE_LINK = "https://tr.ee/cuachukhanh";
const LINKEDIN =
  "https://www.linkedin.com/in/qu%E1%BB%91c-kh%C3%A1nh-3679842ba/";

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? "";

export default function ContactForm() {
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject =
      String(data.get("subject") ?? "").trim() || "Message from portfolio";
    const languages = String(data.get("languages") ?? "").trim();
    const databases = String(data.get("databases") ?? "").trim();
    const stacks = String(data.get("stacks") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus({
        type: "info",
        text: "Please fill in name, email, and message.",
      });
      return;
    }

    setSending(true);

    const extra = [
      languages && `Languages: ${languages}`,
      databases && `Databases: ${databases}`,
      stacks && `Frameworks / tools / other: ${stacks}`,
    ]
      .filter(Boolean)
      .join("\n");

    const body = [`From: ${name}`, `Email: ${email}`, "", extra || null, extra ? "" : null, message]
      .filter((line) => line !== null)
      .join("\n");

    window.setTimeout(() => {
      setSending(false);
      if (CONTACT_EMAIL) {
        const mail = `mailto:${encodeURIComponent(CONTACT_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mail;
        setStatus({
          type: "ok",
          text: "Opening your mail app — languages, DB, and stack are included in the body.",
        });
      } else {
        setStatus({
          type: "ok",
          text: "Recorded (demo). Set VITE_CONTACT_EMAIL in .env to send via Mailto.",
        });
        form.reset();
      }
    }, 380);
  }

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <div className="contact-card">
        <aside className="contact-aside">
          <div className="contact-avatar-wrap">
            <div className="contact-avatar-ring" aria-hidden />
            <div className="contact-avatar-inner">
              <img
                src={avatarImg}
                alt="Criss Nguyen"
                className="contact-avatar"
                width={220}
                height={220}
              />
            </div>
          </div>
          <p className="contact-kicker">Contact</p>
          <h2 id="contact-heading" className="contact-title">
            Let&apos;s talk
          </h2>
          <p className="contact-lead">
            Share your stack (languages, databases, frameworks) so I can reply with
            the right context.
          </p>
          <div className="contact-links">
            <a href={GITHUB} target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer noopener">
              LinkedIn
            </a>
            <a href={TREE_LINK} target="_blank" rel="noreferrer noopener">
              Link tree
            </a>
          </div>
        </aside>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-row">
            <div className="contact-field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
              />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="contact-field">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              placeholder="e.g. Collaboration, internship, project idea"
            />
          </div>

          <div className="contact-row">
            <div className="contact-field">
              <label htmlFor="contact-languages">Programming languages</label>
              <span className="contact-hint">Comma-separated</span>
              <input
                id="contact-languages"
                name="languages"
                type="text"
                placeholder="Java, Kotlin, Python, JavaScript…"
              />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-databases">Databases</label>
              <span className="contact-hint">SQL / NoSQL you use</span>
              <input
                id="contact-databases"
                name="databases"
                type="text"
                placeholder="MySQL, PostgreSQL, Redis…"
              />
            </div>
          </div>

          <div className="contact-field">
            <label htmlFor="contact-stacks">Frameworks &amp; other skills</label>
            <span className="contact-hint">Spring, Laravel, React, Flask…</span>
            <input
              id="contact-stacks"
              name="stacks"
              type="text"
              placeholder="Spring Boot, Flask, Git, CI/CD…"
            />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Project details, timeline, or questions…"
              rows={5}
            />
          </div>

          {status ? (
            <p
              className={`contact-status contact-status--${status.type === "ok" ? "ok" : "info"}`}
              role="status"
            >
              {status.text}
            </p>
          ) : null}

          <button type="submit" className="contact-submit" disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}
