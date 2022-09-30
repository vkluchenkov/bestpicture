import { TextareaHTMLAttributes } from 'react';
import styles from './TextArea.module.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea: React.FC<TextAreaProps> = ({ className, ...props }) => {
  return (
    <textarea
      {...props}
      className={className ? styles.textInput + ' ' + className : styles.textInput}
    />
  );
};
