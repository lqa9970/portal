import {
  InteractionRequiredAuthError,
  IPublicClientApplication,
} from '@azure/msal-browser'
import { tokenRequest } from '@msal/authConfig'
import api from '../baseApi'

const getUsers = async ({
  instance,
  data = '',
}: {
  instance: IPublicClientApplication
  data?: string
}) => {
  try {
    const token = await instance.acquireTokenSilent(tokenRequest)
    const res = await api.get(`/users?search=${data}`, {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    })
    return res.data
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await instance.acquireTokenRedirect(tokenRequest)
    }
    throw error
  }
}

export default getUsers
