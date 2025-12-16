import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/profile/visitor`;

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
