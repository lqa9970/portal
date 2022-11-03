import api from '@api/baseApi'
import getToken from '@api/getToken'
import { tokenRequest } from '@msal/authConfig'
import generateAuthHeaders from '@utils/generateHeader'
import { EnvironmentType } from '@utils/types'

type Response = {
  name: EnvironmentType
  isAlreadyCreated: boolean
}

export default async function listEnvironments(rowKey: string) {
  const token = await getToken(tokenRequest)
  const headers = generateAuthHeaders(token)
  const { data } = await api.get<Response[]>(
    `/projects/${rowKey}/listEnvironments`,
    {
      headers,
    }
  )
  return data
}
