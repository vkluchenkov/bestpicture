import { FormEvent, useState } from 'react';
import { useCart } from '../../store/Cart';
import { Button } from '../../ui-kit/Button';
import { TextInput } from '../../ui-kit/TextInput';
import styles from './Coupons.module.css';

export const Coupons: React.FC = () => {
  const [{ cart, cartErrors }, { applyCoupon, removeCoupons, eraseError }] = useCart();

  const [coupon, setCoupon] = useState('');

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setCoupon(target.value.toLowerCase());
  };

  const handleCouponSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyCoupon(coupon);
    setCoupon('');
    setTimeout(() => {
      eraseError('couponError');
    }, 5000);
  };

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

  return (
    <>
      {couponList?.length ? (
        <>
          <h3 className={styles.title}>Applied coupons:</h3>
          <ul className={styles.cartCoupons}>{couponList}</ul>
        </>
      ) : (
        <></>
      )}

      {cartErrors.removeError ? <p>{cartErrors.removeError.message}</p> : <></>}

      <form onSubmit={handleCouponSubmit} className={styles.couponForm}>
        <TextInput
          type='text'
          placeholder='Coupon code'
          value={coupon}
          onChange={handleInputChange}
          className={styles.couponForm__input}
        />
        <Button type='submit' className={styles.couponForm__button}>
          Apply coupon
        </Button>
      </form>
      <p className={cartErrors.couponError ? styles.error + ' ' + styles.visible : styles.error}>
        {cartErrors.couponError ? cartErrors.couponError.message : ''}
      </p>
    </>
  );
};
