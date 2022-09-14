import { useEffect, useState } from 'react';
import { MobileMenu } from '../MobileMenu';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  // close mobile menu on window width above 1024px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) closeMenu();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.header__logoContainer}>
        <div className={styles.header__logo}>
          <span className={styles.logo__red}>best</span>picture.pro
        </div>
        <p className={styles.header__subline}>event videos from Vladimir Kluchenkov</p>
      </div>
      <button type='button' className={styles.header__mobileMenu} onClick={openMenu} />
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </header>
  );
};
