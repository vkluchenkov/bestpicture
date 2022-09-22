import Link from 'next/link';
import { footerMenu } from '../../utils/constants';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const mappedMenu = footerMenu.map((item, index) => {
    return (
      <li className={styles.navItem} key={index}>
        <Link href={item.link}>{item.name}</Link>
      </li>
    );
  });
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <p className={styles.text}>©2014-{year} Vladimir Kluchenkov. All rights reserved.</p>
          <p className={styles.text}>
            Usage of any materials from this website is forbidden without a written permission from
            the author.
          </p>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navItems}>{mappedMenu}</ul>
        </nav>
      </div>
    </footer>
  );
};
