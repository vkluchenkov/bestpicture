export interface Coupon {
  code: string;
  description: string;
  discountAmount: string;
}

export interface CartProduct {
  product: {
    node: {
      id: number;
      name: string;
      price: string;
    };
  };
  extraData: {
    key: string;
    value: string;
  }[];
  key?: string;
}

export interface CartContents {
  appliedCoupons: null | Coupon[];
  fees: null | {
    amount: string;
    name: string;
  };
  contents: {
    nodes: CartProduct[];
    itemCount: number;
  };
  subtotal: string;
  total: string;
}

export interface CartItems {
  cart: CartContents;
}

type PaymentMethod = 'bacs' | 'paypal' | 'stripe' | 'cod' | 'cheque' | undefined;

// export interface CheckoutPayload {
//   billing: {
//     email: string;
//     firstName: string;
//   };
//   customerNote: string;
//   paymentMethod?: PaymentMethod;
//   isPaid?: boolean;
// }

export interface FormFields {
  name: string;
  email: string;
  note: string;
  payment: PaymentMethod;
}

export type CartErrorName = 'addError' | 'removeError' | 'couponError' | 'removeCouponsError';

export interface CartProviderProps {
  children: React.ReactNode;
}

export interface AddToCartMutation {
  addToCart: CartItems;
}

export interface AddFeeMutation {
  addFee: CartItems;
}

export interface RemoveFromCartMutation {
  removeItemsFromCart: CartItems;
}

export interface ApplyCouponMutation {
  applyCoupon: CartItems;
}

export interface RemoveCouponsMutation {
  removeCoupons: CartItems;
}

export interface CheckoutResult {
  redirect: string | null;
  result: string;
  customer: {
    id: string;
    sessionToken: string;
  };
  order: {
    databaseId: number;
    orderKey: string;
  };
}

export interface CheckoutMutation {
  checkout: CheckoutResult;
}
