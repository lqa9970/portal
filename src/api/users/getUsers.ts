import { getToken } from '@api'
import { tokenRequest } from '@msal/authConfig'
import generateAuthHeaders from '@utils/generateHeader'
import api from '../baseApi'

const getUsers = async ({ data = '' }: { data?: string }) => {
  const token = await getToken(tokenRequest)
  const headers = generateAuthHeaders(token)

  const { data: responseData } = await api.get<string[]>(
    `/users?search=${data}`,
    {
      headers,
    }
  )
  return responseData
}

export default getUsers
