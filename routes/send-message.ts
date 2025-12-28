import pb from "../utils/pb.ts";
import { createTransport } from "nodemailer";
import { Handlers } from "fresh/compat";

const transporter = createTransport({
  host: "localhost",
  port: 25,
  secure: false, // true for 465, false for other ports
  tls: {
    rejectUnauthorized: false,
  },
});

export const handler: Handlers = {
  async POST(_ctx) {
    const req = ctx.req;

    try {
      const form = await req.formData();
      const name = form.get("name")?.toString() || "";
      const email = form.get("email")?.toString() || "";
      const phone = form.get("phone")?.toString() || "";
      const message = form.get("message")?.toString() || "";

      if (!email || !message) {
        return new Response("Email and Message are required", { status: 400 });
      }

      // 1. Save to PocketBase (Blocking - critical data)
      await pb.collection("messages").create({
        name,
        email,
        phone,
        message,
        read: false,
      });

      // 2. Send Notification Email (Non-blocking - optimization)
      // We do NOT await this promise so the user gets an immediate response.
      transporter.sendMail({
        from: '"TKD Dzwirzyno" <trener@tkddzwirzyno.pl>',
        to: "trener@tkddzwirzyno.pl",
        replyTo: email,
        subject: `�� Nowa wiadomość od ${name}`,
        text: `
Otrzymano nową wiadomość ze strony:

Od: ${name}
Email: ${email}
Telefon: ${phone}

Treść:
${message}
        `,
        html: `
          <h2>Nowa wiadomość ze strony</h2>
          <p><strong>Od:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <hr />
          <h3>Treść:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        `,
      })
        .then(() => console.log("Email notification sent for", email))
        .catch((err) =>
          console.error("Failed to send email notification:", err)
        );

      const url = new URL(req.url);
      return Response.redirect(url.origin + "/kontakt?success=true", 303);
    } catch (e) {
      console.error("Contact Form Error:", e);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
