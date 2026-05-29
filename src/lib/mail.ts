import { getSiteSettings } from "@/lib/site-settings";

type MailPayload = {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
};

export type MailResult = {
  ok: boolean;
  provider: "resend" | "disabled";
  error?: string;
};

function configuredFrom() {
  return process.env.MAIL_FROM || process.env.RESEND_FROM || "Gyokurinken <onboarding@resend.dev>";
}

export async function sendMail(payload: MailPayload): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info(`[mail disabled] ${payload.subject} -> ${Array.isArray(payload.to) ? payload.to.join(",") : payload.to}`);
    return { ok: false, provider: "disabled", error: "RESEND_API_KEY is not configured." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: configuredFrom(),
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      reply_to: payload.replyTo
    })
  });

  if (!response.ok) {
    return { ok: false, provider: "resend", error: await response.text() };
  }

  return { ok: true, provider: "resend" };
}

export async function adminNotificationEmail() {
  const settings = await getSiteSettings();
  return process.env.ADMIN_NOTIFY_EMAIL || settings.contact.email || process.env.ADMIN_EMAIL || "";
}
