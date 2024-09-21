import React from 'react';
import { Checkbox, CheckboxProps } from '@mui/material';
import { styles } from './styles';

export type InputCheckboxProps = CheckboxProps & {};

export const InputCheckbox: React.FC<CheckboxProps> = (props) => {
  return <Checkbox {...props} sx={styles.largeCheckbox} />;
};
