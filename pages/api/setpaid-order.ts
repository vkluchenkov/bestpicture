import { NextApiRequest, NextApiResponse } from 'next';
import { api } from '../../wooApi/wooApiREST';
import { withSentry } from '@sentry/nextjs';

interface OrderPayload {
  orderId: string;
  isPaid: boolean;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const orderPayload: OrderPayload = req.body;

  api
    .put('orders/' + orderPayload.orderId, { set_paid: orderPayload.isPaid })
    .then((response) => res.status(200).send(response.data))
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
}

export default withSentry(handler);
