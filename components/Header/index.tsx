import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useCart } from '../../store/Cart';
import { Menu } from '../Menu';
import { MobileMenu } from '../MobileMenu';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [{ cart }, { showCart }] = useCart();

  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // close mobile menu on window width above 1024px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) closeMenu();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeMenu]);

  return (
    <>
      <header className={styles.header} id='header'>
        <Link href={'/'}>
          <div className={styles.header__logoContainer}>
            <div className={styles.header__logo}>
              <span className={styles.logo__red}>best</span>picture.pro
            </div>
            <p className={styles.header__subline}>event videos from Vladimir Kluchenkov</p>
          </div>
        </Link>

        <div className={styles.header__actions}>
          {cart.contents.itemCount > 0 ? (
            <div className={styles.header__cartWrapper} onClick={showCart}>
              <div className={styles.header__cart} />
              <span className={styles.header__cartCount}>{cart.contents.itemCount}</span>
            </div>
          ) : (
            <></>
          )}
          <button type='button' className={styles.header__mobileMenu} onClick={openMenu} />
        </div>
        <Menu />
      </header>
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
};
