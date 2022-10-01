import { FormEvent } from 'react';
import { useCart } from '../../store/Cart';
import { FormFields } from '../../types/cart.types';
import { Button } from '../../ui-kit/Button';
import { RadioInput } from '../../ui-kit/RadioInput';
import { TextArea } from '../../ui-kit/TextArea';
import { TextInput } from '../../ui-kit/TextInput';
import styles from './CheckoutForm.module.css';

interface CheckoutFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onChange: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  formFields: FormFields;
  formFieldsErrors: Partial<FormFields>;
  isBtnDisabled: boolean;
  total: string | number;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSubmit,
  onChange,
  formFields,
  formFieldsErrors,
  isBtnDisabled,
  total,
}) => {
  const [{ cart }, {}] = useCart();

  return (
    <form onSubmit={onSubmit} id='checkout_form' noValidate className={styles.checkoutForm}>
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
          onChange={onChange}
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
          onChange={onChange}
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
            onChange={onChange}
          />
          <RadioInput
            label='PayPal (processing fee 5%, min €1)'
            id='paypal'
            name='payment'
            required
            value='paypal'
            checked={formFields.payment == 'paypal'}
            onChange={onChange}
          />
          <RadioInput
            label='Stripe (cards, Apply Pay, Google Pay and more. Processing fee 5%, min €1)'
            id='stripe'
            name='payment'
            required
            value='stripe'
            checked={formFields.payment == 'stripe'}
            onChange={onChange}
          />
          {/* <RadioInput
                  label='Already paid (specify in notes please)'
                  id='cod'
                  name='payment'
                  required
                  value='cod'
                  checked={formFields.payment == 'cod'}
                  onChange={onChange}
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
          ? 'Pay €' + total
          : 'Place order'}
      </Button>
    </form>
  );
};
