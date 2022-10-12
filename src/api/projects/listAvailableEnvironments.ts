import api from '@api/baseApi'
import getToken from '@api/getToken'
import { tokenRequest } from '@msal/authConfig'
import generateAuthHeaders from '@utils/generateHeader'
import { EnvironmentType } from '@utils/types'

export default async function listAvailableEnvironments(rowKey: string) {
  const token = await getToken(tokenRequest)
  const headers = generateAuthHeaders(token)
  const { data } = await api.get<EnvironmentType[]>(
    `/projects/${rowKey}/listAvailableEnvironments`,
    {
      headers,
    }
  )
  return data
}
