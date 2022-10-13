import Image from 'next/image';
import { useEffect } from 'react';
import { Product } from '../../types/categoryListing.types';
import { Button } from '../../ui-kit/Button';
import styles from './ProductPopup.module.css';

interface ProductPopupProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onClick: (id: number) => void;
  isInCart: boolean;
}

export const ProductPopup: React.FC<ProductPopupProps> = ({
  product,
  isOpen,
  onClose,
  onClick,
  isInCart,
}) => {
  const { id, name, image, price } = product;

  // Blocking body scroll when popup visible
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
      document.body.style.marginRight = '0';
    }
    return () => {
      document.body.classList.remove('no-scroll');
      const scrollbarWidth = window.innerWidth - document.body.clientWidth;
      document.body.style.marginRight = `-${scrollbarWidth.toString()}px`;
    };
  }, [isOpen]);

  //Handling close on ESC
  useEffect(() => {
    const handleEscClose = (e: KeyboardEvent) => e.key === 'Escape' && onClose();

    if (product) {
      document.addEventListener('keydown', handleEscClose);
    }
    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [product, onClose]);

  const handleClickClose = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    (target.classList.contains(styles.popup) || target.id == 'image') && onClose();
  };

  const productButton = isInCart ? (
    <Button className={styles.button} isConfirm isLarge isDisabled>
      &#10003; Added to cart
    </Button>
  ) : (
    <Button type='button' isLarge className={styles.button} onClick={() => onClick(id)}>
      Add to cart
    </Button>
  );

  return (
    <div className={`${styles.popup} ${styles.popup_open}`} onClick={handleClickClose}>
      <div className={styles.imageWrapper}>
        <Image
          src={image.large}
          alt={name}
          layout='fill'
          objectFit='contain'
          objectPosition='center'
          className={styles.image}
          id='image'
        />
      </div>
      <p className={styles.name}>{name}</p>
      <p className={styles.price}>{price ? `${price}` : 'Free'}</p>
      {productButton}
      <button type='button' className={styles.buttonBack} onClick={onClose}>
        Go back to category
      </button>
    </div>
  );
};
