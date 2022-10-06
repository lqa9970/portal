import { PaletteOptions } from '@mui/material'

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary']
  }
  interface PaletteOptions {
    accent: PaletteOptions['primary']
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    accent: true
  }
}

const paletteSlice: PaletteOptions = {
  common: {
    black: '#000',
    white: '#fff',
  },
  background: {
    paper: '#fff',
    default: '#fafafa',
  },
  primary: {
    main: 'hsl(189,40.7%,52.4%)',
    contrastText: '#fff',
  },
  secondary: {
    main: 'hsl(0,76%,57%)',
    contrastText: '#fff',
  },
  accent: {
    main: 'hsl(172,100%,49.4%)',
    contrastText: 'hsl(175,100%,5.9%)',
  },
  error: {
    light: '#e57373',
    main: '#f44336',
    dark: '#d32f2f',
    contrastText: '#fff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.54)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
}

export default paletteSlice
