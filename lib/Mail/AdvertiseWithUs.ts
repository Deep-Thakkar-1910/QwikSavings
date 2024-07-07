"use server";
import nodemailer from "nodemailer";

interface AdvertiseWithUsEmailData {
  fullName: string;
  companyName: string;
  websiteUrl: string;
  email: string;
  isAffiliateNetwork: "Yes" | "No";
  message: string;
}

export async function sendAdvertiseWithUsMail(data: AdvertiseWithUsEmailData) {
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
        name: "QwikSavings Advertise With Us Form",
        address: "qwiksavings@qwiksavings.com",
      },
      to: "dthakkar477@gmail.com",
      subject: "New Advertising Inquiry",
      text: `
        Name: ${data.fullName}
        Company Name: ${data.companyName}
        Website URL: ${data.websiteUrl}
        Email: ${data.email}
        Affiliate Network: ${data.isAffiliateNetwork}
        Message: ${data.message}
      `,
    });

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error sending email" };
  }
}
