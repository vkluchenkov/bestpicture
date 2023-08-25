import { FormEvent, useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Checkout.module.css';
import { FormFields } from '../types/cart.types';
import { CreateOrderPayload, OrderData } from '../types/order.types';
import axios, { AxiosResponse } from 'axios';
import { Order, loadStripe } from '@stripe/stripe-js';
import { useCart } from '../store/Cart';
import { Coupons } from '../components/Coupons';
import { CartProducts } from '../components/CartProducts';
import { CheckoutForm } from '../components/CheckoutForm';
import { minProcessingFee, processingFee } from '../utils/constants';
import { Loader } from '../components/Loader';
import { Layout } from '../components/Layout';

const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
const stripePromise = loadStripe(key);

const Checkout: NextPage = () => {
  const router = useRouter();

  const [{ cart }, { clearCart }] = useCart();

  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [formFields, setFormFields] = useState<FormFields>({
    name: '',
    email: '',
    payment: undefined,
    note: '',
  });
  const [formFieldsErrors, setFormFieldsErrors] = useState<Partial<FormFields>>({});
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);

  // Add processing fee amount to total
  const cartTotalNormalized = Number.parseFloat(
    Number.parseFloat(cart.total.replace('€', '')).toFixed(2)
  );

  const calculatedFee = Math.round((cartTotalNormalized * 100 * processingFee) / 100) / 100;
  const actualFee = calculatedFee <= minProcessingFee ? minProcessingFee : calculatedFee;

  const total = () => {
    if (formFields.payment == 'stripe' || formFields.payment == 'paypal') {
      return '€' + (cartTotalNormalized + actualFee).toFixed(2);
    } else return cart.total;
  };

  const handleInputChange = useCallback((e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const form: HTMLFormElement | null = document.querySelector('#checkout_form');
    const target = e.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    const errMessage = target.validationMessage;

    setFormFieldsErrors((prev) => ({ ...prev, [name]: errMessage }));
    setFormFields((prev) => ({ ...prev, [name]: value }));
    setIsBtnDisabled(!form!.checkValidity());
  }, []);

  // PayPal transaction id
  let paypalTransactionId = '';
  const setPayPalTransactionId = (orderId: string) => (paypalTransactionId = orderId);

  const submitHandler = useCallback(async () => {
    setIsLoading(true);
    // Create order payload
    const lineItems = cart.contents.nodes.map((cartItem) => {
      return {
        product_id: cartItem.product.node.id,
        quantity: 1,
      };
    });

    const couponLines = cart.appliedCoupons?.length
      ? cart.appliedCoupons.map((c) => {
          return { code: c.code };
        })
      : [];

    const createOrderPayload: CreateOrderPayload = {
      billing: {
        email: formFields.email,
        first_name: formFields.name,
      },
      customer_note: formFields.note,
      status: 'pending',
      line_items: lineItems,
      coupon_lines: couponLines,
    };

    if (!formFields.payment && cart.total === '€0.00') {
      createOrderPayload.set_paid = true;
    }

    if (formFields.payment == 'bacs') {
      createOrderPayload.payment_method = 'bacs';
      createOrderPayload.payment_method_title = 'Bank transfer';
      createOrderPayload.set_paid = false;
      createOrderPayload.status = 'on-hold';
    }

    if (formFields.payment == 'cod') {
      createOrderPayload.payment_method = 'cod';
      createOrderPayload.payment_method_title = 'Paid in cash';
      createOrderPayload.set_paid = false;
      createOrderPayload.status = 'on-hold';
    }

    if (formFields.payment == 'cheque') {
      createOrderPayload.payment_method = 'cheque';
      createOrderPayload.payment_method_title = 'Revolut';
      createOrderPayload.set_paid = false;
      createOrderPayload.status = 'on-hold';
    }

    if (formFields.payment == 'stripe') {
      createOrderPayload.payment_method = 'stripe';
      createOrderPayload.payment_method_title = 'Stripe (cards and wallets)';
      createOrderPayload.fee_lines = [
        { name: 'Stripe processing fee 5% (min €1)', total: String(actualFee) },
      ];
    }

    if (formFields.payment == 'paypal') {
      createOrderPayload.payment_method = 'paypal';
      createOrderPayload.payment_method_title = 'PayPal';
      createOrderPayload.fee_lines = [
        { name: 'PayPal processing fee 5% (min €1)', total: String(actualFee) },
      ];
      createOrderPayload.transaction_id = paypalTransactionId;
    }
    // Create order and process payment
    try {
      const { data: orderData } = await axios.post('/api/create-order', createOrderPayload);

      if (createOrderPayload.payment_method == 'stripe' && orderData) {
        const stripePayload = {
          name: `Order ${orderData.id} on Vladimir Kluchenkov's website`,
          price: orderData.total,
          orderId: orderData.id,
          orderKey: orderData.order_key,
          email: orderData.billing.email,
        };
        axios
          .post('/api/stripe-session', stripePayload)
          .then((data: any) => window.open(data.data.url as string, '_self'));
        // .catch((error) => console.log(error));
      } else if (orderData) {
        clearCart();
        router.push(`/checkout/order-received/${orderData.id}?key=${orderData.order_key}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [cart, clearCart, formFields, actualFee, router, paypalTransactionId]);

  if (isLoading) return <Loader />;

  if (!cart.contents.nodes.length)
    return (
      <Layout>
        <Head>
          <title>Checkout | bestpicture.pro</title>
        </Head>
        <h2 className={styles.subtitle}>Your cart is empty. Please put some videos in it</h2>
      </Layout>
    );

  return (
    <Layout>
      <Head>
        <title>Checkout | bestpicture.pro</title>
      </Head>
      <h1 className={styles.title}>Checkout</h1>
      <div className={styles.sections}>
        <section className={styles.productsSection}>
          <h2 className={styles.subtitle}>Videos</h2>
          <CartProducts />
          <Coupons />
          <p className={styles.subtotal}>Subtotal: {cart.subtotal}</p>
          <p className={styles.total}>Total: {total()}</p>
        </section>
        <section className={styles.checkoutSection}>
          <h2 className={styles.subtitle}>Billing</h2>
          <CheckoutForm
            onSubmit={submitHandler}
            onChange={handleInputChange}
            formFields={formFields}
            formFieldsErrors={formFieldsErrors}
            isBtnDisabled={isBtnDisabled}
            total={total()}
            setTransactionId={setPayPalTransactionId}
          />
        </section>
      </div>
    </Layout>
  );
};

export default Checkout;
