/**
 * Vercel Serverless — POST JSON to forward messages to your inbox via Web3Forms.
 *
 * Setup:
 * 1. https://web3forms.com — create form, set destination to quockhanhdz295@gmail.com
 * 2. Vercel → Project → Settings → Environment Variables → WEB3FORMS_ACCESS_KEY
 * 3. Redeploy
 */

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    res.status(503).json({
      error: "not_configured",
      message: "Contact API is not configured (missing WEB3FORMS_ACCESS_KEY).",
    });
    return;
  }

  let body;
  try {
    body = await parseJsonBody(req);
  } catch {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject =
    String(body.subject ?? "").trim() || "Message from portfolio site";
  const languages = String(body.languages ?? "").trim();
  const databases = String(body.databases ?? "").trim();
  const stacks = String(body.stacks ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    res
      .status(400)
      .json({ error: "Name, email, and message are required." });
    return;
  }

  const extra = [
    languages && `Languages: ${languages}`,
    databases && `Databases: ${databases}`,
    stacks && `Frameworks / tools / other: ${stacks}`,
  ]
    .filter(Boolean)
    .join("\n");

  const fullMessage = [
    `From: ${name}`,
    `Reply-To: ${email}`,
    "",
    extra || "(no stack rows)",
    "",
    message,
  ].join("\n");

  const upstream = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `[Portfolio] ${subject}`,
      name,
      email,
      message: fullMessage,
    }),
  });

  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok || data.success === false) {
    res.status(502).json({
      error: data.message || "Email service rejected the request",
    });
    return;
  }

  res.status(200).json({ ok: true });
}

async function parseJsonBody(req) {
  if (req.body != null && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === "string" && req.body.length > 0) {
    return JSON.parse(req.body);
  }

  const raw = await new Promise((resolve, reject) => {
    let buf = "";
    req.on("data", (c) => {
      buf += c;
    });
    req.on("end", () => resolve(buf));
    req.on("error", reject);
  });

  return raw ? JSON.parse(raw) : {};
}
