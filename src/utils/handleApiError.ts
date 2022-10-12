import { InteractionRequiredAuthError } from '@azure/msal-browser'
import { msalInstance } from '@main'
import { tokenRequest } from '@msal/authConfig'

export default async function handleApiError(error: unknown) {
  if (error instanceof InteractionRequiredAuthError) {
    await msalInstance.acquireTokenRedirect(tokenRequest)
    return
  }
}
