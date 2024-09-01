import { createApiClient } from '@accentor/api-client-js'

let url: string
if (import.meta.env.VITE_APP_API_URL != undefined) {
  url = import.meta.env.VITE_APP_API_URL
} else if (import.meta.env.PROD) {
  url = '/api'
} else {
  url = 'http://localhost:3000/api'
}

export const baseURL = url

export default createApiClient(url)
