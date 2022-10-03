import { InputHTMLAttributes } from 'react';
import styles from './RadioInput.module.css';

interface RadioInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const RadioInput: React.FC<RadioInputProps> = ({ id, label, className, ...props }) => {
  return (
    <div className={styles.inputContainer}>
      <input type='radio' id={id} {...props} className={styles.input} />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
};
