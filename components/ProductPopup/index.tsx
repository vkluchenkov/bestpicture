import Image from 'next/image';
import { useEffect } from 'react';
import { Product } from '../../types/categoryListing.types';
import styles from './ProductPopup.module.css';

interface ProductPopupProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductPopup: React.FC<ProductPopupProps> = ({ product, isOpen, onClose }) => {
  const { id, name, slug, menuOrder, image, price } = product;

  // Blocking body scroll when popup visible
  useEffect(() => {
    if (isOpen) document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  return (
    <div
      className={isOpen ? `${styles.popup} ${styles.popup_open}` : styles.popup}
      onClick={onClose}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={image.large}
          alt={name}
          layout='fill'
          objectFit='contain'
          objectPosition='center'
          className={styles.image}
        />
      </div>
      <p className={styles.name}>{name}</p>
      <p className={styles.price}>{price ? `€${price}` : 'Free'}</p>
      <button type='button' className={styles.button}>
        Add to cart
      </button>
      <button type='button' className={styles.buttonBack} onClick={onClose}>
        Go back to category
      </button>
    </div>
  );
};
