import { AuthenticationResult } from '@azure/msal-browser'

const generateAuthHeaders = (token: AuthenticationResult) => ({
  Authorization: `Bearer ${token.accessToken}`,
})
export default generateAuthHeaders
