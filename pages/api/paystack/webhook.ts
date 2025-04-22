import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import crypto from 'crypto';

interface PaystackTransaction {
  customer: {
    email: string;
  };
  amount: number;
  currency: string;
  reference: string;
}

interface PaystackWebhookEvent {
  event: string;
  data: {
    reference: string;
    metadata: any;
  };
}

const sendReceiptEmail = async (reference: string, metadata: any) => {
  try {
    const response: AxiosResponse<{ data: PaystackTransaction }> = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const { data } = response.data;
    const { customer, amount, currency, reference: txReference } = data;

    console.log('Sending receipt to:', customer.email);
  } catch (error) {
    console.error('Error sending receipt:', error);
    throw error;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
    return res.status(500).json({ message: 'Paystack secret key not configured' });
  }

  try {
    const signature = req.headers['x-paystack-signature'];
    if (!signature) {
      return res.status(401).json({ message: 'Missing signature header' });
    }
    
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (hash !== signature) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const event = req.body as PaystackWebhookEvent;

    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      await sendReceiptEmail(reference, metadata);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
