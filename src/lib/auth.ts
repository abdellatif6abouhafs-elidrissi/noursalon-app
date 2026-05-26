'use client';

import type { RegisterFormData, LoginFormData } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    salonName?: string;
  };
}

export const authService = {
  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        salonName: data.salonName,
        phone: data.phone,
        city: data.city,
        role: data.role,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  },

  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  },

  saveSession(data: AuthResponse) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    // Store token in cookie for middleware (must be 'ns_token' to match middleware)
    document.cookie = `ns_token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  },

  getSession() {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user ? { token, user: JSON.parse(user) } : null;
  },

  getUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Delete token from cookie (must match 'ns_token')
    document.cookie = 'ns_token=; path=/; max-age=0; SameSite=Lax';
  },

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
};
