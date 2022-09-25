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
  isOpen: boolean;
  addLoading: boolean;
  removeLoading: boolean;
  couponLoading: boolean;
  removeCouponsLoading: boolean;
  cartErrors: Record<string, ApolloError | undefined>;
}

interface CartStoreActions {
  addProduct: (productId: number) => void;
  removeProduct: (cartKey: string) => void;
  applyCoupon: (code: string) => void;
  removeCoupons: (codes: string[]) => void;
  showCart: () => void;
  hideCart: () => void;
  eraseError: (eName: CartErrorName) => void;
}

type CartErrorName = 'addError' | 'removeError' | 'couponError' | 'removeCouponsError';

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
  const [cartErrors, setCartErrors] = useState<Record<CartErrorName, ApolloError | undefined>>({
    addError: undefined,
    removeError: undefined,
    couponError: undefined,
    removeCouponsError: undefined,
  });

  const handleError = (e: ApolloError, eName: string) => {
    setCartErrors((prev) => {
      return {
        ...prev,
        [eName]: e,
      };
    });
  };

  const [addMutation, { data: addData, error: addError, loading: addLoading }] =
    useMutation<AddToCartMutation>(ADD_TO_CART, {
      onError: (e) => handleError(e, 'addError'),
    });

  const [removeMutation, { data: removeData, error: removeError, loading: removeLoading }] =
    useMutation<RemoveFromCartMutation>(REMOVE_FROM_CART, {
      onError: (e) => handleError(e, 'removeError'),
    });

  const [couponMutation, { data: couponData, error: couponError, loading: couponLoading }] =
    useMutation<ApplyCouponMutation>(APPLY_COUPON, {
      onError: (e) => handleError(e, 'couponError'),
    });

  const [
    removeCouponsMutation,
    { data: removeCouponsData, error: removeCouponsError, loading: removeCouponsLoading },
  ] = useMutation<RemoveCouponsMutation>(REMOVE_COUPONS, {
    onError: (e) => handleError(e, 'removeCouponsError'),
  });

  const [skip, setSkip] = useState(false);
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

  const [isOpen, setIsOpen] = useState(false);

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

  const addProduct: CartStoreActions['addProduct'] = async (productId) => {
    try {
      await addMutation({ variables: { productId: productId } });
    } catch (error) {}
  };

  const removeProduct: CartStoreActions['removeProduct'] = async (cartKey) => {
    try {
      await removeMutation({ variables: { keys: [cartKey] } });
    } catch (error) {}
  };

  const applyCoupon: CartStoreActions['applyCoupon'] = async (code) => {
    try {
      await couponMutation({ variables: { code: code } });
    } catch (error) {}
  };

  const removeCoupons: CartStoreActions['removeCoupons'] = async (codes) => {
    try {
      await removeCouponsMutation({ variables: { codes: codes } });
    } catch (error) {}
  };

  const showCart: CartStoreActions['showCart'] = () => setIsOpen(true);
  const hideCart: CartStoreActions['hideCart'] = () => setIsOpen(false);

  const eraseError: CartStoreActions['eraseError'] = (eName) =>
    setCartErrors((prev) => {
      return { ...prev, [eName]: undefined };
    });

  return (
    <Cart.Provider
      value={[
        {
          ...state,
          isOpen,
          addLoading,
          removeLoading,
          couponLoading,
          removeCouponsLoading,
          cartErrors,
        },
        {
          addProduct,
          removeProduct,
          applyCoupon,
          removeCoupons,
          showCart,
          hideCart,
          eraseError,
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
