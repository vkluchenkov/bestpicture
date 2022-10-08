import { NextApiRequest, NextApiResponse } from 'next';
import { CreateOrderPayload } from '../../types/order.types';
import { api } from '../../wooApi/wooApiREST';
import { withSentry } from '@sentry/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const orderPayload: CreateOrderPayload = JSON.parse(req.body);

  try {
    const { data } = await api.post('orders', orderPayload);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
}

export default withSentry(handler);
