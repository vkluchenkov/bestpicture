import { PayPalButtons } from '@paypal/react-paypal-js';
import { FormEvent, useEffect, useState } from 'react';
import { useCart } from '../../store/Cart';
import { FormFields } from '../../types/cart.types';
import { Button } from '../../ui-kit/Button';
import { RadioInput } from '../../ui-kit/RadioInput';
import { TextArea } from '../../ui-kit/TextArea';
import { TextInput } from '../../ui-kit/TextInput';
import styles from './CheckoutForm.module.css';

interface CheckoutFormProps {
  onSubmit: () => Promise<string>;
  onChange: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  // setTransactionId: (orderId: string) => void;
  payPalApproveHandler: (orderId: string | null) => Promise<void>;
  formFields: FormFields;
  formFieldsErrors: Partial<FormFields>;
  isBtnDisabled: boolean;
  total: string;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSubmit,
  onChange,
  // setTransactionId,
  payPalApproveHandler,
  formFields,
  formFieldsErrors,
  isBtnDisabled,
  total,
}) => {
  const [{ cart }, {}] = useCart();

  const [isOrderError, setIsOrderError] = useState(false);

  useEffect(() => {
    if (isOrderError)
      setTimeout(() => {
        setIsOrderError(false);
      }, 10000);
  }, [isOrderError]);

  let wcOrderId: null | string = null;

  const buttonText = () =>
    cart.total != '€0.00' &&
    cart.total != '' &&
    formFields.payment != 'bacs' &&
    formFields.payment != 'cod' &&
    formFields.payment != 'cheque'
      ? 'Pay ' + total
      : 'Place order for ' + total;

  return (
    <form id='checkout_form' noValidate className={styles.checkoutForm}>
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
          onChange={onChange}
          error={formFieldsErrors.name}
        />
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
          onChange={onChange}
          error={formFieldsErrors.email}
        />
      </div>

      <div className={styles.inputWrapper}>
        <label htmlFor='note' className={styles.label}>
          Order note
        </label>
        <TextArea
          id='note'
          name='note'
          value={formFields.note}
          onChange={onChange}
          rows={5}
          placeholder='Any notes related to your order'
        />
      </div>

      {cart.total != '€0.00' ? (
        <fieldset className={styles.payment}>
          <h2 className={styles.subtitle}>Payment method</h2>
          <RadioInput
            label='Cash (select only if pay in person)'
            id='cod'
            name='payment'
            required
            value='cod'
            checked={formFields.payment === 'cod'}
            onChange={onChange}
          />
          {/* <RadioInput
            label='Revolut'
            id='cheque'
            name='payment'
            required
            value='cheque'
            checked={formFields.payment === 'cheque'}
            onChange={onChange}
          /> */}
          <RadioInput
            label='Direct bank transfer'
            id='bacs'
            name='payment'
            required
            value='bacs'
            checked={formFields.payment === 'bacs'}
            onChange={onChange}
          />
          <RadioInput
            label='PayPal (fee 5%)'
            id='paypal'
            name='payment'
            required
            value='paypal'
            checked={formFields.payment === 'paypal'}
            onChange={onChange}
          />
          <RadioInput
            label='Stripe (cards, Apply Pay, Google Pay and more. Fee 5%)'
            id='stripe'
            name='payment'
            required
            value='stripe'
            checked={formFields.payment === 'stripe'}
            onChange={onChange}
          />
        </fieldset>
      ) : (
        <></>
      )}
      {isOrderError && (
        <span className={styles.error}>
          There was an error while placing your order. Please try again or contact me to resolve the
          problem
        </span>
      )}
      {formFields.payment != 'paypal' ? (
        <Button
          type='button'
          role='link'
          className={styles.button}
          isLarge
          fullWidth
          isDisabled={isBtnDisabled}
          onClick={onSubmit}
        >
          {buttonText()}
        </Button>
      ) : (
        <PayPalButtons
          style={{ color: 'gold', height: 40, label: 'checkout' }}
          fundingSource='paypal'
          disabled={isBtnDisabled}
          className={styles.button}
          createOrder={async (data, actions) => {
            const getWcOrderId = await onSubmit();
            if (getWcOrderId) {
              wcOrderId = getWcOrderId;
              const paypalOrderId = await actions.order.create({
                purchase_units: [
                  {
                    amount: { value: total.replace('€', '') },
                    description: `bestpicture.pro order #${getWcOrderId}`,
                  },
                ],
                application_context: {},
              });
              // setTransactionId(paypalOrderId);
              return paypalOrderId;
            } else throw new Error('Error creating order');
          }}
          onError={(error) => {
            console.log(error);
            setIsOrderError(true);
          }}
          onApprove={async (data, actions) => {
            await actions.order!.capture();
            await payPalApproveHandler(wcOrderId);
          }}
        />
      )}
    </form>
  );
};
