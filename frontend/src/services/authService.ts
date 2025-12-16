import axios from 'axios';
import { API_BASE_URL, AUTH_BASE_URL } from '../config';

axios.defaults.withCredentials = true; // Important for sessions/cookies

interface Credentials {
  email: string;
  password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: 'ROLE_VISITOR' | 'ROLE_ORGANIZER';
    surname?: string;
    city?: string;
    annee_activite?: number;
    instagram_url?: string;
    facebook_url?: string;
    whatsapp_url?: string;
    profil_url?: string;
}

export const login = async (credentials: Credentials) => {
  const params = new URLSearchParams();
  params.append('username', credentials.email);
  params.append('password', credentials.password);

  return axios.post(`${AUTH_BASE_URL}/login`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const logout = async () => {
  return axios.post(`${AUTH_BASE_URL}/logout`);
};

export const register = async (data: RegisterData) => {
    return axios.post(`${API_BASE_URL}/auth/register`, data);
}

export const getMe = async () => {
  return axios.get(`${API_BASE_URL}/profile/me`);
};

export const forgotPassword = async (email: string) => {
  return axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
};

export const resetPassword = async (token: string, newPassword: string) => {
  return axios.post(`${API_BASE_URL}/auth/reset-password`, { token, newPassword });
};

