import axios from 'axios';

const API_URL = 'http://localhost:8080/visitor';

interface VisitorData {
  name: string;
  surname: string;
  phone: string;
  city: string;
  email: string;
  password?: string;
}

export const registerVisitor = async (visitorData: VisitorData) => {
  return axios.post(`${API_URL}/register`, visitorData);
};

export const updateVisitor = async (id: number, visitorData: Partial<VisitorData>) => {
  return axios.put(`${API_URL}/${id}`, visitorData);
};
