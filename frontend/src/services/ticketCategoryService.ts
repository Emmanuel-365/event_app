import axios from 'axios';
import { AUTH_BASE_URL } from '../config';

const API_URL = `${AUTH_BASE_URL}/ticket`;

interface TicketCategoryData {
  intitule: string;
  prix: number;
  id_event: number;
}

export const createTicketCategory = async (ticketData: TicketCategoryData) => {
  return axios.post(API_URL, ticketData);
};

export const updateTicketCategory = async (id: number, ticketData: Partial<TicketCategoryData>) => {
  return axios.put(`${API_URL}/${id}`, ticketData);
};

export const deleteTicketCategory = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};
