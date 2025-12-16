import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin`;

export interface User {
  id: number;
  email: string;
  role: any;
  // Add other user fields as needed
}

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
