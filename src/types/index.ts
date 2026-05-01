// ─── Auth ────────────────────────────────────────────────────────────────────
export type UserRole = 'owner' | 'manager' | 'stylist'
export type PlanType = 'free' | 'pro'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  salonId: string
  phone?: string
  avatar?: string
  createdAt: string
}

export interface AuthResponse {
  access_token: string
  token_type: 'bearer'
  user: User
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  firstName: string
  lastName: string
  salonName: string
  phone: string
  email: string
  password: string
  city: string
  role: UserRole
}

// ─── Salon ───────────────────────────────────────────────────────────────────
export interface Salon {
  id: string
  name: string
  phone: string
  email: string
  city: string
  address?: string
  plan: PlanType
  planExpiresAt?: string
  workingHours: WorkingHours
  services: Service[]
  createdAt: string
}

export interface WorkingHours {
  [day: string]: { open: string; close: string; closed: boolean }
}

// ─── Service ─────────────────────────────────────────────────────────────────
export interface Service {
  id: string
  name: string
  duration: number
  price: number
  color: string
  active: boolean
}

// ─── Staff ───────────────────────────────────────────────────────────────────
export interface StaffMember {
  id: string
  salonId: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  role: UserRole
  color: string
  avatar?: string
  specialties: string[]
  workingDays: number[]
  active: boolean
  appointmentsCount?: number
  createdAt: string
}

// ─── Client ──────────────────────────────────────────────────────────────────
export interface Client {
  id: string
  salonId: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  city?: string
  notes?: string
  totalVisits: number
  totalSpent: number
  lastVisit?: string
  createdAt: string
}

// ─── Appointment ─────────────────────────────────────────────────────────────
export type AppointmentStatus = 'confirmed' | 'pending' | 'done' | 'cancelled' | 'no_show'

export interface Appointment {
  id: string
  salonId: string
  clientId: string
  client: Pick<Client, 'id' | 'firstName' | 'lastName' | 'phone'>
  staffId: string
  staff: Pick<StaffMember, 'id' | 'firstName' | 'lastName' | 'color'>
  serviceId: string
  service: Pick<Service, 'id' | 'name' | 'duration' | 'price' | 'color'>
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes?: string
  price: number
  createdAt: string
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export interface DashboardStats {
  todayAppointments: number
  todayRevenue: number
  newClientsThisWeek: number
  pendingAppointments: number
  weeklyAppointments: number
  monthlyRevenue: number
  topServices: { name: string; count: number }[]
}

// ─── API ─────────────────────────────────────────────────────────────────────
export interface ApiError {
  detail: string
  status?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}
