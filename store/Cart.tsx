import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { CartContents, CartItems } from '../types/cart.types';
import { ADD_TO_CART, GET_CART, REMOVE_FROM_CART } from '../wooApi/wooApi';

interface CartStore {
  cart: CartContents;
  addLoading: boolean;
  addError: ApolloError | undefined;
  removeLoading: boolean;
  removeError: ApolloError | undefined;
}

interface CartStoreActions {
  addProduct: (productId: number) => void;
  removeProduct: (cartKey: string) => void;
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

export const Cart = createContext<[CartStore, CartStoreActions] | null>(null);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [skip, setSkip] = useState(false);

  const [addMutation, { data: addData, error: addError, loading: addLoading }] =
    useMutation<AddToCartMutation>(ADD_TO_CART);

  const [removeMutation, { data: removeData, error: removeError, loading: removeLoading }] =
    useMutation<RemoveFromCartMutation>(REMOVE_FROM_CART);

  const { data: cartData } = useQuery<CartItems>(GET_CART, { skip: skip });

  const [state, setState] = useState<CartItems>({
    cart: {
      appliedCoupons: null,
      contents: {
        nodes: [],
        itemCount: 0,
      },
      total: '',
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

  const addProduct: CartStoreActions['addProduct'] = (productId) => {
    addMutation({ variables: { productId: productId } });
  };

  const removeProduct: CartStoreActions['removeProduct'] = (cartKey) => {
    removeMutation({ variables: { keys: [cartKey] } });
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
        },
        {
          addProduct,
          removeProduct,
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
