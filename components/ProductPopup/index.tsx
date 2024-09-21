import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Product } from '../../types/categoryListing.types';
import { Button } from '../../ui-kit/Button';
import styles from './ProductPopup.module.css';
import { InputCheckbox } from '../../ui-kit/Checkbox/InputCheckbox';
import { FormControlLabel, ThemeProvider } from '@mui/material';
import { darkTheme, cropFee } from '../../utils/constants';
import Link from 'next/link';

interface ProductPopupProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onClick: (id: number, extraData: string) => void;
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

  const [isVertical, setIsVertical] = useState(false);
  const [isSquare, setIsSquare] = useState(false);

  // Blocking body scroll when popup visible
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
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

  const handleAddToCart = () => {
    let extraData = '';
    if (isVertical) extraData = JSON.stringify({ is_vertical: 'true' });
    if (isSquare) extraData = JSON.stringify({ is_square: 'true' });
    if (isVertical && isSquare)
      extraData = JSON.stringify({ is_vertical: 'true', is_square: 'true' });

    onClick(id, extraData);
    onClose();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'square') setIsSquare(e.target.checked);
    if (e.target.name === 'vertical') setIsVertical(e.target.checked);
  };

  const productButton = isInCart ? (
    <Button className={styles.button} isConfirm isLarge isDisabled>
      &#10003; Added to cart
    </Button>
  ) : (
    <Button type='button' isLarge className={styles.button} onClick={handleAddToCart}>
      Add to cart
    </Button>
  );

  return (
    <div className={`${styles.popup} ${styles.popup_open}`} onClick={handleClickClose}>
      <p className={styles.name}>{name}</p>
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
      <p className={styles.price}>{price ? `${price}` : 'Free'}</p>
      <hr className={styles.separator} />
      <ThemeProvider theme={darkTheme}>
        <h2 className={styles.options_title}>Additional Social media formats:</h2>
        <div className={styles.checkboxGroupWrapper}>
          <FormControlLabel
            control={
              <InputCheckbox value={isVertical} name='vertical' onChange={handleCheckboxChange} />
            }
            label={`Vertical crop (reels) +€${cropFee}`}
          />
          <FormControlLabel
            control={
              <InputCheckbox value={isSquare} name='square' onChange={handleCheckboxChange} />
            }
            label={`Square crop +€${cropFee}`}
          />
        </div>
        <button
          type='button'
          className={styles.buttonBack}
          onClick={() => window.open('/faq', '_blank')}
        >
          Learn more about crops
        </button>
      </ThemeProvider>
      <hr className={styles.separator} />
      {productButton}
      <button type='button' className={styles.buttonBack} onClick={onClose}>
        Go back to category
      </button>
    </div>
  );
};
