const express = require("express");
const app = express();

const PORT = Number(process.env.PORT || 10000);
const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM;
const ORIGINS = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",").map(x => x.trim().replace(/\/$/, "")).filter(Boolean);
const MAX_RECIPIENTS = Number(process.env.MAX_RECIPIENTS || 20);
const MAX_ATTACHMENT_MB = Number(process.env.MAX_ATTACHMENT_MB || 10);

app.disable("x-powered-by");
app.use(express.json({ limit: "15mb" }));

// Basic per-process IP rate limit.
const hits = new Map();
app.use((req, res, next) => {
  const ip = req.ip || "unknown", now = Date.now();
  let item = hits.get(ip);
  if (!item || now - item.start > 60000) item = { start: now, count: 0 };
  item.count++;
  hits.set(ip, item);
  if (item.count > Number(process.env.MAX_REQUESTS_PER_MINUTE || 30))
    return res.status(429).json({ success:false, error:"Too many requests. Try again shortly." });
  next();
});

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (ORIGINS.includes("*") || ORIGINS.includes(origin.replace(/\/$/, "")))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const validEmail = x => typeof x === "string" && x.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);

app.get("/health", (_req, res) => res.json({
  success:true, service:"one-gram-demo-email-api",
  configured:Boolean(API_KEY && FROM)
}));

app.post("/api/send-email", async (req, res) => {
  try {
    if (!API_KEY || !FROM)
      return res.status(503).json({ success:false, error:"Set RESEND_API_KEY and EMAIL_FROM on Render." });

    let { to, subject, html, text, replyTo, attachments } = req.body || {};
    if (typeof to === "string") to = [to];
    if (!Array.isArray(to) || !to.length || to.length > MAX_RECIPIENTS)
      return res.status(400).json({ success:false, error:`to must contain 1-${MAX_RECIPIENTS} email address(es).` });

    to = [...new Set(to.map(x => typeof x === "string" ? x.trim().toLowerCase() : ""))];
    if (to.some(x => !validEmail(x)))
      return res.status(400).json({ success:false, error:"One or more recipient email addresses are invalid." });
    if (typeof subject !== "string" || !subject.trim() || subject.length > 200)
      return res.status(400).json({ success:false, error:"A subject (max 200 characters) is required." });
    if (!(typeof html === "string" && html) && !(typeof text === "string" && text))
      return res.status(400).json({ success:false, error:"Provide html, text, or both." });
    if (replyTo !== undefined && !validEmail(replyTo))
      return res.status(400).json({ success:false, error:"replyTo must be a valid email address." });

    if (attachments === undefined) attachments = [];
    if (!Array.isArray(attachments) || attachments.length > 5)
      return res.status(400).json({ success:false, error:"attachments must be an array of at most 5 files." });

    let totalBytes = 0;
    const cleanAttachments = [];
    for (const file of attachments) {
      if (!file || typeof file.filename !== "string" || typeof file.content !== "string")
        return res.status(400).json({ success:false, error:"Each attachment needs filename and base64 content." });
      const content = file.content.includes(",") ? file.content.split(",").pop() : file.content;
      if (!/^[A-Za-z0-9+/=\r\n]+$/.test(content))
        return res.status(400).json({ success:false, error:`Invalid base64 attachment: ${file.filename}` });
      const buffer = Buffer.from(content, "base64");
      totalBytes += buffer.length;
      cleanAttachments.push({ filename:file.filename.slice(0,180), content:buffer.toString("base64") });
    }
    if (totalBytes > MAX_ATTACHMENT_MB * 1024 * 1024)
      return res.status(400).json({ success:false, error:`Attachments exceed ${MAX_ATTACHMENT_MB} MB total.` });

    // Send separately: bulk recipients cannot see one another's email addresses.
    const results = [];
    for (const recipient of to) {
      const payload = {
        from:FROM, to:[recipient], subject:subject.trim(),
        ...(html ? {html} : {}), ...(text ? {text} : {}),
        ...(replyTo ? {reply_to:replyTo} : {}),
        ...(cleanAttachments.length ? {attachments:cleanAttachments} : {})
      };
      const response = await fetch("https://api.resend.com/emails", {
        method:"POST",
        headers:{ Authorization:`Bearer ${API_KEY}`, "Content-Type":"application/json" },
        body:JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      results.push(response.ok
        ? {email:recipient, success:true, id:data.id}
        : {email:recipient, success:false, error:data.message || data.error || "Resend send failed"});
    }
    const sent = results.filter(x => x.success).length;
    const failed = results.length - sent;
    return res.status(failed === results.length ? 502 : 200).json({
      success:failed === 0, sent, failed, results,
      message:`${sent} email(s) sent; ${failed} failed.`
    });
  } catch (err) {
    console.error("Email API error:", err);
    return res.status(500).json({ success:false, error:"Unexpected email service error." });
  }
});

app.use((err, _req, res, _next) => {
  if (err.type === "entity.too.large")
    return res.status(413).json({ success:false, error:"Request payload is too large." });
  console.error(err);
  res.status(400).json({ success:false, error:"Invalid request." });
});

app.listen(PORT, "0.0.0.0", () => console.log(`Email API listening on ${PORT}`));
