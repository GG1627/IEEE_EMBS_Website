// supabase/functions/discord-captcha-verify/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Payload = {
  verification_token: string;
  captcha_token: string;
};

const allowedOrigins = [
  "https://www.ufembs.com",
  "https://embs.ufl.edu",
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
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405, headers: cors });

  try {
    const body: Payload = await req.json();

    const verificationToken = (body.verification_token || "").trim();
    const captchaToken = (body.captcha_token || "").trim();

    if (!verificationToken || !captchaToken) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing verification_token or captcha_token." }),
        {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        }
      );
    }

    // Step 1: Validate CAPTCHA with Turnstile
    const TURNSTILE_SECRET_KEY = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (!TURNSTILE_SECRET_KEY) {
      throw new Error("TURNSTILE_SECRET_KEY not configured");
    }

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET_KEY,
          response: captchaToken,
        }),
      }
    );

    const turnstileData = await turnstileResponse.json();

    if (!turnstileData.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "CAPTCHA verification failed. Please try again.",
        }),
        {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        }
      );
    }

    // Step 2: Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 3: Check verification token in database
    const { data: tokenData, error: tokenError } = await supabase
      .from("discord_verification_tokens")
      .select("*")
      .eq("token", verificationToken)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (tokenError || !tokenData) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid or expired verification token. Please request a new link from Discord.",
        }),
        {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        }
      );
    }

    // Step 4: Get Discord bot token and role IDs from environment
    const DISCORD_BOT_TOKEN = Deno.env.get("DISCORD_BOT_TOKEN");
    const DISCORD_VERIFIED_ROLE_ID = Deno.env.get("DISCORD_VERIFIED_ROLE_ID");
    const DISCORD_UNVERIFIED_ROLE_ID = Deno.env.get("DISCORD_UNVERIFIED_ROLE_ID");

    if (!DISCORD_BOT_TOKEN || !DISCORD_VERIFIED_ROLE_ID) {
      throw new Error("Discord configuration missing");
    }

    const guildId = tokenData.guild_id;
    const discordUserId = tokenData.discord_user_id;

    // Step 5: Grant verified role
    const addRoleResponse = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}/roles/${DISCORD_VERIFIED_ROLE_ID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!addRoleResponse.ok) {
      const errorText = await addRoleResponse.text();
      console.error("Discord API error (add role):", errorText);
      throw new Error(`Failed to grant verified role: ${addRoleResponse.status}`);
    }

    // Step 6: Remove unverified role (if configured)
    if (DISCORD_UNVERIFIED_ROLE_ID) {
      const removeRoleResponse = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}/roles/${DISCORD_UNVERIFIED_ROLE_ID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Log but don't fail if removing unverified role fails
      if (!removeRoleResponse.ok) {
        console.warn("Failed to remove unverified role (non-critical):", await removeRoleResponse.text());
      }
    }

    // Step 7: Mark token as used
    const { error: updateError } = await supabase
      .from("discord_verification_tokens")
      .update({ used: true })
      .eq("id", tokenData.id);

    if (updateError) {
      console.error("Error marking token as used:", updateError);
      // Don't fail the request if this fails - role was already granted
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification successful. Return to Discord to see the server.",
      }),
      {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in discord-captcha-verify function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred during verification. Please contact an officer.",
      }),
      {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      }
    );
  }
});
