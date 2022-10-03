import { NextApiRequest, NextApiResponse } from 'next';
import { api } from '../../wooApi/wooApiREST';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const orderId = req.body.orderId;
  const key = req.body.key;

  try {
    const { data } = await api.get('orders/' + orderId);
    const { order_key, ...rest } = data;
    if (!key || key != order_key)
      res.status(400).send({ message: 'Order key is missing or incorrect' });
    else res.status(200).send({ ...rest });
  } catch (error: any) {
    console.log(error);
    res.status(error.response.status).send(error.response.statusText);
  }
}
