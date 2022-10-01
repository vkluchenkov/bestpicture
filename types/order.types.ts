interface LineItem {
  product_id: number;
  name?: string;
  price?: number;
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

export interface CreateOrderPayload {
  billing: {
    email: string;
    first_name: string;
  };
  customer_note?: string;
  status: OrderStatus;
  set_paid?: boolean;
  payment_method?: PaymentMethod;
  line_items?: LineItem[];
  coupon_lines?: CouponItem[];
  fee_lines?: FeeItem[];
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
  order_key?: string;
}
