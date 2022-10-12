import { getToken } from '@api'
import { tokenRequest } from '@msal/authConfig'
import generateAuthHeaders from '@utils/generateHeader'
import { Project } from '@utils/types'
import api from '../baseApi'

const getProject = async (rowKey: string) => {
  const token = await getToken(tokenRequest)
  const headers = generateAuthHeaders(token)

  const { data } = await api.get<Project>(`/projects/${rowKey}`, {
    headers,
  })
  return data
}
export default getProject
