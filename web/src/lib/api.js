import axios from "axios"
import { getCookie } from "#/lib/cookies"

const baseURL = `${import.meta.env.VITE_API_URL ?? ""}/api`

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = getCookie("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
