import { OrderData } from '../../types/order.types';
import styles from './OrderView.module.css';

interface OrderViewProps {
  orderData: OrderData;
}

export const OrderVeiw: React.FC<OrderViewProps> = ({ orderData }) => {
  const lineItems = orderData.line_items.map((i) => {
    return (
      <li key={'video' + i.product_id} className={styles.listItem}>
        <h3 className={styles.listItem__name}>{i.name}</h3>
        <p className={styles.listItem__price}>€{i.subtotal}</p>
      </li>
    );
  });
  const feeItems = orderData.fee_lines.map((i) => {
    return (
      <li key={'fee' + i.id} className={styles.listItem}>
        <h3 className={styles.listItem__name}>{i.name}</h3>
        <p className={styles.listItem__price}>€{i.total}</p>
      </li>
    );
  });

  const status = () => {
    if (orderData.status == 'on-hold')
      return 'Awaiting payment to arrive into my bank account or my manual confirmation if paid in cash. Payment details sent by email, please check your mailbox.';
    if (orderData.status == 'processing')
      return 'Payment received, processing videos. Download links will be sent by email.';
    if (orderData.status == 'pending')
      return 'Awaiting confirmation from the payment provider if paid electronically or my manual confirmation if paid in cash. You will receive an email with the payment confirmation.';
    if (orderData.status == 'failed') return 'Order failed, please place a new order.';
    if (orderData.status == 'completed')
      return 'Order completed. Download details sent by email, lease check your mailbox.';
    if (orderData.status == 'refunded')
      return 'Order refunded. All relevant details were sent by email, please check your mailbox.';
    if (orderData.status == 'trash' || orderData.status == 'cancelled')
      return 'Order cancelled. Please place a new order.';
    return 'Order status unknown. Please contact me for clarification.';
  };

  return (
    <>
      <h1 className={styles.title}>Order #{orderData.id}</h1>
      <p className={styles.text}>
        <span className={styles.text_bold}>Order status:</span> {status()}
      </p>
      <h2 className={styles.subtitle}>Billing</h2>
      <p className={styles.text}>
        <span className={styles.text_bold}>Name: </span>
        {orderData.billing.first_name}
      </p>
      <p className={styles.text}>
        <span className={styles.text_bold}>Email: </span>
        {orderData.billing.email}
      </p>
      {orderData.payment_method_title != '' && (
        <p className={styles.text}>
          <span className={styles.text_bold}>Payment method: </span>
          {orderData.payment_method_title}
        </p>
      )}

      <h2 className={styles.subtitle}>Videos</h2>
      <ul className={styles.listItems}>{lineItems}</ul>

      {!!feeItems.length && (
        <>
          <h2 className={styles.subtitle}>Fees</h2>
          <ul className={styles.listItems}>{feeItems}</ul>
        </>
      )}

      {!!orderData.customer_note.length && (
        <>
          <h2 className={styles.subtitle}>Note</h2>
          <p className={styles.text}>{orderData.customer_note}</p>
        </>
      )}
      <p className={styles.subtotal}>
        {orderData.discount_total != '0.00' ? 'Discount: -€' + orderData.discount_total : ''}
      </p>
      <p className={styles.total}>Total: €{orderData.total}</p>
    </>
  );
};
