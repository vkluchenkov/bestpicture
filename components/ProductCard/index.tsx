import Image from 'next/image';
import { useState } from 'react';
import { Product } from '../../types/categoryListing.types';
import { ProductPopup } from '../ProductPopup';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, slug, menuOrder, image, price } = product;

  const [isPopupOpen, setIsPopapOpen] = useState(false);

  const clickHandler = () => setIsPopapOpen(true);
  const closeHandler = () => setIsPopapOpen(false);

  return (
    <li className={styles.card}>
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
      <p className={styles.price}>{price ? `€${price}` : 'Free'}</p>
      <button type='button' className={styles.button}>
        Add to cart
      </button>
      <ProductPopup isOpen={isPopupOpen} product={product} onClose={closeHandler} />
    </li>
  );
};
