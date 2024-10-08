import { FormEvent, useCallback, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

import styles from '../styles/Checkout.module.css';
import { FormFields } from '../types/cart.types';
import { CreateOrderPayload, FeeItem } from '../types/order.types';
import { useCart } from '../store/Cart';
import { Coupons } from '../components/Coupons';
import { CartProducts } from '../components/CartProducts';
import { CheckoutForm } from '../components/CheckoutForm';
import { minProcessingFee, processingFee, cropFee } from '../utils/constants';
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

  const pushToConfirmationPage = useCallback(
    (orderId: string, key: string) => {
      router.push(`/checkout/order-received/${orderId}?key=${key}`);
    },
    [router]
  );

  const paypalApproveHandler = useCallback(
    async (orderId: string | null) => {
      if (orderId) {
        try {
          const { data } = await axios.post('api/setpaid-order', {
            orderId: orderId,
            isPaid: true,
          });
          const key = data.order_key;
          clearCart();
          pushToConfirmationPage(orderId, key);
        } catch (error) {
          console.log('Error updating order');
        }
      } else console.log('No order ID present!');
    },
    [pushToConfirmationPage, clearCart]
  );

  const submitHandler = useCallback(async () => {
    if (formFields.payment !== 'paypal') setIsLoading(true);
    // Create order payload
    const lineItems = cart.contents.nodes.map((cartItem) => {
      const isVertical = cartItem.extraData.find(
        (d) => d.key === 'is_vertical' && d.value === 'true'
      );
      const isSquare = cartItem.extraData.find((d) => d.key === 'is_square' && d.value === 'true');

      if (isVertical || isSquare) {
        const price = cartItem.product.node.price;
        const productPrice = price ? parseFloat(price.replace('€', '')) : 0;

        const getName = () => {
          if (isVertical && isSquare) {
            return cartItem.product.node.name + ' + vertical and square crop';
          }
          if (isVertical) {
            return cartItem.product.node.name + ' + vertical crop';
          }
          if (isSquare) {
            return cartItem.product.node.name + ' + square crop';
          }
          return cartItem.product.node.name;
        };

        const getTotal = () => {
          if (isVertical && isSquare) {
            return (productPrice + cropFee * 2).toFixed(2);
          }
          if (isVertical || isSquare) {
            return (productPrice + cropFee).toFixed(2);
          }
          return price;
        };

        return {
          name: getName(),
          product_id: cartItem.product.node.id,
          quantity: 1,
          total: getTotal(),
        };
      }

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
      fee_lines: [],
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
      createOrderPayload.fee_lines.push({
        name: 'Stripe processing fee 5%',
        total: String(actualFee),
      });
    }

    if (formFields.payment == 'paypal') {
      createOrderPayload.payment_method = 'paypal';
      createOrderPayload.payment_method_title = 'PayPal';
      createOrderPayload.fee_lines.push({
        name: 'PayPal processing fee 5%',
        total: String(actualFee),
      });
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
        // if not PayPal, clear cart and redirect to order confirmation page
      } else if (createOrderPayload.payment_method !== 'paypal' && orderData) {
        clearCart();
        pushToConfirmationPage(orderData.id, orderData.order_key);
      }
      // return orderId for Paypal
      return orderData.id;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [cart, clearCart, formFields, actualFee, pushToConfirmationPage]);

  if (isLoading) return <Loader />;

  if (!cart.contents.nodes.length)
    return (
      <Layout>
        <Head>
          <title>Checkout | bestpicture.pro</title>
        </Head>
        <h2 className={styles.subtitle}>Your cart is empty. Please put some items in it</h2>
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
          <h2 className={styles.subtitle}>Items</h2>
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
            payPalApproveHandler={paypalApproveHandler}
          />
        </section>
      </div>
    </Layout>
  );
};

export default Checkout;
