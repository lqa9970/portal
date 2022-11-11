import { getToken } from '@api'
import { tokenRequest } from '@msal/authConfig'
import generateAuthHeaders from '@utils/generateHeader'
import api from '../baseApi'

const calculateCost = async (rowKey: string) => {
  const token = await getToken(tokenRequest)
  const headers = generateAuthHeaders(token)

  const { data } = await api.get(`/projects/${rowKey}/calculateCost`, {
    headers,
  })
  return data
}
export default calculateCost
