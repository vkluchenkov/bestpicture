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

export interface CartStoreItems {
  appliedCoupons: null | Coupon[];
  contents: {
    nodes: CartProduct[];
    itemCount: number;
  };
  total: string;
}

export interface CartItems {
  cart: CartStoreItems;
}
