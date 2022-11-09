import { getToken } from '@api'
import { tokenRequest } from '@msal/authConfig'
import generateAuthHeaders from '@utils/generateHeader'
import { format } from 'date-fns'
import api from '../baseApi'

const calculateCost = async (rowKey: string) => {
  const token = await getToken(tokenRequest)
  const headers = generateAuthHeaders(token)

  const { data } = await api.get(`/projects/${rowKey}/calculateCost`, {
    headers,
    responseType: 'blob',
  })
  const dateString = format(new Date(), 'dMy')
  // Create blob link to download
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `cost-report-${dateString}.csv`)
  // Append to html link element page
  document.body.appendChild(link)
  // Start download
  link.click()
  // Clean up and remove the link
  link.parentNode?.removeChild(link)
}
export default calculateCost
