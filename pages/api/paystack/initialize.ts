import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, amount, metadata } = req.body;
  if (!email || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET_KEY) {
    return res.status(500).json({ error: 'Paystack secret key not set' });
  }

  try {
    // Build callback URL with fallbacks
    let callbackUrl: string;
    
    if (req.headers.origin) {
      callbackUrl = `${req.headers.origin}/payment-success`;
    } else {
      // Fallback to environment variable or default
      callbackUrl = process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success`
        : 'https://yourdomain.com/payment-success';
    }

    // Validate URL structure
    try {
      new URL(callbackUrl);
    } catch {
      return res.status(500).json({ error: 'Invalid callback URL configuration' });
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        metadata,
        callback_url: callbackUrl,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: data.message || 'Paystack error' });
    }
    return res.status(200).json(data.data);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
