import api from '@api/baseApi'
import getToken from '@api/getToken'
import { tokenRequest } from '@msal/authConfig'
import generateAuthHeaders from '@utils/generateHeader'
import { EnvironmentType } from '@utils/types'

type Params = {
  applicationShortName: string
  environmentType: EnvironmentType
}

const checkApplicationShortNameValid = async ({
  applicationShortName,
  environmentType,
}: Params) => {
  const token = await getToken(tokenRequest)
  const headers = generateAuthHeaders(token)

  const { data } = await api.post<boolean>(
    'projects/checkApplicationShortNameValid',
    {
      applicationShortName,
      environmentType,
    },
    {
      headers,
    }
  )
  return data
}

export default checkApplicationShortNameValid
