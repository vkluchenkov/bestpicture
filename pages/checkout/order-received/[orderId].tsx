import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Loader } from '../../../components/Loader';
import axios from 'axios';
import styles from '../../../styles/Order.module.css';
import { OrderData } from '../../../types/order.types';
import Head from 'next/head';
import { OrderVeiw } from '../../../components/OrderView';

const Order: NextPage = () => {
  const router = useRouter();
  const { orderId, key } = router.query;

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const getOrder = useCallback(() => {
    axios
      .post('/api/get-order', { orderId: orderId, key: key })
      .then((res) => setOrderData(res.data))
      .catch((e) => setError(e))
      .finally(() => setIsLoading(false));
  }, [key, orderId]);

  useEffect(() => {
    setIsLoading(true);
    if (orderId && key) getOrder();
  }, []);

  // Refetch data while waiting for order status change (webhook processing)
  useEffect(() => {
    if (orderData && orderData.status == 'pending') {
      setTimeout(() => {
        getOrder();
      }, 5000);
    }
  }, [getOrder, orderData]);

  if (isLoading) return <Loader />;

  const head = (
    <Head>
      <title>Your order | bestpicture.pro</title>
    </Head>
  );

  if (!key)
    return (
      <>
        {head}
        <h1>Oops.. something went wrong</h1>
        <p>Order key for order #{orderId} was not provided.</p>
      </>
    );

  if (error)
    return (
      <>
        {head}
        <h1>Oops.. something went wrong</h1>
        <p>It seems this order does not exist.</p>
      </>
    );

  if (orderData) {
    return (
      <>
        {head}
        <OrderVeiw orderData={orderData} />
      </>
    );
  }
  return <></>;
};

export default Order;
