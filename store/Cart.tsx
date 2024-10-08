import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  CartContents,
  CartItems,
  CartErrorName,
  CartProviderProps,
  AddToCartMutation,
  RemoveFromCartMutation,
  ApplyCouponMutation,
  RemoveCouponsMutation,
  AddFeeMutation,
} from '../types/cart.types';
import {
  ADD_TO_CART,
  APPLY_COUPON,
  ADD_FEE,
  GET_CART,
  REMOVE_COUPONS,
  REMOVE_FROM_CART,
  CLEAR_CART_MUTATION,
} from '../wooApi/wooApiGQL';
import { cropFee } from '../utils/constants';

interface CartStore {
  cart: CartContents;
  isOpen: boolean;
  isLoading: boolean;
  cartErrors: Record<string, ApolloError | undefined>;
}

interface CartStoreActions {
  addProduct: (productId: number, extraData: string) => void;
  addFee: (name: string, amount: number) => void;
  removeProduct: (cartKey: string) => void;
  applyCoupon: (code: string) => void;
  removeCoupons: (codes: string[]) => void;
  showCart: () => void;
  hideCart: () => void;
  clearCart: () => void;
  eraseError: (eName: CartErrorName) => void;
}

export const Cart = createContext<[CartStore, CartStoreActions] | null>(null);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const emptyCart = useMemo(() => {
    return {
      appliedCoupons: null,
      contents: {
        nodes: [],
        itemCount: 0,
      },
      total: '',
      subtotal: '',
      fees: null,
    };
  }, []);

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [cartContent, setCartContent] = useState<CartItems>({ cart: emptyCart });
  const [cartErrors, setCartErrors] = useState<Record<CartErrorName, ApolloError | undefined>>({
    addError: undefined,
    removeError: undefined,
    couponError: undefined,
    removeCouponsError: undefined,
  });

  const [skip, setSkip] = useState(false);

  // Mutations error handler
  const handleError = useCallback((e: ApolloError, eName: string) => {
    setCartErrors((prev) => {
      return {
        ...prev,
        [eName]: e,
      };
    });
  }, []);

  // Mutations & queries
  const [addMutation, { data: addData, error: addError, loading: addLoading }] =
    useMutation<AddToCartMutation>(ADD_TO_CART, {
      onError: (e) => handleError(e, 'addError'),
    });

  const [addFeeMutation, { data: addFeeData, error: addFeeError, loading: addFeeLoading }] =
    useMutation<AddFeeMutation>(ADD_FEE, {
      onError: (e) => handleError(e, 'addFeeError'),
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

  const [clearCartMutation, { loading: clearCartLoading }] = useMutation(CLEAR_CART_MUTATION, {
    onError: (e) => handleError(e, 'clearCartError'),
  });

  const { data: cartData, refetch: refetchCart } = useQuery<CartItems>(GET_CART, { skip: skip });

  // Handle crops and amend cart total and subtotal
  const getTotals = useCallback((cartData: CartItems) => {
    const numberOfVerticals = cartData.cart.contents.nodes.filter((p) =>
      p.extraData.find((d) => d.key === 'is_vertical' && d.value === 'true')
    ).length;

    const numberOfSquares = cartData.cart.contents.nodes.filter((p) =>
      p.extraData.find((d) => d.key === 'is_square' && d.value === 'true')
    ).length;

    if (numberOfVerticals > 0 || numberOfSquares > 0) {
      const totalAdd = (numberOfVerticals + numberOfSquares) * cropFee;
      const total = parseFloat(cartData.cart.total.replace('€', '')) + totalAdd;
      const subtotal = parseFloat(cartData.cart.subtotal.replace('€', '')) + totalAdd;
      return { total: '€' + total.toFixed(2), subtotal: '€' + subtotal.toFixed(2) };
    }
    return {
      total: cartData.cart.total,
      subtotal: cartData.cart.subtotal,
    };
  }, []);

  // Effects
  // Populate cart on initial loading
  useEffect(() => {
    if (cartData) {
      const totals = getTotals(cartData);
      setCartContent({
        ...cartData,
        cart: { ...cartData.cart, total: totals.total, subtotal: totals.subtotal },
      });
      setSkip(true);
    }
  }, [cartData, getTotals]);

  // Set cart after add mutation complete
  useEffect(() => {
    if (addData) {
      const totals = getTotals(addData.addToCart);
      setCartContent({
        ...addData.addToCart,
        cart: { ...addData.addToCart.cart, total: totals.total, subtotal: totals.subtotal },
      });
    }
  }, [addData, getTotals]);

  // Set cart after remove mutation complete
  useEffect(() => {
    if (removeData) {
      const totals = getTotals(removeData.removeItemsFromCart);
      setCartContent({
        ...removeData.removeItemsFromCart,
        cart: {
          ...removeData.removeItemsFromCart.cart,
          total: totals.total,
          subtotal: totals.subtotal,
        },
      });
    }
  }, [removeData, getTotals]);

  // Set cart after coupon mutation complete
  useEffect(() => {
    if (couponData) {
      const totals = getTotals(couponData.applyCoupon);
      setCartContent({
        ...couponData.applyCoupon,
        cart: { ...couponData.applyCoupon.cart, total: totals.total, subtotal: totals.subtotal },
      });
    }
  }, [couponData, getTotals]);

  // Set cart after remove coupons mutation complete
  useEffect(() => {
    if (removeCouponsData) {
      const totals = getTotals(removeCouponsData.removeCoupons);
      setCartContent({
        ...removeCouponsData.removeCoupons,
        cart: {
          ...removeCouponsData.removeCoupons.cart,
          total: totals.total,
          subtotal: totals.subtotal,
        },
      });
    }
  }, [removeCouponsData, getTotals]);

  // Set loading state for all requests
  const isLoading = useMemo(() => {
    if (addLoading || removeLoading || couponLoading || removeCouponsLoading || clearCartLoading)
      return true;
    else return false;
  }, [addLoading, removeLoading, couponLoading, removeCouponsLoading, clearCartLoading]);

  // Cart handlers
  const addProduct: CartStoreActions['addProduct'] = useCallback(
    async (productId, extraData) =>
      await addMutation({ variables: { productId: productId, extraData: extraData } }),
    [addMutation]
  );

  const addFee: CartStoreActions['addFee'] = useCallback(
    async (name, amount) => await addFeeMutation({ variables: { name: name, amount: amount } }),
    [addFeeMutation]
  );

  const removeProduct: CartStoreActions['removeProduct'] = useCallback(
    async (cartKey) => await removeMutation({ variables: { keys: [cartKey] } }),
    [removeMutation]
  );

  const applyCoupon: CartStoreActions['applyCoupon'] = useCallback(
    async (code) => await couponMutation({ variables: { code: code } }),
    [couponMutation]
  );

  const removeCoupons: CartStoreActions['removeCoupons'] = useCallback(
    async (codes) => await removeCouponsMutation({ variables: { codes: codes } }),
    [removeCouponsMutation]
  );

  const showCart: CartStoreActions['showCart'] = useCallback(() => setIsOpen(true), []);
  const hideCart: CartStoreActions['hideCart'] = useCallback(() => setIsOpen(false), []);
  const clearCart: CartStoreActions['clearCart'] = useCallback(async () => {
    await clearCartMutation();
    setCartContent({ cart: emptyCart });
  }, [clearCartMutation, emptyCart]);

  const eraseError: CartStoreActions['eraseError'] = useCallback(
    (eName) =>
      setCartErrors((prev) => {
        return { ...prev, [eName]: undefined };
      }),
    []
  );

  return (
    <Cart.Provider
      value={[
        {
          ...cartContent,
          isOpen,
          isLoading,
          cartErrors,
        },
        {
          addProduct,
          addFee,
          removeProduct,
          applyCoupon,
          removeCoupons,
          showCart,
          hideCart,
          clearCart,
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
