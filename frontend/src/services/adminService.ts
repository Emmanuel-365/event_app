import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/admin`;

export interface User {
  id: number;
  email: string;
  role: any;
  enabled: boolean;
  // Add other user fields as needed
}

export const updateUserStatus = async (userId: number, enabled: boolean): Promise<User> => {
  const response = await axios.put(`${API_URL}/users/${userId}/status`, enabled, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};


export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const updateUserRole = async (userId: number, newRole: any): Promise<User> => {
  const response = await axios.put(`${API_URL}/users/${userId}/role`, newRole, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
  await axios.delete(`${API_URL}/users/${userId}`);
};
