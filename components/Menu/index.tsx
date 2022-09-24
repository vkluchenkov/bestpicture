import styles from './Menu.module.css';
import { menu } from '../../utils/constants';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../../store/Cart';

export const Menu: React.FC = () => {
  const router = useRouter();
  const [{ cart }, {}] = useCart();

  const renderMenu = menu.map((item, index) => {
    return (
      <li key={index}>
        <Link href={item.link}>
          <a
            className={
              router.asPath.startsWith(item.link)
                ? `${styles.menu__item} ${styles.menu__item_active}`
                : styles.menu__item
            }
          >
            {item.name}
          </a>
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
        <li>
          <Link href='/cart'>
            <a
              className={
                router.pathname == '/cart'
                  ? `${styles.menu__item} ${styles.menu__item_active}`
                  : styles.menu__item
              }
            >
              Cart{cart.contents.itemCount > 0 ? ' (' + cart.contents.itemCount + ')' : ''}
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
