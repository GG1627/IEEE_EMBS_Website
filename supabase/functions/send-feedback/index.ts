// supabase/functions/send-feedback/index.ts
type Payload = {
  name?: string;
  email?: string;
  subject: string;
  message: string;
  anonymous?: boolean;
};

const allowedOrigins = [
  "https://www.ufembs.com",
  "http://localhost:5173",
];

const getCorsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
});

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const cors = getCorsHeaders(origin);
  
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: cors });

  try {
    const body: Payload = await req.json();

    const anonymous = !!body.anonymous;
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();
    const name = anonymous ? "Anonymous" : (body.name || "Anonymous").trim();
    const email = anonymous ? "" : (body.email || "").trim();

    if (!subject || !message) {
      return new Response(JSON.stringify({ ok: false, error: "Missing subject or message." }), {
        status: 400, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const MAIL_FROM = "EMBS UF <noreply@auth.ufembs.com>"; // Using verified domain
    const MAIL_TO = Deno.env.get("MAIL_TO");     // club inbox
    
    if (!RESEND_API_KEY || !MAIL_FROM || !MAIL_TO) {
      throw new Error("Missing mail env vars");
    }

    const emailText = `
Anonymous: ${anonymous ? "Yes" : "No"}
Name: ${name}
Email: ${anonymous ? "(hidden)" : email || "(none)"}

Message:
${message}
    `.trim();

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [MAIL_TO],
        reply_to: anonymous ? undefined : email || undefined,
        subject: `[Feedback] ${subject}`,
        text: emailText,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Resend error: ${errText}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
