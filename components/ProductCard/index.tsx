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
  const { id, name, slug, menuOrder, image, price } = product;

  const [{}, { addProduct, showCart }] = useCart();

  const [isPopupOpen, setIsPopapOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const clickHandler = () => setIsPopapOpen(true);
  const closeHandler = () => setIsPopapOpen(false);

  const addToCartHandler = useCallback(() => {
    addProduct(id);
    showCart();
  }, [addProduct, showCart, id]);

  const productLink: string = categoryPath + '#' + slug;

  const handleCopy = async () => {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(productLink);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
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

  return (
    <li className={styles.card}>
      <button type='button' className={styles.copyBtn} onClick={handleCopy} />
      <span className={isSuccess ? styles.success + ' ' + styles.successVisible : styles.success}>
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
