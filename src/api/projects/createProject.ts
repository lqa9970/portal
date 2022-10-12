import api from '@api/baseApi'
import getToken from '@api/getToken'
import { tokenRequest } from '@msal/authConfig'
import generateAuthHeaders from '@utils/generateHeader'
import { ProjectFormData } from '@utils/types'

const createProject = async (project: ProjectFormData) => {
  const token = await getToken(tokenRequest)
  const headers = generateAuthHeaders(token)

  const { data } = await api.post<string>('projects/save', project, {
    headers,
  })
  await api.post('projects', project, { headers })
  return { rowKey: data }
}
export default createProject
