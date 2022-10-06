// documentation at https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md#ssosilent-example

// mui imports
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

// MSAL imports
import {
  InteractionRequiredAuthError,
  InteractionType,
} from '@azure/msal-browser'
import { useMsalAuthentication } from '@azure/msal-react'
import theme from './theme'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { loginRequest } from './msal/authConfig'
import Routes from './Routes'

const queryClient = new QueryClient()

function App() {
  // The useMsalAuthentication hook will initiate a login if a user is not already signed in, otherwise it will attempt to acquire a token.
  const { login, result, error } = useMsalAuthentication(
    InteractionType.Silent,
    loginRequest
  )

  useEffect(() => {
    if (error instanceof InteractionRequiredAuthError) {
      login(InteractionType.Redirect, loginRequest)
    }
  }, [error])

  if (!result) {
    return null
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Routes />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
