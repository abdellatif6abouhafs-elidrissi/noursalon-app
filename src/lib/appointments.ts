import api from './api'
import type { Appointment, AppointmentStatus, PaginatedResponse } from '@/types'

export interface CreateAppointmentDto {
  clientId: string
  staffId: string
  serviceId: string
  date: string
  startTime: string
  notes?: string
}

export const appointmentService = {
  async list(params?: {
    date?: string
    staffId?: string
    status?: AppointmentStatus
    page?: number
  }): Promise<PaginatedResponse<Appointment>> {
    const res = await api.get('/appointments', { params })
    return res.data
  },

  async getByDateRange(start: string, end: string): Promise<Appointment[]> {
    const res = await api.get('/appointments/range', { params: { start, end } })
    return res.data
  },

  async create(data: CreateAppointmentDto): Promise<Appointment> {
    const res = await api.post('/appointments', data)
    return res.data
  },

  async update(id: string, data: Partial<CreateAppointmentDto>): Promise<Appointment> {
    const res = await api.patch(`/appointments/${id}`, data)
    return res.data
  },

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const res = await api.patch(`/appointments/${id}/status`, { status })
    return res.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/appointments/${id}`)
  },

  async getAvailableSlots(date: string, staffId: string, serviceId: string): Promise<string[]> {
    const res = await api.get('/appointments/slots', {
      params: { date, staffId, serviceId },
    })
    return res.data
  },
}
