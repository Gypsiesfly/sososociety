import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { reference } = req.body;
  if (!reference) {
    console.error('No reference provided to /api/paystack/verify');
    return res.status(400).json({ message: 'Missing transaction reference' });
  }

  try {
    console.log('Verifying Paystack payment for reference:', reference);
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    console.log('Paystack verify response:', response.data);
    if (response.data.status && response.data.data.status === 'success') {
      // Compose order summary for WhatsApp
      const tx = response.data.data;
      const metadata = tx.metadata || {};
      const orderSummary = `Order Summary:\nPlatforms: ${metadata.platforms || '-'}\nPost Frequency: ${metadata.postFrequency || '-'} times/week\nVideo Editing: ${metadata.videoEditing ? 'Yes' : 'No'}\nPayment Frequency: ${metadata.paymentFrequency || '-'}\nTotal: ₦${tx.amount / 100} NGN (${tx.currency})`;
      const customerEmail = tx.customer?.email || '-';
      const customerPhone = metadata.phone || '-';
      await sendOrderSummaryEmail(orderSummary, customerPhone, customerEmail);
      console.log('Order summary email sent successfully.');
      return res.status(200).json({ success: true, data: response.data.data });
    } else {
      // Return a clear error for failed/declined payments
      return res.status(400).json({ success: false, message: response.data.data.gateway_response || response.data.data.status || 'Payment not successful', data: response.data.data });
    }
  } catch (error: any) {
    console.error('PAYSTACK VERIFY ERROR:', error);
    return res.status(500).json({ success: false, message: error.message, error: JSON.stringify(error, Object.getOwnPropertyNames(error)) });
  }
}

import nodemailer from 'nodemailer';

async function sendOrderSummaryEmail(orderSummary: string, customerPhone: string, customerEmail: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const mailOptions = {
    from: `Order Notification <${process.env.SMTP_USER}>`,
    to: process.env.BUSINESS_EMAIL,
    subject: 'New Order Received',
    text: `New Order!\n\n${orderSummary}\nEmail: ${customerEmail}\nPhone: ${customerPhone}`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending order summary email:', err);
  }
}

