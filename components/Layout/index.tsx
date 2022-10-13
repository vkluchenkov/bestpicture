import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../store/Cart';
import { FlyCart } from '../flyCart';

import { Footer } from '../Footer';
import { Header } from '../Header';
import styles from './Layout.module.css';

interface LayoutProps {
  children: any;
}

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [{ isOpen }, {}] = useCart();

  return (
    <>
      <Header />
      <motion.main
        initial='hidden'
        animate='enter'
        exit='exit'
        variants={variants}
        transition={{ type: 'linear', duration: 0.5 }}
        className={styles.main}
        id='main'
      >
        {children}
      </motion.main>
      <AnimatePresence mode='wait' initial={false}>
        {isOpen && (
          <motion.div
            initial='hidden'
            animate='enter'
            exit='exit'
            variants={variants}
            transition={{ type: 'linear', duration: 0.3 }}
            style={{ zIndex: 99 }}
          >
            <FlyCart />
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
};
