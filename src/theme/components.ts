import { Components } from '@mui/material'

const components: Components = {
  MuiButton: {
    defaultProps: {
      // disableRipple: true,
    },
    styleOverrides: {
      root: {
        fontWeight: 700,
      },
    },
  },
  MuiIconButton: {
    defaultProps: {
      // disableRipple: true,
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: () => ({
        fontSize: '0.8rem',
        // TODO use dynamic theme color here
        '&.Mui-focused': { color: 'hsl(189,40.7%,52.4%)' },
        '&.Mui-error': { color: '#f44336 !important' },
      }),
    },
  },
}

export default components
