import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { CartContents, CartItems } from '../types/cart.types';
import {
  ADD_TO_CART,
  APPLY_COUPON,
  GET_CART,
  REMOVE_COUPONS,
  REMOVE_FROM_CART,
} from '../wooApi/wooApi';

interface CartStore {
  cart: CartContents;
  addLoading: boolean;
  addError: ApolloError | undefined;
  removeLoading: boolean;
  removeError: ApolloError | undefined;
  couponLoading: boolean;
  couponError: ApolloError | undefined;
  removeCouponsLoading: boolean;
  removeCouponsError: ApolloError | undefined;
}

interface CartStoreActions {
  addProduct: (productId: number) => void;
  removeProduct: (cartKey: string) => void;
  applyCoupon: (code: string) => void;
  removeCoupons: (codes: string[]) => void;
}

interface CartProviderProps {
  children: React.ReactNode;
}

interface AddToCartMutation {
  addToCart: CartItems;
}

interface RemoveFromCartMutation {
  removeItemsFromCart: CartItems;
}

interface ApplyCouponMutation {
  applyCoupon: CartItems;
}

interface RemoveCouponsMutation {
  removeCoupons: CartItems;
}

export const Cart = createContext<[CartStore, CartStoreActions] | null>(null);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [skip, setSkip] = useState(false);

  const [addMutation, { data: addData, error: addError, loading: addLoading }] =
    useMutation<AddToCartMutation>(ADD_TO_CART);

  const [removeMutation, { data: removeData, error: removeError, loading: removeLoading }] =
    useMutation<RemoveFromCartMutation>(REMOVE_FROM_CART);

  const [couponMutation, { data: couponData, error: couponError, loading: couponLoading }] =
    useMutation<ApplyCouponMutation>(APPLY_COUPON);

  const [
    removeCouponsMutation,
    { data: removeCouponsData, error: removeCouponsError, loading: removeCouponsLoading },
  ] = useMutation<RemoveCouponsMutation>(REMOVE_COUPONS);

  const { data: cartData } = useQuery<CartItems>(GET_CART, { skip: skip });

  const [state, setState] = useState<CartItems>({
    cart: {
      appliedCoupons: null,
      contents: {
        nodes: [],
        itemCount: 0,
      },
      total: '',
      subtotal: '',
    },
  });

  // Populate cart on initial loading
  useEffect(() => {
    if (cartData) {
      setState(cartData);
      setSkip(true);
    }
  }, [cartData]);

  // Set cart after add mutation complete
  useEffect(() => {
    if (addData) setState(addData.addToCart);
  }, [addData]);

  // Set cart after remove mutation complete
  useEffect(() => {
    if (removeData) setState(removeData.removeItemsFromCart);
  }, [removeData]);

  // Set cart after coupon mutation complete
  useEffect(() => {
    if (couponData) setState(couponData.applyCoupon);
  }, [couponData]);

  // Set cart after remove coupons mutation complete
  useEffect(() => {
    if (removeCouponsData) setState(removeCouponsData.removeCoupons);
  }, [removeCouponsData]);

  const addProduct: CartStoreActions['addProduct'] = (productId) => {
    addMutation({ variables: { productId: productId } });
  };

  const removeProduct: CartStoreActions['removeProduct'] = (cartKey) => {
    removeMutation({ variables: { keys: [cartKey] } });
  };

  const applyCoupon: CartStoreActions['applyCoupon'] = (code) => {
    couponMutation({ variables: { code: code } });
  };

  const removeCoupons: CartStoreActions['removeCoupons'] = (codes) => {
    removeCouponsMutation({ variables: { codes: codes } });
  };

  return (
    <Cart.Provider
      value={[
        {
          ...state,
          addError,
          addLoading,
          removeError,
          removeLoading,
          couponError,
          couponLoading,
          removeCouponsError,
          removeCouponsLoading,
        },
        {
          addProduct,
          removeProduct,
          applyCoupon,
          removeCoupons,
        },
      ]}
    >
      {children}
    </Cart.Provider>
  );
};

export const useCart = () => {
  const store = useContext(Cart);
  if (!store) {
    throw new Error('useCart must be used within a Cart');
  }
  return store;
};
