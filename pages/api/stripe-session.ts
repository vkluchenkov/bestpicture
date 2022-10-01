// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { api } from '../../wooApi/wooApiREST';
//@ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: null });

interface UpdateOrder {
  orderId: number;
  data: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { price, name, email, orderId, orderKey } = req.body;

  const updateOrder = async (payload: UpdateOrder) => {
    await api.put(`orders/${payload.orderId}`, payload.data).catch((e) => console.log(e));
  };

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
    quantity: 1,
  };

  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        // customer: customer.id,
        customer_email: email,
        line_items: [item],
        mode: 'payment',
        success_url: `${req.headers.origin}/checkout/order-received/${orderId}?key=${orderKey}`,
        cancel_url: `${req.headers.origin}/checkout/order-failed/${orderId}?key=${orderKey}`,
        metadata: { orderId: orderId },
        payment_method_types: [],
      });
      await updateOrder({
        orderId,
        data: {
          meta_data: [
            {
              key: '_stripe_intent_id',
              value: session.payment_intent,
            },
          ],
        },
      });
      res.status(200).send({ url: session.url });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
