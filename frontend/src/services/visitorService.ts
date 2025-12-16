import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/profile/visitor`;

interface VisitorData {
  name: string;
  surname: string;
  phone: string;
  city: string;
  email: string;
  password?: string;
}

export const updateVisitor = async (id: number, visitorData: Partial<VisitorData>) => {
  return axios.put(`${API_URL}/${id}`, visitorData);
};
