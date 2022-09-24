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
  key: string;
}

export interface CartProducts {
  cart: {
    appliedCoupons: null | Coupon[];
    contents: {
      nodes: CartProduct[];
    };
  };
}
