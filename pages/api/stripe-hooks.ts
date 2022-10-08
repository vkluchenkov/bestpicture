import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { api } from '../../wooApi/wooApiREST';
import { withSentry } from '@sentry/nextjs';
//@ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: null });
export const config = { api: { bodyParser: false } };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const signature = req.headers['stripe-signature'];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;
  const reqBuffer = await buffer(req);

  if (signature && signingSecret) {
    try {
      const event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);

      if (event.type == 'checkout.session.completed') {
        const object: any = event.data.object;

        if (!object.metadata.orderId) throw new Error('Missing orderId in metadata');
        const order = await api.get(`orders/${object.metadata.orderId}`);

        if (order) {
          const updateData = { set_paid: true };
          await api.put(`orders/${object.metadata.orderId}`, updateData);
        }
      }
    } catch (error: any) {
      console.log(error);
      res.status(400).send(`Webhook error ${error.message}`);
    }
  }
  res.send({ received: true });
};

export default withSentry(handler);
