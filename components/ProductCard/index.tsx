import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useCart } from '../../store/Cart';
import { Product } from '../../types/categoryListing.types';
import { Button } from '../../ui-kit/Button';
import { ProductPopup } from '../ProductPopup';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  categoryPath: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isInCart, categoryPath }) => {
  const { id, name, slug, image, price } = product;

  const [{}, { addProduct, showCart }] = useCart();

  const [isProductPopupOpen, setIsProductPopapOpen] = useState(false);
  const [isCopyLinkSuccess, setIsCopyLinkSuccess] = useState(false);

  const clickHandler = () => setIsProductPopapOpen(true);
  const closeHandler = () => setIsProductPopapOpen(false);

  const addToCartHandler = useCallback(() => {
    addProduct(id);
    showCart();
  }, [addProduct, showCart, id]);

  const productLink: string = categoryPath + '#' + slug;

  const handleCopyLink = async () => {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(productLink);
      setIsCopyLinkSuccess(true);
      setTimeout(() => {
        setIsCopyLinkSuccess(false);
      }, 2000);
    } else {
      document.execCommand('copy', true, productLink);
      alert('Done too');
    }
  };

  const productButton = isInCart ? (
    <Button className={styles.button} isDisabled isConfirm>
      &#10003; Added to cart
    </Button>
  ) : (
    <Button type='button' className={styles.button} onClick={addToCartHandler}>
      Add to cart
    </Button>
  );

  const variants = {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <li className={styles.card}>
      <button type='button' className={styles.copyBtn} onClick={handleCopyLink} />
      <span
        className={
          isCopyLinkSuccess ? styles.success + ' ' + styles.successVisible : styles.success
        }
      >
        Link copied!
      </span>
      <a className={styles.anchor} id={slug}></a>
      <div className={styles.imageWrapper} onClick={clickHandler}>
        <Image
          src={image.small}
          alt={name}
          layout='fill'
          objectFit='cover'
          objectPosition='center'
          className={styles.image}
        />
      </div>
      <p className={styles.name}>{name}</p>
      <p className={styles.price}>{price ? `${price}` : 'Free'}</p>
      {productButton}
      {isProductPopupOpen && (
        <motion.div
          initial='hidden'
          animate='enter'
          exit='exit'
          variants={variants}
          transition={{ type: 'linear', duration: 0.3 }}
          style={{ zIndex: 99 }}
        >
          <ProductPopup
            isOpen={isProductPopupOpen}
            product={product}
            onClose={closeHandler}
            onClick={addProduct}
            isInCart={isInCart}
          />
        </motion.div>
      )}
    </li>
  );
};
