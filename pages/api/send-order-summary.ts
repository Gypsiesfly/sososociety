import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Add debug logging at start
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('SMTP Config Check:', {
    host: !!process.env.SMTP_HOST,
    port: !!process.env.SMTP_PORT,
    user: !!process.env.SMTP_USER,
    pass: !!process.env.SMTP_PASS ? '*****' : false,
    businessEmail: !!process.env.BUSINESS_EMAIL
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { orderSummary, customerEmail, customerPhone } = req.body;
  
  console.log('Received request with:', {
    orderSummary: orderSummary ? 'exists' : 'missing',
    customerEmail: customerEmail || 'missing',
    customerPhone: customerPhone || 'missing'
  });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('Attempting to send email...');
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.BUSINESS_EMAIL,
      subject: 'New Order Summary',
      html: `<p>Order Details: ${orderSummary}</p>
             <p>Customer Email: ${customerEmail}</p>
             <p>Customer Phone: ${customerPhone}</p>`,
    });

    console.log('Email sent:', info.messageId);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
