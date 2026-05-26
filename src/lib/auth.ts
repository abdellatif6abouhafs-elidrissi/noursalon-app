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
  },

  getSession() {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user ? { token, user: JSON.parse(user) } : null;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
};

// Server-side utilities (imported by API routes)
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}

export function createToken(userId: string, email: string): string {
  const jwt = require('jsonwebtoken');
  const SECRET_KEY = process.env.SECRET_KEY || 'dev-secret-key-change-in-production-min-32-chars';
  return jwt.sign(
    { sub: userId, email },
    SECRET_KEY,
    { expiresIn: '168h' }
  );
}

export function verifyToken(token: string): { sub: string; email: string } | null {
  try {
    const jwt = require('jsonwebtoken');
    const SECRET_KEY = process.env.SECRET_KEY || 'dev-secret-key-change-in-production-min-32-chars';
    const decoded = jwt.verify(token, SECRET_KEY) as { sub: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}
