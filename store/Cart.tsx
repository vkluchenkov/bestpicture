import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  CartContents,
  CartItems,
  CheckoutPayload,
  CartErrorName,
  CartProviderProps,
  AddToCartMutation,
  RemoveFromCartMutation,
  ApplyCouponMutation,
  RemoveCouponsMutation,
  CheckoutMutation,
  CheckoutResult,
} from '../types/cart.types';
import {
  ADD_TO_CART,
  APPLY_COUPON,
  GET_CART,
  REMOVE_COUPONS,
  REMOVE_FROM_CART,
  CHECKOUT_MUTATION,
} from '../wooApi/wooApi';

interface CartStore {
  cart: CartContents;
  isOpen: boolean;
  isLoading: boolean;
  cartErrors: Record<string, ApolloError | undefined>;
  checkoutResult: CheckoutMutation | null;
}

interface CartStoreActions {
  addProduct: (productId: number) => void;
  removeProduct: (cartKey: string) => void;
  applyCoupon: (code: string) => void;
  removeCoupons: (codes: string[]) => void;
  showCart: () => void;
  hideCart: () => void;
  clearCart: () => void;
  eraseError: (eName: CartErrorName) => void;
  checkout: (payload: CheckoutPayload) => void;
}

export const Cart = createContext<[CartStore, CartStoreActions] | null>(null);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // States
  const [isOpen, setIsOpen] = useState(false);

  const [cartContent, setCartContent] = useState<CartItems>({
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

  const [cartErrors, setCartErrors] = useState<Record<CartErrorName, ApolloError | undefined>>({
    addError: undefined,
    removeError: undefined,
    couponError: undefined,
    removeCouponsError: undefined,
    checkoutError: undefined,
  });

  const [checkoutResult, setCheckoutResult] = useState<CheckoutMutation | null>(null);

  const [skip, setSkip] = useState(false);

  const [isLoading, setIsloading] = useState(false);

  const handleError = (e: ApolloError, eName: string) => {
    setCartErrors((prev) => {
      return {
        ...prev,
        [eName]: e,
      };
    });
  };

  // Mutations & queries
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

  const [checkoutMutation, { data: checkoutData, error: checkoutError, loading: checkoutLoading }] =
    useMutation<CheckoutMutation>(CHECKOUT_MUTATION, {
      onError: (e) => handleError(e, 'checkoutError'),
    });

  const { data: cartData } = useQuery<CartItems>(GET_CART, { skip: skip });

  // Effects
  // Populate cart on initial loading
  useEffect(() => {
    if (cartData) {
      setCartContent(cartData);
      setSkip(true);
    }
  }, [cartData]);

  // Set cart after add mutation complete
  useEffect(() => {
    if (addData) setCartContent(addData.addToCart);
  }, [addData]);

  // Set cart after remove mutation complete
  useEffect(() => {
    if (removeData) setCartContent(removeData.removeItemsFromCart);
  }, [removeData]);

  // Set cart after coupon mutation complete
  useEffect(() => {
    if (couponData) setCartContent(couponData.applyCoupon);
  }, [couponData]);

  // Set cart after remove coupons mutation complete
  useEffect(() => {
    if (removeCouponsData) setCartContent(removeCouponsData.removeCoupons);
  }, [removeCouponsData]);

  // Set cart after checkout mutation complete
  useEffect(() => {
    if (checkoutData) setCheckoutResult(checkoutData);
  }, [checkoutData]);

  // Set loading state for all requests
  useEffect(() => {
    if (addLoading || removeLoading || couponLoading || removeCouponsLoading || checkoutLoading)
      setIsloading(true);
    else setIsloading(false);
  }, [addLoading, removeLoading, couponLoading, removeCouponsLoading, checkoutLoading]);

  // Handlers
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
  const clearCart: CartStoreActions['clearCart'] = async () => {
    setTimeout(() => {
      setCartContent({
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
      setCheckoutResult(null);
    }, 500);
  };

  const eraseError: CartStoreActions['eraseError'] = (eName) =>
    setCartErrors((prev) => {
      return { ...prev, [eName]: undefined };
    });

  const checkout: CartStoreActions['checkout'] = async (payload) => {
    try {
      await checkoutMutation({ variables: { input: payload } });
      clearCart();
    } catch (error) {}
  };

  return (
    <Cart.Provider
      value={[
        {
          ...cartContent,
          isOpen,
          isLoading,
          cartErrors,
          checkoutResult,
        },
        {
          addProduct,
          removeProduct,
          applyCoupon,
          removeCoupons,
          showCart,
          hideCart,
          clearCart,
          eraseError,
          checkout,
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
