import { FormEvent, useEffect, useState } from 'react';
import { useCart } from '../../store/Cart';
import { Loader } from '../Loader';
import styles from './flyCart.module.css';

export const FlyCart: React.FC = () => {
  // Hooks
  const [
    { cart, isOpen, removeLoading, couponLoading, removeCouponsLoading, cartErrors },
    { removeProduct, applyCoupon, removeCoupons, hideCart, eraseError },
  ] = useCart();

  const [coupon, setCoupon] = useState('');

  // Effects

  // Body scroll blocking
  useEffect(() => {
    if (isOpen) document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  //Handling close on ESC
  useEffect(() => {
    const handleEscClose = (e: KeyboardEvent) => e.key === 'Escape' && hideCart();
    document.addEventListener('keydown', handleEscClose);
    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [hideCart]);

  // Handlers
  const handleClickClose = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    target.id == 'cart' && hideCart();
  };

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setCoupon(target.value);
  };

  const handleCouponSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyCoupon(coupon);
    setCoupon('');
    setTimeout(() => {
      eraseError('couponError');
    }, 5000);
  };

  // Data
  const cartProducts = cart.contents.nodes;
  const cartCoupons = cart.appliedCoupons;

  const couponList = cartCoupons?.map((c) => {
    return (
      <li className={styles.cartCoupon} key={c.code}>
        <p className={styles.coupon}>
          Coupon {c.code}: -€{c.discountAmount}
        </p>
        <button
          className={styles.removeCoupon}
          type='button'
          onClick={() => removeCoupons([c.code])}
        >
          remove coupon
        </button>
        {cartErrors.removeCouponsError ? <p>{cartErrors.removeCouponsError.message}</p> : ''}
      </li>
    );
  });

  const productList = !cartProducts
    ? []
    : cartProducts.map((p) => {
        const { id, name, price } = p.product.node;
        return (
          <li key={id} className={styles.cartItem}>
            <button
              className={styles.cartItem__remove}
              type='button'
              onClick={() => removeProduct(p.key!)}
            />
            <div className={styles.cartItem__info}>
              <h3 className={styles.cartItem__title}>{name}</h3>
              <p className={styles.cartItem__price}>€{price}</p>
            </div>
          </li>
        );
      });

  if (!productList.length)
    return (
      <>
        <div
          className={isOpen ? styles.flycart + ' ' + styles.flycart_open : styles.flycart}
          onClick={handleClickClose}
          id='cart'
        >
          <div className={styles.contentContainer}>
            <h1 className={styles.title}>Cart</h1>
            <h3 className={styles.cart__subtitle}>Your cart is empty</h3>

            <div className={styles.actions}>
              <button className={styles.actions__btn} type='button' onClick={hideCart}>
                Continue shopping
              </button>
            </div>
          </div>
        </div>
        {removeLoading || couponLoading || removeCouponsLoading ? <Loader /> : <></>}
      </>
    );

  return (
    <>
      <div
        className={isOpen ? styles.flycart + ' ' + styles.flycart_open : styles.flycart}
        onClick={handleClickClose}
        id='cart'
      >
        <div className={styles.contentContainer}>
          <h1 className={styles.title}>Cart</h1>
          <p className={styles.count}>Items: {cart.contents.itemCount}</p>
          <ul className={styles.cartItems}>{productList}</ul>
          {couponList?.length ? (
            <>
              <h3 className={styles.cart__subtitle}>Applied coupons:</h3>
              <ul className={styles.cartCoupons}>{couponList}</ul>
            </>
          ) : (
            <></>
          )}

          {cartErrors.removeError ? <p>{cartErrors.removeError.message}</p> : <></>}

          <form onSubmit={handleCouponSubmit} className={styles.couponForm}>
            <input
              type='text'
              placeholder='Coupon code'
              value={coupon}
              onChange={handleInputChange}
              className={styles.couponForm__input}
            />
            <button type='submit' className={styles.couponForm__button}>
              Apply coupon
            </button>
          </form>
          <p
            className={cartErrors.couponError ? styles.error + ' ' + styles.visible : styles.error}
          >
            {cartErrors.couponError ? cartErrors.couponError.message : ''}
          </p>

          <p className={styles.subtotal}>Subtotal: €{cart.subtotal}</p>
          <p className={styles.total}>Total: €{cart.total}</p>
          <div className={styles.actions}>
            <button className={styles.actions__btn_checkout} type='button'>
              Go to checkout
            </button>
            <button className={styles.actions__btn} type='button' onClick={hideCart}>
              Continue shopping
            </button>
          </div>
        </div>
      </div>
      {removeLoading || couponLoading || removeCouponsLoading ? <Loader /> : <></>}
    </>
  );
};
