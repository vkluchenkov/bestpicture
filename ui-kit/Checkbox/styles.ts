import { createStyles } from '../../types/emotion-styles';

export const styles = createStyles({
  input: {
    '& input': {
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
        WebkitBoxShadow: 'none !important',
        backgroundColor: `rgba(0, 0, 0, 0.01) !important`,
        transition: 'background-color 1s ease-in-out 5000000s',
      },
    },
  },

  error: {
    fontSize: '14px',
    color: 'red',
    fontWeight: 400,
    margin: '5px 0 0',
    display: 'none',
    '&.visible': {
      display: 'block',
    },
  },

  largeCheckbox: {
    '& .MuiSvgIcon-root': { fontSize: 30 },
  },
});
