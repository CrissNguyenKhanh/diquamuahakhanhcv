import { useState } from "react";
import "./ContactForm.css";
import avatarImg from "../images/image.png";

const GITHUB = "https://github.com/CrissNguyenKhanh";
const TREE_LINK = "https://tr.ee/cuachukhanh";
const LINKEDIN =
  "https://www.linkedin.com/in/qu%E1%BB%91c-kh%C3%A1nh-3679842ba/";

/**
 * Web3Forms “access key” can live in Vite env (public in bundle — OK per Web3Forms).
 * On Vercel: add VITE_WEB3FORMS_ACCESS_KEY and redeploy so the build embeds it.
 */
const WEB3_CLIENT_KEY = String(
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? "",
).trim();

/** Mailto when neither Web3 path works (e.g. local dev without any key). */
const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL ?? "quockhanhdz295@gmail.com";

function buildWeb3Message(payload) {
  const { name, email, languages, databases, stacks, message } = payload;
  const extra = [
    languages && `Languages: ${languages}`,
    databases && `Databases: ${databases}`,
    stacks && `Frameworks / tools / other: ${stacks}`,
  ]
    .filter(Boolean)
    .join("\n");
  return [
    `From: ${name}`,
    `Reply-To: ${email}`,
    "",
    extra || "(no stack rows)",
    "",
    message,
  ].join("\n");
}

function web3formsUserMessage(data) {
  if (!data || typeof data !== "object") return "";
  return String(data.message || data.body?.message || "").trim();
}

async function submitToWeb3Forms(accessKey, payload) {
  const key = String(accessKey ?? "").trim();
  if (!key) {
    return {
      ok: false,
      message: "Missing Web3Forms access key.",
    };
  }

  const upstream = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: key,
      subject: `[Portfolio] ${payload.subject}`,
      name: payload.name,
      email: payload.email,
      message: buildWeb3Message(payload),
    }),
  });
  const data = await upstream.json().catch(() => ({}));
  const msg = web3formsUserMessage(data);
  const ok = upstream.ok && data.success === true;

  if (ok) {
    return { ok: true, message: msg };
  }

  return {
    ok: false,
    message:
      msg ||
      "Web3Forms rejected this request. Check the access key, Web3Forms inbox limits, and spam folder.",
  };
}

function buildMailtoBody({
  name,
  email,
  languages,
  databases,
  stacks,
  message,
}) {
  const extra = [
    languages && `Languages: ${languages}`,
    databases && `Databases: ${databases}`,
    stacks && `Frameworks / tools / other: ${stacks}`,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    `From: ${name}`,
    `Email: ${email}`,
    "",
    extra || null,
    extra ? "" : null,
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

function openMailtoDraft({ name, email, subject, languages, databases, stacks, message }) {
  const body = buildMailtoBody({
    name,
    email,
    languages,
    databases,
    stacks,
    message,
  });
  const sub = subject || "Message from portfolio";
  window.location.href = `mailto:${encodeURIComponent(CONTACT_EMAIL)}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
}

export default function ContactForm() {
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
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

    const payload = {
      name,
      email,
      subject,
      languages,
      databases,
      stacks,
      message,
    };

    setSending(true);

    try {
      if (WEB3_CLIENT_KEY) {
        const result = await submitToWeb3Forms(WEB3_CLIENT_KEY, payload);
        if (result.ok) {
          setStatus({
            type: "ok",
            text: "Message sent — I'll reply to your email soon.",
          });
          form.reset();
          return;
        }
        setStatus({
          type: "info",
          text: result.message,
        });
        return;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let dataJson = {};
      try {
        dataJson = await res.json();
      } catch {
        /* non-JSON error page */
      }

      if (res.ok) {
        setStatus({
          type: "ok",
          text: "Message sent — I'll reply to your email soon.",
        });
        form.reset();
        return;
      }

      if (res.status === 503 && dataJson.error === "not_configured") {
        openMailtoDraft(payload);
        setStatus({
          type: "ok",
          text:
            "Opening your mail app. On Vercel, add VITE_WEB3FORMS_ACCESS_KEY (or WEB3FORMS_ACCESS_KEY for /api/contact) and redeploy.",
        });
        return;
      }

      setStatus({
        type: "info",
        text:
          (typeof dataJson.error === "string" && dataJson.error) ||
          dataJson.message ||
          "Could not deliver the message. Prefer VITE_WEB3FORMS_ACCESS_KEY (browser) on Web3Forms free plan — see Web3Forms docs.",
      });
    } catch {
      openMailtoDraft(payload);
      setStatus({
        type: "ok",
        text:
          "Opening your mail app. For direct send from the site: set VITE_WEB3FORMS_ACCESS_KEY on Vercel and redeploy (or run the app with that key in .env locally).",
      });
    } finally {
      setSending(false);
    }
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
