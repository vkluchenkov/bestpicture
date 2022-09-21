import styles from './Menu.module.css';
import { menu } from '../../utils/constants';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const Menu: React.FC = () => {
  const router = useRouter();

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
      </ul>
    </nav>
  );
};
