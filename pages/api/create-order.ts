import { NextApiRequest, NextApiResponse } from 'next';
import { CreateOrderPayload } from '../../types/order.types';
import { api } from '../../wooApi/wooApiREST';
import { withSentry } from '@sentry/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const orderPayload: CreateOrderPayload = req.body;

  api
    .post('orders', orderPayload)
    .then((response) => res.status(200).send(response.data))
    .catch((error) => res.status(500).send(error));
}

export default withSentry(handler);
