import nodemailer, { Transporter } from "nodemailer";

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
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  });

  await transporter.sendMail({
    from: `'Social App' <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
