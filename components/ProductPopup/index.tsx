import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Product } from '../../types/categoryListing.types';
import { Button } from '../../ui-kit/Button';
import styles from './ProductPopup.module.css';
import { InputCheckbox } from '../../ui-kit/Checkbox/InputCheckbox';
import { FormControlLabel, ThemeProvider } from '@mui/material';
import { darkTheme } from '../../utils/constants';
import { getCropFee } from '../../utils/getCropFee';
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

  const cropFee = getCropFee(price);

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

  // Push a history entry on open so the browser Back button closes the popup
  // instead of navigating away from the category page.
  useEffect(() => {
    // Opt out of the browser's scroll restoration for this entry so Back closes
    // the popup in place (like ESC/click) instead of rewinding to the top.
    const prevScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    window.history.pushState({ productPopup: true }, '');

    const handlePopState = () => onClose();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // If the marker is still present, the popup was closed programmatically
      // (Escape / click / button) rather than by Back — pop our pushed entry so
      // history stays consistent. If it was closed by Back, the entry is already
      // gone and we must not call back() again.
      if (window.history.state?.productPopup) {
        window.history.back();
      }
      window.history.scrollRestoration = prevScrollRestoration;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* <p className={styles.name}>{name}</p> */}
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
      <p className={styles.price}>
        {name} ({price ? `${price}` : 'Free'})
      </p>
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
