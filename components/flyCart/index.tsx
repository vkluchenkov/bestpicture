import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useCart } from '../../store/Cart';
import { Button } from '../../ui-kit/Button';
import { CartProducts } from '../CartProducts';
import { Coupons } from '../Coupons';
import { Loader } from '../Loader';
import styles from './flyCart.module.css';

export const FlyCart: React.FC = () => {
  // Hooks
  const [{ cart, isOpen, isLoading }, { removeProduct, hideCart }] = useCart();

  const router = useRouter();

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

  const handleCheckout = () => {
    router.push('/checkout');
    hideCart();
  };

  // Data
  if (!cart.contents.nodes.length)
    return (
      <>
        <div
          // className={isOpen ? styles.flycart + ' ' + styles.flycart_open : styles.flycart}
          className={styles.flycart + ' ' + styles.flycart_open}
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
        {isLoading ? <Loader /> : <></>}
      </>
    );

  return (
    <>
      {/* <AnimatePresence mode='wait' initial={false} onExitComplete={() => window.scrollTo(0, 0)} /> */}
      <div
        // className={isOpen ? styles.flycart + ' ' + styles.flycart_open : styles.flycart}
        className={styles.flycart + ' ' + styles.flycart_open}
        onClick={handleClickClose}
        id='cart'
      >
        <div className={styles.contentContainer}>
          <h1 className={styles.title}>Cart</h1>
          <p className={styles.count}>Items: {cart.contents.itemCount}</p>

          <CartProducts />
          {cart.total != '0' ? <Coupons /> : <></>}

          <p className={styles.subtotal}>Subtotal: {cart.subtotal}</p>
          <p className={styles.total}>Total: {cart.total}</p>

          <div className={styles.actions}>
            <Button
              className={styles.actions__btn_checkout}
              type='button'
              onClick={handleCheckout}
              isLarge
              fullWidth
            >
              Go to checkout
            </Button>
            <button className={styles.actions__btn} type='button' onClick={hideCart}>
              Continue shopping
            </button>
          </div>
        </div>
      </div>
      {isLoading ? <Loader /> : <></>}
    </>
  );
};
