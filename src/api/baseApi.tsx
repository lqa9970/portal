import handleApiError from '@utils/handleApiError'
import axios from 'axios'

const baseURL = `${import.meta.env.VITE_API_URL}/api`

const api = axios.create({
  baseURL,
})

api.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    await handleApiError(error)
    return Promise.reject(error)
  }
)

export default api
