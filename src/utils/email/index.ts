import nodemailer, { Transporter } from "nodemailer";
import { devConfig } from "../../config/env/dev.config";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}
export async function sendEmail({
  to,
  subject,
  html,
}: EmailOptions): Promise<void> {
  const transporter: Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: devConfig.EMAIL_USER as string,
      pass: devConfig.EMAIL_PASS as string,
    },
  });

  await transporter.sendMail({
    from: `'Social App' <${devConfig.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
