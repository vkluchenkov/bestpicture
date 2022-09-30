import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Loader } from '../../../components/Loader';
import axios from 'axios';
import styles from '../../../styles/Order.module.css';
import { OrderData } from '../../../types/order.types';

const ThankYou: NextPage = () => {
  const router = useRouter();
  const { orderId, key } = router.query;

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (orderId && key) {
      setIsLoading(true);
      axios
        .post('/api/get-order', { orderId: orderId, key: key })
        .then((res) => setOrderData(res.data))
        .catch((e) => setError(e))
        .finally(() => setIsLoading(false));
    }
  }, [orderId, key]);

  useEffect(() => {
    if (orderData) console.log(orderData);
  }, [orderData]);

  if (isLoading) return <Loader />;

  if (!key)
    return (
      <>
        <h1>Oops.. something went wrong</h1>
        <p>Order key for order #{orderId} was not provided. Please check your link.</p>
      </>
    );

  if (error)
    return (
      <>
        <h1>Oops.. something went wrong</h1>
        <p>
          Please check your link. It seems that the order does not exist or you do not have rights
          to view it.
        </p>
      </>
    );

  if (orderData) {
    const lineItems = orderData.line_items.map((i) => (
      <li key={'video' + i.product_id}>{i.name}</li>
    ));
    const feeItems = orderData.fee_lines.map((i) => <li key={'fee' + i.id}>{i.name}</li>);
    return (
      <>
        <h1 className={styles.title}>Order {orderData.id}</h1>
        <p className={styles.status}>Status: {orderData.status}</p>
        <h2>Billing</h2>
        <p>{orderData.billing.first_name}</p>
        <p>{orderData.billing.email}</p>
        <h2>Videos</h2>
        <ul>
          {lineItems}
          {feeItems}
        </ul>
      </>
    );
  }
  return <></>;
};

export default ThankYou;
