import api from './api'
import type { StaffMember } from '@/types'

export interface CreateStaffDto {
  firstName: string
  lastName: string
  phone: string
  email?: string
  color: string
  specialties: string[]
  workingDays: number[]
}

export const staffService = {
  async list(): Promise<StaffMember[]> {
    const res = await api.get('/staff')
    return res.data
  },

  async get(id: string): Promise<StaffMember> {
    const res = await api.get(`/staff/${id}`)
    return res.data
  },

  async create(data: CreateStaffDto): Promise<StaffMember> {
    const res = await api.post('/staff', data)
    return res.data
  },

  async update(id: string, data: Partial<CreateStaffDto>): Promise<StaffMember> {
    const res = await api.patch(`/staff/${id}`, data)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/staff/${id}`)
  },
}
