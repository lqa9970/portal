import { SilentRequest } from '@azure/msal-browser'
import { msalInstance } from '@main'

export default async function getToken(tokenRequest: SilentRequest) {
  const token = await msalInstance.acquireTokenSilent(tokenRequest)
  return token
}
