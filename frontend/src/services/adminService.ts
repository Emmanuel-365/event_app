import axios from 'axios';
import { UserRole } from '../context/AuthContext'; // Assuming UserRole is defined here or similar

const API_URL = 'http://localhost:8080/api/admin';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  // Add other user fields as needed
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const updateUserRole = async (userId: number, newRole: UserRole): Promise<User> => {
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
