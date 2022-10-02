import { OrderData } from '../../types/order.types';
import styles from './OrderView.module.css';

interface OrderViewProps {
  orderData: OrderData;
}

export const OrderVeiw: React.FC<OrderViewProps> = ({ orderData }) => {
  const lineItems = orderData.line_items.map((i) => <li key={'video' + i.product_id}>{i.name}</li>);
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
};
