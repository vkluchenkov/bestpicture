import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCart } from '../../store/Cart';
import { Product } from '../../types/categoryListing.types';
import { ProductPopup } from '../ProductPopup';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isInCart }) => {
  const { id, name, slug, menuOrder, image, price } = product;

  const router = useRouter();
  const [{}, { addProduct }] = useCart();

  const [isPopupOpen, setIsPopapOpen] = useState(false);

  const clickHandler = () => setIsPopapOpen(true);
  const closeHandler = () => setIsPopapOpen(false);

  const productButton = isInCart ? (
    <div className={styles.button_added}>✔ Added to cart</div>
  ) : (
    <button type='button' className={styles.button} onClick={() => addProduct(id)}>
      Add to cart
    </button>
  );

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
      {productButton}
      <ProductPopup
        isOpen={isPopupOpen}
        product={product}
        onClose={closeHandler}
        onClick={addProduct}
        isInCart={isInCart}
      />
    </li>
  );
};
