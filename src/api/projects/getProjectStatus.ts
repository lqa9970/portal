import api from '@api/baseApi'
import getToken from '@api/getToken'
import { tokenRequest } from '@msal/authConfig'
import generateAuthHeaders from '@utils/generateHeader'
import { ProjectItemStatus } from '@utils/types'

const getProjectStatus = async (rowKey: string) => {
  const token = await getToken(tokenRequest)
  const headers = generateAuthHeaders(token)

  const { data } = await api.get<ProjectItemStatus[]>(
    `/projects/${rowKey}/status`,
    {
      headers,
    }
  )
  return data
}

export default getProjectStatus
