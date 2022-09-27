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
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isInCart }) => {
  const { id, name, slug, menuOrder, image, price } = product;

  const [{}, { addProduct, showCart }] = useCart();

  const [isPopupOpen, setIsPopapOpen] = useState(false);

  const clickHandler = () => setIsPopapOpen(true);
  const closeHandler = () => setIsPopapOpen(false);

  const addToCartHandler = useCallback(() => {
    addProduct(id);
    showCart();
  }, [addProduct, showCart, id]);

  const productButton = isInCart ? (
    <Button className={styles.button} isDisabled isConfirm>
      &#10003; Added to cart
    </Button>
  ) : (
    <Button type='button' className={styles.button} onClick={addToCartHandler}>
      Add to cart
    </Button>
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
