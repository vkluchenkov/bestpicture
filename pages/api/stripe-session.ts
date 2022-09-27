// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const { price, name, description } = req.body as CheckoutPayload;
  const price = '20.00';
  const name = "Vladimir Kluchenkov's website order";
  const description = 'Some description here';

  const itemPrice = () => {
    const parsed = Number.parseFloat(price);
    if (Number.isNaN(parsed)) return 0;
    return parsed * 100;
  };

  const item = {
    price_data: {
      currency: 'eur',
      product_data: {
        name,
      },
      unit_amount: itemPrice(),
    },
    description,
    quantity: 1,
  };

  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [item],
        mode: 'payment',
        success_url: `${req.headers.origin}/checkout/?success=true`,
        cancel_url: `${req.headers.origin}/checkout/?canceled=true`,
      });
      console.log({
        _stripe_customer_id: session.customer,
        _stripe_source_id: '',
        _stripe_intent_id: session.payment_intent,
      });
      res.redirect(303, session.url);
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
