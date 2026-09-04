// Supabase Edge Function: send-inquiry
// Receives a painting inquiry from inquire.html, logs it to the `inquiries`
// table, and emails it to the gallery via Resend. Runs server-side, so this
// is the only place the Resend API key (a real secret) is ever used.
//
// Deploy: supabase functions deploy send-inquiry
// Secret: supabase secrets set RESEND_API_KEY=your_resend_key

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RECIPIENT_EMAIL = "crea8ivekidcreations.3@gmail.com";
const SENDER_EMAIL = "Afshan Art Gallery <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { product_id, product_title, name, email, phone, message } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Name and email are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: insertError } = await supabaseAdmin.from("inquiries").insert({
      product_id: product_id || null,
      product_title: product_title || null,
      name,
      email,
      phone: phone || null,
      message: message || null,
    });
    if (insertError) throw insertError;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: SENDER_EMAIL,
          to: RECIPIENT_EMAIL,
          reply_to: email,
          subject: `New inquiry: ${product_title || "a painting"}`,
          html: `
            <h2>New painting inquiry</h2>
            <p><strong>Painting:</strong> ${product_title || "Unknown"}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "-"}</p>
            <p><strong>Message:</strong><br>${(message || "-").replace(/\n/g, "<br>")}</p>
          `,
        }),
      });
      if (!emailRes.ok) {
        console.error("Resend error:", await emailRes.text());
        // Inquiry is already logged in the database even if the email fails,
        // so don't fail the whole request over an email delivery hiccup.
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
