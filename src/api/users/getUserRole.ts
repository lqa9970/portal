import { tokenRequest } from '@msal/authConfig'
import api from '../baseApi'
import { getToken } from '@api'
import generateAuthHeaders from '@utils/generateHeader'
import { UserRole } from '../../utils/types'


const getUserRole = async () => {
  const token = await getToken(tokenRequest)
  const headers = generateAuthHeaders(token)

    const { data } = await api.get<UserRole>(
    '/user/role',
    {
      headers,
    }
  )
  return data
}
export default getUserRole
