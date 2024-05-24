import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
interface sendmailParams {
  to: string;
  subject: string;
  body: string;
}

export async function sendmail({ to, subject, body }: sendmailParams) {
  const { SMTP_USER, SMTP_PASS, SMTP_GMAIL, SMTP_PASS_PERSONAL } = process.env;
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    // NOTE: this is to verify the transport connection
    const test = await transport.verify();
    console.log("NodemailerTest", test);
  } catch (err) {
    console.error(err);
  }

  // send mail with defined transport object
  try {
    const sendMailResult = await transport.sendMail({
      to,
      subject,
      html: body,
    });
    console.log("sendMailResult", sendMailResult);
  } catch (err) {
    console.error(err);
  }
}

export async function compileEmailTemplate(
  name: string,
  Url: string,
  templateToUse: string,
) {
  const templatePath = path.join(
    process.cwd(),
    "lib",
    "emailTemplates",
    `${templateToUse}.hbs`,
  );
  const template = fs.readFileSync(templatePath, "utf8");
  const compiledTemplate = Handlebars.compile(template);
  const htmlBody = compiledTemplate({ name, Url });
  return htmlBody;
}
