import axios from "axios"
import { useAuthStore } from "./auth-store"

const API = axios.create({
  baseURL: "http://localhost:8080",
})

API.interceptors.request.use((config) => {
  const authHeader = useAuthStore.getState().getAuthHeader()
  if (authHeader) {
    config.headers.Authorization = authHeader
  }
  return config
})

// Response interceptor to handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default API
