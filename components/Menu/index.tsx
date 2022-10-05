import styles from './Menu.module.css';
import { menu, wooShopBase } from '../../utils/constants';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../../store/Cart';

export const Menu: React.FC = () => {
  const router = useRouter();
  const [{ cart }, { showCart }] = useCart();

  const renderMenu = menu.map((item, index) => {
    const className = () => {
      if (item.link == wooShopBase) {
        return router.asPath.endsWith(item.link)
          ? `${styles.menu__item} ${styles.menu__item_active}`
          : styles.menu__item;
      } else
        return router.asPath.startsWith(item.link)
          ? `${styles.menu__item} ${styles.menu__item_active}`
          : styles.menu__item;
    };
    return (
      <li key={index}>
        <Link href={item.link}>
          <a className={className()}>{item.name}</a>
        </Link>
      </li>
    );
  });

  return (
    <nav className={styles.menu}>
      <ul className={styles.menu__items}>
        <li>
          <Link href='/'>
            <a
              className={
                router.pathname == '/'
                  ? `${styles.menu__item} ${styles.menu__item_active}`
                  : styles.menu__item
              }
            >
              Home
            </a>
          </Link>
        </li>
        {renderMenu}
        {cart.contents.itemCount > 0 ? (
          <li className={styles.menu__cartWrapper} onClick={showCart}>
            <div className={styles.menu__cart} />
            <span className={styles.menu__cartCount}>{cart.contents.itemCount}</span>
          </li>
        ) : (
          <></>
        )}
      </ul>
    </nav>
  );
};
