import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLarge?: boolean;
  isConfirm?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className: containerClassName,
  isLarge,
  isConfirm,
  isDisabled,
  fullWidth,
  ...props
}) => {
  const buttonStyle = () => {
    const large = isLarge ? ' ' + styles.button_large : '';
    const confirm = isConfirm ? ' ' + styles.button_confirm : '';
    const width = fullWidth ? ' ' + styles.button_fullWidth : '';

    return styles.button + large + confirm + width;
  };

  return (
    <div className={styles.container + ' ' + containerClassName}>
      <button className={buttonStyle()} disabled={isDisabled} {...props}>
        {children}
      </button>
    </div>
  );
};
