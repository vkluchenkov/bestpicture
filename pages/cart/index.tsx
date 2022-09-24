import { NextPage } from 'next';
import Head from 'next/head';
import { FormEvent, useState } from 'react';
import { Loader } from '../../components/Loader';
import { useCart } from '../../store/Cart';

const CartPage: NextPage = () => {
  const [
    {
      cart,
      removeLoading,
      removeError,
      couponLoading,
      couponError,
      removeCouponsError,
      removeCouponsLoading,
    },
    { removeProduct, applyCoupon, removeCoupons },
  ] = useCart();

  const [coupon, setCoupon] = useState('');

  const cartProducts = cart.contents.nodes;
  const cartCoupons = cart.appliedCoupons;

  const couponList = cartCoupons?.map((c) => {
    return (
      <div key={c.code}>
        <p>
          Code: {c.code}, amount {c.discountAmount}
        </p>
        <button type='button' onClick={() => handleRemoveCoupons(c.code)}>
          remove coupon
        </button>
        {removeCouponsError ? <p>{removeCouponsError.message}</p> : ''}
      </div>
    );
  });

  const productList = !cartProducts
    ? []
    : cartProducts.map((p) => {
        const { id, name, price } = p.product.node;
        return (
          <div key={id}>
            <h3>{name}</h3>
            <p>€{price}</p>
            <button type='button' onClick={() => removeProduct(p.key!)}>
              remove
            </button>
          </div>
        );
      });

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setCoupon(target.value);
  };

  if (!productList.length)
    return (
      <>
        <Head>
          <title>Cart | bestpicture.pro</title>
        </Head>
        <h1>Cart</h1>
        <p>Nothing here.. yet</p>
      </>
    );

  const handleCouponSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyCoupon(coupon);
  };

  const handleRemoveCoupons = (code: string) => {
    removeCoupons([code]);
  };

  return (
    <>
      <Head>
        <title>Cart | bestpicture.pro</title>
      </Head>
      <h1>Cart</h1>
      <p>Items: {cart.contents.itemCount}</p>
      {productList}
      <p>Subtotal: €{cart.subtotal}</p>
      {couponList}
      <p>Total: €{cart.total}</p>
      {removeError ? <p>removeError.message</p> : <></>}
      {removeLoading || couponLoading || removeCouponsLoading ? <Loader /> : <></>}
      <form onSubmit={handleCouponSubmit}>
        <input type='text' value={coupon} onChange={handleInputChange} />
        <button type='submit'>Apply coupon</button>
        {couponError ? <p>{couponError.message}</p> : <></>}
      </form>
    </>
  );
};

export default CartPage;
