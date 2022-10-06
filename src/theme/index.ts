import { createTheme } from '@mui/material'
import breakpoints from './breakpoints'
import components from './components'
import palette from './palette'
import spacing from './spacing'
import typography from './typography'

//  need custom theme variables work with typescript? check out https://mui.com/material-ui/customization/theming/#custom-variables

const theme = createTheme({
  breakpoints,
  palette,
  components,
  spacing,
  typography,
})

export default theme
