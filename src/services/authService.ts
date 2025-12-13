import api from '../utils/axios';
import type { SignUpData, LoginData, AuthResponse, User } from '../types/auth';

export const authService = {
  // Sign up new user
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/signup', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Sign up failed');
    }
  },

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  // Get current user (for persistent login)
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/user/me');
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  },
};