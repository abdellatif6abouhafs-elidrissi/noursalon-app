import api from './api'
import type { Client, PaginatedResponse } from '@/types'

export interface CreateClientDto {
  firstName: string
  lastName: string
  phone: string
  email?: string
  city?: string
  notes?: string
}

export const clientService = {
  async list(params?: {
    search?: string
    page?: number
    size?: number
  }): Promise<PaginatedResponse<Client>> {
    const res = await api.get('/clients', { params })
    return res.data
  },

  async get(id: string): Promise<Client> {
    const res = await api.get(`/clients/${id}`)
    return res.data
  },

  async create(data: CreateClientDto): Promise<Client> {
    const res = await api.post('/clients', data)
    return res.data
  },

  async update(id: string, data: Partial<CreateClientDto>): Promise<Client> {
    const res = await api.patch(`/clients/${id}`, data)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/clients/${id}`)
  },
}
