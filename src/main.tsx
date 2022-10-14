// documentation at https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/samples/msal-react-samples/typescript-sample/src/index.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// MSAL imports
import {
  PublicClientApplication,
  EventType,
  EventMessage,
  AuthenticationResult,
} from '@azure/msal-browser'
import { msalConfig } from './msal/authConfig'
import { MsalProvider } from '@azure/msal-react'

export const msalInstance = new PublicClientApplication(msalConfig)
// Account selection logic is app dependent. Adjust as needed for different use cases.
// function getAllAccounts will attemp to get all accounts from cache
const accounts = msalInstance.getAllAccounts()
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0])
}
// Optional - This will update account state if a user signs in from another tab or window
msalInstance.enableAccountStorageEvents()
msalInstance.addEventCallback((event: EventMessage) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult
    const account = payload.account
    msalInstance.setActiveAccount(account)
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
)
