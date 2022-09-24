import { useMutation, useQuery } from '@apollo/client';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Loader } from '../../components/Loader';
import { useCart } from '../../store/Cart';

const CartPage: NextPage = () => {
  const [{ cart }, { removeProduct }] = useCart();
  const cartProducts = cart.contents.nodes;

  const ProductList = !cartProducts
    ? []
    : cartProducts.map((p) => {
        const { id, name, price } = p.product.node;
        return (
          <div key={id}>
            <h3>{name}</h3>
            <p>{price}</p>
            <button type='button' onClick={() => removeProduct(p.key!)}>
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
      {/* {removeError ? <p>removeError.message</p> : <></>} */}
      {/* {removeLoading ? <Loader /> : <></>} */}
    </>
  );
};

export default CartPage;
