import api from './api'
import type { AuthResponse, LoginFormData, RegisterFormData, User } from '@/types'

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data)
    return res.data
  },

  async me(): Promise<User> {
    const res = await api.get<User>('/auth/me')
    return res.data
  },

  saveSession(response: AuthResponse) {
    localStorage.setItem('ns_token', response.access_token)
    localStorage.setItem('ns_user', JSON.stringify(response.user))
    document.cookie = `ns_token=${response.access_token}; path=/; max-age=604800`
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem('ns_user')
    return raw ? JSON.parse(raw) : null
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('ns_token')
  },

  logout() {
    localStorage.removeItem('ns_token')
    localStorage.removeItem('ns_user')
    document.cookie = 'ns_token=; path=/; max-age=0'
    window.location.href = '/auth/login'
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}