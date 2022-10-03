interface LineItem {
  product_id: number;
  name?: string;
  price?: number;
  subtotal?: number;
  quantity: number;
}

interface CouponItem {}

interface FeeItem {
  id?: number;
  name: string;
  total: string;
}

type OrderStatus =
  | 'pending'
  | 'processing'
  | 'on-hold'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed'
  | 'trash';

type PaymentMethod = 'bacs' | 'stripe' | 'paypal' | 'cod' | '';
type PaymentMethodTitle =
  | 'PayPal'
  | 'Stripe (cards and wallets)'
  | 'Bank transfer'
  | 'Paid in cash'
  | '';

export interface CreateOrderPayload {
  billing: {
    email: string;
    first_name: string;
  };
  customer_note?: string;
  status: OrderStatus;
  set_paid?: boolean;
  payment_method?: PaymentMethod;
  payment_method_title?: PaymentMethodTitle;
  line_items?: LineItem[];
  coupon_lines?: CouponItem[];
  fee_lines?: FeeItem[];
  meta_data?: {
    key: string;
    value: string;
  }[];
  transaction_id?: string;
}

export interface OrderData {
  id: number;
  billing: {
    first_name: string;
    email: string;
  };
  fee_lines: FeeItem[];
  line_items: LineItem[];
  status: OrderStatus;
  discount_total: string;
  total: string;
  payment_method: PaymentMethod;
  payment_method_title: PaymentMethodTitle;
  order_key?: string;
  transaction_id: string;
}
