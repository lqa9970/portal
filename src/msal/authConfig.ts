// documentation at https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/samples/msal-react-samples/typescript-sample/src/authConfig.ts

import {
  Configuration,
  RedirectRequest,
  SilentRequest,
} from '@azure/msal-browser'

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_TENANT_ID
    }`,
    redirectUri: '/',
    postLogoutRedirectUri: '/',
  },
}

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: RedirectRequest = {
  scopes: ['openid', 'profile', 'User.Read'],
}

export const tokenRequest: SilentRequest = {
  scopes: [`${import.meta.env.VITE_BACKEND_IDENTIFIER}/user_impersonation`],
}
