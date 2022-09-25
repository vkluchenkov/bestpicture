import { MobileMenuProps } from './types';
import styles from './MobileMenu.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { menu } from '../../utils/constants';
import { useEffect } from 'react';
import { useCart } from '../../store/Cart';

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [{ cart }, {}] = useCart();

  const handleClose = async () => {
    await setTimeout(() => {}, 1000);
    onClose();
  };

  // Blocking body scroll when menu visible
  useEffect(() => {
    if (isOpen) document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  const renderMenu = menu.map((item, index) => {
    return (
      <li key={index}>
        <Link href={item.link}>
          <a
            className={
              router.asPath.startsWith(item.link)
                ? `${styles.mobileMenu__item} ${styles.mobileMenu__item_active}`
                : styles.mobileMenu__item
            }
            onClick={handleClose}
          >
            {item.name}
          </a>
        </Link>
      </li>
    );
  });

  return (
    <nav className={isOpen ? `${styles.mobileMenu} ${styles.mobileMenu_open}` : styles.mobileMenu}>
      <ul className={styles.mobileMenu__items}>
        <li>
          <Link href='/'>
            <a
              className={
                router.pathname == '/'
                  ? `${styles.mobileMenu__item} ${styles.mobileMenu__item_active}`
                  : styles.mobileMenu__item
              }
              onClick={handleClose}
            >
              Home
            </a>
          </Link>
        </li>
        {renderMenu}
      </ul>
      <button type='button' className={styles.mobileMenu__close} onClick={handleClose}></button>
    </nav>
  );
};
