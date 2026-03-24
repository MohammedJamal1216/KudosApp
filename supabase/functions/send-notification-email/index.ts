import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "onboarding@resend.dev";

interface NotificationRecord {
  id: string;
  user_id: string;
  recipient_email: string | null;
  message: string;
  type: string;
  nomination_id: string | null;
  created_at: string;
}

interface NotificationPayload {
  type: "INSERT";
  table: "notifications";
  record: NotificationRecord;
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Resend API error: ${res.status} ${error}`);
  }

  return res.json();
}

function getSubject(type: string): string {
  switch (type) {
    case "nominated":
      return "You've been nominated! - Kudos App";
    case "vote_received":
      return "Someone voted for you! - Kudos App";
    case "new_nomination":
      return "New nomination to vote on! - Kudos App";
    default:
      return "Notification - Kudos App";
  }
}

function buildHtml(message: string, type: string): string {
  const ctaText =
    type === "new_nomination" ? "Vote Now" : "View on Dashboard";
  const ctaColor =
    type === "new_nomination" ? "#00c9a7" : "#4f38f5";

  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
      <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#4f38f5,#7c3aed);padding:32px 24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">Kudos App</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Employee Recognition</p>
        </div>
        <div style="padding:32px 24px;">
          <p style="font-size:16px;color:#1d2940;line-height:1.6;margin:0 0 24px;">
            ${message}
          </p>
          <a href="https://em-ployee-recogination.vercel.app"
             style="display:inline-block;background:${ctaColor};color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;">
            ${ctaText}
          </a>
        </div>
        <div style="padding:16px 24px;border-top:1px solid #f1f5f9;text-align:center;">
          <p style="font-size:12px;color:#90a3b8;margin:0;">
            You received this because of activity on the Kudos App.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload: NotificationPayload = await req.json();
    const { record } = payload;

    // Skip broadcast notifications
    if (record.user_id === "broadcast") {
      return new Response(JSON.stringify({ skipped: true, reason: "broadcast" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Read email directly from the notification record
    const email = record.recipient_email;

    if (!email) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "no recipient_email" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send the email
    const subject = getSubject(record.type);
    const html = buildHtml(record.message, record.type);
    const result = await sendEmail(email, subject, html);

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
