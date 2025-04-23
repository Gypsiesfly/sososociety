import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import crypto from 'crypto';
import { MongoClient } from 'mongodb';

interface PaystackTransaction {
  customer: {
    email: string;
  };
  amount: number;
  currency: string;
  reference: string;
  status: string;
  message: string;
  metadata: any;
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
    const { customer, amount, currency, reference: txReference, status, message, metadata: txMetadata } = data;

    console.log('Transaction verified:', {
      reference: txReference,
      status,
      message,
      amount,
      currency,
      customer: customer.email
    });

    // Store transaction in MongoDB
    const client = new MongoClient(process.env.MONGODB_URI || '');
    try {
      await client.connect();
      const db = client.db('your-database-name');
      const transactions = db.collection('transactions');
      
      await transactions.insertOne({
        reference: txReference,
        status,
        amount,
        currency,
        customer: customer.email,
        metadata: txMetadata,
        createdAt: new Date()
      });

      // Update order status if needed
      if (txMetadata.order_id) {
        const orders = db.collection('orders');
        await orders.updateOne(
          { _id: txMetadata.order_id },
          { $set: { status: 'paid', paid_at: new Date() } }
        );
      }
    } finally {
      await client.close();
    }

    // Send receipt email here if needed
    // ... email sending logic ...

  } catch (error) {
    console.error('Error processing transaction:', error);
    throw error;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
    console.error('Paystack secret key not configured');
    return res.status(500).json({ message: 'Paystack secret key not configured' });
  }

  try {
    const signature = req.headers['x-paystack-signature'];
    if (!signature) {
      console.error('Missing signature header');
      return res.status(401).json({ message: 'Missing signature header' });
    }
    
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (hash !== signature) {
      console.error('Invalid signature');
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const event = req.body as PaystackWebhookEvent;

    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      await sendReceiptEmail(reference, metadata);
    }

    // Log all events
    console.log('Received Paystack webhook:', {
      event: event.event,
      reference: event.data.reference,
      metadata: event.data.metadata
    });

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
