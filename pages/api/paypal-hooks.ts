import { NextApiRequest, NextApiResponse } from 'next';
import { api } from '../../wooApi/wooApiREST';
import { OrderData } from '../../types/order.types';
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const eventType = req.body.event_type;

  if (eventType == 'PAYMENT.CAPTURE.COMPLETED') {
    const verificationPayload = {
      auth_algo: req.headers['paypal-auth-algo'],
      cert_url: req.headers['paypal-cert-url'],
      transmission_id: req.headers['paypal-transmission-id'],
      transmission_sig: req.headers['paypal-transmission-sig'],
      transmission_time: req.headers['paypal-transmission-time'],
      webhook_event: req.body,
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
    };
    const apiUrl = process.env.PAYPAL_API_URL;

    let verification: string | undefined = undefined;

    await axios
      .post(apiUrl + '/v1/notifications/verify-webhook-signature', verificationPayload, {
        auth: {
          username: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          password: process.env.PAYPAL_SECRET!,
        },
      })
      .then((res: any) => (verification = res.data.verification_status))
      .catch((error: any) => {});

    if (verification == 'SUCCESS') {
      const PaypalOrderId = req.body.resource.supplementary_data.related_ids.order_id;

      const pendingOrders = await api.get('orders?status=pending');
      const data: OrderData[] = pendingOrders.data;

      if (!data.length) res.status(404).send('');
      else {
        const isOrder = data.find((order) => order.transaction_id == PaypalOrderId);

        if (!isOrder) res.status(404).send('');
        else
          api
            .put(`orders/${isOrder.id}`, { set_paid: true })
            .then((data) => {
              res.status(200).send('');
            })
            .catch((e) => res.status(500).send(''));
      }
    }
  } else res.status(200).send('');
};

export default handler;
