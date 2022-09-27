import { InputHTMLAttributes } from 'react';
import styles from './TextInput.module.css';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TextInput: React.FC<TextInputProps> = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={className ? styles.textInput + ' ' + className : styles.textInput}
    />
  );
};
