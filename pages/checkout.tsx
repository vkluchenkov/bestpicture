import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useEffect, useState } from 'react';
import { useCart } from '../store/Cart';
import styles from '../styles/Checkout.module.css';
import { TextInput } from '../ui-kit/TextInput';
import { Button } from '../ui-kit/Button';
import { Coupons } from '../components/Coupons';
import { CartProducts } from '../components/CartProducts';
import { RadioInput } from '../ui-kit/RadioInput';
import { StripeStatus, FormFields } from '../types/cart.types';
import { CreateOrderPayload, OrderData } from '../types/order.types';
import { TextArea } from '../ui-kit/TextArea';

const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  : '';
const stripePromise = loadStripe(key);

const Checkout: NextPage = () => {
  const router = useRouter();

  const [{ cart }, { clearCart }] = useCart();

  // StripeStatus
  const [status, setStatus] = useState<StripeStatus>(undefined);

  // Form fields
  const [formFields, setFormFields] = useState<FormFields>({
    name: '',
    email: '',
    payment: undefined,
    note: '',
  });
  const [formFieldsErrors, setFormFieldsErrors] = useState<Partial<FormFields>>({});
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);

  const [orderRes, setOrderRes] = useState<OrderData | null>(null);

  useEffect(() => {
    if (orderRes) router.push(`/checkout/order-received/${orderRes.id}?key=${orderRes.order_key}`);
  }, [orderRes, router]);

  const handleInputChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const form: HTMLFormElement | null = document.querySelector('#checkout_form');
    const target = e.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    const errMessage = target.validationMessage;

    setFormFieldsErrors((prev) => ({ ...prev, [name]: errMessage }));
    setFormFields((prev) => ({ ...prev, [name]: value }));
    setIsBtnDisabled(!form!.checkValidity());
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const lineItems = cart.contents.nodes.map((cartItem) => {
      return {
        product_id: cartItem.product.node.id,
        quantity: 1,
      };
    });

    const createOrderPayload: CreateOrderPayload = {
      billing: {
        email: formFields.email,
        first_name: formFields.name,
      },
      customer_note: '',
      status: 'pending',
      line_items: lineItems,
    };

    if (!formFields.payment) createOrderPayload.set_paid = true;

    if (formFields.payment == 'bacs') {
      createOrderPayload.payment_method = 'bacs';
      createOrderPayload.set_paid = false;
      createOrderPayload.status = 'on-hold';
    }

    if (formFields.payment == 'stripe') {
      // Send API fetch here to '/api/stripe-session'
    }

    if (formFields.payment == 'paypal') {
      createOrderPayload.payment_method = 'paypal';
      createOrderPayload.set_paid = false;
    }

    // Create order and process payment
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        body: JSON.stringify(createOrderPayload),
      });
      const data: OrderData = await res.json();
      if (data) setOrderRes({ ...data });
      clearCart();
    } catch (error) {
      console.log(error);
    }
  };

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
      {status ? <p>Payment status: {status} </p> : <></>}
      <div className={styles.sections}>
        <section className={styles.productsSection}>
          <h2 className={styles.subtitle}>Videos</h2>
          <CartProducts />
          {cart.total != '0' ? <Coupons /> : <></>}
          <p className={styles.subtotal}>Subtotal: €{cart.subtotal}</p>
          <p className={styles.total}>Total: €{cart.total}</p>
        </section>

        <section className={styles.checkoutSection}>
          <h2 className={styles.subtitle}>Billing</h2>
          <form
            onSubmit={submitHandler}
            id='checkout_form'
            noValidate
            className={styles.checkoutForm}
          >
            <div className={styles.inputWrapper}>
              <label htmlFor='name' className={styles.label}>
                Name*
              </label>
              <TextInput
                required
                min={3}
                type='text'
                name='name'
                value={formFields.name}
                placeholder='Jane Doe'
                onChange={handleInputChange}
              />
              {formFieldsErrors.name ? (
                <span className={styles.error}>{formFieldsErrors.name}</span>
              ) : (
                <></>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor='email' className={styles.label}>
                Email*
              </label>
              <TextInput
                required
                type='email'
                name='email'
                value={formFields.email}
                placeholder='email@example.com'
                onChange={handleInputChange}
              />
              {formFieldsErrors.email ? (
                <span className={styles.error}>{formFieldsErrors.email}</span>
              ) : (
                <></>
              )}
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor='note' className={styles.label}>
                Order note
              </label>
              <TextArea
                id='note'
                name='note'
                value={formFields.note}
                onChange={handleInputChange}
                rows={5}
                placeholder='Any notes related to your order'
              />
            </div>

            {cart.total != '0' ? (
              <fieldset className={styles.payment}>
                <h2 className={styles.subtitle}>Payment method</h2>
                <RadioInput
                  label='Direct bank transfer'
                  id='bacs'
                  name='payment'
                  required
                  value='bacs'
                  checked={formFields.payment == 'bacs'}
                  onChange={handleInputChange}
                />
                <RadioInput
                  label='PayPal'
                  id='paypal'
                  name='payment'
                  required
                  value='paypal'
                  checked={formFields.payment == 'paypal'}
                  onChange={handleInputChange}
                />
                {/*<RadioInput
                  label='Stripe (cards, Apply Pay, Google Pay and more)'
                  id='stripe'
                  name='payment'
                  required
                  value='stripe'
                  checked={formFields.payment == 'stripe'}
                  onChange={handleInputChange}
                /> */}
                {/* <RadioInput
                  label='Already paid (specify in notes please)'
                  id='cod'
                  name='payment'
                  required
                  value='cod'
                  checked={formFields.payment == 'cod'}
                  onChange={handleInputChange}
                /> */}
              </fieldset>
            ) : (
              <></>
            )}

            <Button
              type='submit'
              role='link'
              className={styles.button}
              isLarge
              fullWidth
              isDisabled={isBtnDisabled}
            >
              {cart.total != '0' &&
              cart.total != '' &&
              formFields.payment != 'bacs' &&
              formFields.payment != 'cod'
                ? 'Pay €' + cart.total
                : 'Place order'}
            </Button>
          </form>
        </section>
      </div>
    </>
  );
};

export default Checkout;
