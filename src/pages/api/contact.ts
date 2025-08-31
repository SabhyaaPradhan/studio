
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type ResponseBody = { ok: boolean; message?: string; detail?: string };

const {
  EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD,
  EMAIL_SERVER_HOST = "smtp.gmail.com",
  EMAIL_SERVER_PORT = "587",
  EMAIL_SERVER_SECURE = "false",
  RECEIVER_EMAIL
} = process.env;

const DEFAULT_FROM = EMAIL_SERVER_USER;
const DEFAULT_TO = RECEIVER_EMAIL || EMAIL_SERVER_USER;

function createTransporter() {
  const secure = EMAIL_SERVER_SECURE === "true" || EMAIL_SERVER_PORT === "465";

  return nodemailer.createTransport({
    host: EMAIL_SERVER_HOST,
    port: Number(EMAIL_SERVER_PORT || 587),
    secure,
    auth: {
      user: EMAIL_SERVER_USER,
      pass: EMAIL_SERVER_PASSWORD,
    },
    logger: true,
    debug: true,
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseBody>) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  if (!EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
    return res.status(500).json({
      ok: false,
      message: "Email server credentials missing.",
      detail: "Ensure EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD are configured in environment."
    });
  }

  const { fullName, email, subject, message } = req.body ?? {};

  if (!fullName || !email || !subject || !message) {
    return res.status(400).json({ ok: false, message: "Missing fields (fullName, email, subject, message)." });
  }

  const transporter = createTransporter();

  try {
    await transporter.verify();
    console.log("[contact] SMTP verify: OK");
  } catch (err: any) {
    console.error("[contact] SMTP verify failed:", err?.message || err);
    return res.status(500).json({
      ok: false,
      message: "Unable to connect to email server.",
      detail: err?.message || "SMTP verify failed"
    });
  }

  const mailOptions = {
    from: `"Website Contact" <${DEFAULT_FROM}>`,
    to: DEFAULT_TO,
    replyTo: email,
    subject: `Contact form: ${fullName} <${email}> - ${subject}`,
    text: `Name: ${fullName}\nEmail: ${email}\n\n${message}`,
    html: `
      <h3>Contact form submission</h3>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <hr />
      <div>${(message || "").replace(/\n/g, "<br/>")}</div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("[contact] sendMail OK:", { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected });
    console.log(`Successfully sent email to ${mailOptions.to} with subject: "${mailOptions.subject}"`);
    return res.status(200).json({ ok: true, message: "Email sent" });
  } catch (err: any) {
    console.error("[contact] sendMail error:", err?.message || err);
    return res.status(500).json({
      ok: false,
      message: "Failed to send email.",
      detail: err?.message || "sendMail error"
    });
  }
}
