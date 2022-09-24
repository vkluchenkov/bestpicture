import { useMutation, useQuery } from '@apollo/client';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Loader } from '../../components/Loader';
import { CartProducts } from '../../types/cart.types';
import { GET_CART, REMOVE_FROM_CART } from '../../wooApi/wooApi';

const Cart: NextPage = () => {
  const [cartProducts, setCartProducts] = useState<CartProducts | null>(null);

  const {
    loading: cartLoading,
    error: cartError,
    data: cartData,
  } = useQuery<CartProducts>(GET_CART);

  const [handleRemoveMutation, { data: removeData, error: removeError, loading: removeLoading }] =
    useMutation(REMOVE_FROM_CART);

  useEffect(() => cartData && setCartProducts(cartData), [cartData]);
  useEffect(() => removeData && setCartProducts(removeData.removeItemsFromCart), [removeData]);

  const handleRemove = async (key: string) =>
    await handleRemoveMutation({ variables: { keys: [key] } });

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
