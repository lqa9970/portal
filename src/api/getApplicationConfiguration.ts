import { tokenRequest } from '@msal/authConfig'
import generateAuthHeaders from '@utils/generateHeader'
import api from './baseApi'
import getToken from './getToken'

type Response = {
  title: string
  customerName: string
  customerEmail: string
}

const getApplicationConfiguration = async (name: string) => {
  const token = await getToken(tokenRequest)
  const headers = generateAuthHeaders(token)

  const { data } = await api.get<Response>(`/config?name=${name}`, {
    headers,
  })
  return data
}

export default getApplicationConfiguration
