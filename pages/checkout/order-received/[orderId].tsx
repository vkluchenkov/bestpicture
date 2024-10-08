import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

import { Loader } from '../../../components/Loader';
import styles from '../../../styles/Order.module.css';
import { OrderData } from '../../../types/order.types';
import { OrderVeiw } from '../../../components/OrderView';
import { useCart } from '../../../store/Cart';
import { Layout } from '../../../components/Layout';

const Order: NextPage = () => {
  const router = useRouter();
  const { orderId, key, stripeSuccess } = router.query;

  const [isOrderfetched, setisOrderFetched] = useState(false);
  const [cartCleared, setCartCleared] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [{}, { clearCart }] = useCart();

  const getOrder = useCallback(async () => {
    await axios
      .post('/api/get-order', { orderId: orderId, key: key })
      .then((res) => setOrderData(res.data))
      .catch((e) => setError(e))
      .finally(() => setIsLoading(false));
  }, [key, orderId]);

  // Clear cart on successful stripe return
  useEffect(() => {
    if (stripeSuccess && !cartCleared) {
      clearCart();
      setCartCleared(true);
    }
  }, [stripeSuccess, clearCart, cartCleared]);

  // Initial order data loading
  useEffect(() => {
    if (orderId && key && !isOrderfetched) {
      setIsLoading(true);
      getOrder().then((data) => {
        setisOrderFetched(true);
        setIsLoading(false);
      });
    }
  }, [orderId, key, isOrderfetched, getOrder]);

  // Refetch data while waiting for order status change (webhook processing)
  useEffect(() => {
    if (orderData && orderData.status == 'pending') {
      setTimeout(() => {
        getOrder();
      }, 5000);
    }
  }, [getOrder, orderData]);

  const head = (
    <Head>
      <title>Your order | bestpicture.pro</title>
    </Head>
  );

  if (!key)
    return (
      <Layout>
        {head}
        <h1 className={styles.title}>Oops.. something went wrong</h1>
        <p>Order key for order #{orderId} was not provided.</p>
      </Layout>
    );

  if (error) {
    return (
      <Layout>
        {head}
        <h1 className={styles.title}>Oops.. something went wrong</h1>
        <p>It seems this order does not exist.</p>
      </Layout>
    );
  }

  if (isLoading) return <Loader />;

  if (orderData) {
    return (
      <Layout>
        {head}
        <section className={styles.orderContainer}>
          <OrderVeiw orderData={orderData} />
        </section>
      </Layout>
    );
  } else return <></>;
};

export default Order;
