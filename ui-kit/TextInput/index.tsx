import { InputHTMLAttributes } from 'react';
import styles from './TextInput.module.css';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | undefined;
}

export const TextInput: React.FC<TextInputProps> = ({ className, error, ...props }) => {
  return (
    <>
      <input
        {...props}
        className={className ? styles.textInput + ' ' + className : styles.textInput}
      />
      {!!error && <span className={styles.error}>{error}</span>}
    </>
  );
};
