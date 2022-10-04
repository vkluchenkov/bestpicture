import { FormEvent, useCallback, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Checkout.module.css';
import { FormFields } from '../types/cart.types';
import { CreateOrderPayload, OrderData } from '../types/order.types';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../store/Cart';
import { Coupons } from '../components/Coupons';
import { CartProducts } from '../components/CartProducts';
import { CheckoutForm } from '../components/CheckoutForm';

const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
const stripePromise = loadStripe(key);

const Checkout: NextPage = () => {
  const router = useRouter();

  const [{ cart }, { clearCart }] = useCart();

  // PayPal transaction id
  const [paypalTransactionId, setPayPalTransactionId] = useState('');

  // Form fields
  const [formFields, setFormFields] = useState<FormFields>({
    name: '',
    email: '',
    payment: undefined,
    note: '',
  });
  const [formFieldsErrors, setFormFieldsErrors] = useState<Partial<FormFields>>({});
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);

  // Add processing fee to total
  const fee = Number.parseFloat(cart.total) <= 20 ? 1 : Number.parseFloat(cart.total) * 0.05;

  const total = () => {
    if (formFields.payment == 'stripe' || formFields.payment == 'paypal') {
      const total = Number.parseFloat(cart.total);
      return fee > 1 ? String(total + fee) : String(total + 1);
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

  const submitHandler = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
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
        customer_note: '',
        status: 'pending',
        line_items: lineItems,
        coupon_lines: couponLines,
      };

      if (!formFields.payment) createOrderPayload.set_paid = true;

      if (formFields.payment == 'bacs') {
        createOrderPayload.payment_method = 'bacs';
        createOrderPayload.payment_method_title = 'Bank transfer';
        createOrderPayload.set_paid = false;
        createOrderPayload.status = 'on-hold';
      }

      if (formFields.payment == 'stripe') {
        createOrderPayload.payment_method = 'stripe';
        createOrderPayload.payment_method_title = 'Stripe (cards and wallets)';
        createOrderPayload.fee_lines = [
          { name: 'Stripe processing fee 5% (min €1)', total: String(fee) },
        ];
      }

      if (formFields.payment == 'paypal') {
        createOrderPayload.payment_method = 'paypal';
        createOrderPayload.payment_method_title = 'PayPal';
        createOrderPayload.fee_lines = [
          { name: 'PayPal processing fee 5% (min €1)', total: String(fee) },
        ];
        createOrderPayload.transaction_id = paypalTransactionId;
      }

      // Create order and process payment
      try {
        const res = await fetch('/api/create-order', {
          method: 'POST',
          body: JSON.stringify(createOrderPayload),
        });
        const data: OrderData = await res.json();

        if (createOrderPayload.payment_method == 'stripe' && data) {
          const stripePayload = {
            name: `Order ${data.id} on Vladimir Kluchenkov's website`,
            price: data.total,
            orderId: data.id,
            orderKey: data.order_key,
            email: data.billing.email,
          };

          axios
            .post('/api/stripe-session', stripePayload)
            .then((data: any) => window.open(data.data.url as string, '_self'))
            .catch((error) => console.log(error));
        } else if (data) {
          router.push(`/checkout/order-received/${data.id}?key=${data.order_key}`);
          clearCart();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [cart, clearCart, formFields, fee, router, paypalTransactionId]
  );

  if (!cart.contents.nodes.length)
    return (
      <>
        <Head>
          <title>Checkout | bestpicture.pro</title>
        </Head>
        <h2 className={styles.subtitle}>Your cart is empty. Please put some videos in it</h2>
      </>
    );

  return (
    <>
      <Head>
        <title>Checkout | bestpicture.pro</title>
      </Head>
      <h1 className={styles.title}>Checkout</h1>
      <div className={styles.sections}>
        <section className={styles.productsSection}>
          <h2 className={styles.subtitle}>Videos</h2>
          <CartProducts />
          <Coupons />
          <p className={styles.subtotal}>Subtotal: €{cart.subtotal}</p>
          <p className={styles.total}>Total: €{total()}</p>
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
    </>
  );
};

export default Checkout;
