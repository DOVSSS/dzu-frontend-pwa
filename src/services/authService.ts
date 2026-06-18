import api from './api';
import {type LoginRequest,type RegisterRequest,type AuthResponse,type User } from '../types/api.types';

// --- Login ---
// POST /auth/login
export const loginRequest = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

// --- Register ---
// POST /auth/register
export const registerRequest = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

// --- Get current user ---
// GET /auth/me
export const getMeRequest = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};