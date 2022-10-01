import { NextApiRequest, NextApiResponse } from 'next';
import { api } from '../../wooApi/wooApiREST';
import { OrderData } from '../../types/order.types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const eventType = req.body.event_type;
  if (eventType == 'PAYMENT.CAPTURE.COMPLETED') {
    const PaypalOrderId = req.body.resource.supplementary_data.related_ids.order_id;
    const pendingOrders = await api.get('orders?status=pending');
    const data: OrderData[] = pendingOrders.data;

    if (!data.length) res.status(404).send('');
    else {
      const isOrder = data.find((order) => order.transaction_id == PaypalOrderId);
      console.log(isOrder);

      if (!isOrder) res.status(404).send('');
      else
        api
          .put(`orders/${isOrder.id}`, { set_paid: true })
          .then((data) => {
            console.log(data);
            res.status(200).send('');
          })
          .catch((e) => res.status(500).send(''));
    }
  } else res.status(200).send('');
};

export default handler;
