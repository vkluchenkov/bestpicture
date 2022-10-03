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

    try {
      const { data } = await axios.post(
        apiUrl + '/v1/notifications/verify-webhook-signature',
        verificationPayload,
        {
          auth: {
            username: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            password: process.env.PAYPAL_SECRET!,
          },
        }
      );

      if (data.verification_status == 'SUCCESS') {
        // const PaypalOrderId = req.body.resource.supplementary_data.related_ids.order_id;
        // const { data: pendingOrders } = await api
        //   .get('orders?status=pending')
        //   .catch((error) => res.status(404).send('Can not fetch orders'));
        // if (!pendingOrders.length) {
        //   res.status(404).send('No pending orders found');
        // } else {
        //     const isOrder = pendingOrders.find(
        //       (order: OrderData) => order.transaction_id == PaypalOrderId
        //     );
        //     if (!isOrder) res.status(404).send('No such order in pending orders');
        //     await api
        //       .put(`orders/${isOrder.id}`, { set_paid: true })
        //       .then((data) => {
        //         res.status(200).send('Order updated');
        //       })
        //       .catch((e) => res.status(500).send('Error updating order'));
        //     res.status(502).send('');
        // }
      } else res.status(403).send('Verification failed');
    } catch (error) {
      res.status(501).send('Something went wrong');
    }
  } else res.status(202).send('Webhook received');
};

export default handler;
