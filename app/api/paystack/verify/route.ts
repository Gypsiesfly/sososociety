import type { NextApiRequest, NextApiResponse } from 'next';

import { NextResponse } from "next/server"
import axios from 'axios';
import nodemailer from 'nodemailer';

export async function POST(req: Request, res: NextApiResponse) {
  // if (req.method !== 'POST') {
  //   return res.status(405).json({ message: 'Method not allowed' });
  // }

  const body = await req.json()
  const { reference } = body;
  console.log(reference)
  if (!reference) {
    console.error('No reference provided to /api/paystack/verify');
   return  NextResponse.json({ error: 'Missing transaction reference' }, { status: 400 })
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
    // console.log('Paystack verify response: ===================================', response.data);
    if (response.data.status && response.data.data.status === 'success') {
      // Compose order summary for WhatsApp
      const tx = response.data.data;
      const metadata = tx.metadata || {};
      const customFields:{ display_name: string, variable_name: string, value: any}[] = tx.metadata.custom_fields || [];


      let platforms:string[] = []
      let postFrequency: string = ''
      let videoEditing: string = ''
      let paymentFrequency: string = ''
      let phone: string = ""

      customFields.forEach(_ => {
        _.variable_name === 'platforms'? 
          platforms = _.value :
        _.variable_name === 'post_frequency'?
          postFrequency = _.value :
        _.variable_name === 'video_editing'?
          videoEditing = _.value : 
        _.variable_name === 'payment_frequency'?
          paymentFrequency = _.value : 
        _.variable_name === 'phone_number'?
          phone = _.value :
        undefined
      });

      // http://localhost:3000/payment-success?trxref=nhe6tu5fyn&reference=nhe6tu5fyn

      const orderSummary = `Order Summary:\nPlatforms: ${platforms.join(", ") || '-'}\nPost Frequency: ${postFrequency|| "-"} times/week\nVideo Editing: ${videoEditing?.toLowerCase?.() === 'true' ? 'Yes' : 'No'}\nPayment Frequency: ${paymentFrequency || '-'}\nTotal: ₦${tx.amount / 100} NGN (${tx.currency})`;
      const customerEmail = tx.customer?.email || '-';
      const customerPhone = phone || '-';
      await sendOrderSummaryEmail(orderSummary, customerPhone, customerEmail);
      console.log('Order summary email sent successfully.');
      return  NextResponse.json({ data: response.data.data })
      // return res.status(200).json({ success: true, data: response.data.data });
    } else {
      // Return a clear error for failed/declined payments
   return  NextResponse.json({ error: response.data.data.gateway_response || response.data.data.status || 'Payment not successful'}, { status: 400 })
      // return res.status(400).json({ success: false, message: response.data.data.gateway_response || response.data.data.status || 'Payment not successful', data: response.data.data });
    }
  } catch (error: any) {
    console.error('PAYSTACK VERIFY ERROR:', error);
   return  NextResponse.json({ error: JSON.stringify(error, Object.getOwnPropertyNames(error)) || error.message}, { status: 500 })
    // return res.status(500).json({ success: false, message: error.message, error: JSON.stringify(error, Object.getOwnPropertyNames(error)) });
  }
}


async function sendOrderSummaryEmail(orderSummary: string, customerPhone: string, customerEmail: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for others
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const mailOptions = {
    from: `Order Notification <${process.env.SMTP_USER}>`,
    // to: process.env.BUSINESS_EMAIL,
    to: customerEmail,
    subject: 'New Order Received',
    text: `New Order!\n\n${orderSummary}\nEmail: ${customerEmail}\nPhone: ${customerPhone}`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending order summary email:', err);
  }
}

