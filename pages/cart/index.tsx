import { gql, useMutation, useQuery } from '@apollo/client';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Loader } from '../../components/Loader';

interface Coupon {
  code: string;
  description: string;
  discountAmount: string;
}

interface CartProduct {
  product: {
    node: {
      id: number;
      name: string;
      price: string;
    };
  };
  key: string;
}

interface CartProducts {
  cart: {
    appliedCoupons: null | Coupon[];
    contents: {
      nodes: CartProduct[];
    };
  };
}

const Cart: NextPage = () => {
  const [cartProducts, setCartProducts] = useState<CartProducts | null>(null);

  const GET_CART = gql`
    query GetCart {
      cart {
        appliedCoupons {
          code
          description
          discountAmount(format: RAW)
        }
        contents {
          nodes {
            product {
              node {
                ... on SimpleProduct {
                  name
                  id: databaseId
                  price(format: RAW)
                }
              }
            }
            key
          }
        }
      }
    }
  `;

  const REMOVE_FROM_CART = gql`
    mutation RemoveFromCart($keys: [ID]) {
      removeItemsFromCart(input: { keys: $keys }) {
        cart {
          appliedCoupons {
            code
            description
            discountAmount(format: RAW)
          }
          contents {
            nodes {
              product {
                node {
                  ... on SimpleProduct {
                    name
                    id: databaseId
                    price(format: RAW)
                  }
                }
              }
              key
            }
          }
        }
      }
    }
  `;

  const {
    loading: cartLoading,
    error: cartError,
    data: cartData,
  } = useQuery<CartProducts>(GET_CART);

  const [handleRemoveMutation, { data: removeData, error: removeError, loading: removeLoading }] =
    useMutation(REMOVE_FROM_CART);

  useEffect(() => {
    if (cartData) setCartProducts(cartData);
  }, [cartData]);

  useEffect(() => {
    if (removeData) setCartProducts(removeData.removeItemsFromCart);
  }, [removeData]);

  const handleRemove = async (key: string) => {
    await handleRemoveMutation({ variables: { keys: [key] } });
  };

  if (cartError) return <>{cartError.message}</>;

  const ProductList = !cartProducts
    ? []
    : cartProducts.cart.contents.nodes.map((p) => {
        const { id, name, price } = p.product.node;
        return (
          <div key={id}>
            <h3>{name}</h3>
            <p>{price}</p>
            <button type='button' onClick={() => handleRemove(p.key)}>
              remove
            </button>
          </div>
        );
      });
  return (
    <>
      <Head>
        <title>Cart | bestpicture.pro</title>
      </Head>
      <h1>Cart</h1>
      {ProductList.length ? ProductList : <p>Nothing here.. yet</p>}
      {removeError ? <p>removeError.message</p> : <></>}
      {removeLoading || cartLoading ? <Loader /> : <></>}
    </>
  );
};

export default Cart;
