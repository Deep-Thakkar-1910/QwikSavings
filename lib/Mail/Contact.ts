"use server";
import nodemailer from "nodemailer";

interface EmailData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMail(data: EmailData) {
  const { SMTP_USER, SMTP_PASS } = process.env;

  const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: {
        name: "QwikSavings Contact Form",
        address: "qwiksavings@qwiksavings.com",
      },
      to: "contact@qwiksavings.com",
      subject: data.subject,
      text: `
        Name: ${data.fullName}
        Email: ${data.email}
        Message: ${data.message}
      `,
    });

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error sending email" };
  }
}
