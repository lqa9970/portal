import { Project } from '@utils/types'
import { tokenRequest } from '@msal/authConfig'
import api from '../baseApi'
import { getToken } from '@api'
import generateAuthHeaders from '@utils/generateHeader'

type Params = {
  isViewingOwnProject: boolean
}

const getProjects = async (params?: Params) => {
  const token = await getToken(tokenRequest)
  const headers = generateAuthHeaders(token)

  const { data } = await api.get<Project[]>(
    `/projects${
      params?.isViewingOwnProject ? '?isViewingOwnProject=true' : ''
    }`,
    {
      headers,
    }
  )
  return data
}
export default getProjects
