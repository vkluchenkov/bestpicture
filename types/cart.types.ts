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
  key?: string;
}

export interface CartContents {
  appliedCoupons: null | Coupon[];
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
