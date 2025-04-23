import type { NextApiRequest, NextApiResponse } from 'next';

import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for others
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.BUSINESS_EMAIL,
      subject: 'Test Email from Next.js App',
      text: 'This is a test email sent from your Next.js API route using your current SMTP configuration.',
    });

    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
